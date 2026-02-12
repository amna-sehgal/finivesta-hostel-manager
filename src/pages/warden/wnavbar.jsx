import styles from "./wnavbar.module.css";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("warden");
    localStorage.removeItem("wardenToken");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          StayMate
        </Link>

        <div className={styles.links}>
          <Link
            to="/warden/dashboard"
            className={`${styles.link} ${isActive("/warden/dashboard") ? styles.active : ""}`}
          >
            🏠 Home
          </Link>

          <Link
            to="/warden/notification"
            className={`${styles.link} ${isActive("/warden/notification") ? styles.active : ""}`}
          >
            🔔 Notices
          </Link>

          <Link
            to="/warden/profile"
            className={`${styles.link} ${isActive("/warden/profile") ? styles.active : ""}`}
          >
            👤 Profile
          </Link>

          <button
            className={styles.hamburger}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* SIDEPANEL */}
      <div className={`${styles.sidepanel} ${isDropdownOpen ? styles.open : ""}`}>
        <div className={styles.panelContent}>
          <div className={styles.panelTitle}>StayMate</div>

          <Link to="/warden/approval" onClick={handleLinkClick} className={styles.item}>
            📝 Outpass Approval
          </Link>

          <Link to="/warden/complaint" onClick={handleLinkClick} className={styles.item}>
            📢 Complaints
          </Link>

          <Link to="/warden/mess" onClick={handleLinkClick} className={styles.item}>
            🍽️ Mess
          </Link>

          <Link to="/warden/laundry" onClick={handleLinkClick} className={styles.item}>
            🧺 Laundry
          </Link>

          <Link to="/warden/safety" onClick={handleLinkClick} className={styles.item}>
            🛡️ Safety
          </Link>

          <div className={styles.divider}></div>

          <Link to="/warden/settings" onClick={handleLinkClick} className={styles.item}>
            ⚙️ Settings
          </Link>

          <button onClick={handleLogout} className={`${styles.item} ${styles.logout}`}>
            🚪 Logout
          </button>
        </div>

        <div
          className={styles.backdrop}
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      </div>
    </>
  );
}

export default Navbar;


