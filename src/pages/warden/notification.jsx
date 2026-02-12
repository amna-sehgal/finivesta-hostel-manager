import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import styles from "./notification.module.css";
import Navbar from "./wnavbar";

const Notification = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    studentEmail: "",
  });

  const [notices, setNotices] = useState([]);

  const fetchNotices = () => {
    fetch("http://localhost:5000/api/notifications/warden")
      .then((res) => res.json())
      .then((data) => setNotices(data.notifications || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchNotices();

    gsap.fromTo(
      `.${styles.card}`,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      alert("Please fill all fields");
      return;
    }

    fetch("http://localhost:5000/api/notifications/warden", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "manual",
        receiver: formData.studentEmail ? "student" : "students",
        title: formData.title,
        message: formData.message,
        studentEmail: formData.studentEmail || null,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setFormData({ title: "", message: "", studentEmail: "" });
        fetchNotices();
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/notifications/warden/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchNotices())
      .catch(console.error);
  };

  const incomingNotifications = notices.filter(
    (n) => n.type === "complaint" && n.receiver === "warden"
  );

  const postedNotices = notices.filter((n) => n.type === "manual");

  return (
    <>
      <Navbar />

      <div className={styles.root}>
        <div className={styles.header}>
          <span className={styles.icon}>📢</span>
          <div>
            <h1>Notice Management</h1>
            <p>Create and manage hostel notices</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* CREATE */}
          <div className={`${styles.card} ${styles.system}`}>
            <div className={styles.cardHeader}>
              <span>📝</span>
              <h2>Create Notice</h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                className={styles.input}
                placeholder="Notice title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <textarea
                className={styles.input}
                placeholder="Notice message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Student email (optional)"
                value={formData.studentEmail}
                onChange={(e) =>
                  setFormData({ ...formData, studentEmail: e.target.value })
                }
              />

              <button type="submit" className={styles.submitBtn}>
                Post Notice
              </button>
            </form>
          </div>

          {/* INCOMING */}
          <div className={`${styles.card} ${styles.alert}`}>
            <div className={styles.cardHeader}>
              <span>📥</span>
              <h2>Incoming Complaints</h2>
            </div>

            {incomingNotifications.length === 0 ? (
              <p className={styles.empty}>No incoming complaints</p>
            ) : (
              <ul className={styles.list}>
                {incomingNotifications.map((n) => (
                  <li key={n._id} className={styles.listItem}>
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* POSTED */}
          <div className={`${styles.card} ${styles.alert}`}>
            <div className={styles.cardHeader}>
              <span>📢</span>
              <h2>Posted Notices</h2>
            </div>

            {postedNotices.length === 0 ? (
              <p className={styles.empty}>No notices posted</p>
            ) : (
              <ul className={styles.list}>
                {postedNotices.map((n) => (
                  <li key={n._id} className={styles.listItem}>
                    <div>
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                    </div>

                    <button
                      onClick={() => handleDelete(n._id)}
                      className={styles.deleteBtn}
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;


