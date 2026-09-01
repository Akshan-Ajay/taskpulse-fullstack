import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskpulse';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`🚀 TaskPulse Server is actively listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });
