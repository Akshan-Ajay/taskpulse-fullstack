import React, { useState, useEffect } from "react";
import { viewEvents } from "../eventRouter";

const AVAILABLE_TAGS = ["Frontend", "Backend", "Design", "Bug", "API", "Docs"];

const TAG_COLORS = {
  Frontend: "#8B52C3",
  Backend: "#3F8CD9",
  Design: "#E8A33D",
  Bug: "#E4574C",
  API: "#2FAE7A",
  Docs: "#7A6E96",
};

export default function TaskOverlayApp() {
  const [route, setRoute] = useState({ view: "dashboard", data: null });
  const [isEditing, setIsEditing] = useState(false);

  // Form / Edit States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const unsubscribe = viewEvents.subscribe((newRoute) => {
      setRoute(newRoute);
      setIsEditing(false);
      setCommentText("");

      if (newRoute.data) {
        setTitle(newRoute.data.title || "");
        setDescription(newRoute.data.description || "");
        setStatus(newRoute.data.status || "todo");
        setPriority(newRoute.data.priority || "Medium");
        setTags(newRoute.data.tags || []);
      } else {
        setTitle("");
        setDescription("");
        setStatus("todo");
        setPriority("Medium");
        setTags([]);
      }
    });
    return () => unsubscribe();
  }, []);

  if (route.view === "dashboard") return null;

  // Helper to standardise ID access across Mongo (_id) and normal (id)
  const getTaskId = (taskData) => taskData?.id || taskData?._id;

  // --- TAG TOGGLE HANDLER ---
  const handleToggleTag = (tagToToggle) => {
    if (tags.includes(tagToToggle)) {
      setTags(tags.filter((t) => t !== tagToToggle));
    } else {
      setTags([...tags, tagToToggle]);
    }
  };

  // --- API HANDLERS ---

  const handleCreateTask = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          tags,
          boardId: "web",
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        viewEvents.updateTaskCard(newTask.title, newTask);
        viewEvents.setView("dashboard");
      }
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleSaveEdit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const task = route.data;
    const taskId = getTaskId(task);

    if (!taskId) {
      console.error("No task ID found in route.data:", task);
      alert("Cannot save: Task is missing a valid ID.");
      return;
    }

    console.log("Saving task with ID:", taskId, { title, description, priority, tags });

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, tags }),
      });

      if (res.ok) {
        const responseData = await res.json();
        const updatedData =
          responseData.task ||
          (getTaskId(responseData)
            ? responseData
            : { ...task, title, description, priority, tags });

        viewEvents.updateTaskCard(task.title || title, updatedData);
        setRoute((prev) => ({ ...prev, data: updatedData }));
        setIsEditing(false);
        console.log("Successfully saved changes!");
      } else {
        console.error("Server returned error status:", res.status);
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDelete = async () => {
    const task = route.data;
    const taskId = getTaskId(task);

    if (!taskId) {
      console.error("No task ID found for deletion:", task);
      return;
    }

    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
          method: "DELETE",
        });
        viewEvents.updateTaskCard(task.title, { delete: true });
        viewEvents.setView("dashboard");
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const task = route.data;
    const taskId = getTaskId(task);

    if (!taskId) {
      console.error("No task ID found for comment:", task);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${taskId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: commentText }),
        }
      );

      if (res.ok) {
        const { comment } = await res.json();
        const updatedTask = {
          ...task,
          comments: [...(task.comments || []), comment],
        };
        setRoute((prev) => ({ ...prev, data: updatedTask }));
        setCommentText("");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const getPriorityColors = (p) => {
    const pLower = p?.toLowerCase() || "";
    if (pLower.includes("high") || pLower.includes("urgent"))
      return { bg: "#fee2e2", text: "#ef4444" };
    if (pLower.includes("low")) return { bg: "#dcfce7", text: "#22c55e" };
    return { bg: "#f3e8ff", text: "#6b21a8" };
  };

  // --- VIEW: CREATE NEW TASK ---
  if (route.view === "create-task") {
    return (
      <div style={styles.overlay}>
        <div style={{ ...styles.modalCard, maxWidth: "580px" }}>
          <h2 style={styles.modalTitle}>Create New Task</h2>
          <hr style={styles.divider} />
          <form onSubmit={handleCreateTask}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Task Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="enter task title..."
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
                        border: isSelected
                          ? "none"
                          : "1px solid rgba(196, 181, 253, 0.8)",
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
                placeholder="enter detailed description..."
                rows="4"
                style={styles.textarea}
              />
            </div>

            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={styles.select}
                >
                  <option value="todo">📌 To Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={styles.select}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="button"
                onClick={() => viewEvents.setView("dashboard")}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" style={styles.saveBtn}>
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: TASK DETAILS ---
  if (route.view === "task-details") {
    const task = route.data;
    const pColors = getPriorityColors(isEditing ? priority : task?.priority);

    return (
      <div style={styles.overlay}>
        <div style={{ ...styles.modalCard, maxWidth: "840px" }}>
          {/* Top Header Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <button
              type="button"
              onClick={() => viewEvents.setView("dashboard")}
              style={styles.backBtn}
            >
              ← Back to Board
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={styles.editBtn}
                  >
                    📝 Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    style={styles.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveEdit} style={styles.detailGrid}>
            {/* Left Content Column */}
            <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
              <span style={styles.sectionBadge}>TASK PROFILE</span>

              {isEditing ? (
                <div style={{ marginTop: "8px", marginBottom: "15px" }}>
                  <label style={styles.label}>Edit Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              ) : (
                <h2 style={styles.taskDetailTitle}>{task?.title}</h2>
              )}

              {/* Dynamic / Editable Tags */}
              <label style={styles.label}>Tags</label>
              {isEditing ? (
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
                          border: isSelected
                            ? "none"
                            : "1px solid rgba(196, 181, 253, 0.8)",
                        }}
                      >
                        {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={styles.tagsDisplayBox}>
                  {task?.tags?.length > 0 ? (
                    task.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          ...styles.tagBadge,
                          background: TAG_COLORS[tag] || "#7A6E96",
                        }}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                      No tags attached
                    </span>
                  )}
                </div>
              )}

              <h4 style={styles.sectionHeader}>DESCRIPTION</h4>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  style={styles.textarea}
                />
              ) : (
                <p style={styles.descText}>
                  {task?.description || "No description provided."}
                </p>
              )}

              {!isEditing && (
                <>
                  <h4 style={styles.sectionHeader}>ACTIVITY / COMMENTS</h4>

                  {task?.comments?.length > 0 && (
                    <div style={styles.commentsList}>
                      {task.comments.map((c) => (
                        <div key={c.id || c._id || c.text} style={styles.commentBox}>
                          <div style={styles.commentMeta}>
                            <strong>{c.author?.name || "Anonymous"}</strong>
                            <span>{c.createdAt}</span>
                          </div>
                          <div style={styles.commentBody}>{c.text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="write a comment..."
                      style={{ ...styles.commentInput, flex: 1, marginBottom: 0 }}
                    />
                    <button
                      type="button"
                      onClick={handleAddComment}
                      style={styles.commentBtn}
                    >
                      🚀 Post
                    </button>
                  </div>
                </>
              )}

              {isEditing && (
                <button
                  type="submit"
                  style={{ ...styles.saveBtn, marginTop: "20px" }}
                >
                  Save Changes
                </button>
              )}
            </div>

            {/* Right Details Pane */}
            <div style={styles.metaColumn}>
              <h3 style={styles.metaPanelHeader}>DETAILS</h3>

              <label style={styles.metaLabel}>Priority</label>
              {isEditing ? (
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={styles.select}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              ) : (
                <div
                  style={{
                    ...styles.metaValue,
                    background: pColors.bg,
                    color: pColors.text,
                  }}
                >
                  {task?.priority}
                </div>
              )}

              <label style={styles.metaLabel}>Assignee</label>
              <div style={styles.assigneeValueBox}>
                {task?.assignee ? (
                  <>
                    <div
                      style={{
                        ...styles.avatar,
                        background: task.assignee.color || "#8B52C3",
                      }}
                    >
                      {task.assignee.initials}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#4c1d95" }}>
                      {task.assignee.name}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: "13px", color: "#9ca3af" }}>
                    Unassigned
                  </span>
                )}
              </div>

              <label style={styles.metaLabel}>Due Date</label>
              <div style={styles.metaValue}>
                📅 {task?.dueDate || "No due date"}
              </div>
            </div>
          </form>
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
  divider: {
    border: "none",
    height: "3px",
    background: "linear-gradient(90deg, #7c3aed, transparent)",
    margin: "12px 0 20px 0",
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
  tagsDisplayBox: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },
  tagBadge: {
    color: "#fff",
    padding: "5px 12px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
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
  saveBtn: {
    padding: "10px 24px",
    border: "none",
    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(109, 40, 217, 0.2)",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#7c3aed",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
  editBtn: {
    background: "#f3e8ff",
    color: "#6d28d9",
    border: "1px solid rgba(167, 139, 250, 0.4)",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteBtn: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid rgba(252, 165, 165, 0.5)",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  detailGrid: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  sectionBadge: {
    color: "#a855f7",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.05em",
  },
  taskDetailTitle: {
    margin: "4px 0 16px 0",
    color: "#25103c",
    fontSize: "22px",
    fontWeight: "800",
  },
  sectionHeader: {
    color: "#5b21b6",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.05em",
    margin: "20px 0 8px 0",
  },
  descText: {
    color: "#4c1d95",
    background: "rgba(241, 233, 247, 0.6)",
    padding: "14px",
    borderRadius: "12px",
    margin: 0,
    border: "1px solid rgba(196, 181, 253, 0.3)",
    lineHeight: "1.5",
    fontSize: "14px",
  },
  commentsList: {
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  commentBox: {
    background: "#fff",
    border: "1px solid rgba(196, 181, 253, 0.4)",
    padding: "10px 14px",
    borderRadius: "10px",
  },
  commentMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#6b21a8",
    marginBottom: "4px",
  },
  commentBody: { fontSize: "13px", color: "#374151" },
  commentInput: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid #c4b5fd",
    background: "#fff",
    outline: "none",
    color: "#4c1d95",
    fontSize: "13px",
  },
  commentBtn: {
    background: "#6d28d9",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
  },
  avatar: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "bold",
    border: "1.5px solid #fff",
  },
  metaColumn: {
    flex: 1,
    minWidth: "220px",
    background: "rgba(241, 233, 247, 0.5)",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid rgba(196, 181, 253, 0.3)",
    boxSizing: "border-box",
  },
  metaPanelHeader: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#5b21b6",
    marginBottom: "12px",
    letterSpacing: "0.05em",
  },
  metaLabel: {
    fontSize: "11px",
    color: "#8b5cf6",
    display: "block",
    marginTop: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metaValue: {
    padding: "8px 12px",
    borderRadius: "8px",
    marginTop: "4px",
    fontSize: "13px",
    fontWeight: "600",
    background: "#fff",
    border: "1px solid rgba(196, 181, 253, 0.4)",
    color: "#4c1d95",
  },
  assigneeValueBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    marginTop: "4px",
    background: "#fff",
    border: "1px solid rgba(196, 181, 253, 0.4)",
  },
};