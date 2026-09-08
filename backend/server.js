import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskpulse';

// Updated CORS setup to handle deployment origin
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('TaskPulse API is running...');
});

// Connect to MongoDB without blocking serverless execution
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// Only listen on PORT when running locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 TaskPulse Server is actively listening on port ${PORT}`);
  });
}

export default app;