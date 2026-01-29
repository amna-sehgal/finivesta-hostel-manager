import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./approval.css";
import Navbar from "../wnavbar";

const Approval = () => {
  const titleRef = useRef();
  const analyticsRef = useRef();

  const [requests, setRequests] = useState([]); // all requests
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

    // Fetch all pending requests
    fetch("http://localhost:5000/api/outpass/warden/pending")
      .then((res) => res.json())
      .then((data) => {
        const allPending = data.requests || [];
        setPending(allPending);
        setRequests(allPending); // for analytics & filtering
      })
      .catch(console.error);
  }, []);

  const updateStatus = (id, status) => {
    fetch(`http://localhost:5000/api/outpass/warden/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setPending((prev) => prev.filter((p) => p.id !== id));
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? updated.request : r))
        );
      })
      .catch(console.error);
  };

  // Analytics counts
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;
  const aiFlaggedCount = requests.filter((r) => r.status === "High Risk").length;

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
            <p>{approvedCount}</p>
          </div>
          <div className="analytics-card red">
            <h3>Rejected</h3>
            <p>{rejectedCount}</p>
          </div>
          <div className="analytics-card purple">
            <h3>AI Flagged</h3>
            <p>{aiFlaggedCount}</p>
          </div>
        </div>

        {/* ================== FEATURE CARDS ================== */}
        <div className="approval-grid">
          {/* ================= PENDING REQUESTS ================= */}
          <div className="approval-card">
            <h2>Pending Outpass Requests</h2>
            <p>Requests awaiting your approval with reason and duration.</p>
            <ul className="status-list">
              {pending.map((req) => (
                <li key={req.id}>
                  {req.studentName} – {req.reason} ({req.fromDate} to {req.toDate})
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

          {/* ================= PARENT VERIFICATION ================= */}
          <div className="approval-card">
            <h2>Parent Verification</h2>
            <p>Check whether guardian has approved the outpass request.</p>
            <ul className="status-list">
              {requests.map((req) => (
                <li key={req.id}>
                  {req.parentApproval ? "✔ Verified" : "⏳ Awaiting Consent"} – {req.studentName}
                </li>
              ))}
            </ul>
            <button className="secondary-btn">Resend Verification</button>
          </div>

          {/* ================= AI RISK / EXCEPTIONS ================= */}
          <div className="approval-card">
            <h2>AI Risk & Exceptions</h2>
            <p>Automatically flags unusual patterns or overdue requests.</p>
            <div className="risk-box low">Low Risk – Routine Leave</div>
            <div className="risk-box medium">Medium Risk – Long Duration</div>
            <div className="risk-box high">High Risk – Repeated Late Night Outs</div>
            <div className="alert-box">
              {requests.filter((r) => r.status === "High Risk").length} Overstay Alerts Pending Review
            </div>
          </div>

          {/* ================= QR PASS PREVIEW ================= */}
          <div className="approval-card">
            <h2>QR Outpass</h2>
            <p>Encrypted QR for approved students, usable at gates.</p>
            <div className="qr-mock">[ QR Code Preview ]</div>
            <button className="secondary-btn">Generate QR Pass</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Approval;
