import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Board from "./components/Board";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import ProtectedTaskOverlay from "./components/ProtectedTaskOverlay"; // Swapped import
import { viewEvents } from "./eventRouter";
import { TasksProvider } from "./context/TasksContext";
import logoImg from "./assets/logo.png";

// Import original working stylesheets
import "./components/Auth/Auth.css";
import "./App.css";

export default function App() {
  // Navigation State: 'dashboard', 'login', or 'register'
  const [currentView, setCurrentView] = useState("dashboard");
  const [activeOverlay, setActiveOverlay] = useState(null); // 'create-task', 'view-task', or null
  const [selectedTaskData, setSelectedTaskData] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Shell themes & background preferences
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("taskpulse-theme") === "dark"
  );
  const [bg, setBg] = useState(
    () => localStorage.getItem("taskpulse-bg") || "aurora"
  );
  const [customBgUrl, setCustomBgUrl] = useState(
    () => localStorage.getItem("taskpulse-bg-custom") || null
  );

  // --- LISTEN FOR VIEW EVENTS FROM eventRouter ---
  useEffect(() => {
    const unsubscribe = viewEvents.subscribe(({ view, data }) => {
      if (view === "create-task" || view === "view-task" || view === "task-details") {
        setActiveOverlay(view === "task-details" ? "view-task" : view);
        setSelectedTaskData(data);
      } else if (view === "dashboard" || view === "close") {
        setActiveOverlay(null);
        setSelectedTaskData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- GLOBAL CLICK INTERCEPTOR FOR DYNAMIC NAVBAR INTERFACES ---
  useEffect(() => {
    function handleGlobalClick(e) {
      const target = e.target.closest("button");
      if (!target) return;

      const buttonText = target.textContent?.trim();
      if (buttonText === "Login") {
        e.preventDefault();
        setCurrentView("login");
      } else if (buttonText === "Register") {
        e.preventDefault();
        setCurrentView("register");
      }
    }

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  useEffect(() => {
    localStorage.setItem("taskpulse-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("taskpulse-bg", bg);
  }, [bg]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView("dashboard");
  };

  function handleUploadBg(dataUrl) {
    setCustomBgUrl(dataUrl);
    setBg("custom");
    try {
      localStorage.setItem("taskpulse-bg-custom", dataUrl);
    } catch {
      // image too large for localStorage
    }
  }

  const customStyle =
    bg === "custom" && customBgUrl
      ? {
          backgroundImage: `url(${customBgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }
      : undefined;

  // ----------------------------------------------------
  // 1. DASHBOARD / KANBAN BOARD VIEW
  // ----------------------------------------------------
  if (currentView === "dashboard") {
    return (
      <TasksProvider>
        <div
          className="app-shell"
          data-theme={isDark ? "dark" : "light"}
          data-bg={bg}
          style={customStyle}
        >
          <Navbar
            isDark={isDark}
            onToggleDark={() => setIsDark((d) => !d)}
            bg={bg}
            onChangeBg={setBg}
            onUploadBg={handleUploadBg}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />

          <Board
            onSelectTask={(task) => {
              setSelectedTaskData(task);
              setActiveOverlay("view-task");
            }}
          />

          {/* PROTECTED MODAL OVERLAY WRAPPER */}
          {activeOverlay && (
            <ProtectedTaskOverlay
              initialView={activeOverlay}
              taskData={selectedTaskData}
              isLoggedIn={isLoggedIn}
              onClose={() => {
                setActiveOverlay(null);
                setSelectedTaskData(null);
              }}
            />
          )}
        </div>
      </TasksProvider>
    );
  }

  // ----------------------------------------------------
  // 2. AUTHENTICATION VIEW
  // ----------------------------------------------------
  return (
    <div className="auth-split-wrapper">
      <section className="auth-brand-side">
        <div className="brand-hero-content">
          <img src={logoImg} alt="Task Pulse Logo" className="brand-hero-logo" />
          <h1 className="brand-hero-title">Task Pulse</h1>
          <p className="brand-hero-tagline">
            Keep your team's workflow in sync with real-time collaborative Kanban boards.
          </p>
        </div>
      </section>

      <main className="auth-form-side">
        {currentView === "login" ? (
          <LoginForm
            onSwitchToRegister={() => setCurrentView("register")}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <RegisterForm onSwitchToLogin={() => setCurrentView("login")} />
        )}

        <button
          onClick={() => setCurrentView("dashboard")}
          className="btn-ghost-nav"
          style={{
            marginTop: "24px",
            color: "#5b21b6",
            borderColor: "#c4b5fd",
            cursor: "pointer",
          }}
        >
          ← Back to Board
        </button>
      </main>
    </div>
  );
}