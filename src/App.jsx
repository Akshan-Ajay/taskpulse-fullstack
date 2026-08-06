import { useState } from "react";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import Navbar from "./components/Navbar";
import logoImg from "./assets/logo.png";
import "./components/Auth/Auth.css";
import "./components/Navbar.css";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // States for Calendar Modal and Search Bar Overlay
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleNewTaskClick = () => {
    console.log("New Task button clicked!");
  };

  // ----------------------------------------------------
  // 1. DASHBOARD VIEW
  // ----------------------------------------------------
  if (currentView === "dashboard") {
    return (
      <div className="app-dashboard-layout">
        <Navbar 
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onNewTaskClick={handleNewTaskClick}
          onLoginClick={() => setCurrentView("login")}
          onRegisterClick={() => setCurrentView("register")}
          onCalendarClick={() => setShowCalendar(true)}
          onSearchClick={() => setShowSearchBar(!showSearchBar)}
        />

        {/* Dropdown Search Bar */}
        {showSearchBar && (
          <div className="search-banner">
            <input 
              type="text" 
              placeholder="Search tasks, projects, or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className="search-close-btn" onClick={() => setShowSearchBar(false)}>✕</button>
          </div>
        )}
        
        {/* Main Dashboard Content Area */}
        <main style={{ padding: "30px", color: "#ffffff" }}>
          <h2>Welcome to TaskPulse Dashboard!</h2>
          {isLoggedIn ? (
            <p>Logged in as: <strong>{user?.email}</strong></p>
          ) : (
            <p>Please click <strong>Login</strong> or <strong>Register</strong> in the navbar to get started.</p>
          )}
        </main>

        {/* Calendar Modal */}
        {showCalendar && (
          <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
            <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📅 TaskPulse Calendar</h3>
                <button className="close-btn" onClick={() => setShowCalendar(false)}>✕</button>
              </div>
              <div className="demo-calendar-grid">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="cal-head">{day}</div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className="cal-day">{i + 1}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
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
      </main>
    </div>
  );
}