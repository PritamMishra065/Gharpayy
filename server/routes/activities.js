import { Router } from 'express';
import Activity from '../models/Activity.js';
import Lead from '../models/Lead.js';

const router = Router();

router.get('/:leadId', async (req, res) => {
  try {
    const activities = await Activity.find({ leadId: req.params.leadId }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { leadId, type, message, content, agent, actor } = req.body;
    
    // Front end body normalization
    const finalContent = content || message || '';
    const finalActor = actor || agent || 'System';

    const activity = new Activity({
      leadId,
      type,
      content: finalContent,
      actor: finalActor
    });

    await activity.save();

    await Lead.findByIdAndUpdate(leadId, {
      lastActivity: new Date()
    });

    res.status(201).json(activity);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
