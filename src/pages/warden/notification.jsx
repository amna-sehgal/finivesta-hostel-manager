import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import "./notification.css";
import Navbar from "./wnavbar";

const Notification = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    studentEmail: "",
  });
  const [notices, setNotices] = useState([]);

  // Fetch all notices
  const fetchNotices = () => {
    fetch("http://localhost:5000/api/notifications/warden")
      .then((res) => res.json())
      .then((data) => setNotices(data.notifications))
      .catch(console.error);
  };

  useEffect(() => {
    fetchNotices();
    gsap.fromTo(
      ".notification-card",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "opacity,transform",
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



  return (
    <>
      <Navbar />

      <div className="notification-container">
        <h1 className="notification-title">Notice Management</h1>
        <p className="notification-subtitle">
          Create and publish notices for students
        </p>

        <div className="notification-grid">
          {/* CREATE NOTICE */}
          <div className="notification-card system">
            <div className="notification-header">
              <span className="notification-icon">📝</span>
              <h2>Create Notice</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                className="notification-item"
                placeholder="Notice title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <textarea
                className="notification-item"
                placeholder="Notice message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
              <input
                className="notification-item"
                placeholder="Student Email (optional)"
                value={formData.studentEmail}
                onChange={(e) =>
                  setFormData({ ...formData, studentEmail: e.target.value })
                }
              />
              <button type="submit" className="submit-btn">
                Post Notice
              </button>
            </form>
          </div>

          {/* POSTED NOTICES */}
          <div className="notification-card alert">
            <div className="notification-header">
              <span className="notification-icon">📢</span>
              <h2>Posted Notices</h2>
            </div>

            {notices.length === 0 ? (
              <p className="notification-item">No notices posted yet</p>
            ) : (
              <ul className="notification-list">
                {notices.map((n) => (
                  <li key={n.id} className="notification-item">
                    <div className="notice-text">
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                    </div>

                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => handleDelete(n.id)}
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
