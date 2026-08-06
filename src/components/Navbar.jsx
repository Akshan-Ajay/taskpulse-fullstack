import React, { useState } from 'react';
import logoImg from '../assets/logo.png';
import './Navbar.css';

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
        
        {/* LEFT SECTION: Logo & Nav Links */}
        <div className="navbar-left">
          <div className="navbar-logo">
            <img src={logoImg} alt="Task Pulse Logo" className="logo-img" />
          </div>

          <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
            {isLoggedIn && (
              <button className="nav-item nav-btn" onClick={onNewTaskClick}>
                +New Task
              </button>
            )}
            <button className="nav-item" onClick={onCalendarClick}>Calendar</button>
            <button className="nav-item" onClick={onSearchClick}>Search</button>
          </div>
        </div>

        {/* RIGHT SECTION: Auth Buttons */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <button className="nav-item nav-auth-btn" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="nav-item nav-auth" onClick={onLoginClick}>
                Login
              </button>
              <button className="nav-item nav-auth" onClick={onRegisterClick}>
                Register
              </button>
            </>
          )}

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

      </div>
    </nav>
  );
};

export default Navbar;