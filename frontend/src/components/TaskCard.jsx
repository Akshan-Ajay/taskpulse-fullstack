import { Draggable } from "@hello-pangea/dnd";
import { CalendarDays, MessageSquare, ArrowUpRight } from "lucide-react";
import { priorityColor } from "../data/mockData";
import { viewEvents } from "../eventRouter";

const TAG_COLORS = {
  Frontend: "#8B52C3",
  Backend: "#3F8CD9",
  Design: "#E8A33D",
  Bug: "#E4574C",
  API: "#2FAE7A",
  Docs: "#7A6E96",
  Database: "#00684A",
};

export default function TaskCard({ task, columnColor, index, onSelectTask }) {
  const taskId = task._id || task.id;
  const { title, tags, assignee, dueDate, comments, priority } = task;

  const pColor = priorityColor[priority] || "#7A6E96";
  const dueSoon = dueDate && new Date(`${dueDate}T00:00:00`) < new Date(Date.now() + 2 * 86400000);

  const handleOpenDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const taskPayload = { ...task, id: taskId, _id: taskId };

    if (typeof onSelectTask === "function") {
      onSelectTask(taskPayload);
    } else {
      viewEvents.setView("view-task", taskPayload);
    }
  };

  return (
    <Draggable draggableId={String(taskId)} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? "task-card-dragging" : ""}`}
          data-id={taskId}
          style={{ "--card-accent": columnColor, ...provided.draggableProps.style }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task-card-top">
            <span
              className="priority-badge"
              style={{ background: `${pColor}22`, color: pColor }}
            >
              <span className="priority-dot" style={{ background: pColor }} />
              {priority}
            </span>

            <button
              type="button"
              className="open-icon"
              aria-label={`Open details for ${title}`}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleOpenDetails}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                position: "relative",
              }}
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          {tags?.length > 0 && (
            <div className="task-labels">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="task-label"
                  style={{ background: TAG_COLORS[tag] || "#8b81ab" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="task-title">{title}</p>

          <div className="task-footer">
            <div className="task-meta">
              {dueDate && (
                <span
                  className={`meta-item ${dueSoon ? "meta-due" : ""}`}
                  title={`Due ${dueDate}`}
                >
                  <CalendarDays size={13} />
                  {new Date(`${dueDate}T00:00:00`).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
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
              <div
                className="task-avatar"
                style={{ background: assignee.color }}
                title={assignee.name}
              >
                {assignee.initials}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}