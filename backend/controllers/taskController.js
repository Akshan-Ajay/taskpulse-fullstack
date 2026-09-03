import Task from "../models/Task.js";
import Board from "../models/Board.js";

// Helper function to map MongoDB document properties to Frontend expected formats
const formatTask = (taskDoc) => {
  if (!taskDoc) return null;
  const obj = taskDoc.toObject ? taskDoc.toObject() : taskDoc;
  return {
    ...obj,
    id: obj.taskId || obj._id.toString(),
  };
};

// @desc Get all boards
// @route GET /api/tasks/boards
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    if (boards.length === 0) {
      // Return a default board if none exist in the database
      return res.json([{ id: "web", customId: "web", name: "Sprint 8 — Web Team", letter: "W", color: "#8B52C3" }]);
    }
    const formattedBoards = boards.map((b) => {
      const doc = b.toObject();
      return { ...doc, id: doc.customId || doc._id.toString() };
    });
    res.json(formattedBoards);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch boards", error: error.message });
  }
};

// @desc Get all tasks (optionally filtered by boardId)
// @route GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const { boardId } = req.query;
    const filter = boardId ? { boardId } : {};
    const tasks = await Task.find(filter);
    res.json(tasks.map(formatTask));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

// @desc Create new task (ADD)
// @route POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, boardId, status, priority, tags, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const newTask = new Task({
      taskId: `TASK-${Date.now()}`,
      boardId: boardId || "web",
      title,
      description: description || "",
      status: status || "todo",
      priority: priority || "High",
      tags: tags || [],
      dueDate: dueDate || null,
      comments: [],
    });

    const savedTask = await newTask.save();
    res.status(201).json(formatTask(savedTask));
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
};

// @desc Update task details (EDIT)
// @route PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const idParam = req.params.id;
    const filter = {
      $or: [
        { taskId: idParam },
        { _id: idParam.match(/^[0-9a-fA-F]{24}$/) ? idParam : null },
      ],
    };

    const updatedTask = await Task.findOneAndUpdate(filter, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json(formatTask(updatedTask));
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};

// @desc Delete task (DELETE)
// @route DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const idParam = req.params.id;
    const filter = {
      $or: [
        { taskId: idParam },
        { _id: idParam.match(/^[0-9a-fA-F]{24}$/) ? idParam : null },
      ],
    };

    const deletedTask = await Task.findOneAndDelete(filter);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }
    res.json({ message: "Task deleted successfully", id: idParam });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
};

// @desc Move task / Change status
// @route PATCH /api/tasks/:id/move
export const moveTask = async (req, res) => {
  try {
    const { status } = req.body;
    const idParam = req.params.id;
    const filter = {
      $or: [
        { taskId: idParam },
        { _id: idParam.match(/^[0-9a-fA-F]{24}$/) ? idParam : null },
      ],
    };

    const task = await Task.findOneAndUpdate(filter, { status }, { new: true });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json(formatTask(task));
  } catch (error) {
    res.status(500).json({ message: "Failed to move task", error: error.message });
  }
};

// @desc Add comment to task
// @route POST /api/tasks/:id/comments
export const addComment = async (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const idParam = req.params.id;
    const filter = {
      $or: [
        { taskId: idParam },
        { _id: idParam.match(/^[0-9a-fA-F]{24}$/) ? idParam : null },
      ],
    };

    const task = await Task.findOne(filter);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const newComment = {
      author: author || "Anonymous",
      text,
      createdAt: new Date().toLocaleString(),
    };

    task.comments.push(newComment);
    await task.save();

    res.status(201).json({ comment: newComment, task: formatTask(task) });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};