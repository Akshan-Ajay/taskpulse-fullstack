// Mock data — stands in for the REST API until the backend is ready.

export const currentUser = {
  id: "u1",
  name: "Alex Rivera",
  initials: "AR",
  color: "#8B52C3",
};

export const teammates = [
  { id: "u1", name: "Alex Rivera", initials: "AR", color: "#8B52C3", online: true, email: "alex.rivera@taskpulse.dev", role: "Frontend" },
  { id: "u2", name: "Nadeesha Perera", initials: "NP", color: "#E8763C", online: true, email: "nadeesha.p@taskpulse.dev", role: "Design" },
  { id: "u3", name: "Kasun Silva", initials: "KS", color: "#2FAE7A", online: false, email: "kasun.silva@taskpulse.dev", role: "Backend" },
  { id: "u4", name: "Ishara Fernando", initials: "IF", color: "#3F8CD9", online: true, email: "ishara.f@taskpulse.dev", role: "Backend" },
];

// Multiple boards — switched from the letter icon in the navbar.
export const boards = [
  { id: "web", name: "Sprint 8 — Web Team", membersLabel: "4 members", letter: "W", color: "#8B52C3" },
  { id: "marketing", name: "Marketing Q3", membersLabel: "3 members", letter: "M", color: "#E8A33D" },
  { id: "mobile", name: "Mobile Launch", membersLabel: "2 members", letter: "L", color: "#3F8CD9" },
];

// Who each board is shared with, and their role on that board.
export const boardMembers = {
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

// Ordered left-to-right on the board
export const statusColumns = [
  { id: "todo", title: "To Do", color: "#6D4AEB" },
  { id: "doing", title: "Doing", color: "#E8A33D" },
  { id: "done", title: "Done", color: "#2FAE7A" },
];

export const priorities = ["Low", "Medium", "High", "Urgent"];

// Low = green, Medium = yellow, High = red (as requested) + Urgent a step darker
export const priorityColor = {
  Low: "#2FAE7A",
  Medium: "#E8B93D",
  High: "#E4574C",
  Urgent: "#B91C3C",
};

export const allTags = ["Frontend", "Backend", "Design", "Bug", "API", "Docs"];

export const initialTasks = [
  {
    id: "TASK-101",
    boardId: "web",
    title: "Design the sign-up & login screens",
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
    status: "todo",
    priority: "Low",
    assignee: teammates[3],
    dueDate: "2026-08-20",
    createdAt: "2026-08-06",
    tags: ["Frontend"],
    comments: [],
  },
];
