import { createContext, useContext, useState, useCallback } from "react";
import { initialTasks, boards } from "../data/mockData";

const TasksContext = createContext(null);

/**
 * TasksProvider — holds all tasks (across every board) plus which board is
 * currently selected. Board.jsx reads `tasks` already filtered to the
 * current board; Column.jsx / TaskCard.jsx call `moveTask` on drag-and-drop.
 *
 * This is still a mock data layer — moveTask just reorders the in-memory
 * array. When the backend is ready, moveTask becomes a
 * PATCH /api/tasks/:id { status, position } call instead.
 */
export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentBoardId, setCurrentBoardId] = useState(boards[0].id);

  const currentBoard = boards.find((b) => b.id === currentBoardId) || boards[0];
  const boardTasks = tasks.filter((t) => t.boardId === currentBoardId);

  /**
   * Move a task to a new status column and position within that column.
   * `toIndex` is the index *within the destination column's own list*
   * (that's what @hello-pangea/dnd gives us), so we resolve it against
   * the full task array here.
   */
  const moveTask = useCallback((taskId, toStatus, toIndex) => {
    setTasks((prev) => {
      const updated = [...prev];
      const fromIdx = updated.findIndex((t) => t.id === taskId);
      if (fromIdx === -1) return prev;
      const [task] = updated.splice(fromIdx, 1);
      const movedTask = { ...task, status: toStatus };

      const destColumnTasks = updated.filter(
        (t) => t.boardId === movedTask.boardId && t.status === toStatus
      );

      if (toIndex >= destColumnTasks.length) {
        const last = destColumnTasks[destColumnTasks.length - 1];
        const insertAt = last ? updated.indexOf(last) + 1 : updated.length;
        updated.splice(insertAt, 0, movedTask);
      } else {
        const target = destColumnTasks[toIndex];
        const insertAt = updated.indexOf(target);
        updated.splice(insertAt, 0, movedTask);
      }
      return updated;
    });
  }, []);

  return (
    <TasksContext.Provider
      value={{ tasks: boardTasks, allTasks: tasks, boards, currentBoard, setCurrentBoardId, moveTask }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside a TasksProvider");
  return ctx;
}
