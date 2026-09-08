import app from '../backend/server.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGO_URI) {
        return res.status(500).json({ error: "MONGO_URI environment variable is missing on Vercel." });
      }
      await mongoose.connect(process.env.MONGO_URI);
    }
    return app(req, res);
  } catch (err) {
    console.error("Serverless Execution Error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}