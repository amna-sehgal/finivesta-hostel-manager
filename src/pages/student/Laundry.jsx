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

import "./Laundry.css";

function Laundry() {
  const [selectedType, setSelectedType] = useState(null);
  const [requests, setRequests] = useState([]);

  // Replace with actual student email from auth/localStorage
  const studentEmail = localStorage.getItem("studentEmail") || "student@example.com";

  const clothTypes = [
    { label: "Regular Clothes", icon: <GiClothes /> },
    { label: "Delicates", icon: <GiWaterDrop /> },
    { label: "Bedsheets", icon: <GiCheckMark /> },
  ];

  // Fetch student laundry requests
  useEffect(() => {
    fetch(`/api/laundry/student/${studentEmail}`)
      .then((res) => res.json())
      .then((data) => setRequests(data.requests))
      .catch((err) => console.error(err));
  }, [studentEmail]);

  // Schedule new laundry pickup
  const handleSchedulePickup = async () => {
    if (!selectedType) return alert("Select a laundry type");

    const instructions = document.querySelector(".laundry-input").value;

    try {
      const res = await fetch("/api/laundry/student/request", {
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
        document.querySelector(".laundry-input").value = "";
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
        `/api/laundry/student/cancel/${requestId}`,
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

      <div className="laundry-root">
        {/* HEADER */}
        <div className="laundry-header">
          <GiWashingMachine className="laundry-icon" />
          <div>
            <h1>Laundry Services</h1>
            <p>Schedule, track & manage your laundry easily</p>
          </div>
        </div>

        {/* STATUS STRIP */}
        <div className="laundry-status">
          <div className="status-item">
            <HiOutlineArchiveBox />
            <span>Pending Bags</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="status-item">
            <HiOutlineTruck />
            <span>Processing</span>
            <strong>{processingCount ? "Yes" : "No"}</strong>
          </div>

          <div className="status-item">
            <HiOutlineCalendarDays />
            <span>Next Pickup</span>
            <strong>
              {(() => {
                const nextPending = requests.find(
                  (r) => r.status === "Pending"
                );
                return nextPending
                  ? new Date(nextPending.createdAt).toLocaleDateString()
                  : "N/A";
              })()}
            </strong>

          </div>
        </div>

        {/* SCHEDULE */}
        <div className="glass laundry-schedule">
          <h2>
            <FaCalendarAlt />
            Weekly Schedule
          </h2>

          <div className="schedule-row">
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
        <div className="glass laundry-request">
          <h2>Request Laundry Pickup</h2>

          <div className="cloth-types">
            {clothTypes.map((item) => (
              <button
                key={item.label}
                className={`cloth-chip ${selectedType === item.label ? "active" : ""
                  }`}
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
            className="laundry-input"
            placeholder="Any special instructions? (optional)"
          />

          <button className="pickup-btn" onClick={handleSchedulePickup}>
            <FaTruck />
            Schedule Pickup
          </button>
        </div>

        {/* ACTIVE REQUESTS */}
        <div className="laundry-active">
          <h2>Active Requests</h2>

          <div className="laundry-cards">
            {requests.map((req) => (
              <div key={req._id} className="glass laundry-card">
                <h3>{req.type}</h3>

                <p>
                  Pickup: {new Date(req.createdAt).toLocaleDateString()}
                </p>

                <span className={`status-tag ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>

                {req.status === "Pending" && (
                  <button
                    className="cancel-btn"
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
