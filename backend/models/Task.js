import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: { type: String, default: "Anonymous" },
  text: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toLocaleString() },
});

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
      default: () => `TASK-${Date.now()}`,
    },
    boardId: { type: String, required: true, default: "web" },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["todo", "doing", "done"], default: "todo" },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    dueDate: { type: String, default: null },
    tags: [{ type: String }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);