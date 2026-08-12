import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import { statusColumns } from "../data/mockData";
import { useTasks } from "../context/TasksContext";

export default function Board() {
  const { tasks, moveTask } = useTasks();

  function handleDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return; // dropped outside any column
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    moveTask(draggableId, destination.droppableId, destination.index);
  }

  return (
    <div className="board-scroll">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board">
          {statusColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((t) => t.status === column.id)}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
