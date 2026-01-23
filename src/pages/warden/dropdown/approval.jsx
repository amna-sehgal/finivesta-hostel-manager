import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./approval.css";
import Navbar from "../wnavbar";

const Approval = () => {
  const titleRef = useRef();
  const analyticsRef = useRef();

  useEffect(() => {
    // Title entrance animation
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    // Analytics cards entrance
    gsap.to(analyticsRef.current.children, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.3,
      delay: 0.2,
      ease: "power2.out",
    });

    // Feature cards entrance animation
    gsap.to(".approval-card", {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.4,
      delay: 0.2,
      ease: "power3.out",
    });
  }, []);

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

        {/* ================== ANALYTICS / SUMMARY CARDS ================== */}
        <div className="analytics-grid" ref={analyticsRef}>
          <div className="analytics-card blue">
            <h3>Pending Requests</h3>
            <p>8</p>
            {/* BACKEND: Fetch count from /api/outpass/pending */}
          </div>
          <div className="analytics-card green">
            <h3>Approved</h3>
            <p>15</p>
            {/* BACKEND: Fetch count from /api/outpass/approved */}
          </div>
          <div className="analytics-card red">
            <h3>Rejected</h3>
            <p>2</p>
            {/* BACKEND: Fetch count from /api/outpass/rejected */}
          </div>
          <div className="analytics-card purple">
            <h3>AI Flagged</h3>
            <p>3</p>
            {/* AI: Identify unusual patterns such as repeated night-outs or long-duration outpasses */}
          </div>
        </div>

        {/* ================== FEATURE CARDS ================== */}
        <div className="approval-grid">
          {/* ================= PENDING REQUESTS ================= */}
          <div className="approval-card">
            <h2>Pending Outpass Requests</h2>
            <p>Requests awaiting your approval with reason and duration.</p>

            {/* BACKEND: Fetch all pending requests from /api/outpass/pending */}
            {/* Example structure returned:
            [
              {id: 1, student: "Riya Sharma", reason: "Medical", duration: "2 Days"},
              {id: 2, student: "Arjun Verma", reason: "Family Emergency", duration: "1 Day"}
            ]
          */}
            <ul className="status-list">
              <li>Riya Sharma – Medical (2 Days)</li>
              <li>Arjun Verma – Family Emergency</li>
              <li>Simran Kaur – Internship Visit</li>
            </ul>

            {/* BACKEND: POST /api/outpass/approve or /api/outpass/reject */}
            {/* onClick Approve: send { outpass_id: 1, status: "approved" } */}
            {/* onClick Reject: send { outpass_id: 1, status: "rejected", reason?: "" } */}
            <div className="action-buttons">
              <button className="approve">Approve</button>
              <button className="reject">Reject</button>
            </div>
          </div>

          {/* ================= PARENT VERIFICATION ================= */}
          <div className="approval-card">
            <h2>Parent Verification</h2>
            <p>
              Check whether guardian has approved the outpass request.
            </p>

            {/* BACKEND: GET /api/parent-consent/status */}
            {/* Returns status for each outpass: 'verified', 'pending', 'rejected' */}
            <ul className="status-list">
              <li>✔ OTP Verified – Riya Sharma</li>
              <li>⏳ Awaiting Consent – Arjun Verma</li>
              <li>✔ App Approval – Simran Kaur</li>
            </ul>

            {/* BACKEND: POST /api/parent-consent/resend */}
            {/* Trigger OTP / Push Notification for pending verification */}
            <button className="secondary-btn">Resend Verification</button>
          </div>

          {/* ================= AI RISK / EXCEPTIONS ================= */}
          <div className="approval-card">
            <h2>AI Risk & Exceptions</h2>
            <p>
              Automatically flags unusual patterns or overdue requests.
            </p>

            {/* AI: Compute risk score based on history, duration, and frequency of outpasses */}
            {/* Example:
            - Low: 1-3 points → Routine leaves
            - Medium: 4-6 points → Long-duration leaves or repeated night-outs
            - High: 7+ points → Frequent late-night leaves, unverified reasons
          */}
            <div className="risk-box low">Low Risk – Medical Leave</div>
            <div className="risk-box medium">Medium Risk – Long Duration</div>
            <div className="risk-box high">High Risk – Repeated Late Night Outs</div>

            {/* BACKEND: /api/outpass/exceptions */}
            {/* Returns all exceptions like overdue returns */}
            <div className="alert-box">3 Overstay Alerts Pending Review</div>
          </div>

          {/* ================= QR PASS PREVIEW ================= */}
          <div className="approval-card">
            <h2>QR Outpass</h2>
            <p>
              Encrypted QR for approved students, usable when gate hardware is added in future.
            </p>

            {/* BACKEND: POST /api/outpass/generate-qr */}
            {/* Send { outpass_id } → returns QR image / code */}
            <div className="qr-mock">[ QR Code Preview ]</div>
            <button className="secondary-btn">Generate QR Pass</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Approval;
