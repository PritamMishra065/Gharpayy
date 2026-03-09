import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import leadRoutes from './routes/leads.js';
import visitRoutes from './routes/visits.js';
import activityRoutes from './routes/activities.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/activities', activityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'local_json' });
});

// Initialize DB
initDB().catch(err => {
  console.error('❌ Failed to initialize TiDB database:', err);
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📦 Using TiDB MySQL database`);
  });
}

// Export for Vercel Serverless
export default app;
