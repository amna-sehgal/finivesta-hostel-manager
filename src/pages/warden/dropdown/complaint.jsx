import React, { useEffect, useRef, useState } from "react";
import "./complaint.css";
import gsap from "gsap";
import Navbar from "../wnavbar";

const Complaint = () => {
  const containerRef = useRef(null);
  const [complaints, setComplaints] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  // animations
  useEffect(() => {
    gsap.to(".kpi-card, .complaint-card, .ai-card", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, []);

  // fetch all complaints
  const fetchComplaints = async () => {
    const res = await fetch("http://localhost:5000/api/complaints/warden");
    const data = await res.json();
    setComplaints(data.complaints || []);
  };

  // fetch active count
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

  // update complaint status
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
      <div className="complaint-dashboard" ref={containerRef}>
        <h1 className="page-title">Complaint Management – Warden Control Panel</h1>
        <p className="page-subtitle">
          Centralized monitoring of student grievances, SLA performance, and resolution efficiency.
        </p>

        {/* KPI CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card blue">
            <h3>Total Open</h3>
            <p>{activeCount}</p>
          </div>
          <div className="kpi-card orange">
            <h3>SLA At Risk</h3>
            <p>—</p>
          </div>
          <div className="kpi-card green">
            <h3>Resolved Today</h3>
            <p>
              {complaints.filter(c => c.status === "Resolved").length}
            </p>
          </div>
          <div className="kpi-card purple">
            <h3>Avg Resolution</h3>
            <p>—</p>
          </div>
        </div>

        {/* COMPLAINT QUEUE */}
        <div className="complaint-grid">
          <div className="complaint-card">
            <h2>📋 Live Complaint Queue</h2>

            {complaints.length === 0 ? (
              <p>No complaints available</p>
            ) : (
              <ul>
                {complaints.map((c) => (
                  <li key={c.id}>
                    {c.category} – {c.hostel}
                    <span
                      className={`status ${
                        c.status === "Pending"
                          ? "open"
                          : c.status === "In Progress"
                          ? "progress"
                          : "closed"
                      }`}
                    >
                      {c.status}
                    </span>

                    {c.status !== "Resolved" && (
                      <div style={{ marginTop: "8px" }}>
                        <button
                          onClick={() => updateStatus(c.id, "In Progress")}
                          style={{ marginRight: "8px" }}
                        >
                          In Progress
                        </button>
                        <button
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
          <div className="complaint-card">
            <h2>⏱ SLA Monitoring</h2>
            <div className="progress-group">
              <p>Within SLA <span>—</span></p>
              <div className="bar">
                <div className="fill green" style={{ width: "80%" }}></div>
              </div>
              <p>Approaching Breach <span>—</span></p>
              <div className="bar">
                <div className="fill orange" style={{ width: "15%" }}></div>
              </div>
              <p>Breached <span>—</span></p>
              <div className="bar">
                <div className="fill red" style={{ width: "5%" }}></div>
              </div>
            </div>
          </div>

          {/* CLOSURE */}
          <div className="complaint-card">
            <h2>🔄 Closure & Reopen Control</h2>
            <p>
              Closed Today:{" "}
              <strong>
                {complaints.filter(c => c.status === "Resolved").length}
              </strong>
            </p>
            <p>Reopened: <strong>0</strong></p>
            <p>Pending Verification: <strong>{activeCount}</strong></p>
          </div>

          {/* DEPARTMENT */}
          <div className="complaint-card">
            <h2>📈 Department Performance</h2>
            <p>Mess Dept: ⭐ 4.2 / 5</p>
            <p>Maintenance: ⭐ 3.8 / 5</p>
            <p>Housekeeping: ⭐ 4.0 / 5</p>
          </div>
        </div>

        {/* AI SECTION (static – future scope) */}
        <div className="ai-section">
          <h2>🤖 AI-Powered Insights</h2>
          <div className="ai-grid">
            <div className="ai-card">
              <h4>🎯 Urgency Prediction</h4>
              <p>Auto-prioritized complaints</p>
            </div>
            <div className="ai-card">
              <h4>💭 Sentiment Analysis</h4>
              <p>Student tone analysis</p>
            </div>
            <div className="ai-card">
              <h4>🔀 Auto Department Routing</h4>
              <p>Electrical, Plumbing, Mess</p>
            </div>
            <div className="ai-card">
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

