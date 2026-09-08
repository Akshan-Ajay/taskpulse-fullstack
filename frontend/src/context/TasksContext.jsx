import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api";

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [currentBoardId, setCurrentBoardId] = useState("web");
  const [loading, setLoading] = useState(true);

  // Helper to extract uniform ID string
  const getTaskId = (task) => task?.id || task?._id || task?.taskId;

  // Fetch initial tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, []);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);

        const [boardsRes, tasksRes] = await Promise.all([
          API.get("/tasks/boards").catch(() => ({ data: [] })),
          API.get("/tasks").catch(() => ({ data: [] })),
        ]);

        const boardsData = boardsRes.data || [];
        const tasksData = tasksRes.data || [];

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

  const currentBoard = boards.find((b) => (b.id || b.customId) === currentBoardId) || {
    id: "web",
    name: "Board",
  };
  const boardTasks = tasks.filter((t) => t.boardId === currentBoardId);

  // 1. ADD TASK
  const AddNewTask = useCallback(
    async (taskData) => {
      try {
        const payload = {
          ...taskData,
          boardId: taskData.boardId || currentBoardId || "web",
        };

        const res = await API.post("/tasks", payload);
        const created = res.data;

        setTasks((prev) => [...prev, created]);
        return created;
      } catch (err) {
        console.error("Failed to create task:", err);
        return null;
      }
    },
    [currentBoardId]
  );

  // 2. EDIT / UPDATE TASK
  const updateTask = useCallback(async (taskId, updatedData) => {
    try {
      const res = await API.put(`/tasks/${taskId}`, updatedData);
      const updated = res.data;

      setTasks((prev) =>
        prev.map((t) => (getTaskId(t) === taskId ? updated : t))
      );
      return updated;
    } catch (err) {
      console.error("Failed to edit task:", err);
      return null;
    }
  }, []);

  // 3. DELETE TASK
  const deleteTask = useCallback(async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);

      setTasks((prev) => prev.filter((t) => getTaskId(t) !== taskId));
      return true;
    } catch (err) {
      console.error("Failed to delete task:", err);
      return false;
    }
  }, []);

  // 4. MOVE TASK
  const moveTask = useCallback(
    async (taskId, toStatus) => {
      // Optimistic state update
      setTasks((prev) =>
        prev.map((t) => (getTaskId(t) === taskId ? { ...t, status: toStatus } : t))
      );

      try {
        await API.patch(`/tasks/${taskId}/move`, { status: toStatus });
      } catch (err) {
        console.error("Failed to move task:", err);
        fetchTasks(); // Resync on failure
      }
    },
    [fetchTasks]
  );

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