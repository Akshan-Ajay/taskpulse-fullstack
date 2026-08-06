import { useState } from "react";

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    alert("Logged in successfully!");
    if (onLoginSuccess) onLoginSuccess({ email: formData.email });
  };

  return (
    <div className="auth-card">
      <h2>Welcome to TaskPulse</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email or Username</label>
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
        <button type="submit" className="btn-primary">
          Sign In
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
