import React, { useState } from "react";
import "./sos.css";

const EmergencySOS = ({ isOpen, onClose }) => {
  const student = JSON.parse(localStorage.getItem("student"));

  const [type, setType] = useState("Medical");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

const handleSubmit = async () => {
  if (!message.trim()) return;

  const payload = {
    studentName: student?.fullName,
    roomNumber: student?.roomno,
    hostel: student?.hostel,
    issue: type,
    message
  };

  try {
    setLoading(true);
    await fetch("http://localhost:5000/api/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("🚨 SOS sent to warden");
    setMessage("");
    onClose();
  } catch (err) {
    console.error(err);
    alert("Failed to send SOS");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="sos-backdrop">
      <div className="sos-modal">
        <h2>Emergency Assistance</h2>

        <p className="sos-info">
          This will immediately notify the hostel warden.
        </p>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Medical</option>
          <option>Safety</option>
          <option>Fire</option>
          <option>Harassment</option>
          <option>Other</option>
        </select>

        <textarea
          placeholder="Describe the emergency briefly..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="sos-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send SOS"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencySOS;
