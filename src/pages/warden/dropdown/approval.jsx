import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./approval.module.css";
import Navbar from "../wnavbar";

const Approval = () => {
  const titleRef = useRef();
  const analyticsRef = useRef();

  const [requests, setRequests] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6 });
    gsap.to(analyticsRef.current.children, { opacity: 1, y: 0, stagger: 0.1 });
    gsap.to(`.${styles.card}`, { opacity: 1, y: 0, stagger: 0.12 });

    fetch("http://localhost:5000/api/outpass/warden/pending")
      .then((res) => res.json())
      .then((data) => {
        const allPending = (data.requests || []).map((r) => ({
          ...r,
          id: r._id,
        }));
        setPending(allPending);
        setRequests(allPending);
      });
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
          prev.map((r) =>
            r.id === id ? { ...updated.request, id: updated.request._id } : r
          )
        );
      });
  };

  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;
  const aiFlaggedCount = requests.filter((r) => r.status === "High Risk").length;

  return (
    <>
      <Navbar />
      <div className={styles.root}>
        <div className={styles.pageHeader} ref={titleRef}>
          <h2>Outpass Approval Dashboard</h2>
          <p className={styles.subtitle}>
            Monitor, verify, and approve student outpasses
          </p>
        </div>

        <div className={styles.analyticsGrid} ref={analyticsRef}>
          <div className={styles.analyticsCard}>
            <h4>Pending</h4>
            <span>{pending.length}</span>
          </div>
          <div className={styles.analyticsCard}>
            <h4>Approved</h4>
            <span>{approvedCount}</span>
          </div>
          <div className={styles.analyticsCard}>
            <h4>Rejected</h4>
            <span>{rejectedCount}</span>
          </div>
          <div className={styles.analyticsCard}>
            <h4>AI Flagged</h4>
            <span>{aiFlaggedCount}</span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* CARD 1 */}
          <div className={`${styles.card}`}>
            <h3>Pending Requests</h3>
            <ul className={styles.list}>
              {pending.map((req) => (
                <li key={req.id}>
                  {req.studentName || req.studentEmail} – {req.reason}
                  <div className={styles.actions}>
                    <button
                      className={styles.approve}
                      onClick={() => updateStatus(req.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className={styles.reject}
                      onClick={() => updateStatus(req.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CARD 2 */}
          <div className={`${styles.card}`}>
            <h3>Parent Verification</h3>
            <ul className={styles.list}>
              {requests.map((req) => (
                <li key={req.id}>
                  {req.parentApproval ? "✔ Verified" : "⏳ Waiting"} –{" "}
                  {req.studentName || req.studentEmail}
                </li>
              ))}
            </ul>
          </div>

          {/* CARD 3 */}
          <div className={`${styles.card}`}>
            <h3>AI Risk</h3>
            <div className={styles.risk}>Low Risk</div>
            <div className={styles.risk}>Medium Risk</div>
            <div className={styles.riskHigh}>High Risk</div>
          </div>

          {/* CARD 4 */}
          <div className={`${styles.card}`}>
            <h3>QR Outpass</h3>
            <div className={styles.qr}>QR Preview</div>
            <button className={styles.secondary}>Generate QR</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Approval;
