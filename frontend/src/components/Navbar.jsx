import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Check,
  Calendar as CalendarIcon,
  Search as SearchIcon,
  Moon,
  Sun,
  Image as ImageIcon,
  ImagePlus,
  X,
  LayoutGrid,
  Tag as TagIcon,
  CheckSquare,
} from "lucide-react";
import { boards as mockBoards, boardMembers, priorityColor, allTags } from "../data/mockData";
import { useTasks } from "../context/TasksContext";
import logo from "../assets/logo.png";

const BG_PRESETS = [
  { id: "solid", label: "Solid" },
  { id: "aurora", label: "Aurora" },
  { id: "dots", label: "Dot grid" },
  { id: "mesh", label: "Mesh glow" },
];

/**
 * Navbar — top navigation bar: brand, board switcher, calendar, search,
 * "shared with" avatars, background picker, theme toggle, and auth controls.
 */
export default function Navbar({
  isDark,
  onToggleDark,
  bg,
  onChangeBg,
  onUploadBg,
  isLoggedIn,
  onLogout,
}) {
  const taskContext = useTasks() || {};
  const tasks = taskContext.tasks || [];
  const allTasks = taskContext.allTasks || [];
  const contextBoards = taskContext.boards || [];
  const activeBoard = taskContext.currentBoard;
  const setCurrentBoardId = taskContext.setCurrentBoardId || (() => {});

  // Fallback to mock boards if context boards are unavailable
  const availableBoards = contextBoards.length > 0 ? contextBoards : mockBoards;

  // Ensure currentBoard never crashes on undefined
  const currentBoard = activeBoard || {
    id: "web",
    name: "Web Platform",
    letter: "W",
    color: "#6d28d9",
    membersLabel: "Team",
  };

  const [openPanel, setOpenPanel] = useState(null); // 'board' | 'calendar' | 'search' | 'people' | 'bg' | null
  const [query, setQuery] = useState("");

  const boardRef = useRef(null);
  const calendarRef = useRef(null);
  const searchRef = useRef(null);
  const peopleRef = useRef(null);
  const bgRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      const refs = [boardRef, calendarRef, searchRef, peopleRef, bgRef];
      const clickedInside = refs.some((r) => r.current && r.current.contains(e.target));
      if (!clickedInside) setOpenPanel(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggle(panel) {
    setOpenPanel((p) => (p === panel ? null : panel));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUploadBg(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const boardIdKey = currentBoard.id || currentBoard.customId || "web";
  const members = boardMembers[boardIdKey] || boardMembers["web"] || [];

  return (
    <header className="navbar">
      <div className="brand">
        <img src={logo} alt="" className="brand-mark" />
        TaskPulse
      </div>

      {/* 1. Board switcher */}
      <div className="board-switcher" ref={boardRef}>
        <button className="board-switcher-btn" onClick={() => toggle("board")} aria-label="Switch board">
          <span className="board-letter" style={{ background: currentBoard.color || "#6d28d9" }}>
            {currentBoard.letter || (currentBoard.name ? currentBoard.name.charAt(0) : "B")}
          </span>
          <div className="board-title-group">
            <span className="board-name">{currentBoard.name || "Board"}</span>
            <span className="board-sub">{currentBoard.membersLabel || "Team"} · updated just now</span>
          </div>
          <ChevronDown size={15} className={`caret ${openPanel === "board" ? "caret-open" : ""}`} />
        </button>

        {openPanel === "board" && (
          <div className="nav-panel board-menu">
            <h4>Your boards</h4>
            {availableBoards.map((b) => {
              const bId = b.id || b.customId || "web";
              const isSelected = bId === boardIdKey;
              return (
                <button
                  key={bId}
                  className={`board-menu-item ${isSelected ? "active" : ""}`}
                  onClick={() => {
                    setCurrentBoardId(bId);
                    setOpenPanel(null);
                  }}
                >
                  <span className="board-letter board-letter-sm" style={{ background: b.color || "#6d28d9" }}>
                    {b.letter || (b.name ? b.name.charAt(0) : "B")}
                  </span>
                  <span className="board-menu-name">{b.name}</span>
                  {isSelected && <Check size={14} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <nav className="nav-actions">
        {/* 2. Calendar */}
        <div className="nav-item" ref={calendarRef}>
          <button
            className={`nav-link ${openPanel === "calendar" ? "nav-link-active" : ""}`}
            onClick={() => toggle("calendar")}
          >
            <CalendarIcon size={16} />
            Calendar
          </button>
          {openPanel === "calendar" && <CalendarPanel tasks={tasks} />}
        </div>

        {/* 3. Search */}
        <div className="nav-item" ref={searchRef}>
          <button
            className={`nav-link ${openPanel === "search" ? "nav-link-active" : ""}`}
            onClick={() => toggle("search")}
          >
            <SearchIcon size={16} />
            Search
          </button>
          {openPanel === "search" && (
            <SearchPanel
              allTasks={allTasks}
              query={query}
              setQuery={setQuery}
              onNavigateBoard={setCurrentBoardId}
              onClose={() => setOpenPanel(null)}
              availableBoards={availableBoards}
            />
          )}
        </div>
      </nav>

      {/* 4. Avatars -> shared-with panel */}
      <div className="people-cluster" ref={peopleRef}>
        <button
          className="presence-stack"
          onClick={() => toggle("people")}
          aria-label="Show who this board is shared with"
        >
          {members.map((m) => (
            <span key={m.id || m.name} className="presence-avatar" style={{ background: m.color }} title={m.name}>
              {m.initials}
              <span className={`dot ${m.online ? "" : "offline"}`} />
            </span>
          ))}
        </button>
        {openPanel === "people" && <SharedWithPanel members={members} boardName={currentBoard.name || "Board"} />}
      </div>

      {/* 5. Background changer */}
      <div className="nav-item" ref={bgRef}>
        <button className="icon-btn" aria-label="Change background" onClick={() => toggle("bg")}>
          <ImageIcon size={16} />
        </button>
        {openPanel === "bg" && (
          <div className="nav-panel bg-panel">
            <h4>Page background</h4>
            <div className="bg-swatches">
              {BG_PRESETS.map((opt) => (
                <button
                  key={opt.id}
                  className={`bg-swatch ${opt.id} ${bg === opt.id ? "active" : ""}`}
                  onClick={() => onChangeBg(opt.id)}
                  aria-label={opt.label}
                  title={opt.label}
                />
              ))}
              <button
                className={`bg-swatch upload ${bg === "custom" ? "active" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload from your gallery"
                title="Upload from your gallery"
              >
                <ImagePlus size={15} />
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
            <p className="nav-panel-hint">Pick a preset, or upload a photo from your device.</p>
          </div>
        )}
      </div>

      {/* 6. Theme toggle */}
      <button className="icon-btn" onClick={onToggleDark} aria-label="Toggle dark mode">
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Conditional Interface Engine - Login/Register vs Logout Switch */}
      {isLoggedIn ? (
        <button className="btn-ghost-nav" onClick={onLogout}>
          Logout
        </button>
      ) : (
        <>
          <button className="btn-ghost-nav">Login</button>
          <button className="btn-primary">Register</button>
        </>
      )}
    </header>
  );
}

/* ---------------- Calendar panel ---------------- */

function CalendarPanel({ tasks }) {
  const monthDate = new Date("2026-08-01T00:00:00");
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const tasksByDay = useMemo(() => {
    const map = {};
    (tasks || []).forEach((t) => {
      if (!t.dueDate) return;
      const day = Number(t.dueDate.slice(-2));
      if (!isNaN(day)) {
        (map[day] ||= []).push(t);
      }
    });
    return map;
  }, [tasks]);

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="nav-panel calendar-panel">
      <h4>{monthDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h4>
      <div className="calendar-grid calendar-weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((day, i) => {
          const dayTasks = day ? tasksByDay[day] || [] : [];
          return (
            <div key={i} className={`calendar-cell ${day ? "" : "calendar-cell-empty"}`}>
              {day && (
                <>
                  <span className="calendar-day-num">{day}</span>
                  <span className="calendar-dots">
                    {dayTasks.slice(0, 3).map((t) => {
                      const tId = t.id || t._id || t.taskId || Math.random();
                      const color = priorityColor[t.priority] || "#8B52C3";
                      return (
                        <span
                          key={tId}
                          className="calendar-dot"
                          style={{ background: color }}
                          title={`${t.title} — ${t.priority}`}
                        />
                      );
                    })}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="calendar-legend">
        {Object.entries(priorityColor).map(([label, color]) => (
          <span key={label} className="calendar-legend-item">
            <span className="calendar-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Search panel ---------------- */

function SearchPanel({ allTasks, query, setQuery, onNavigateBoard, onClose, availableBoards }) {
  const q = query.trim().toLowerCase();

  const matchedTasks = q ? (allTasks || []).filter((t) => t.title && t.title.toLowerCase().includes(q)) : [];
  const matchedTags = q ? (allTags || []).filter((tag) => tag.toLowerCase().includes(q)) : [];
  const matchedBoards = q ? (availableBoards || []).filter((b) => b.name && b.name.toLowerCase().includes(q)) : [];

  const hasResults = matchedTasks.length || matchedTags.length || matchedBoards.length;

  return (
    <div className="nav-panel search-panel">
      <div className="search-input-row">
        <SearchIcon size={15} className="search-input-icon" />
        <input
          autoFocus
          placeholder="Search tasks, tags, or boards..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>

      {!q && <p className="nav-panel-hint">Start typing to search across every board.</p>}

      {q && !hasResults && <p className="nav-panel-hint">No matches for &ldquo;{query}&rdquo;.</p>}

      {matchedBoards.length > 0 && (
        <div className="search-group">
          <h5>
            <LayoutGrid size={12} />
            Boards
          </h5>
          {matchedBoards.map((b) => {
            const bId = b.id || b.customId || "web";
            return (
              <button
                key={bId}
                className="search-result"
                onClick={() => {
                  onNavigateBoard(bId);
                  onClose();
                }}
              >
                <span className="board-letter board-letter-sm" style={{ background: b.color || "#6d28d9" }}>
                  {b.letter || (b.name ? b.name.charAt(0) : "B")}
                </span>
                {b.name}
              </button>
            );
          })}
        </div>
      )}

      {matchedTasks.length > 0 && (
        <div className="search-group">
          <h5>
            <CheckSquare size={12} />
            Tasks ({matchedTasks.length})
          </h5>
          {matchedTasks.slice(0, 6).map((t) => {
            const tId = t.id || t._id || t.taskId || Math.random();
            const color = priorityColor[t.priority] || "#8B52C3";
            return (
              <button
                key={tId}
                className="search-result"
                onClick={() => {
                  if (t.boardId) onNavigateBoard(t.boardId);
                  onClose();
                }}
              >
                <span className="search-result-dot" style={{ background: color }} />
                {t.title}
              </button>
            );
          })}
        </div>
      )}

      {matchedTags.length > 0 && (
        <div className="search-group">
          <h5>
            <TagIcon size={12} />
            Tags
          </h5>
          <div className="search-tag-row">
            {matchedTags.map((tag) => (
              <span key={tag} className="task-label" style={{ background: "#8B52C3" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Shared-with panel ---------------- */

function SharedWithPanel({ members, boardName }) {
  return (
    <div className="nav-panel people-panel">
      <h4>Shared with &middot; {boardName}</h4>
      {(members || []).map((m) => (
        <div key={m.id || m.name} className="people-row">
          <span className="presence-avatar people-row-avatar" style={{ background: m.color }}>
            {m.initials}
            <span className={`dot ${m.online ? "" : "offline"}`} />
          </span>
          <div className="people-row-info">
            <span className="people-row-name">{m.name}</span>
            <span className="people-row-email">{m.email}</span>
          </div>
          <span className={`role-badge role-${(m.boardRole || "").toLowerCase()}`}>{m.boardRole}</span>
        </div>
      ))}
    </div>
  );
}