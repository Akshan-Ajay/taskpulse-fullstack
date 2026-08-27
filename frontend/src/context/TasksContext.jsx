import { createContext, useContext, useState, useEffect, useCallback } from "react";

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Boards & Tasks from Backend
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);

        const [boardsRes, tasksRes] = await Promise.all([
          fetch("http://localhost:5000/api/tasks/boards"),
          fetch("http://localhost:5000/api/tasks"),
        ]);

        const boardsData = await boardsRes.json();
        const tasksData = await tasksRes.json();

        setBoards(boardsData);
        if (boardsData.length > 0) setCurrentBoardId(boardsData[0].id);
        setTasks(tasksData);
      } catch (err) {
        console.error("Error connecting to backend server:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  const currentBoard = boards.find((b) => b.id === currentBoardId) || boards[0] || { id: "web", name: "Board" };
  const boardTasks = tasks.filter((t) => t.boardId === currentBoardId);

  // 1. Move Task (Drag-and-Drop)
  const moveTask = useCallback(async (taskId, toStatus, toIndex) => {
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

    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: toStatus, targetIndex: toIndex }),
      });
    } catch (err) {
      console.error("Failed to persist task move:", err);
    }
  }, []);

  // 2. Create New Task (For Add Task Page/Modal)
  const AddNewTask = async (taskData) => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskData, boardId: currentBoardId }),
      });
      const created = await res.json();
      setTasks((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  // 3. Add Comment to Task
  const addCommentToTask = async (taskId, commentText, author) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText, author }),
      });
      const data = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, comments: [...t.comments, data.comment] } : t))
      );
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks: boardTasks,
        allTasks: tasks,
        boards,
        currentBoard,
        setCurrentBoardId,
        moveTask,
        AddNewTask,
        addCommentToTask,
        loading,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}