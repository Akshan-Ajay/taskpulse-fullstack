import { useState } from "react";

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Empty Check
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    // 2. Email Validation Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address (e.g., user@example.com).");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials.");
        return;
      }

      // Save JWT token in browser storage
      if (data.token) {
        localStorage.setItem("taskpulse_token", data.token);
      }

      alert("Logged in successfully!");
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
      console.error("Login request error:", err);
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Welcome to TaskPulse</h2>
      {error && (
        <p
          className="error-message"
          style={{ color: "#ef4444", marginBottom: "1rem" }}
        >
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="enter your email..."
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p className="auth-toggle">
        Don't have an account?{" "}
        <span onClick={onSwitchToRegister} className="link-text">
          Register here
        </span>
      </p>
    </div>
  );
}
