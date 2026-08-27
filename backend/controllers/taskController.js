// --- MOCK DATA STRUCTURE (Synchronized with Frontend) ---

const teammates = [
  { id: "u1", name: "Alex Rivera", initials: "AR", color: "#8B52C3", online: true, email: "alex.rivera@taskpulse.dev", role: "Frontend" },
  { id: "u2", name: "Nadeesha Perera", initials: "NP", color: "#E8763C", online: true, email: "nadeesha.p@taskpulse.dev", role: "Design" },
  { id: "u3", name: "Kasun Silva", initials: "KS", color: "#2FAE7A", online: false, email: "kasun.silva@taskpulse.dev", role: "Backend" },
  { id: "u4", name: "Ishara Fernando", initials: "IF", color: "#3F8CD9", online: true, email: "ishara.f@taskpulse.dev", role: "Backend" },
];

const boards = [
  { id: "web", name: "Sprint 8 — Web Team", membersLabel: "4 members", letter: "W", color: "#8B52C3" },
  { id: "marketing", name: "Marketing Q3", membersLabel: "3 members", letter: "M", color: "#E8A33D" },
  { id: "mobile", name: "Mobile Launch", membersLabel: "2 members", letter: "L", color: "#3F8CD9" },
];

const boardMembers = {
  web: [
    { ...teammates[0], boardRole: "Owner" },
    { ...teammates[1], boardRole: "Editor" },
    { ...teammates[2], boardRole: "Editor" },
    { ...teammates[3], boardRole: "Viewer" },
  ],
  marketing: [
    { ...teammates[1], boardRole: "Owner" },
    { ...teammates[0], boardRole: "Editor" },
    { ...teammates[2], boardRole: "Viewer" },
  ],
  mobile: [
    { ...teammates[3], boardRole: "Owner" },
    { ...teammates[0], boardRole: "Editor" },
  ],
};

let tasks = [
  {
    id: "TASK-101",
    boardId: "web",
    title: "Design the sign-up & login screens",
    description: "Create UI mocks and high-fidelity wireframes for authentication flows.",
    status: "todo",
    priority: "Medium",
    assignee: teammates[3],
    dueDate: "2026-08-14",
    createdAt: "2026-08-02",
    tags: ["Design"],
    comments: [],
  },
  {
    id: "TASK-102",
    boardId: "web",
    title: "Implement Input Validation",
    description: "Ensure all mandatory fields in the form interfaces are passing matching verification routines.",
    status: "doing",
    priority: "High",
    assignee: teammates[0],
    dueDate: "2026-08-10",
    createdAt: "2026-08-04",
    tags: ["Frontend"],
    comments: [{ id: "c1", author: teammates[0], text: "Added client-side validation rules.", createdAt: "10 mins ago" }],
  },
  {
    id: "TASK-103",
    boardId: "web",
    title: "Set up MongoDB Atlas cluster",
    description: "Configure network permissions, database users, and connection string for production.",
    status: "todo",
    priority: "Medium",
    assignee: teammates[2],
    dueDate: "2026-08-12",
    createdAt: "2026-08-03",
    tags: ["Backend", "API"],
    comments: [],
  },
  {
    id: "TASK-104",
    boardId: "web",
    title: "Fix column overflow on small screens",
    description: "Kanban columns overlap on viewport widths below 375px. Apply CSS min-width and horizontal scrolling.",
    status: "doing",
    priority: "Urgent",
    assignee: teammates[1],
    dueDate: "2026-08-08",
    createdAt: "2026-08-05",
    tags: ["Bug", "Frontend"],
    comments: [
      { id: "c2", author: teammates[1], text: "Repro'd on iPhone SE width.", createdAt: "1 hour ago" },
      { id: "c3", author: teammates[0], text: "Looking into a min-width fix.", createdAt: "40 mins ago" },
    ],
  },
  {
    id: "TASK-105",
    boardId: "web",
    title: "Write board & task Mongoose schemas",
    description: "Define object IDs, field validations, indexes, and default values.",
    status: "todo",
    priority: "Medium",
    assignee: teammates[2],
    dueDate: "2026-08-13",
    createdAt: "2026-08-03",
    tags: ["Backend", "Docs"],
    comments: [],
  },
  {
    id: "TASK-106",
    boardId: "web",
    title: "Build Board layout with mock data",
    description: "Assemble Drag-and-Drop functionality using hello-pangea/dnd.",
    status: "doing",
    priority: "High",
    assignee: teammates[0],
    dueDate: "2026-08-09",
    createdAt: "2026-08-04",
    tags: ["Frontend"],
    comments: [],
  },
  {
    id: "TASK-107",
    boardId: "web",
    title: "Scaffold React app with Vite",
    description: "Initialize React app with JavaScript, standard CSS modules, and SVG asset structure.",
    status: "done",
    priority: "Low",
    assignee: teammates[0],
    dueDate: "2026-08-05",
    createdAt: "2026-08-01",
    tags: ["Frontend"],
    comments: [],
  },
  {
    id: "TASK-108",
    boardId: "web",
    title: "Agree on component tree & file structure",
    description: "Document component architecture in repo wiki.",
    status: "done",
    priority: "Low",
    assignee: teammates[0],
    dueDate: "2026-08-04",
    createdAt: "2026-08-01",
    tags: ["Docs"],
    comments: [],
  },
  {
    id: "TASK-201",
    boardId: "marketing",
    title: "Draft Q3 launch newsletter",
    description: "Prepare email content highlighting product updates.",
    status: "todo",
    priority: "Medium",
    assignee: teammates[1],
    dueDate: "2026-08-16",
    createdAt: "2026-08-05",
    tags: ["Docs"],
    comments: [],
  },
  {
    id: "TASK-202",
    boardId: "marketing",
    title: "Approve landing page copy",
    description: "Review hero title, subtitles, and CTA buttons.",
    status: "doing",
    priority: "High",
    assignee: teammates[1],
    dueDate: "2026-08-11",
    createdAt: "2026-08-05",
    tags: ["Design"],
    comments: [],
  },
  {
    id: "TASK-301",
    boardId: "mobile",
    title: "Set up React Native navigation",
    description: "Configure stack navigation and bottom bar components.",
    status: "todo",
    priority: "Low",
    assignee: teammates[3],
    dueDate: "2026-08-20",
    createdAt: "2026-08-06",
    tags: ["Frontend"],
    comments: [],
  },
];

