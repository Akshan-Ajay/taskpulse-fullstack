import React, { useState, useEffect } from "react";
import { viewEvents } from "../eventRouter";
import { useTasks } from "../context/TasksContext";

const AVAILABLE_TAGS = ["Frontend", "Backend", "Design", "Bug", "API", "Docs", "Database"];

const TAG_COLORS = {
  Frontend: "#8B52C3",
  Backend: "#3F8CD9",
  Design: "#E8A33D",
  Bug: "#E4574C",
  API: "#2FAE7A",
  Docs: "#7A6E96",
  Database: "#00684A",
};

export default function TaskOverlayApp({ initialView, taskData, onClose }) {
  const taskContext = useTasks();
  const AddNewTask = taskContext?.AddNewTask;
  const updateTask = taskContext?.updateTask || taskContext?.EditTask;
  const deleteTask = taskContext?.deleteTask || taskContext?.DeleteTask;
  const activeBoardId = taskContext?.currentBoardId || "web";

  const [route, setRoute] = useState({
    view: initialView || "dashboard",
    data: taskData || null,
  });

  const [isEditing, setIsEditing] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("High");
  const [tags, setTags] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [boardId, setBoardId] = useState(activeBoardId);

  // Feedback Notification States
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("High");
    setTags([]);
    setDueDate("");
    setBoardId(activeBoardId);
    setMessage({ type: "", text: "" });
    setIsEditing(false);
  };

  useEffect(() => {
    if (initialView) {
      setRoute({ view: initialView, data: taskData || null });
    }
  }, [initialView, taskData]);

  useEffect(() => {
    const currentView = route?.view;
    const dataToLoad = route?.data || taskData;

    if (dataToLoad && (currentView === "view-task" || currentView === "task-details")) {
      setTitle(dataToLoad.title || "");
      setDescription(dataToLoad.description || "");
      setStatus((dataToLoad.status || "todo").toLowerCase());
      setPriority(dataToLoad.priority || "High");
      setTags(Array.isArray(dataToLoad.tags) ? dataToLoad.tags : []);
      setDueDate(dataToLoad.dueDate || "");
      setBoardId(dataToLoad.boardId || activeBoardId);
      setIsEditing(false);
    } else if (currentView === "create-task") {
      resetForm();
      setIsEditing(true);
    }
  }, [route, taskData, activeBoardId]);

  useEffect(() => {
    const unsubscribe = viewEvents.subscribe((newRoute) => {
      if (!newRoute) return;
      if (typeof newRoute === "string") {
        setRoute({ view: newRoute, data: null });
      } else {
        setRoute({ view: newRoute.view || "dashboard", data: newRoute.data || null });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleClose = () => {
    resetForm();
    viewEvents.setView("dashboard");
    if (onClose) onClose();
  };

  if (!route || route.view === "dashboard" || !route.view) return null;

  const handleToggleTag = (tagToToggle) => {
    if (tags.includes(tagToToggle)) {
      setTags(tags.filter((t) => t !== tagToToggle));
    } else {
      setTags([...tags, tagToToggle]);
    }
  };

  const handleCreateTask = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        title,
        description,
        status,
        priority,
        tags,
        dueDate,
        boardId: boardId || activeBoardId,
      };

      if (AddNewTask) {
        await AddNewTask(payload);
      } else {
        const res = await fetch("http://localhost:5001/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed request");
      }

      setMessage({ type: "success", text: "Task created successfully!" });
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err) {
      console.error("Failed to create task:", err);
      setMessage({ type: "error", text: "Network error occurred while saving." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    const activeTask = route.data || taskData;
    const taskId = activeTask?.id || activeTask?._id || activeTask?.taskId;

    try {
      const payload = {
        title,
        description,
        status,
        priority,
        tags,
        dueDate,
        boardId: boardId || activeBoardId,
      };

      if (updateTask && taskId) {
        await updateTask(taskId, payload);
      } else if (taskId) {
        await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setMessage({ type: "success", text: "Task updated successfully!" });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 1500);
    } catch (err) {
      console.error("Failed to update task:", err);
      setMessage({ type: "error", text: "Failed to update task." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    const activeTask = route.data || taskData;
    const taskId = activeTask?.id || activeTask?._id || activeTask?.taskId;

    if (!taskId) return;
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setIsSubmitting(true);
    try {
      if (deleteTask) {
        await deleteTask(taskId);
      } else {
        await fetch(`http://localhost:5001/api/tasks/${taskId}`, { method: "DELETE" });
      }
      handleClose();
    } catch (err) {
      console.error("Failed to delete task:", err);
      setMessage({ type: "error", text: "Failed to delete task." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- VIEW 1: CREATE TASK ---
  if (route.view === "create-task") {
    return (
      <div style={styles.overlay} onClick={handleClose}>
        <div style={{ ...styles.modalCard, maxWidth: "580px" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={styles.modalTitle}>Create New Task</h2>
            <button onClick={handleClose} style={styles.closeBtn}>✕</button>
          </div>
          <hr style={styles.divider} />

          {message.text && (
            <div
              style={{
                ...styles.alertBanner,
                backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
                color: message.type === "success" ? "#065f46" : "#991b1b",
                borderColor: message.type === "success" ? "#a7f3d0" : "#fca5a5",
              }}
            >
              {message.type === "success" ? "✓ " : "✕ "}
              {message.text}
            </div>
          )}

          <form onSubmit={handleCreateTask}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Task Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tags (Click to select)</label>
              <div style={styles.tagSelectorBox}>
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = tags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      style={{
                        ...styles.tagChipBtn,
                        background: isSelected
                          ? TAG_COLORS[tag] || "#7c3aed"
                          : "rgba(255, 255, 255, 0.8)",
                        color: isSelected ? "#fff" : "#5b21b6",
                        border: isSelected ? "none" : "1px solid rgba(196, 181, 253, 0.8)",
                      }}
                    >
                      {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter detailed description..."
                rows="4"
                style={styles.textarea}
              />
            </div>

            <div style={{ display: "flex", gap: "15px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
                  <option value="todo">📌 To Do</option>
                  <option value="doing">⚡ Doing</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button type="button" onClick={handleClose} style={styles.cancelBtn} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" style={styles.saveBtn} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 2: VIEW / EDIT TASK DETAILS ---
  if (route.view === "view-task" || route.view === "task-details") {
    return (
      <div style={styles.overlay} onClick={handleClose}>
        <div style={{ ...styles.modalCard, maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={styles.modalTitle}>{isEditing ? "Edit Task" : "Task Details"}</h2>
            <button onClick={handleClose} style={styles.closeBtn}>✕</button>
          </div>
          <hr style={styles.divider} />

          {message.text && (
            <div
              style={{
                ...styles.alertBanner,
                backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
                color: message.type === "success" ? "#065f46" : "#991b1b",
                borderColor: message.type === "success" ? "#a7f3d0" : "#fca5a5",
              }}
            >
              {message.type === "success" ? "✓ " : "✕ "}
              {message.text}
            </div>
          )}

          {!isEditing ? (
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Task Title</label>
                <div style={styles.readOnlyValueBold}>{title || "Untitled Task"}</div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tags</label>
                <div style={styles.tagDisplayBox}>
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          ...styles.tagChipReadOnly,
                          background: TAG_COLORS[tag] || "#7c3aed",
                        }}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span style={styles.noneText}>No tags assigned</span>
                  )}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <div style={styles.readOnlyTextarea}>
                  {description || "No description provided."}
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Status</label>
                  <div style={styles.statusBadge}>
                    {status === "todo" && "📌 To Do"}
                    {status === "doing" && "⚡ Doing"}
                    {status === "done" && "✅ Done"}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Priority</label>
                  <div style={styles.readOnlyValue}>{priority}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Due Date</label>
                  <div style={styles.readOnlyValue}>{dueDate || "No due date"}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handleDeleteTask}
                  style={styles.deleteBtn}
                  disabled={isSubmitting}
                >
                  Delete Task
                </button>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="button" onClick={handleClose} style={styles.cancelBtn}>
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={styles.editBtn}
                  >
                    ✏️ Edit Task
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateTask}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tags (Click to select)</label>
                <div style={styles.tagSelectorBox}>
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = tags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        style={{
                          ...styles.tagChipBtn,
                          background: isSelected
                            ? TAG_COLORS[tag] || "#7c3aed"
                            : "rgba(255, 255, 255, 0.8)",
                          color: isSelected ? "#fff" : "#5b21b6",
                          border: isSelected ? "none" : "1px solid rgba(196, 181, 253, 0.8)",
                        }}
                      >
                        {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  style={styles.textarea}
                />
              </div>

              <div style={{ display: "flex", gap: "15px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
                    <option value="todo">📌 To Do</option>
                    <option value="doing">⚡ Doing</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={styles.cancelBtn}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(37, 16, 60, 0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxSizing: "border-box",
  },
  modalCard: {
    background: "rgba(255, 255, 255, 0.94)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    padding: "32px",
    borderRadius: "24px",
    width: "90%",
    margin: "auto",
    boxShadow: "0 20px 50px rgba(76, 29, 149, 0.25)",
    border: "1px solid rgba(196, 181, 253, 0.6)",
    maxHeight: "88vh",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  modalTitle: { color: "#4c1d95", margin: 0, fontSize: "22px", fontWeight: "800" },
  closeBtn: { background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#6d28d9" },
  divider: {
    border: "none",
    height: "3px",
    background: "linear-gradient(90deg, #7c3aed, transparent)",
    margin: "12px 0 20px 0",
  },
  alertBanner: {
    padding: "10px 16px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
  },
  formGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#5b21b6",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  readOnlyValueBold: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#371b58",
    padding: "4px 0",
  },
  readOnlyValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#4c1d95",
    padding: "6px 0",
  },
  readOnlyTextarea: {
    fontSize: "14px",
    color: "#4a3b69",
    background: "rgba(241, 233, 247, 0.4)",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(196, 181, 253, 0.4)",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 12px",
    background: "#ede9fe",
    color: "#6d28d9",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "13px",
  },
  tagDisplayBox: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    padding: "4px 0",
  },
  tagChipReadOnly: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#fff",
  },
  noneText: {
    fontSize: "13px",
    color: "#8b81ab",
    fontStyle: "italic",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #c4b5fd",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#4c1d95",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #c4b5fd",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#4c1d95",
    boxSizing: "border-box",
    resize: "none",
    outline: "none",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #c4b5fd",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#4c1d95",
    outline: "none",
    fontSize: "14px",
  },
  tagSelectorBox: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    padding: "10px",
    background: "rgba(241, 233, 247, 0.5)",
    borderRadius: "12px",
    border: "1px dashed #c4b5fd",
  },
  tagChipBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px",
  },
  cancelBtn: {
    padding: "10px 20px",
    border: "1.5px solid #c4b5fd",
    background: "#fff",
    color: "#6d28d9",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  editBtn: {
    padding: "10px 24px",
    border: "none",
    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(109, 40, 217, 0.2)",
  },
  saveBtn: {
    padding: "10px 24px",
    border: "none",
    background: "#059669",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
  },
  deleteBtn: {
    padding: "10px 20px",
    border: "none",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
};