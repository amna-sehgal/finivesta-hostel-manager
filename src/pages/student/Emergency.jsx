import React, { useState } from "react";
import styles from "./sos.module.css";
import { MdWarning } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

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
    <div className={styles.sosBackdrop}>
      <div className={styles.sosModal}>

        <div className={styles.header}>
          <MdWarning className={styles.icon}/>
          <h2>Emergency Assistance</h2>
        </div>

        <p className={styles.sosInfo}>
          This will immediately notify the hostel warden.
        </p>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={styles.input}
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
          className={styles.input}
        />

        <div className={styles.sosActions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            className={styles.sendBtn}
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
