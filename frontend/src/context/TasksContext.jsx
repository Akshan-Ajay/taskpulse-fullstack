import { createContext, useContext, useState, useEffect, useCallback } from "react";

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [currentBoardId, setCurrentBoardId] = useState("web");
  const [loading, setLoading] = useState(true);

  // Fetch initial boards and tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/tasks");
      if (res.ok) {
        const tasksData = await res.json();
        setTasks(tasksData);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);

        const [boardsRes, tasksRes] = await Promise.all([
          fetch("http://localhost:5001/api/tasks/boards"),
          fetch("http://localhost:5001/api/tasks"),
        ]);

        const boardsData = await boardsRes.json();
        const tasksData = await tasksRes.json();

        setBoards(boardsData);
        if (boardsData.length > 0) {
          setCurrentBoardId(boardsData[0].id || boardsData[0].customId || "web");
        }
        setTasks(tasksData);
      } catch (err) {
        console.error("Error connecting to backend server:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  const currentBoard = boards.find((b) => (b.id || b.customId) === currentBoardId) || { id: "web", name: "Board" };
  const boardTasks = tasks.filter((t) => t.boardId === currentBoardId);

  // 1. ADD TASK
  const AddNewTask = async (taskData) => {
    try {
      const payload = {
        ...taskData,
        boardId: taskData.boardId || currentBoardId || "web",
      };

      const res = await fetch("http://localhost:5001/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const created = await res.json();
      setTasks((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.error("Failed to create task:", err);
      return null;
    }
  };

  // 2. EDIT / UPDATE TASK
  const updateTask = async (taskId, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId || t._id === taskId || t.taskId === taskId ? updated : t
        )
      );
      return updated;
    } catch (err) {
      console.error("Failed to edit task:", err);
      return null;
    }
  };

  // 3. DELETE TASK
  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      setTasks((prev) =>
        prev.filter((t) => t.id !== taskId && t._id !== taskId && t.taskId !== taskId)
      );
      return true;
    } catch (err) {
      console.error("Failed to delete task:", err);
      return false;
    }
  };

  // 4. MOVE TASK
  const moveTask = useCallback(async (taskId, toStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId || t._id === taskId || t.taskId === taskId
          ? { ...t, status: toStatus }
          : t
      )
    );

    try {
      await fetch(`http://localhost:5001/api/tasks/${taskId}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: toStatus }),
      });
    } catch (err) {
      console.error("Failed to move task:", err);
      fetchTasks(); // Fallback resync on error
    }
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks: boardTasks,
        allTasks: tasks,
        boards,
        currentBoard,
        currentBoardId,
        setCurrentBoardId,
        AddNewTask,
        updateTask,
        deleteTask,
        EditTask: updateTask,
        DeleteTask: deleteTask,
        moveTask,
        fetchTasks,
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