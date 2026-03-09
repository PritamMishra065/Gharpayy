import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = Router();

router.get('/:leadId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT *, id as _id, createdAt as timestamp FROM activities WHERE leadId = ? ORDER BY createdAt DESC',
      [req.params.leadId]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const id = crypto.randomUUID();
    const { leadId, type, message, content, agent, actor } = req.body;
    
    // Fallbacks for variable names between previous implementation and new Table Schema
    const finalContent = content || message || '';
    const finalActor = actor || agent || 'System';

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query(
        `INSERT INTO activities (id, leadId, type, content, actor) VALUES (?, ?, ?, ?, ?)`,
        [id, leadId, type, finalContent, finalActor]
      );

      await connection.query(
        `UPDATE leads SET lastActivity = CURRENT_TIMESTAMP WHERE id = ?`,
        [leadId]
      );

      await connection.commit();
      
      const [newActivity] = await connection.query(
        'SELECT *, id as _id, createdAt as timestamp FROM activities WHERE id = ?', 
        [id]
      );
      res.status(201).json(newActivity[0]);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
