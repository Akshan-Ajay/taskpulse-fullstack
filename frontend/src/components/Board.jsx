import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import { useTasks } from "../context/TasksContext";
import { statusColumns } from "../data/mockData";

export default function Board({ onSelectTask }) {
  const taskContext = useTasks();
  const tasks = taskContext?.tasks || [];
  const moveTask = taskContext?.moveTask;

  function handleDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    if (moveTask) moveTask(draggableId, destination.droppableId, destination.index);
  }

  return (
    <div className="board-scroll">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board">
          {statusColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((t) => (t.status || "").toLowerCase() === column.id.toLowerCase())}
              onSelectTask={onSelectTask}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}