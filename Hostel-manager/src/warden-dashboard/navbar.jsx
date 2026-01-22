
import './navbar.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <>
            <nav className="navbar navbar-top">
                <div className="navbar-logo">
                    <div className="logo-icon">📚</div>
                    <span className="logo-text">StayMate</span>
                </div>
                <div className="navbar-items">
                    <Link to="/" className="nav-item home-btn">
                        <span className="icon">🏠</span>
                        <span className="label">Home</span>
                    </Link>
                    <button className="nav-item notification-btn">
                        <span className="icon">🔔</span>
                        <span className="label">Notifications</span>
                        <span className="badge">3</span>
                    </button>
                    <button className="nav-item profile-btn">
                        <span className="icon">👤</span>
                        <span className="label">Profile</span>
                    </button>
                    <div className="dropdown-container">
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
                </div>
            </nav>
            <div className={`dropdown-sidepanel${isDropdownOpen ? ' open' : ''}`}>
                <div className="dropdown-sidepanel-content dashboard-theme">
                    <div className="dropdown-title">
                        <span className="dropdown-title-icon">📚</span>
                        <span className="dropdown-title-text">StayMate</span>
                    </div>
                    <Link
                        to="/warden-dashboard/dropdown/approval"
                        className="dropdown-item"
                    >
                        Go Approval
                    </Link>

                    <Link to="/warden-dashboard/dropdown/approval" className="dropdown-item">
                        📝 Outpass Approval
                    </Link>

                    <Link to="/warden-dashboard/dropdown/complaint" onClick={() => setIsDropdownOpen(false)} className="dropdown-item dropdown-anim">
                        📢 Complaint Management
                    </Link>

                    <Link to="/warden-dashboard/dropdown/mess" onClick={() => setIsDropdownOpen(false)} className="dropdown-item dropdown-anim">
                        🍽️ Mess Control Panel
                    </Link>

                    <Link to="/warden-dashboard/dropdown/laundry" onClick={() => setIsDropdownOpen(false)} className="dropdown-item dropdown-anim">
                        🧺 Laundry Management
                    </Link>

                    <Link to="#" onClick={() => setIsDropdownOpen(false)} className="dropdown-item dropdown-anim" style={{ animationDelay: '0.25s' }}><span className="dropdown-icon">🛡️</span> Safety Control Room</Link>
                    <div className="dropdown-divider"></div>
                    <Link to="#" onClick={() => setIsDropdownOpen(false)} className="dropdown-item dropdown-anim" style={{ animationDelay: '0.30s' }}><span className="dropdown-icon">⚙️</span> Settings</Link>
                    <Link to="#" onClick={() => setIsDropdownOpen(false)} className="dropdown-item dropdown-anim" style={{ animationDelay: '0.35s' }}><span className="dropdown-icon">🚪</span> Log Out</Link>
                </div>
                <div className="dropdown-sidepanel-backdrop" onClick={() => setIsDropdownOpen(false)}></div>
            </div>
        </>
    );
}

export default Navbar;