// --- CONTROLLER FUNCTIONS ---

export const getBoards = (req, res) => {
  res.json(boards);
};

export const getBoardMembers = (req, res) => {
  const { boardId } = req.params;
  const members = boardMembers[boardId] || [];
  res.json(members);
};

export const getTeammates = (req, res) => {
  res.json(teammates);
};

export const getTasks = (req, res) => {
  const { boardId } = req.query;
  if (boardId) {
    const filtered = tasks.filter((t) => t.boardId === boardId);
    return res.json(filtered);
  }
  res.json(tasks);
};

export const getTaskById = (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  res.json(task);
};

// @desc Create new task (NOW PERSISTS DESCRIPTION & ASSIGNEE OBJECT)
// @route POST /api/tasks
export const createTask = (req, res) => {
  const { title, description, boardId, status, priority, tags, dueDate, assignee } = req.body;

  if (!title || !boardId) {
    return res.status(400).json({ message: "Title and Board ID are required." });
  }

  // Find teammate object matching the assignee ID if only ID passed
  let assigneeObj = assignee;
  if (typeof assignee === "string") {
    assigneeObj = teammates.find((t) => t.id === assignee) || null;
  }

  const newTask = {
    id: `TASK-${Date.now()}`,
    boardId,
    title,
    description: description || "",
    status: status || "todo",
    priority: priority || "Medium",
    assignee: assigneeObj || null,
    dueDate: dueDate || null,
    createdAt: new Date().toISOString().split("T")[0],
    tags: tags || [],
    comments: [],
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

// @desc Update task details
// @route PUT /api/tasks/:id
export const updateTask = (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body,
  };

  res.json({ message: "Task updated successfully", task: tasks[taskIndex] });
};

export const moveTask = (req, res) => {
  const { id } = req.params;
  const { status, targetIndex } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  const [movedTask] = tasks.splice(taskIndex, 1);
  movedTask.status = status !== undefined ? status : movedTask.status;

  if (targetIndex !== undefined && targetIndex >= 0) {
    tasks.splice(targetIndex, 0, movedTask);
  } else {
    tasks.push(movedTask);
  }

  res.json({ message: "Task moved successfully", task: movedTask, tasks });
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted successfully" });
};

export const addComment = (req, res) => {
  const { id } = req.params;
  const { text, author } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required." });
  }

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    author: author || teammates[0],
    text,
    createdAt: "Just now",
  };

  task.comments.push(newComment);
  res.status(201).json({ message: "Comment added", comment: newComment, task });
};