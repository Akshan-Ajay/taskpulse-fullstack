import { useState } from "react";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import logoImg from "./assets/logo.png";
import "./components/Auth/Auth.css";

export default function App() {
  const [authView, setAuthView] = useState("login");

  return (
    <div className="auth-split-wrapper">
      {/* Left Side: Logo & Brand Hero */}
      <section className="auth-brand-side">
        <div className="brand-hero-content">
          <img
            src={logoImg}
            alt="Task Pulse Logo"
            className="brand-hero-logo"
          />
          <h1 className="brand-hero-title">Task Pulse</h1>
          <p className="brand-hero-tagline">
            Keep your team's workflow in sync with real-time collaborative
            Kanban boards.
          </p>
        </div>
      </section>

      {/* Right Side: Form View */}
      <main className="auth-form-side">
        {authView === "login" ? (
          <LoginForm onSwitchToRegister={() => setAuthView("register")} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setAuthView("login")} />
        )}
      </main>
    </div>
  );
}
