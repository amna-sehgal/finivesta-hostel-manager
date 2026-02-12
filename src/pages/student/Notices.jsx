import Navbar from "../../components/common/sNavbar";
import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import styles from "./Notices.module.css";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [visible, setVisible] = useState(false);
  const [clearedAt, setClearedAt] = useState(null);

  const student = JSON.parse(localStorage.getItem("student"));

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const fetchNotices = () => {
    if (!student || !student.email) return;
    fetch(`http://localhost:5000/api/notifications/student/${student.email}`)
      .then((res) => res.json())
      .then((data) => {
        const items = (data.notifications || []).map((n) => ({
            id: n._id,
            title: n.title,
            description: n.message,
            date: new Date(n.createdAt).toLocaleDateString("en-GB"),
          }));
        const filtered = clearedAt
          ? items.filter((n) => {
              const original = (data.notifications || []).find(x => x._id === n.id);
              return original && new Date(original.createdAt) > clearedAt;
            })
          : items;
        setNotices(filtered);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchNotices(); // initial fetch
    const interval = setInterval(fetchNotices, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [student]);

  const handleClearAll = () => {
    setClearedAt(new Date());
    setNotices([]);
  };

  return (
    <>
      <Navbar />

      <div className={styles.noticesRoot}>
        <div className={styles.noticesHeader}>
          <FiBell className={styles.noticeIcon} />
          <h1>Notices</h1>
          {notices.length > 0 && (
            <button className={styles.clearBtn} onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>

        {notices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No notices available 🎉</p>
          </div>
        ) : (
          <div className={styles.noticesGrid}>
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`${styles.noticeCard} ${styles.glass} ${visible ? styles.fadeIn : ""}`}
              >
                <h3>{notice.title}</h3>
                <span className={styles.noticeDate}>{notice.date}</span>
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

