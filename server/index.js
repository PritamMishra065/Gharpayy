import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './db.js';
import leadRoutes from './routes/leads.js';
import visitRoutes from './routes/visits.js';
import activityRoutes from './routes/activities.js';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// In serverless, we ensure the DB is connected on every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection failed', err);
    res.status(500).json({ error: 'Internal Server Error (Database)' });
  }
});

app.use('/api/leads', leadRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/activities', activityRoutes);

app.get('/api/health', async (req, res) => {
  res.json({ status: 'ok', db: 'mongodb' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    try {
      await connectDB();
    } catch(err) {
      console.error('❌ Failed to initialize MongoDB database:', err);
    }
  });
}

// Export for Vercel Serverless
export default app;
