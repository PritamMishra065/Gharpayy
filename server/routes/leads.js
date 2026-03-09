import { Router } from 'express';
import crypto from 'crypto';
import { readDB, writeDB } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = await readDB();
    const { source, stage, search, sort } = req.query;
    
    let leads = db.leads;

    if (source && source !== 'all') leads = leads.filter(l => l.source === source);
    if (stage && stage !== 'all') leads = leads.filter(l => l.stage === stage);
    if (search) {
      const lower = search.toLowerCase();
      leads = leads.filter(l => 
        l.name.toLowerCase().includes(lower) ||
        l.phone.includes(search) ||
        (l.email && l.email.toLowerCase().includes(lower)) ||
        (l.location && l.location.toLowerCase().includes(lower))
      );
    }

    leads.sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'score-high') return b.score - a.score;
      if (sort === 'score-low') return a.score - b.score;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(leads);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await readDB();
    const lead = db.leads.find(l => l._id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const db = await readDB();
    const now = new Date().toISOString();
    
    const lead = {
      ...req.body,
      _id: crypto.randomUUID(),
      score: req.body.score || Math.floor(Math.random() * 40) + 30,
      createdAt: now,
      updatedAt: now,
      lastActivity: now,
      id: crypto.randomUUID() // Added for Mongoose virtual backward compatibility
    };
    lead.id = lead._id; // Sync id and _id

    db.leads.push(lead);

    db.activities.push({
      _id: crypto.randomUUID(),
      leadId: lead._id,
      type: 'created',
      message: `Lead created from ${lead.source} inquiry`,
      timestamp: now
    }, {
      _id: crypto.randomUUID(),
      leadId: lead._id,
      type: 'assigned',
      message: `Assigned to agent ${lead.agent}`,
      agent: lead.agent,
      timestamp: now
    });

    await writeDB(db);
    res.status(201).json(lead);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const db = await readDB();
    const idx = db.leads.findIndex(l => l._id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const oldLead = db.leads[idx];
    const now = new Date().toISOString();
    const updatedLead = { ...oldLead, ...req.body, updatedAt: now, lastActivity: now };
    db.leads[idx] = updatedLead;

    if (req.body.stage && req.body.stage !== oldLead.stage) {
      db.activities.push({
        _id: crypto.randomUUID(),
        leadId: updatedLead._id,
        type: 'stage_change',
        message: `Stage changed: ${oldLead.stage} → ${req.body.stage}`,
        agent: updatedLead.agent,
        timestamp: now
      });
    }

    if (req.body.agent && req.body.agent !== oldLead.agent) {
      db.activities.push({
        _id: crypto.randomUUID(),
        leadId: updatedLead._id,
        type: 'reassigned',
        message: `Lead reassigned to ${req.body.agent} (${req.body.reassignReason || 'manual'})`,
        agent: req.body.agent,
        timestamp: now
      });
    }

    await writeDB(db);
    res.json(updatedLead);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await readDB();
    const len = db.leads.length;
    db.leads = db.leads.filter(l => l._id !== req.params.id);
    if (db.leads.length === len) return res.status(404).json({ error: 'Lead not found' });
    
    db.activities = db.activities.filter(a => a.leadId !== req.params.id);
    db.visits = db.visits.filter(v => v.leadId !== req.params.id);
    
    await writeDB(db);
    res.json({ message: 'Lead deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/stats/dashboard', async (req, res) => {
  try {
    const db = await readDB();
    const leads = db.leads;
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
      return (now - new Date(l.lastActivity || l.updatedAt || l.createdAt)) > threshold;
    }).length;

    res.json({ totalLeads, byStage, bySource, bookings, avgScore, followUps });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
