import React, { useEffect, useRef, useState } from "react";
import styles from "./complaint.module.css";
import gsap from "gsap";
import Navbar from "../wnavbar";

const Complaint = () => {
  const containerRef = useRef(null);
  const [complaints, setComplaints] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    gsap.to(`.${styles.kpiCard}, .${styles.complaintCard}, .${styles.aiCard}`, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, []);

  const fetchComplaints = async () => {
    const res = await fetch("http://localhost:5000/api/complaints/warden");
    const data = await res.json();
    setComplaints(data.complaints || []);
  };

  const fetchActiveCount = async () => {
    const res = await fetch(
      "http://localhost:5000/api/complaints/warden/active-count"
    );
    const data = await res.json();
    setActiveCount(data.count);
  };

  useEffect(() => {
    fetchComplaints();
    fetchActiveCount();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/complaints/warden/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    fetchComplaints();
    fetchActiveCount();
  };

  return (
    <>
      <Navbar />

      <div className={styles.dashboard} ref={containerRef}>
        <h1 className={styles.pageTitle}>
          Complaint Management – Warden Control Panel
        </h1>

        <p className={styles.pageSubtitle}>
          Centralized monitoring of student grievances, SLA performance, and resolution efficiency.
        </p>

        {/* KPI */}
        <div className={styles.kpiGrid}>
          <div className={`${styles.kpiCard} ${styles.blue}`}>
            <h3>Total Open</h3>
            <p>{activeCount}</p>
          </div>

          <div className={`${styles.kpiCard} ${styles.orange}`}>
            <h3>SLA At Risk</h3>
            <p>—</p>
          </div>

          <div className={`${styles.kpiCard} ${styles.green}`}>
            <h3>Resolved Today</h3>
            <p>
              {complaints.filter(c => c.status === "Resolved").length}
            </p>
          </div>

          <div className={`${styles.kpiCard} ${styles.purple}`}>
            <h3>Avg Resolution</h3>
            <p>—</p>
          </div>
        </div>

        {/* GRID */}
        <div className={styles.complaintGrid}>
          {/* QUEUE */}
          <div className={styles.complaintCard}>
            <h2>📋 Live Complaint Queue</h2>

            {complaints.length === 0 ? (
              <p>No complaints available</p>
            ) : (
              <ul>
                {complaints.map((c) => (
                  <li key={c.id}>
                    {c.category} – {c.hostel}

                    <span
                      className={`${styles.status} ${
                        c.status === "Pending"
                          ? styles.open
                          : c.status === "In Progress"
                          ? styles.progress
                          : styles.closed
                      }`}
                    >
                      {c.status}
                    </span>

                    {c.status !== "Resolved" && (
                      <div className={styles.actionRow}>
                        <button
                          className={styles.progressBtn}
                          onClick={() => updateStatus(c.id, "In Progress")}
                        >
                          In Progress
                        </button>

                        <button
                          className={styles.resolveBtn}
                          onClick={() => updateStatus(c.id, "Resolved")}
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SLA */}
          <div className={styles.complaintCard}>
            <h2>⏱ SLA Monitoring</h2>

            <div className={styles.progressGroup}>
              <p>Within SLA <span>—</span></p>
              <div className={styles.bar}>
                <div className={`${styles.fill} ${styles.greenFill}`} style={{ width: "80%" }}></div>
              </div>

              <p>Approaching Breach <span>—</span></p>
              <div className={styles.bar}>
                <div className={`${styles.fill} ${styles.orangeFill}`} style={{ width: "15%" }}></div>
              </div>

              <p>Breached <span>—</span></p>
              <div className={styles.bar}>
                <div className={`${styles.fill} ${styles.redFill}`} style={{ width: "5%" }}></div>
              </div>
            </div>
          </div>

          {/* CLOSURE */}
          <div className={styles.complaintCard}>
            <h2>🔄 Closure & Reopen Control</h2>

            <p>
              Closed Today:
              <strong>
                {complaints.filter(c => c.status === "Resolved").length}
              </strong>
            </p>

            <p>Reopened: <strong>0</strong></p>
            <p>Pending Verification: <strong>{activeCount}</strong></p>
          </div>

          {/* DEPARTMENT */}
          <div className={styles.complaintCard}>
            <h2>📈 Department Performance</h2>
            <p>Mess Dept: ⭐ 4.2 / 5</p>
            <p>Maintenance: ⭐ 3.8 / 5</p>
            <p>Housekeeping: ⭐ 4.0 / 5</p>
          </div>
        </div>

        {/* AI */}
        <div className={styles.aiSection}>
          <h2>🤖 AI-Powered Insights</h2>

          <div className={styles.aiGrid}>
            <div className={styles.aiCard}>
              <h4>🎯 Urgency Prediction</h4>
              <p>Auto-prioritized complaints</p>
            </div>

            <div className={styles.aiCard}>
              <h4>💭 Sentiment Analysis</h4>
              <p>Student tone analysis</p>
            </div>

            <div className={styles.aiCard}>
              <h4>🔀 Auto Department Routing</h4>
              <p>Electrical, Plumbing, Mess</p>
            </div>

            <div className={styles.aiCard}>
              <h4>🔁 Repeat Complaint Detection</h4>
              <p>Chronic issue identification</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Complaint;

