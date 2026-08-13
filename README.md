# TaskPulse — Navbar + Board & Columns

## What's new in this build

The navbar (matching the layout in your screenshot) is now fully wired up:

1. **Board switcher** — click "Sprint 8 — Web Team" to see and switch
   between your boards (mock: Web Team / Marketing Q3 / Mobile Launch).
2. **Calendar** — click the Calendar link for a mock month view. Each day
   with a task due gets a colored dot: green = Low, yellow = Medium,
   red = High, dark red = Urgent. Legend at the bottom of the popover.
3. **Search** — click Search, type anything. It searches task titles,
   tags, and board names across every board at once, grouped by type.
4. **Shared with** — click the avatar cluster to see everyone this board
   is shared with, their email, and their role (Owner/Editor/Viewer).
5. **Background changer** — the image icon next to the avatars opens the
   same background picker as before: 4 presets, plus upload your own
   photo from your device.
6. **Dark/light toggle** — the moon/sun icon.
7. **Navbar color follows the theme** — it's not one hardcoded color;
   `--topbar` / `--topbar-text` are theme tokens in `src/index.css`, so
   the navbar shifts between a deep purple (light mode) and near-black
   purple (dark mode) automatically.

Login/Register are plain styled buttons with no logic behind them —
that's still a teammate's part.

## Requirements

Node.js 18+ and npm.

## Run it

```bash
npm install
npm run dev
```

## Project structure

```
src/
  main.jsx
  App.jsx                 # renders Navbar + Board, owns theme/background state
  App.css
  index.css                # design tokens, incl. --topbar / --topbar-text per theme
  assets/
    logo.png
  context/
    TasksContext.jsx        # tasks (all + current board), board switching, drag reorder
  data/
    mockData.js              # tasks, boards, board membership/roles, tags, priority colors
  components/
    Navbar.jsx                # board switcher, calendar, search, shared-with, bg, theme
    Board.jsx                  # DragDropContext + renders the 3 columns
    Column.jsx                  # Droppable column
    TaskCard.jsx                 # Draggable card w/ priority badge + open icon
```

## A note on the mock data

Everything (tasks, boards, who's shared on which board, roles) lives in
`src/data/mockData.js` and `boardMembers` in the same file. When there's
a real backend, the shapes there are what a `GET /api/boards`,
`GET /api/tasks`, and `GET /api/boards/:id/members` response should
roughly match, so swapping them for `fetch()` calls should be
straightforward.

## Merging with your teammate's work

If your friend already has a working `Navbar` in the shared repo with
Login/Register logic wired up, don't just overwrite their file — open
both versions side by side and combine: keep their auth logic, bring in
the board switcher / calendar / search / shared-with / background pieces
from this one. The panel logic in `Navbar.jsx` is self-contained (all in
one file, one `openPanel` state) specifically so it's easy to lift into
whatever navbar shell already exists.
