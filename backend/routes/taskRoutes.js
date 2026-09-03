import express from "express";
import {
  getBoards,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  addComment,
} from "../controllers/taskController.js";

const router = express.Router();

// Board routes
router.get("/boards", getBoards);

// Task CRUD routes
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// Specialized Task routes
router.patch("/:id/move", moveTask);
router.post("/:id/comments", addComment);

export default router;