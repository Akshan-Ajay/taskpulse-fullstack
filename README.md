# TaskPulse

Real-time collaborative Kanban board — the **Board & Columns** slice.

## What's in this build

- Three status columns (To Do / Doing / Done)
- **Drag and drop** — move a task between columns or reorder it within a
  column (`@hello-pangea/dnd`)
- **Priority color coding** on every card — Low = green, Medium = yellow,
  High = red, Urgent = dark red
- **Multiple boards** — click the letter icon in the top bar to switch
  between boards (mock: Web Team / Marketing Q3 / Mobile Launch)
- **Dark mode** toggle
- **Page background picker** — presets (solid / aurora / dot grid / mesh
  glow) plus **upload your own photo** from your device as the background
- Full-bleed layout — no page-chrome sitting in a corner

This slice does **not** include the Create Task or Task Detail pages —
those are being built by teammates. The "Create task" button, "Add a
task" links, and the small arrow icon on each card are plain links to
`/tasks/new` and `/tasks/:id` — they'll open your teammates' pages once
everything is merged into one app. They won't render anything in this
project on their own.

## Requirements

Node.js 18+ and npm.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

```bash
npm run build     # production build -> dist/
npm run preview   # preview the production build
npm run lint       # oxlint
```

## Project structure

```
src/
  main.jsx
  App.jsx                    # theme state (dark mode, background incl. custom upload)
  App.css                    # all component styles
  index.css                  # design tokens + background variants
  assets/
    logo.png                  # TaskPulse logo
  context/
    TasksContext.jsx           # tasks + current board + drag-and-drop reordering
  data/
    mockData.js                 # mock tasks, boards, teammates, priority colors
  components/
    Topbar.jsx                   # branding, board switcher, presence, theme controls
    Board.jsx                     # DragDropContext + renders the 3 columns
    Column.jsx                     # Droppable column
    TaskCard.jsx                    # Draggable card w/ priority badge + open icon
```

## A note on colors

The `App.css` you shared earlier didn't actually have color variables in
it — it was leftover default Vite template CSS, no `:root { --accent: ... }`
block. The palette here was sampled directly from your screenshots instead
(lavender background, white cards, `#8B52C3` purple). Everything's
centralized in `src/index.css` if you get a real theme file to swap in.

## Wiring this to the real backend later

`TasksContext.jsx`'s `moveTask` is the one function that talks to task
state. When the backend is ready, it becomes a
`PATCH /api/tasks/:id { status, position }` call instead of an in-memory
array splice — nothing in `Board.jsx`, `Column.jsx`, or `TaskCard.jsx`
needs to change shape-wise.
