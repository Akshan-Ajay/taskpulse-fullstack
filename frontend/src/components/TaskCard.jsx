import { Draggable } from "@hello-pangea/dnd";
import { CalendarDays, MessageSquare, ArrowUpRight } from "lucide-react";
import { priorityColor } from "../data/mockData";

const TAG_COLORS = {
  Frontend: "#8B52C3",
  Backend: "#3F8CD9",
  Design: "#E8A33D",
  Bug: "#E4574C",
  API: "#2FAE7A",
  Docs: "#7A6E96",
};

export default function TaskCard({ task, columnColor, index, onSelectTask }) {
  // Support both Mongo (_id) and standard (id)
  const taskId = task.id || task._id;
  const { title, tags, assignee, dueDate, comments, priority } = task;

  const pColor = priorityColor[priority] || "#7A6E96";
  const dueSoon = dueDate && new Date(`${dueDate}T00:00:00`) < new Date(Date.now() + 2 * 86400000);

  const handleOpenDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const fullTaskData = {
      ...task,
      id: taskId,
      _id: taskId,
    };

    // 1. If passed via props:
    if (onSelectTask) {
      onSelectTask(fullTaskData);
      return;
    }

    // 2. Or dispatch global event if your app uses window events:
    window.dispatchEvent(
      new CustomEvent("open-task-details", { detail: fullTaskData })
    );
  };

  return (
    <Draggable draggableId={String(taskId)} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? "task-card-dragging" : ""}`}
          style={{ "--card-accent": columnColor, ...provided.draggableProps.style }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task-card-top">
            <span className="priority-badge" style={{ background: `${pColor}22`, color: pColor }}>
              <span className="priority-dot" style={{ background: pColor }} />
              {priority}
            </span>

            {/* Click button to trigger detail modal with complete task object */}
            <button
              type="button"
              className="open-icon"
              aria-label={`Open ${taskId}`}
              onClick={handleOpenDetails}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
            >
              <ArrowUpRight size={14} />
            </button>
          </div>

          {tags?.length > 0 && (
            <div className="task-labels">
              {tags.map((tag) => (
                <span key={tag} className="task-label" style={{ background: TAG_COLORS[tag] || "#8b81ab" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="task-title">{title}</p>

          <div className="task-footer">
            <div className="task-meta">
              {dueDate && (
                <span className={`meta-item ${dueSoon ? "meta-due" : ""}`} title={`Due ${dueDate}`}>
                  <CalendarDays size={13} />
                  {new Date(`${dueDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              )}
              {comments?.length > 0 && (
                <span className="meta-item" title={`${comments.length} comments`}>
                  <MessageSquare size={13} />
                  {comments.length}
                </span>
              )}
            </div>

            {assignee && (
              <div className="task-avatar" style={{ background: assignee.color }} title={assignee.name}>
                {assignee.initials}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}