/* global process */
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "syncboard_secret_key_2026";

const isStrongPassword = (pwd) => {
  return (
    pwd.length >= 6 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)
  );
};

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  console.log("➡️ Processing Registration in MongoDB for:", req.body?.email);
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters and include uppercase, lowercase, a number, and a special character.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered in MongoDB." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    console.log("✅ Successfully saved user to MongoDB Database:", newUser.email);

    return res.status(201).json({
      message: "User registered successfully!",
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error("MongoDB Register Error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  console.log("➡️ Processing Login in MongoDB for:", req.body?.email);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Successfully logged in user from MongoDB:", user.email);

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("MongoDB Login Error:", error);
    return res.status(500).json({ message: error.message });
  }
});

export default router;
