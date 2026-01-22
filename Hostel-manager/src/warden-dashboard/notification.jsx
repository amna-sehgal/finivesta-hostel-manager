import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import "./notification.css";

const Notification = () => {
  const [notifications, setNotifications] = useState({
    urgent: [],
    mess: [],
    outpass: [],
    complaint: [],
    system: [],
  });

  useEffect(() => {
    // Example: Fetch notifications from backend and set state
    // setNotifications({ urgent: [...], mess: [...], ... });

    // GSAP animation for all notification cards on load
    gsap.from(".notification-card", {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="notification-container">
      <h1 className="notification-title">Warden Notification Center</h1>
      <p className="notification-subtitle">
        Stay updated with all critical alerts and messages.
      </p>

      <div className="notification-grid">
        {/* ================= Urgent Alerts ================= */}
        <div className="notification-card alert">
          <div className="notification-header">
            <span className="notification-icon">⚠️</span>
            <h2>Urgent Alerts</h2>
          </div>
          <ul className="notification-list">
            {notifications.urgent.map((item, index) => (
              <li key={index} className="notification-item unread">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ================= Mess Notifications ================= */}
        <div className="notification-card mess">
          <div className="notification-header">
            <span className="notification-icon">🍽️</span>
            <h2>Mess Notifications</h2>
          </div>
          <ul className="notification-list">
            {notifications.mess.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ================= Outpass Requests ================= */}
        <div className="notification-card outpass">
          <div className="notification-header">
            <span className="notification-icon">🛂</span>
            <h2>Outpass Requests</h2>
          </div>
          <ul className="notification-list">
            {notifications.outpass.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ================= Complaint Escalations ================= */}
        <div className="notification-card complaint">
          <div className="notification-header">
            <span className="notification-icon">📢</span>
            <h2>Complaint Escalations</h2>
          </div>
          <ul className="notification-list">
            {notifications.complaint.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ================= System Warnings ================= */}
        <div className="notification-card system">
          <div className="notification-header">
            <span className="notification-icon">⚙️</span>
            <h2>System Warnings</h2>
          </div>
          <ul className="notification-list">
            {notifications.system.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notification;
