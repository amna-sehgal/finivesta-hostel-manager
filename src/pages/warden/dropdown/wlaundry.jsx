import React, { useEffect, useRef, useState } from "react";
import styles from "./wlaundry.module.css";
import gsap from "gsap";
import Navbar from "../wnavbar";

const Laundry = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef(null);
  const [requests, setRequests] = useState([]);
  const [editStats, setEditStats] = useState(null);
  const [machineStats, setMachineStats] = useState({
    total: 24,
    operational: 21,
    maintenance: 2,
    outOfService: 1,
  });

  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [pickupDate, setPickupDate] = useState("");

  useEffect(() => {
    const fetchRequests = () => {
      fetch("http://localhost:5000/api/laundry/warden")
        .then((res) => res.json())
        .then((data) => setRequests(data.requests))
        .catch((err) => console.error(err));
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.from(titleRef.current, {
      y: -40,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.to(
      `.${styles["laundry-card"]}, .${styles["insight-card"]}, .${styles["stat-box"]}`,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      }
    );
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/laundry/machine-stats")
      .then((res) => res.json())
      .then((data) => setMachineStats(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (
      machineStats.total !== undefined &&
      machineStats.operational !== undefined
    ) {
      const timer = setTimeout(() => {
        fetch("/api/laundry/machine-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(machineStats),
        })
          .then((res) => res.json())
          .then((data) => console.log("Stats saved:", data))
          .catch((err) => console.error(err));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [machineStats]);

  const updateStatus = async (id, newStatus, pickupDate = null) => {
    try {
      const res = await fetch(`http://localhost:5000/api/laundry/warden/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, pickupDate }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? data.request : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const savePickupDate = async (id, pickupDate) => {
    try {
      const res = await fetch(`http://localhost:5000/api/laundry/warden/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupDate }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? data.request : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <>
      <Navbar />

      <div
        className={styles["laundry-container"]}
        ref={containerRef}
      >
        {/* HEADER */}
        <div
          className={styles["laundry-header"]}
          ref={titleRef}
        >
          <h1 className={styles["laundry-title"]}>
            🧺 Laundry Operations Dashboard
          </h1>
          <p className={styles["laundry-subtitle"]}>
            Complete oversight of hostel laundry infrastructure,
            maintenance cycles, resource optimization, and compliance
            tracking.
          </p>
        </div>

        {/* STATS */}
        <div
          className={styles["stats-container"]}
          ref={statsRef}
        >
          {/* TOTAL */}
          <div className={styles["stat-box"]}>
            <button
              className={styles["stat-edit-btn"]}
              onClick={(e) => {
                e.stopPropagation();
                if (editStats === "total") {
                  setEditStats(null);
                } else {
                  setEditStats("total");
                }
              }}
            >
              {editStats === "total" ? "Save" : "Edit"}
            </button>

            <h3>Total Machines</h3>

            {editStats === "total" ? (
              <input
                className={styles["stat-input"]}
                type="number"
                value={machineStats.total}
                onChange={(e) =>
                  setMachineStats({
                    ...machineStats,
                    total: Number(e.target.value),
                  })
                }
              />
            ) : (
              <p className={styles["stat-number"]}>
                {machineStats.total}
              </p>
            )}
          </div>

          {/* OPERATIONAL */}
          <div className={styles["stat-box"]}>
            <button
              className={styles["stat-edit-btn"]}
              onClick={(e) => {
                e.stopPropagation();
                if (editStats === "operational") {
                  setEditStats(null);
                } else {
                  setEditStats("operational");
                }
              }}
            >
              {editStats === "operational" ? "Save" : "Edit"}
            </button>

            <h3>Operational</h3>

            {editStats === "operational" ? (
              <input
                className={styles["stat-input"]}
                type="number"
                value={machineStats.operational}
                onChange={(e) =>
                  setMachineStats({
                    ...machineStats,
                    operational: Number(e.target.value),
                  })
                }
              />
            ) : (
              <p className={styles["stat-number"]}>
                {machineStats.operational}
              </p>
            )}
          </div>

          {/* MAINTENANCE */}
          <div className={styles["stat-box"]}>
            <button
              className={styles["stat-edit-btn"]}
              onClick={(e) => {
                e.stopPropagation();
                if (editStats === "maintenance") {
                  setEditStats(null);
                } else {
                  setEditStats("maintenance");
                }
              }}
            >
              {editStats === "maintenance" ? "Save" : "Edit"}
            </button>

            <h3>Maintenance</h3>

            {editStats === "maintenance" ? (
              <input
                className={styles["stat-input"]}
                type="number"
                value={machineStats.maintenance}
                onChange={(e) =>
                  setMachineStats({
                    ...machineStats,
                    maintenance: Number(e.target.value),
                  })
                }
              />
            ) : (
              <p className={styles["stat-number"]}>
                {machineStats.maintenance}
              </p>
            )}
          </div>

          {/* OUT OF SERVICE */}
          <div className={styles["stat-box"]}>
            <button
              className={styles["stat-edit-btn"]}
              onClick={(e) => {
                e.stopPropagation();
                if (editStats === "outOfService") {
                  setEditStats(null);
                } else {
                  setEditStats("outOfService");
                }
              }}
            >
              {editStats === "outOfService" ? "Save" : "Edit"}
            </button>

            <h3>Out Of Service</h3>

            {editStats === "outOfService" ? (
              <input
                className={styles["stat-input"]}
                type="number"
                value={machineStats.outOfService}
                onChange={(e) =>
                  setMachineStats({
                    ...machineStats,
                    outOfService: Number(e.target.value),
                  })
                }
              />
            ) : (
              <p className={styles["stat-number"]}>
                {machineStats.outOfService}
              </p>
            )}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className={styles["laundry-grid"]}>
          {/* REQUEST CARD */}
          <div className={styles["laundry-card"]}>
            <div className={styles["card-header"]}>
              <h2>Student Laundry Requests</h2>
              <span className={styles["card-badge"]}>
                {pendingCount} Pending
              </span>
            </div>

            {requests.map((req) => (
              <div
                key={req._id}
                className={styles["request-item"]}
              >
                <div>
                  <h4>{req.type}</h4>
                  <p>{req.studentEmail}</p>
                  <span
                    className={`${styles["status-pill"]} ${
                      styles[req.status?.toLowerCase()]
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className={styles["request-actions"]}>
                  {req.status === "Pending" && (
                    <button
                      className={styles["action-btn"]}
                      onClick={() =>
                        updateStatus(req._id, "Processing")
                      }
                    >
                      Mark Processing
                    </button>
                  )}

                  {req.status !== "Pending" && (
                    <button
                      className={styles["action-btn"]}
                      onClick={() => {
                        setSelectedRequestId(req._id);
                        setShowPickupModal(true);
                      }}
                    >
                      Add Pickup Date
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ALL OTHER STATIC CARDS (UNCHANGED CONTENT, ONLY STYLES) */}

          <div className={styles["laundry-card"]}>
            <div className={styles["card-header"]}>
              <h2>Machine Status Overview</h2>
              <span className={styles["card-badge"]}>
                Real-time
              </span>
            </div>
            <ul>
              <li>Total Installed: 24 units</li>
              <li>Operational: 21 units</li>
              <li>Under Maintenance: 2 units</li>
              <li>Out Of Service: 1 unit</li>
            </ul>
          </div>

          <div className={styles["laundry-card"]}>
            <div className={styles["card-header"]}>
              <h2>Maintenance & Fault Alerts</h2>
              <span className={styles["card-badge"]}>
                3 Active
              </span>
            </div>
            <ul>
              <li>Washer #7 vibration abnormal</li>
              <li>Dryer #3 heating reduced</li>
              <li>Filter cleaning due</li>
            </ul>
          </div>

          <div className={styles["laundry-card"]}>
            <div className={styles["card-header"]}>
              <h2>Peak Load Analytics</h2>
              <span className={styles["card-badge"]}>
                Today
              </span>
            </div>
            <ul>
              <li>Peak Usage: 7–10 PM</li>
              <li>Low Usage: 2–6 AM</li>
              <li>Avg Cycles: 186/day</li>
            </ul>
          </div>

          <div className={styles["laundry-card"]}>
            <div className={styles["card-header"]}>
              <h2>Resource Optimization</h2>
              <span className={styles["card-badge"]}>
                Efficiency
              </span>
            </div>
            <ul>
              <li>Electricity: 312 kWh</li>
              <li>Water Recycling: 42%</li>
              <li>Idle Time: 27%</li>
            </ul>
          </div>

          <div className={styles["laundry-card"]}>
            <div className={styles["card-header"]}>
              <h2>Compliance & Safety</h2>
              <span className={styles["card-badge"]}>
                All Clear
              </span>
            </div>
            <ul>
              <li>Fire Safety Valid</li>
              <li>Electrical Audit Completed</li>
              <li>Noise within limits</li>
            </ul>
          </div>

          <div className={styles["laundry-card"]}>
            <div className={styles["card-header"]}>
              <h2>Supply Inventory</h2>
              <span className={styles["card-badge"]}>
                Low Stock
              </span>
            </div>
            <ul>
              <li>Detergent Low</li>
              <li>Machine Oil Low</li>
            </ul>
          </div>

          <div className={styles["laundry-card"]}>
            <div className={styles["card-header"]}>
              <h2>Complaint Tracking</h2>
              <span className={styles["card-badge"]}>
                5 Open
              </span>
            </div>
            <ul>
              <li>12 complaints this month</li>
              <li>7 resolved</li>
              <li>5 pending</li>
            </ul>
          </div>
        </div>

        {/* AI INSIGHTS */}
        <h2 className={styles["section-title"]}>
          AI Insights
        </h2>

        <div className={styles["insights-grid"]}>
          <div className={styles["insight-card"]}>
            Peak demand 7–10 PM
          </div>
          <div className={styles["insight-card"]}>
            Machine #7 may fail in 14 days
          </div>
          <div className={styles["insight-card"]}>
            Improve water recycling to 55%
          </div>
        </div>
      </div>

      {showPickupModal && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal"]}>
            <h3>Select Pickup Date</h3>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) =>
                setPickupDate(e.target.value)
              }
            />
            <button
              onClick={() => {
                savePickupDate(
                  selectedRequestId,
                  pickupDate
                );
                setShowPickupModal(false);
                setPickupDate("");
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Laundry;

