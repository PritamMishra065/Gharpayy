import { Router } from 'express';
import Lead from '../models/Lead.js';
import Activity from '../models/Activity.js';
import Visit from '../models/Visit.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { source, stage, search, sort } = req.query;
    
    let query = {};

    if (source && source !== 'all') query.source = source;
    if (stage && stage !== 'all') query.stage = stage;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'score-high') sortObj = { score: -1 };
    else if (sort === 'score-low') sortObj = { score: 1 };
    else if (sort === 'name') sortObj = { name: 1 };

    const leads = await Lead.find(query).sort(sortObj);
    res.json(leads);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const defaultScore = Math.floor(Math.random() * 40) + 30;
    
    const lead = new Lead({
      ...req.body,
      score: req.body.score || defaultScore,
      stage: req.body.stage || 'New Lead'
    });

    await lead.save();

    await Activity.create({
      leadId: lead._id,
      type: 'created',
      content: `Lead created from ${lead.source} inquiry`,
      actor: 'System'
    });

    if (lead.assignedTo) {
      await Activity.create({
        leadId: lead._id,
        type: 'assigned',
        content: `Assigned to agent ${lead.assignedTo}`,
        actor: 'System'
      });
    }

    res.status(201).json(lead);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;
    updates.lastActivity = new Date();

    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead) return res.status(404).json({ error: 'Lead not found' });

    const lead = await Lead.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (updates.stage && updates.stage !== oldLead.stage) {
      await Activity.create({
        leadId: lead._id,
        type: 'stage_change',
        content: `Stage changed: ${oldLead.stage} → ${updates.stage}`,
        actor: updates.assignedTo || oldLead.assignedTo || 'System'
      });
    }

    if (updates.assignedTo && updates.assignedTo !== oldLead.assignedTo) {
      await Activity.create({
        leadId: lead._id,
        type: 'reassigned',
        content: `Lead reassigned to ${updates.assignedTo}`,
        actor: updates.assignedTo
      });
    }

    res.json(lead);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Activity.deleteMany({ leadId: req.params.id });
    await Visit.deleteMany({ leadId: req.params.id });
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/stats/dashboard', async (req, res) => {
  try {
    const leads = await Lead.find();
    
    const totalLeads = leads.length;
    const byStage = {};
    const bySource = {};
    
    leads.forEach(l => { 
      byStage[l.stage] = (byStage[l.stage] || 0) + 1; 
      bySource[l.source] = (bySource[l.source] || 0) + 1;
    });

    const bookings = leads.filter(l => l.stage === 'booked').length;
    const avgScore = leads.length
      ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length)
      : 0;

    const now = new Date();
    const threshold = 24 * 60 * 60 * 1000;
    const followUps = leads.filter(l => {
      if (l.stage === 'booked' || l.stage === 'lost') return false;
      return (now - new Date(l.lastActivity || l.createdAt)) > threshold;
    }).length;

    res.json({ totalLeads, byStage, bySource, bookings, avgScore, followUps });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
