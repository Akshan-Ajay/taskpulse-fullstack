import React, { useState } from 'react';
import logoImg from '../assets/logo.png';
import './Navbar.css';

// Import the mock data (adjust path if your file location is different)
import { currentWorkspace } from '../data/mockData';

const Navbar = ({ 
  isLoggedIn, 
  onNewTaskClick, 
  onLogout, 
  onLoginClick, 
  onRegisterClick,
  onCalendarClick,
  onSearchClick 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        
        {/* LEFT SECTION: Logo & Team Workspace Dropdown */}
        <div className="navbar-left">
          <div className="navbar-brand">
            <img src={logoImg} alt="Task Pulse Logo" className="logo-img" />
            <span className="brand-name">TaskPulse</span>
          </div>

          <div className="workspace-divider"></div>

          {/* Dynamic Project / Workspace Selector */}
          <div className="workspace-selector">
            <div className="workspace-badge">{currentWorkspace.badge}</div>
            <div className="workspace-info">
              <div className="workspace-title">
                {currentWorkspace.title}
                <span className="chevron-down">▼</span>
              </div>
              <div className="workspace-status">{currentWorkspace.status}</div>
            </div>
          </div>
        </div>

        {/* MIDDLE/RIGHT LINKS (Responsive Toggle Wrapper) */}
        <div className={`navbar-menu-wrapper ${isOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <button className="nav-item-link" onClick={onCalendarClick}>Calendar</button>
            <button className="nav-item-link" onClick={onSearchClick}>Search</button>
          </div>

          {/* RIGHT SECTION: Active Members, Actions & Auth */}
          <div className="navbar-right">
            
            {/* Dynamic Overlapping Member Avatars */}
            <div className="avatar-group">
              {currentWorkspace.members.map((member) => (
                <div key={member.id} className={`avatar ${member.colorClass}`}>
                  {member.initials}
                  <span className="status-dot"></span>
                </div>
              ))}
            </div>

            {/* Utility Icons */}
            <button className="icon-btn" aria-label="Change Theme">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.01445 19.1559 5.06835 19.3882 4.99562 19.5973C4.82136 20.0984 4.5 21.2075 4.5 21.5C4.5 21.7761 4.72386 22 5 22H12Z"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1.5" fill="currentColor"/></svg>
            </button>
            <button className="icon-btn" aria-label="Toggle Dark Mode">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>

            {/* Auth Logic */}
            {isLoggedIn ? (
              <>
                <button className="nav-btn-primary" onClick={onNewTaskClick}>
                  <span>+</span> Create task
                </button>
                <button className="nav-item-link logout-link" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <div className="auth-group">
                <button className="nav-item-link" onClick={onLoginClick}>Login</button>
                <button className="nav-btn-primary" onClick={onRegisterClick}>Register</button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="navbar-toggle" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;