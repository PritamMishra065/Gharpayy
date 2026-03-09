import { Router } from 'express';
import crypto from 'crypto';
import { readDB, writeDB } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = await readDB();
    let visits = db.visits;
    if (req.query.status) {
      visits = visits.filter(v => v.status === req.query.status);
    }
    visits.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(visits);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const db = await readDB();
    const now = new Date().toISOString();
    
    const visit = {
      ...req.body,
      _id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    visit.id = visit._id; // Front-end fallback compatibility

    db.visits.push(visit);

    if (req.body.leadId) {
      const lIdx = db.leads.findIndex(l => l._id === req.body.leadId);
      if (lIdx !== -1) {
        db.leads[lIdx].stage = 'visit_scheduled';
        db.leads[lIdx].updatedAt = now;
        db.leads[lIdx].lastActivity = now;
        
        db.activities.push({
          _id: crypto.randomUUID(),
          leadId: req.body.leadId,
          type: 'visit_scheduled',
          message: `Visit scheduled at ${req.body.propertyName} for ${req.body.date}, ${req.body.time}`,
          agent: req.body.agent,
          timestamp: now
        });
      }
    }

    await writeDB(db);
    res.status(201).json(visit);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const db = await readDB();
    const vIdx = db.visits.findIndex(v => v._id === req.params.id);
    if (vIdx === -1) return res.status(404).json({ error: 'Visit not found' });
    
    const now = new Date().toISOString();
    const updatedVisit = { ...db.visits[vIdx], ...req.body, updatedAt: now };
    db.visits[vIdx] = updatedVisit;

    if (req.body.status === 'completed' && req.body.outcome) {
      const lIdx = db.leads.findIndex(l => l._id === updatedVisit.leadId);
      if (lIdx !== -1) {
        const newStage = req.body.outcome === 'booked' ? 'booked' : 'visit_done';
        db.leads[lIdx].stage = newStage;
        db.leads[lIdx].updatedAt = now;
        db.leads[lIdx].lastActivity = now;
        
        db.activities.push({
          _id: crypto.randomUUID(),
          leadId: updatedVisit.leadId,
          type: 'visit_completed',
          message: `Visit completed — outcome: ${req.body.outcome}`,
          agent: updatedVisit.agent,
          timestamp: now
        });
      }
    }

    await writeDB(db);
    res.json(updatedVisit);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
