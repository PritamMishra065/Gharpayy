import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { source, stage, search, sort } = req.query;
    
    let query = 'SELECT *, id as _id FROM leads WHERE 1=1';
    const params = [];

    if (source && source !== 'all') {
      query += ' AND source = ?';
      params.push(source);
    }
    if (stage && stage !== 'all') {
      query += ' AND stage = ?';
      params.push(stage);
    }
    if (search) {
      query += ' AND (LOWER(name) LIKE ? OR phone LIKE ? OR LOWER(location) LIKE ?)';
      const searchStr = `%${search.toLowerCase()}%`;
      params.push(searchStr, searchStr, searchStr);
    }

    if (sort === 'oldest') query += ' ORDER BY createdAt ASC';
    else if (sort === 'score-high') query += ' ORDER BY score DESC';
    else if (sort === 'score-low') query += ' ORDER BY score ASC';
    else if (sort === 'name') query += ' ORDER BY name ASC';
    else query += ' ORDER BY createdAt DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT *, id as _id FROM leads WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const id = crypto.randomUUID();
    const score = req.body.score || Math.floor(Math.random() * 40) + 30;
    
    const { name, phone, stage = 'New Lead', source, budget, location, assignedTo } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query(
        `INSERT INTO leads (id, name, phone, stage, source, budget, location, assignedTo, score) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, phone, stage, source, budget, location, assignedTo, score]
      );

      // Add Creation Activity
      await connection.query(
        `INSERT INTO activities (id, leadId, type, content, actor) VALUES (?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), id, 'created', `Lead created from ${source} inquiry`, 'System']
      );

      // Add Assignment Activity if assigned
      if (assignedTo) {
        await connection.query(
          `INSERT INTO activities (id, leadId, type, content, actor) VALUES (?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), id, 'assigned', `Assigned to agent ${assignedTo}`, 'System']
        );
      }

      await connection.commit();
      
      const [newLead] = await connection.query('SELECT *, id as _id FROM leads WHERE id = ?', [id]);
      res.status(201).json(newLead[0]);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) return res.json({});

    const [existing] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Lead not found' });
    const oldLead = existing[0];

    let query = 'UPDATE leads SET ';
    const params = [];
    
    // Convert camelCase to actual column updates (simplified mapping)
    const allowedFields = ['name', 'phone', 'stage', 'source', 'budget', 'location', 'assignedTo', 'score', 'isNew'];
    const setClauses = [];
    
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        setClauses.push(`${key} = ?`);
        params.push(updates[key]);
      }
    }
    
    // Always update lastActivity
    setClauses.push(`lastActivity = CURRENT_TIMESTAMP`);

    if (setClauses.length > 1) { // > 1 because lastActivity is always there
      query += setClauses.join(', ') + ' WHERE id = ?';
      params.push(id);
      
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      
      try {
        await connection.query(query, params);

        // Stage change activity
        if (updates.stage && updates.stage !== oldLead.stage) {
          await connection.query(
            `INSERT INTO activities (id, leadId, type, content, actor) VALUES (?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), id, 'stage_change', `Stage changed: ${oldLead.stage} → ${updates.stage}`, updates.assignedTo || oldLead.assignedTo]
          );
        }

        // Assignment activity
        if (updates.assignedTo && updates.assignedTo !== oldLead.assignedTo) {
          await connection.query(
            `INSERT INTO activities (id, leadId, type, content, actor) VALUES (?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), id, 'reassigned', `Lead reassigned to ${updates.assignedTo}`, updates.assignedTo]
          );
        }

        await connection.commit();
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }
    }

    const [updatedLead] = await pool.query('SELECT *, id as _id FROM leads WHERE id = ?', [id]);
    res.json(updatedLead[0]);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      await connection.query('DELETE FROM activities WHERE leadId = ?', [req.params.id]);
      await connection.query('DELETE FROM visits WHERE leadId = ?', [req.params.id]);
      const [result] = await connection.query('DELETE FROM leads WHERE id = ?', [req.params.id]);
      
      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      await connection.commit();
      res.json({ message: 'Lead deleted' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/stats/dashboard', async (req, res) => {
  try {
    const [leads] = await pool.query('SELECT * FROM leads');
    
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
