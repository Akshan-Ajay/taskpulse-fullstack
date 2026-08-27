import express from "express";
import {
  getBoards,
  getBoardMembers,
  getTeammates,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  addComment,
} from "../controllers/taskController.js";

const router = express.Router();

// --- Static & Sub-resource Endpoints ---
router.get("/boards", getBoards);
router.get("/members/:boardId", getBoardMembers);
router.get("/teammates", getTeammates);

// --- Base Task Endpoints (/api/tasks) ---
router.route("/")
  .get(getTasks)
  .post(createTask);

// --- Individual Task Endpoints (/api/tasks/:id) ---
router.route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// --- Custom Task Operations ---
router.patch("/:id/move", moveTask);
router.post("/:id/comments", addComment);

export default router;