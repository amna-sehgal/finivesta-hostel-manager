import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/sNavbar";
import { FaIdCard } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Outpass.css";

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
      .then((data) => setLeaveRequests(data.requests || []))
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
            studentEmail: student.email, // 🔥 THIS WAS MISSING
          }),

        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to submit leave request");
        return;
      }

      const data = await res.json();
      setLeaveRequests([data.request, ...leaveRequests]);

      // ✅ Alert on successful submission
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
      <div className="outpass-root">
        {/* HEADER */}
        <div className="page-header">
          <FaIdCard className="header-icon" />
          <div>
            <h2>Outpass / Leave Requests</h2>
            <p className="header-subtitle">
              Request your leave and track approvals
            </p>
          </div>
        </div>

        {/* FORM */}
        <form className="outpass-form" onSubmit={handleSubmit}>
          <label>Reason for Leave</label>
          <textarea
            placeholder="Enter your reason for leave..."
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            required
            className="reason-input"
          />

          <div className="date-inputs">
            <div className="date-picker-wrapper">
              <label>Start Date</label>
              <DatePicker
                selected={formData.fromDate}
                onChange={(date) =>
                  setFormData({ ...formData, fromDate: date })
                }
                placeholderText="Select start date"
                className="custom-datepicker"
                dateFormat="dd/MM/yyyy"
                showPopperArrow={false}
              />
            </div>
            <div className="date-picker-wrapper">
              <label>End Date</label>
              <DatePicker
                selected={formData.toDate}
                onChange={(date) =>
                  setFormData({ ...formData, toDate: date })
                }
                placeholderText="Select end date"
                className="custom-datepicker"
                dateFormat="dd/MM/yyyy"
                showPopperArrow={false}
              />
            </div>
          </div>

          <label className="parent-approval">
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

          <button type="submit" className="submit-btn">
            Submit Leave Request
          </button>
        </form>

        {/* LEAVE REQUESTS */}
        <div className="leave-grid">
          {leaveRequests.map((req) => (
            <div key={req.id} className="leave-card">
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
              <span className={`status-badge ${req.status.toLowerCase()}`}>
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




