import Navbar from "../../components/common/sNavbar";
import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import "./Notices.css";

function Notices() {
  const [notices, setNotices] = useState([
    {
      title: "Water Supply Maintenance",
      date: "22 Jan 2026",
      description: "Water supply will be interrupted from 10 AM to 4 PM.",
    },
    {
      title: "Mess Menu Update",
      date: "20 Jan 2026",
      description: "New menu items will be added to the mess from next week.",
    },
    {
      title: "Room Inspection",
      date: "18 Jan 2026",
      description: "Hostel room inspection will be conducted this Friday.",
    },
  ]);

  const [visible, setVisible] = useState(false);

  // simple fade-in animation on mount
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Navbar />

      <div className="notices-root">
        <div className="notices-header">
          <FiBell className="notice-icon" />
          <h1>Notices</h1>
        </div>

        {notices.length === 0 ? (
          <div className="empty-state">
            <img src="/Screenshot 2026-01-25 123403.png" alt="No notices" />
            <p>No notices available 🎉</p>
          </div>
        ) : (
          <div className="notices-grid">
            {notices.map((notice, i) => (
              <div
                key={i}
                className={`notice-card glass ${visible ? "fade-in" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3>{notice.title}</h3>
                <span className="notice-date">{notice.date}</span>
                <p>{notice.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Notices;

