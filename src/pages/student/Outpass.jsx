import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/sNavbar";
import { FaIdCard } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Outpass.module.css";

function Outpass() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    reason: "",
    fromDate: null,
    toDate: null,
    parentApproval: false,
  });

  const student = JSON.parse(localStorage.getItem("student"));

  /* ================= FETCH STUDENT OUTPASSES ================= */
  useEffect(() => {
    if (!student?.email) return;
    fetch(`http://localhost:5000/api/outpass/student/${student.email}`)
      .then((res) => res.json())
      .then((data) =>
        setLeaveRequests(
          (data.requests || []).map((r) => ({
            ...r,
            id: r._id, // MongoDB ObjectId
            fromDate: new Date(r.fromDate).toLocaleDateString(),
            toDate: new Date(r.toDate).toLocaleDateString(),
          }))
        )
      )
      .catch(console.error);
  }, [student]);

  /* ================= SUBMIT OUTPASS ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason || !formData.fromDate || !formData.toDate) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/outpass/student/request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: formData.reason,
            fromDate: formData.fromDate.toISOString().split("T")[0],
            toDate: formData.toDate.toISOString().split("T")[0],
            parentApproval: formData.parentApproval,
            studentEmail: student.email,
            studentName: student.name, // pass name for warden display
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to submit leave request");
        return;
      }

      const data = await res.json();
      const req = {
        ...data.request,
        id: data.request._id,
        fromDate: new Date(data.request.fromDate).toLocaleDateString(),
        toDate: new Date(data.request.toDate).toLocaleDateString(),
      };
      setLeaveRequests([req, ...leaveRequests]);

      alert("Leave request submitted successfully!");
      setFormData({
        reason: "",
        fromDate: null,
        toDate: null,
        parentApproval: false,
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.outpassRoot}>
        <div className={styles.pageHeader}>
          <FaIdCard className={styles.headerIcon} />
          <div>
            <h2>Outpass / Leave Requests</h2>
            <p className={styles.headerSubtitle}>
              Request your leave and track approvals
            </p>
          </div>
        </div>

        <form className={styles.outpassForm} onSubmit={handleSubmit}>
          <label>Reason for Leave</label>
          <textarea
            placeholder="Enter your reason for leave..."
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            required
            className={styles.reasonInput}
          />

          <div className={styles.dateInputs}>
            <div className={styles.datePickerWrapper}>
              <label>Start Date</label>
              <DatePicker
                selected={formData.fromDate}
                onChange={(date) =>
                  setFormData({ ...formData, fromDate: date })
                }
                placeholderText="Select start date"
                className={styles.customDatePicker}
                dateFormat="dd/MM/yyyy"
                showPopperArrow={false}
              />
            </div>
            <div className={styles.datePickerWrapper}>
              <label>End Date</label>
              <DatePicker
                selected={formData.toDate}
                onChange={(date) =>
                  setFormData({ ...formData, toDate: date })
                }
                placeholderText="Select end date"
                className={styles.customDatePicker}
                dateFormat="dd/MM/yyyy"
                showPopperArrow={false}
              />
            </div>
          </div>

          <label className={styles.parentApprovalLabel}>
            <input
              type="checkbox"
              checked={formData.parentApproval}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parentApproval: e.target.checked,
                })
              }
            />
            Parent Approval Obtained
          </label>

          <button type="submit" className={styles.submitButton}>
            Submit Leave Request
          </button>
        </form>

        <div className={styles.leaveGrid}>
          {leaveRequests.map((req) => (
            <div key={req.id} className={styles.leaveCard}>
              <h4>{req.reason}</h4>
              <p>
                <strong>From:</strong> {req.fromDate}
              </p>
              <p>
                <strong>To:</strong> {req.toDate}
              </p>
              <p>
                Parent Approval: {req.parentApproval ? "✅" : "❌"}
              </p>
              <span
                className={`${styles.statusBadge} ${styles[req.status.toLowerCase()]}`}
              >
                {req.status === "Pending"
                  ? "⏳ Pending"
                  : req.status === "Approved"
                  ? "✅ Approved"
                  : "❌ Rejected"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Outpass;





