import { useState, useEffect } from "react";
import Navbar from "../../components/common/sNavbar";

import {
  GiWashingMachine,
  GiClothes,
  GiWaterDrop,
  GiCheckMark,
} from "react-icons/gi";

import {
  HiOutlineArchiveBox,
  HiOutlineTruck,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import { FaTruck, FaCalendarAlt } from "react-icons/fa";

import styles from "./Laundry.module.css";

function Laundry() {
  const [selectedType, setSelectedType] = useState(null);
  const [requests, setRequests] = useState([]);

  // Replace with actual student email from auth/localStorage
  const studentEmail = JSON.parse(localStorage.getItem("student"))?.email || "student@example.com";
  const [instructions, setInstructions] = useState("");

  const clothTypes = [
    { label: "Regular Clothes", icon: <GiClothes /> },
    { label: "Delicates", icon: <GiWaterDrop /> },
    { label: "Bedsheets", icon: <GiCheckMark /> },
  ];

  // Fetch student laundry requests
  useEffect(() => {
    const fetchRequests = () => {
      fetch(`http://localhost:5000/api/laundry/student/${studentEmail}`)
        .then((res) => res.json())
        .then((data) => setRequests(data.requests))
        .catch((err) => console.error(err));
    };

    fetchRequests();
    // Auto-refresh every 10 seconds to get updates from warden
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [studentEmail]);

  // Schedule new laundry pickup
  const handleSchedulePickup = async () => {
    if (!selectedType) return alert("Select a laundry type");

    const instructions = document.querySelector(".laundry-input").value;

    try {
      const res = await fetch("http://localhost:5000/api/laundry/student/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail,
          type: selectedType,
          instructions,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRequests((prev) => [...prev, data.request]);
        setSelectedType(null);
        setInstructions("");
        alert("Laundry request scheduled!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  };

  // Cancel laundry request (only if Pending)
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm("Cancel this laundry request?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/laundry/student/cancel/${requestId}`,
        { method: "PATCH" }
      );

      const data = await res.json();

      if (res.ok) {
        setRequests((prev) =>
          prev.filter((r) => r._id !== requestId)
        );
        alert("Laundry request cancelled");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to cancel request");
    }
  };


  // Calculate status counts
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const processingCount = requests.filter((r) => r.status === "Processing").length;

  return (
    <>
      <Navbar />

      <div className={styles.laundryRoot}>
        {/* HEADER */}
        <div className={styles.laundryHeader}>
          <GiWashingMachine className={styles.laundryIcon} />
          <div>
            <h1>Laundry Services</h1>
            <p>Schedule, track & manage your laundry easily</p>
          </div>
        </div>

        {/* STATUS STRIP */}
        <div className={styles.laundryStatus}>
          <div className={styles.statusItem}>
            <HiOutlineArchiveBox />
            <span>Pending Bags</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className={styles.statusItem}>
            <HiOutlineTruck />
            <span>Processing</span>
            <strong>{processingCount > 0 ? "Yes" : "No"}</strong>
          </div>

          <div className={styles.statusItem}>
            <HiOutlineCalendarDays />
            <span>Next Pickup</span>
            <strong>
              {(() => {
                // Find the first request with pickupDate (Processing or Done status)
                const nextWithDate = requests.find(
                  (r) => r.pickupDate && (r.status === "Processing" || r.status === "Done")
                );
                return nextWithDate
                  ? new Date(nextWithDate.pickupDate).toLocaleDateString()
                  : "N/A";
              })()}
            </strong>

          </div>
        </div>

        {/* SCHEDULE */}
        <div className={`${styles.glass} ${styles.laundrySchedule}`}>
          <h2>
            <FaCalendarAlt />
            Weekly Schedule
          </h2>

          <div className={styles.scheduleRow}>
            <div>
              <span>Pickup Days</span>
              <strong>Mon • Thu</strong>
            </div>

            <div>
              <span>Delivery</span>
              <strong>Within 48 hrs</strong>
            </div>

            <div>
              <span>Pickup Time</span>
              <strong>8–10 AM</strong>
            </div>
          </div>
        </div>

        {/* REQUEST */}
        <div className={`${styles.glass} ${styles.laundryRequest}`}>
          <h2>Request Laundry Pickup</h2>

          <div className={styles.clothTypes}>
            {clothTypes.map((item) => (
              <button
                key={item.label}
                className={`${styles.clothChip} ${selectedType === item.label ? styles.active : ""}`}
                onClick={() =>
                  setSelectedType(
                    selectedType === item.label ? null : item.label
                  )
                }
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <textarea
            className={styles.laundryInput}
            placeholder="Any special instructions? (optional)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

          <button className={styles.pickupBtn} onClick={handleSchedulePickup}>
            <FaTruck />
            Schedule Pickup
          </button>
        </div>

        {/* ACTIVE REQUESTS */}
        <div className={styles.laundryActive}>
          <h2>Active Requests</h2>

          <div className={styles.laundryCards}>
            {requests.map((req) => (
              <div key={req._id} className={`${styles.glass} ${styles.laundryCard}`}>
                <h3>{req.type}</h3>

                <span className={`${styles.statusTag} ${styles[req.status.toLowerCase()]}`}>
                  {req.status}
                </span>

                {req.status === "Pending" && (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => handleCancelRequest(req._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Laundry;
