<<<<<<< Updated upstream
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js'; // 1. Add this import
=======
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
>>>>>>> Stashed changes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
<<<<<<< Updated upstream
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskpulse';
=======
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskpulse";
>>>>>>> Stashed changes

app.use(cors());
app.use(express.json());

<<<<<<< Updated upstream
// 2. Mount task routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('TaskPulse API is running...');
});

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
=======
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("TaskPulse API is running...");
});

// Run server & connect to DB only in production/development, NOT during tests
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("✓ Connected to MongoDB successfully");
      app.listen(PORT, () => {
        console.log(
          `🚀 TaskPulse Server is actively listening on http://localhost:${PORT}`,
        );
      });
    })
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:", err.message);
    });
}

export default app;
>>>>>>> Stashed changes
