import { Router } from 'express';
import crypto from 'crypto';
import { readDB, writeDB } from '../db.js';

const router = Router();

router.get('/:leadId', async (req, res) => {
  try {
    const db = await readDB();
    const activities = db.activities
      .filter(a => a.leadId === req.params.leadId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(activities);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const db = await readDB();
    const now = new Date().toISOString();
    
    const activity = {
      ...req.body,
      _id: crypto.randomUUID(),
      timestamp: req.body.timestamp || now
    };
    activity.id = activity._id; // Front-end fallback compatibility

    db.activities.push(activity);

    // Update lead lastActivity
    const lIdx = db.leads.findIndex(l => l._id === req.body.leadId);
    if (lIdx !== -1) {
      db.leads[lIdx].lastActivity = activity.timestamp;
      db.leads[lIdx].updatedAt = now;
    }

    await writeDB(db);
    res.status(201).json(activity);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
