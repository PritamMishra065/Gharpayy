import { Router } from 'express';
import Visit from '../models/Visit.js';
import Lead from '../models/Lead.js';
import Activity from '../models/Activity.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.status) query.status = req.query.status;
    
    const visits = await Visit.find(query).sort({ date: -1 });
    res.json(visits);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const visit = new Visit(req.body);
    await visit.save();

    if (visit.leadId) {
      await Lead.findByIdAndUpdate(visit.leadId, {
        stage: 'visit_scheduled',
        lastActivity: new Date()
      });
      
      await Activity.create({
        leadId: visit.leadId,
        type: 'visit_scheduled',
        content: `Visit scheduled at ${visit.property} for ${new Date(visit.date).toLocaleDateString()}`,
        actor: 'System'
      });
    }

    res.status(201).json(visit);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!visit) return res.status(404).json({ error: 'Visit not found' });

    if (req.body.status === 'completed' && req.body.outcome) {
      const newStage = req.body.outcome === 'booked' ? 'booked' : 'visit_done';
      
      await Lead.findByIdAndUpdate(visit.leadId, {
        stage: newStage,
        lastActivity: new Date()
      });
      
      await Activity.create({
        leadId: visit.leadId,
        type: 'visit_completed',
        content: `Visit completed — outcome: ${req.body.outcome}`,
        actor: 'System'
      });
    }

    res.json(visit);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
