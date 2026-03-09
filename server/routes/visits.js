import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let query = 'SELECT *, id as _id FROM visits';
    const params = [];

    if (req.query.status) {
      query += ' WHERE status = ?';
      params.push(req.query.status);
    }
    
    query += ' ORDER BY date DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const id = crypto.randomUUID();
    const { leadId, property, date, status = 'pending', notes } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query(
        `INSERT INTO visits (id, leadId, property, date, status, notes) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, leadId, property, date, status, notes]
      );

      if (leadId) {
        await connection.query(
          `UPDATE leads SET stage = 'visit_scheduled', lastActivity = CURRENT_TIMESTAMP WHERE id = ?`,
          [leadId]
        );
        
        await connection.query(
          `INSERT INTO activities (id, leadId, type, content, actor) VALUES (?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), leadId, 'visit_scheduled', `Visit scheduled at ${property} for ${date}`, 'System']
        );
      }

      await connection.commit();
      
      const [newVisit] = await connection.query('SELECT *, id as _id FROM visits WHERE id = ?', [id]);
      res.status(201).json(newVisit[0]);
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
    const { status, outcome, notes } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [visits] = await connection.query('SELECT * FROM visits WHERE id = ?', [id]);
      if (visits.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Visit not found' });
      }
      
      const existingVisit = visits[0];

      let query = 'UPDATE visits SET ';
      const params = [];
      const setClauses = [];
      
      if (status !== undefined) { setClauses.push('status = ?'); params.push(status); }
      if (notes !== undefined) { setClauses.push('notes = ?'); params.push(notes); }
      
      if (setClauses.length > 0) {
        query += setClauses.join(', ') + ' WHERE id = ?';
        params.push(id);
        await connection.query(query, params);
      }

      if (status === 'completed' && outcome) {
        const newStage = outcome === 'booked' ? 'booked' : 'visit_done';
        
        await connection.query(
          `UPDATE leads SET stage = ?, lastActivity = CURRENT_TIMESTAMP WHERE id = ?`,
          [newStage, existingVisit.leadId]
        );
        
        await connection.query(
          `INSERT INTO activities (id, leadId, type, content, actor) VALUES (?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), existingVisit.leadId, 'visit_completed', `Visit completed — outcome: ${outcome}`, 'System']
        );
      }

      await connection.commit();
      
      const [updatedVisit] = await connection.query('SELECT *, id as _id FROM visits WHERE id = ?', [id]);
      res.json(updatedVisit[0]);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
