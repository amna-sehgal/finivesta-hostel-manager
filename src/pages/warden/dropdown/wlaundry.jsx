import React, { useEffect, useRef, useState } from "react";
import "./wlaundry.css";
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
      fetch("/api/laundry/warden")
        .then((res) => res.json())
        .then((data) => setRequests(data.requests))
        .catch((err) => console.error(err));
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Animate title & stats
  useEffect(() => {
    gsap.from(titleRef.current, {
      y: -40,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.to(".laundry-card, .insight-card, .stat-box", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const savedStats = localStorage.getItem("machineStats");
    if (savedStats) {
      setMachineStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("machineStats", JSON.stringify(machineStats));
  }, [machineStats]);



  const updateStatus = async (id, newStatus, pickupDate = null) => {
    console.log("UPDATE CLICKED", id, newStatus);
    try {
      const res = await fetch(`/api/laundry/warden/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, pickupDate })
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

  // Calculate stats dynamically
  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const processingCount = requests.filter((r) => r.status === "Processing").length;
  const deliveredCount = requests.filter((r) => r.status === "Delivered").length;

  return (
    <>
      <Navbar />
      <div className="laundry-container" ref={containerRef}>
        {/* HEADER SECTION */}
        <div className="laundry-header" ref={titleRef}>
          <h1 className="laundry-title">🧺 Laundry Operations Dashboard</h1>
          <p className="laundry-subtitle">
            Complete oversight of hostel laundry infrastructure, maintenance cycles, resource optimization, and compliance tracking.
          </p>
        </div>

        {/* STATS SECTION */}
        <div className="stats-container" ref={statsRef}>

          {/* TOTAL */}
          <div className="stat-box blue-stat">
            <button
              className="stat-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (editStats === 'total') {
                  setEditStats(null);  // ✅ SAVE
                  // localStorage already saves via useEffect
                } else {
                  setEditStats('total');  // ✅ EDIT MODE
                }
              }}
            >
              {editStats === 'total' ? '✅ Save' : '✏️ Edit'}
            </button>
            <h3>Total Machines</h3>
            {editStats === "total" ? (
              <input
                className="stat-input"
                type="number"
                value={machineStats.total}
                onChange={(e) =>
                  setMachineStats({ ...machineStats, total: Number(e.target.value) })
                }
              />
            ) : (
              <p className="stat-number">{machineStats.total}</p>
            )}
          </div>

          {/* OPERATIONAL */}
          <div className="stat-box green-stat">
            <button
              className="stat-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (editStats === 'operational') {
                  setEditStats(null);  // ✅ SAVE
                  // localStorage already saves via useEffect
                } else {
                  setEditStats('operational');  // ✅ EDIT MODE
                }
              }}
            >
              {editStats === 'operational' ? '✅ Save' : '✏️ Edit'}
            </button>
            <h3>Operational</h3>
            {editStats === "operational" ? (
              <input
                className="stat-input"
                type="number"
                value={machineStats.operational}
                onChange={(e) =>
                  setMachineStats({ ...machineStats, operational: Number(e.target.value) })
                }
              />
            ) : (
              <p className="stat-number">{machineStats.operational}</p>
            )}
          </div>

          {/* MAINTENANCE */}
          <div className="stat-box orange-stat">
            <button
              className="stat-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (editStats === 'maintenance') {
                  setEditStats(null);  // ✅ SAVE
                  // localStorage already saves via useEffect
                } else {
                  setEditStats('maintenance');  // ✅ EDIT MODE
                }
              }}
            >
              {editStats === 'maintenance' ? '✅ Save' : '✏️ Edit'}
            </button>
            <h3>Maintenance</h3>
            {editStats === "maintenance" ? (
              <input
                className="stat-input"
                type="number"
                value={machineStats.maintenance}
                onChange={(e) =>
                  setMachineStats({ ...machineStats, maintenance: Number(e.target.value) })
                }
              />
            ) : (
              <p className="stat-number">{machineStats.maintenance}</p>
            )}
          </div>

          {/* outOfService */}
          <div className="stat-box red-stat">
            <button
              className="stat-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (editStats === 'outOfService') {
                  setEditStats(null);  // ✅ SAVE
                  // localStorage already saves via useEffect
                } else {
                  setEditStats('outOfService');  // ✅ EDIT MODE
                }
              }}
            >
              {editStats === 'outOfService' ? '✅ Save' : '✏️ Edit'}
            </button>
            <h3>outOfService</h3>
            {editStats === "outOfService" ? (
              <input
                className="stat-input"
                type="number"
                value={machineStats.outOfService}
                onChange={(e) =>
                  setMachineStats({ ...machineStats, outOfService: Number(e.target.value) })
                }
              />
            ) : (
              <p className="stat-number">{machineStats.outOfService}</p>
            )}
          </div>

        </div>

        {/* MAIN CARDS SECTION */}
        <div className="laundry-grid">
          <div className="laundry-card live-requests">
            <div className="card-header">
              <h2>🧾 Student Laundry Requests</h2>
              <span className="card-badge">
                {pendingCount} Pending
              </span>
            </div>

            {requests.length === 0 ? (
              <p className="empty-text">No laundry requests yet.</p>
            ) : (
              <div className="request-list">
                {requests.map((req) => (
                  <div key={req.id} className="request-item">
                    <div className="request-info">
                      <h4>{req.type}</h4>
                      <p><strong>Student:</strong> {req.studentEmail}</p>
                      {req.instructions && (
                        <p className="instruction">
                          <strong>Note:</strong> {req.instructions}
                        </p>
                      )}
                      <span className={`status-pill ${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="request-actions">
                      {req.status === "Pending" && (
                        <button
                          type="button"
                          className="action-btn process"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateStatus(req.id, "Processing");
                          }}
                        >
                          Mark Processing
                        </button>
                      )}

                      {req.status === "Processing" && (
                        <button
                          type="button"
                          className="action-btn process"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateStatus(req.id, "Processing");
                          }}
                        >
                          Mark Processing
                        </button>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Machine Status Card */}
          <div className="laundry-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2>🧺 Machine Status Overview</h2>
              <span className="card-badge">Real-time</span>
            </div>
            <ul>
              <li><strong>Total Installed:</strong> 24 units</li>
              <li><strong>Operational:</strong> 21 units (87.5%)</li>
              <li><strong>Under Maintenance:</strong> 2 units</li>
              <li><strong>outOfService:</strong> 1 unit (requires repair)</li>
              <li><strong>Avg Cycle Time:</strong> 38 minutes</li>
            </ul>
          </div>

          {/* Maintenance Alerts Card */}
          <div className="laundry-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2>🛠️ Maintenance & Fault Alerts</h2>
              <span className="card-badge alert">3 Active</span>
            </div>
            <ul>
              <li><span className="alert-level high">HIGH:</span> Washer #7 – Motor vibration abnormal</li>
              <li><span className="alert-level medium">MEDIUM:</span> Dryer #3 – Heating coil efficiency reduced</li>
              <li><span className="alert-level low">LOW:</span> Filter Cleaning Due: 6 Machines</li>
              <li><strong>Next AMC Inspection:</strong> 28 Feb 2026</li>
            </ul>
          </div>

          {/* Peak Load Analytics Card */}
          <div className="laundry-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2>📊 Peak Load Analytics</h2>
              <span className="card-badge">Today</span>
            </div>
            <ul>
              <li><strong>Peak Usage:</strong> 7 PM – 10 PM (highest demand)</li>
              <li><strong>Low Usage:</strong> 2 AM – 6 AM (best maintenance window)</li>
              <li><strong>Avg Daily Cycles:</strong> 186 cycles/day</li>
              <li><strong>Overload Alerts:</strong> 4 today</li>
              <li><strong>Queue Wait Time Avg:</strong> 12 minutes</li>
            </ul>
          </div>

          {/* Resource Optimization Card */}
          <div className="laundry-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2>⚡ Resource Optimization</h2>
              <span className="card-badge">Efficiency</span>
            </div>
            <ul>
              <li><strong>Electricity Today:</strong> 312 kWh (vs avg 298 kWh)</li>
              <li><strong>Water Recycling:</strong> 42% (target: 50%)</li>
              <li><strong>Idle Machine Time:</strong> 27% (optimization opportunity)</li>
              <li><strong>Recommended Addition:</strong> 2 Washers + 1 Dryer</li>
              <li><strong>Cost Savings Potential:</strong> $450/month</li>
            </ul>
          </div>

          {/* Compliance & Safety Card */}
          <div className="laundry-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2>📋 Compliance & Safety</h2>
              <span className="card-badge green">All Clear</span>
            </div>
            <ul>
              <li><strong>Fire Safety:</strong> ✅ Valid (Expires: 15 Apr 2026)</li>
              <li><strong>Electrical Audit:</strong> ✅ Completed (Last: 10 Jan 2026)</li>
              <li><strong>Noise Compliance:</strong> ✅ Within Limits (72 dB - threshold: 75 dB)</li>
              <li><strong>Chemical Storage:</strong> ✅ Secured & Logged</li>
              <li><strong>Next Inspection:</strong> 28 Feb 2026 (37 days)</li>
            </ul>
          </div>

          {/* Supply Inventory Card */}
          <div className="laundry-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2>📦 Supply Inventory</h2>
              <span className="card-badge warning">2 Low</span>
            </div>
            <ul>
              <li><strong>Detergent:</strong> 45 units (⚠️ Low - reorder soon)</li>
              <li><strong>Fabric Softener:</strong> 28 units (sufficient)</li>
              <li><strong>Machine Oil:</strong> 12 liters (⚠️ Low - critical)</li>
              <li><strong>Spare Belts:</strong> 8 units (adequate)</li>
              <li><strong>Filter Cartridges:</strong> 15 units (good)</li>
            </ul>
          </div>

          {/* Student Complaints Card */}
          <div className="laundry-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2>⚠️ Complaint Tracking</h2>
              <span className="card-badge alert">5 Open</span>
            </div>
            <ul>
              <li><strong>Total This Month:</strong> 12 complaints</li>
              <li><strong>Resolved:</strong> 7 (58%)</li>
              <li><strong>Pending:</strong> 5 (42%)</li>
              <li><strong>Avg Resolution Time:</strong> 4.2 hours</li>
              <li><strong>Top Issue:</strong> Machine not drying clothes properly</li>
            </ul>
          </div>
          {/* LIVE STUDENT LAUNDRY REQUESTS */}

        </div>

        {/* AI INSIGHTS SECTION */}
        <h2 className="section-title">🤖 AI-Powered Insights & Predictions</h2>
        <div className="insights-grid" onClick={(e) => e.stopPropagation()}>
          <div className="insight-card">
            <h4>⏰ Peak Supervision Hours Prediction</h4>
            <p>Peak demand forecasted: <strong>7–10 PM</strong>. Recommend additional staff during these hours to manage queue wait times and prevent machine overloading.</p>
          </div>

          <div className="insight-card">
            <h4>🔧 Predictive Maintenance Alert</h4>
            <p>Machine #7 motor health: 68%. Estimated failure in <strong>14 days</strong>. Preventive service recommended to avoid unexpected downtime.</p>
          </div>

          <div className="insight-card">
            <h4>💧 Water & Detergent Optimization</h4>
            <p>Recycled water usage can be improved to <strong>55%</strong>. Estimated annual savings: <strong>$2,100</strong>. Upgrade filtration system recommended.</p>
          </div>

          <div className="insight-card">
            <h4>📈 Load Balancing Recommendation</h4>
            <p>Shift <strong>15% of evening load</strong> to afternoon hours (3-5 PM). Reduces peak congestion by 22% and improves overall utilization.</p>
          </div>

          <div className="insight-card">
            <h4>🎯 Issue Pattern Detection</h4>
            <p>Dryer machines show 3.5x higher complaint rate than average. Root cause: heating element degradation. Batch replacement recommended.</p>
          </div>

          <div className="insight-card">
            <h4>📅 Equipment Lifespan Analysis</h4>
            <p>3 machines approaching end-of-life (8+ years). Budget <strong>$18,000</strong> for replacement next quarter. AI recommends immediate procurement.</p>
          </div>

          <div className="insight-card">
            <h4>🔐 Compliance Risk Assessment</h4>
            <p>Electrical audit delayed by 5 days. Risk level: <strong>Medium</strong>. Schedule immediately to avoid regulatory penalties.</p>
          </div>
        </div>
      </div>
      {showPickupModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select Pickup Date</h3>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
            <button
              onClick={() => {
                updateStatus(selectedRequestId, "Delivered", pickupDate);
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
