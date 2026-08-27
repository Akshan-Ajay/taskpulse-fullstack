import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Attach auth routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('TaskPulse API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});