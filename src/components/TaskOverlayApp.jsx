// src/components/TaskOverlayApp.jsx
import React, { useState, useEffect } from "react";
import { viewEvents } from "../eventRouter";

export default function TaskOverlayApp() {
  const [route, setRoute] = useState({ view: "dashboard", data: null });
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit states
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("");

  useEffect(() => {
    const unsubscribe = viewEvents.subscribe((newRoute) => {
      setRoute(newRoute);
      setIsEditing(false); // Reset editing mode when route changes
      if (newRoute.data) {
        setEditTitle(newRoute.data.title || "");
        setEditPriority(newRoute.data.priority || "Medium");
      }
    });
    return () => unsubscribe();
  }, []);

  if (route.view === "dashboard") return null; 

  // --- VIEW: CREATE NEW TASK ---
  if (route.view === "create-task") {
    return (
      <div style={styles.overlay}>
        <div style={styles.modalCard}>
          <h2 style={styles.modalTitle}>Create New Task</h2>
          <hr style={styles.divider} />
          <form onSubmit={(e) => { e.preventDefault(); viewEvents.setView("dashboard"); }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Task Title *</label>
              <input type="text" placeholder="enter task title..." required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea placeholder="enter detailed description..." rows="4" style={styles.textarea} />
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1 }}><label style={styles.label}>Status</label><select style={styles.select}><option>📌 To Do</option><option>Doing</option><option>Done</option></select></div>
              <div style={{ flex: 1 }}><label style={styles.label}>Priority</label><select style={styles.select}><option>Medium</option><option>Low</option><option>High</option><option>Urgent</option></select></div>
            </div>
            <div style={styles.buttonContainer}>
              <button type="button" onClick={() => viewEvents.setView("dashboard")} style={styles.cancelBtn}>Cancel</button>
              <button type="submit" style={styles.saveBtn}>Save Task</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: TASK DETAILS ---
  if (route.view === "task-details") {
    const task = route.data;

    const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        viewEvents.updateTaskCard(task.title, { delete: true });
        viewEvents.setView("dashboard");
      }
    };

    const handleSaveEdit = (e) => {
      e.preventDefault();
      viewEvents.updateTaskCard(task.title, {
        title: editTitle,
        priority: editPriority
      });
      // Update local view instance data state
      setRoute(prev => ({
        ...prev,
        data: { ...prev.data, title: editTitle, priority: editPriority }
      }));
      setIsEditing(false);
    };

    const getPriorityColors = (p) => {
      const pLower = p?.toLowerCase() || "";
      if (pLower.includes("high") || pLower.includes("urgent")) return { bg: "#fee2e2", text: "#ef4444" };
      if (pLower.includes("low")) return { bg: "#dcfce7", text: "#22c55e" };
      return { bg: "#f3e8ff", text: "#6b21a8" };
    };

    const pColors = getPriorityColors(isEditing ? editPriority : task?.priority);

    return (
      <div style={styles.overlay}>
        <div style={{ ...styles.modalCard, maxWidth: "900px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <button onClick={() => viewEvents.setView("dashboard")} style={styles.backBtn}>← Back to Board</button>
            <div>
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} style={styles.editBtn}>📝 Edit</button>
                  <button onClick={handleDelete} style={styles.deleteBtn}>🗑️ Delete</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSaveEdit} style={{ display: "flex", gap: "30px" }}>
            {/* Left Column */}
            <div style={{ flex: 2 }}>
              <span style={{ color: "#a855f7", fontSize: "12px", fontWeight: "bold" }}>TASK PROFILE</span>
              
              {isEditing ? (
                <div style={{ marginTop: "10px" }}>
                  <label style={styles.label}>Edit Title</label>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={styles.input} required />
                </div>
              ) : (
                <h2 style={{ margin: "5px 0 15px 0", color: "#25103c" }}>{task?.title}</h2>
              )}
              
              <div style={{ display: "flex", gap: "6px", marginBottom: "20px", marginTop: "10px" }}>
                {task?.tags?.map(tag => (
                  <span key={tag} style={{ background: "#7A6E96", color: "#fff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px" }}>
                    {tag}
                  </span>
                ))}
              </div>

              <h4 style={styles.sectionHeader}>DESCRIPTION</h4>
              <p style={styles.descText}>
                Ensure all mandatory fields in the form interfaces are passing matching verification routines.
              </p>

              {!isEditing && (
                <>
                  <h4 style={styles.sectionHeader}>ACTIVITY / COMMENTS</h4>
                  <input type="text" placeholder="write a comment..." style={styles.commentInput} />
                  <button type="button" style={styles.commentBtn}>🚀 Post Comment</button>
                </>
              )}
              
              {isEditing && (
                <button type="submit" style={{ ...styles.saveBtn, marginTop: "20px" }}>Save Changes</button>
              )}
            </div>
            
            {/* Right Side Info Pane */}
            <div style={styles.metaColumn}>
              <h3 style={{ fontSize: "14px", color: "#4b5563", marginBottom: "15px" }}>DETAILS</h3>
              
              <label style={styles.metaLabel}>Priority</label>
              {isEditing ? (
                <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} style={styles.select}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              ) : (
                <div style={{ ...styles.metaValue, background: pColors.bg, color: pColors.text }}>
                  {task?.priority}
                </div>
              )}

              <label style={styles.metaLabel}>Assignee</label>
              <div style={{ ...styles.metaValue, display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ ...styles.avatar, width: "24px", height: "24px", fontSize: "10px" }}>
                  {task?.assignee?.initials}
                </div>
                <span>{task?.assignee?.name}</span>
              </div>

              <label style={styles.metaLabel}>Due Date</label>
              <div style={styles.metaValue}>📅 {task?.dueDate}</div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  // 1. Made the overlay backdrop blur a bit stronger to pop the glass card
  overlay: { 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100vw", 
    height: "100vh", 
    backgroundColor: "rgba(37, 16, 60, 0.25)", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 99999, 
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)" 
  },
  
  // 2. Transformed into Glassmorphism: Semi-transparent background + sharp specular border highlight
  modalCard: { 
    background: "rgba(255, 255, 255, 0.65)", 
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    padding: "35px", 
    borderRadius: "24px", 
    width: "90%", 
    maxWidth: "650px", 
    boxShadow: "0 20px 40px -5px rgba(76, 29, 149, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.6)", 
    textAlign: "left",
    border: "1px solid rgba(196, 181, 253, 0.4)"
  },
  
  // 3. Replaced the color with your main theme deep purple (#4c1d95)
  modalTitle: { color: "#4c1d95", margin: 0, fontSize: "22px", fontWeight: "800" },
  
  // 4. Upgraded divider to use your brand's deep purple to transparent transition
  divider: { border: "none", height: "3px", background: "linear-gradient(90deg, #7c3aed, transparent)", margin: "10px 0 25px 0" },
  
  formGroup: { marginBottom: "20px" },
  
  // 5. Shifted label to use your brand hero's medium/dark violet (#5b21b6)
  label: { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "700", color: "#5b21b6" },
  
  // 6. Styled inputs to look premium and glass-friendly (semi-clear with theme borders)
  input: { 
    width: "100%", 
    padding: "12px", 
    borderRadius: "10px", 
    border: "1.5px solid #c4b5fd", 
    background: "rgba(250, 248, 245, 0.7)", 
    color: "#4c1d95",
    boxSizing: "border-box",
    outline: "none"
  },
  textarea: { 
    width: "100%", 
    padding: "12px", 
    borderRadius: "10px", 
    border: "1.5px solid #c4b5fd", 
    background: "rgba(250, 248, 245, 0.7)", 
    color: "#4c1d95",
    boxSizing: "border-box", 
    resize: "none",
    outline: "none"
  },
  select: { 
    width: "100%", 
    padding: "12px", 
    borderRadius: "10px", 
    border: "1.5px solid #c4b5fd", 
    background: "rgba(250, 248, 245, 0.7)", 
    color: "#4c1d95",
    outline: "none"
  },
  
  buttonContainer: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" },
  cancelBtn: { padding: "8px 18px", border: "1.5px solid #c4b5fd", background: "rgba(255, 255, 255, 0.5)", color: "#6d28d9", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" },
  
  // 7. Dynamic gradient fill for primary save actions matching btn-primary
  saveBtn: { padding: "12px 26px", border: "none", background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "700", boxShadow: "0 4px 12px rgba(109, 40, 217, 0.2)" },
  
  backBtn: { background: "none", border: "none", color: "#7c3aed", fontWeight: "700", cursor: "pointer", fontSize: "14px" },
  editBtn: { background: "#f3e8ff", color: "#6d28d9", border: "1px solid rgba(167, 139, 250, 0.3)", padding: "8px 18px", borderRadius: "10px", marginRight: "8px", cursor: "pointer", fontWeight: "600" },
  deleteBtn: { background: "#fee2e2", color: "#991b1b", border: "1px solid rgba(252, 165, 165, 0.4)", padding: "8px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" },
  
  sectionHeader: { color: "#5b21b6", fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em", margin: "25px 0 10px 0" },
  
  // 8. Text display box matches transparent bento-style design
  descText: { color: "#4c1d95", background: "rgba(241, 233, 247, 0.6)", padding: "15px", borderRadius: "12px", margin: 0, border: "1px solid rgba(196, 181, 253, 0.3)", lineHeight: "1.5" },
  
  commentInput: { width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid #c4b5fd", background: "rgba(255, 255, 255, 0.5)", boxSizing: "border-box", marginBottom: "10px", outline: "none", color: "#4c1d95" },
  commentBtn: { background: "#6d28d9", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  
  avatar: { width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", border: "2px solid #fff", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  
  // 9. Side parameters panel inside detail page updated with matching subtle backdrop transparency
  metaColumn: { flex: 1, background: "rgba(241, 233, 247, 0.4)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(196, 181, 253, 0.3)" },
  metaLabel: { fontSize: "11px", color: "#8b5cf6", display: "block", marginTop: "12px", fontWeight: "700", textTransform: "uppercase" },
  metaValue: { padding: "8px 12px", borderRadius: "8px", marginTop: "4px", fontSize: "13px", fontWeight: "600", background: "rgba(255, 255, 255, 0.7)", border: "1px solid rgba(196, 181, 253, 0.4)", color: "#4c1d95" }
};