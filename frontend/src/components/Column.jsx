import { Droppable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal } from "lucide-react";
import TaskCard from "./TaskCard";
import { viewEvents } from "../eventRouter";

export default function Column({ column, tasks, onSelectTask }) {
  const handleOpenCreateModal = (e) => {
    e.preventDefault();
    viewEvents.setView("create-task");
  };

  return (
    <section className="column" aria-label={column.title}>
      <header className="column-header">
        <span className="column-dot" style={{ background: column.color }} />
        <h2 className="column-title">{column.title}</h2>
        <span className="column-count">{tasks.length}</span>
        <button className="column-add" aria-label={`Column options for ${column.title}`}>
          <MoreHorizontal size={16} />
        </button>
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`column-body ${snapshot.isDraggingOver ? "column-body-over" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id || task.id}
                task={task}
                columnColor={column.color}
                index={index}
                onSelectTask={onSelectTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="column-footer">
        <button type="button" onClick={handleOpenCreateModal} className="add-task-btn">
          <Plus size={15} />
          Add a task
        </button>
      </div>
    </section>
  );
}