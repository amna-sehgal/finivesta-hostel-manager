import Navbar from "../../components/common/sNavbar";
import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import "./Notices.css";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [visible, setVisible] = useState(false);

  const student = JSON.parse(localStorage.getItem("student"));

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const fetchNotices = () => {
    if (!student || !student.email) return;
    fetch(`http://localhost:5000/api/notifications/student/${student.email}`)
      .then((res) => res.json())
      .then((data) => {
        setNotices(
          (data.notifications || []).map((n) => ({
            id: n.id,
            title: n.title,
            description: n.message,
            date: new Date(n.createdAt).toLocaleDateString("en-GB"),
          }))
        );
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchNotices(); // initial fetch
    const interval = setInterval(fetchNotices, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [student]);

  const handleClearAll = () => {
    setNotices([]);
  };

  return (
    <>
      <Navbar />

      <div className="notices-root">
        <div className="notices-header">
          <FiBell className="notice-icon" />
          <h1>Notices</h1>
          {notices.length > 0 && (
            <button className="clear-btn" onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>

        {notices.length === 0 ? (
          <div className="empty-state">
            <p>No notices available 🎉</p>
          </div>
        ) : (
          <div className="notices-grid">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`notice-card glass ${visible ? "fade-in" : ""}`}
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

