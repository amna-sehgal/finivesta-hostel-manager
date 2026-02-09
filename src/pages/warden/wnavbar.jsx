import './wnavbar.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when a link is clicked
  const handleLinkClick = () => setIsDropdownOpen(false);

  // Warden logout
  const handleLogout = () => {
    localStorage.removeItem("warden");
    localStorage.removeItem("wardenToken");
    navigate("/");
  };



  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-top">
        <div className="navbar-logo">
          <Link to='/'>
            <span className="logo-text">StayMate</span>
          </Link>
        </div>

        <div className="navbar-items">
          <Link to="/warden/dashboard" className="nav-item home-btn">
            <span className="icon">🏠</span>
            <span className="label">Home</span>
          </Link>

          <Link to="/warden/notification" className="nav-item notification-btn">
            <span className="icon">🔔</span>
            <span className="label">Notifications</span>
            <span className="badge">3</span>
          </Link>

          <Link to="/warden/profile" className="nav-item profile-btn">
            <span className="icon">👤</span>
            <span className="label">Profile</span>
          </Link>

          {/* Hamburger dropdown */}
          <button
            className="nav-item dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Open dropdown menu"
          >
            <span className="hamburger-lines">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Dropdown Side Panel */}
      <div className={`dropdown-sidepanel${isDropdownOpen ? ' open' : ''}`}>
        <div className="dropdown-sidepanel-content dashboard-theme">
          <div className="dropdown-title">
            <span className="dropdown-title-icon">📚</span>
            <span className="dropdown-title-text">StayMate</span>
          </div>

          {/* Dropdown Links */}
          <Link to="/warden/approval" className="dropdown-item" onClick={handleLinkClick}>
            📝 Outpass Approval
          </Link>

          <Link to="/warden/complaint" className="dropdown-item dropdown-anim" onClick={handleLinkClick}>
            📢 Complaint Management
          </Link>

          <Link to="/warden/mess" className="dropdown-item dropdown-anim" onClick={handleLinkClick}>
            🍽️ Mess Control Panel
          </Link>

          <Link to="/warden/laundry" className="dropdown-item dropdown-anim" onClick={handleLinkClick}>
            🧺 Laundry Management
          </Link>

          <Link to="/warden/safety" className="dropdown-item dropdown-anim" onClick={handleLinkClick} style={{ animationDelay: '0.25s' }}>
            🛡️ Safety Control Room
          </Link>

          <div className="dropdown-divider"></div>

          <Link to="/warden/settings" className="dropdown-item dropdown-anim" onClick={handleLinkClick} style={{ animationDelay: '0.30s' }}>
            ⚙️ Settings
          </Link>

          {/* Logout */}
          <button
            className="dropdown-item dropdown-anim logout-btn"
            onClick={handleLogout}
            style={{ animationDelay: '0.35s' }}
          >
            🚪 Log Out
          </button>
        </div>

        {/* Backdrop to close dropdown */}
        <div className="dropdown-sidepanel-backdrop" onClick={() => setIsDropdownOpen(false)}></div>
      </div>
    </>
  );
}

export default Navbar;

