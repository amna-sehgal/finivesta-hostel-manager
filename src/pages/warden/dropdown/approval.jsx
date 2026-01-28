import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./approval.css";
import Navbar from "../wnavbar";

const Approval = () => {
  const titleRef = useRef();
  const analyticsRef = useRef();

  const [pending, setPending] = useState([]);

  useEffect(() => {
    // Animations
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    gsap.to(analyticsRef.current.children, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.3,
      delay: 0.2,
      ease: "power2.out",
    });

    gsap.to(".approval-card", {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.4,
      delay: 0.2,
      ease: "power3.out",
    });

    // Fetch pending outpasses
    fetch("http://localhost:5000/api/outpass/warden/pending")
      .then((res) => res.json())
      .then((data) => setPending(data.requests || []))
      .catch(console.error);
  }, []);

  const updateStatus = (id, status) => {
    fetch(`http://localhost:5000/api/outpass/warden/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then(() =>
      setPending((prev) => prev.filter((p) => p.id !== id))
    );
  };

  return (
    <>
      <Navbar />
      <div className="approval-container">
        <div className="approval-header" ref={titleRef}>
          <h1 className="approval-title">Outpass Approval Dashboard</h1>
          <p className="approval-subtitle">
            Monitor, verify, and approve student outpasses from a single dashboard.
          </p>
        </div>

        {/* ================== ANALYTICS ================== */}
        <div className="analytics-grid" ref={analyticsRef}>
          <div className="analytics-card blue">
            <h3>Pending Requests</h3>
            <p>{pending.length}</p>
          </div>
          <div className="analytics-card green">
            <h3>Approved</h3>
            <p>—</p>
          </div>
          <div className="analytics-card red">
            <h3>Rejected</h3>
            <p>—</p>
          </div>
          <div className="analytics-card purple">
            <h3>AI Flagged</h3>
            <p>—</p>
          </div>
        </div>

        {/* ================== PENDING REQUESTS ================== */}
        <div className="approval-grid">
          <div className="approval-card">
            <h2>Pending Outpass Requests</h2>
            <p>Requests awaiting your approval with reason and duration.</p>

            <ul className="status-list">
              {pending.map((req) => (
                <li key={req.id}>
                  {req.studentName} – {req.reason}
                  <div className="action-buttons">
                    <button
                      className="approve"
                      onClick={() => updateStatus(req.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => updateStatus(req.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ALL YOUR OTHER CARDS STAY AS-IS */}
        </div>
      </div>
    </>
  );
};

export default Approval;

