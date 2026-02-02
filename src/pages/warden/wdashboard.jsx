import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "./wdashboard.css";
import Navbar from "./wnavbar";

function Dashboard() {
  const svgRef = useRef(null);
  const navigate = useNavigate();

  const [activeComplaints, setActiveComplaints] = useState(0);
  const [sosAlert, setSosAlert] = useState(null);

  /* ---------- DATA ---------- */

  const statsData = [
    { label: "Total Students", value: 20, max: 100, color: "#3B82F6" },
    { label: "Active Complaints", value: activeComplaints, max: 20, color: "#EF4444" },
    { label: "Critical Alerts", value: 2, max: 10, color: "#F59E0B" },
    { label: "Mess Rating", value: 3, max: 5, color: "#10B981" },
  ];

  const ringData = [
    { label: "Total Students", value: 20, max: 100, color: "#3B82F6" },
    { label: "Active Complaints", value: activeComplaints, max: 20, color: "#EF4444" },
    { label: "Critical Alerts", value: 2, max: 10, color: "#F59E0B" },
    { label: "Mess Rating", value: 3, max: 5, color: "#10B981" },
  ];

  /* ---------- FETCH ACTIVE COMPLAINTS ---------- */

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints/warden/active-count")
      .then(res => res.json())
      .then(data => setActiveComplaints(data.count))
      .catch(err => console.error(err));
  }, []);

  /* ---------- GSAP ENTRY ANIMATION (ONCE) ---------- */

  useEffect(() => {
    gsap.from(".dashboard-heading", {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.from(".dashboard-container", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.2,
    });
  }, []);

  /* ---------- GSAP RING ANIMATION (WHEN DATA CHANGES) ---------- */

  useEffect(() => {
    if (!svgRef.current) return;

    const rings = svgRef.current.querySelectorAll(".ring-progress");

    rings.forEach((ring, index) => {
      const radius = 60 + index * 40;
      const circumference = 2 * Math.PI * radius;

      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference;

      gsap.to(ring, {
        strokeDashoffset:
          circumference * (1 - ringData[index].value / ringData[index].max),
        duration: 1.4,
        ease: "power2.out",
      });
    });
  }, [activeComplaints]);

  /* ---------- SOS POLLING ---------- */

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sos/active");
        const data = await res.json();
        if (data.length > 0) setSosAlert(data[0]);
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ---------- JSX ---------- */

  return (
    <>
      <Navbar />

      <div className="dashboard-wrapper">
        <div className="dashboard-heading">
          <h1>Warden's Dashboard</h1>
          <p>Hostel Management Overview</p>
        </div>

        <div className="dashboard-container">
          {/* Analysis Section */}
          <div className="analysis-section">
            <h2>Analysis & Statistics</h2>
            <div className="stats-grid">
              {statsData.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">
                    {stat.value}/{stat.max}
                  </div>
                  <div className="stat-bar">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${(stat.value / stat.max) * 100}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Section */}
          <div className="performance-section">
            <div className="ring-section">
              <h2>Performance Rings</h2>

              <svg
                ref={svgRef}
                viewBox="0 0 300 300"
                className="ring-chart"
                preserveAspectRatio="xMidYMid meet"
              >
                {ringData.map((ring, index) => {
                  const radius = 60 + index * 40;
                  const circumference = 2 * Math.PI * radius;

                  return (
                    <g key={index}>
                      <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="10"
                        opacity="0.3"
                      />

                      <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        fill="none"
                        stroke={ring.color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="ring-progress"
                        style={{
                          transform: "rotate(-90deg)",
                          transformOrigin: "150px 150px",
                        }}
                      />

                      <text
                        x="150"
                        y={150 - radius + 15}
                        textAnchor="middle"
                        fontSize="12"
                        fill={ring.color}
                        fontWeight="700"
                        opacity="0.8"
                      >
                        {ring.label.split(" ")[0]}
                      </text>

                      <text
                        x="150"
                        y={150 - radius + 28}
                        textAnchor="middle"
                        fontSize="16"
                        fill={ring.color}
                        fontWeight="700"
                      >
                        {ring.value}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="info-column">
              <div className="info-card">
                <span className="info-icon">⚡</span>
                <span className="info-label">Power Usage</span>
                <span className="info-value">200 units/room</span>
              </div>

              <div className="info-card">
                <span className="info-icon">😊</span>
                <span className="info-label">Hostel Mood</span>
                <span className="info-value mood-happy">Happy</span>
              </div>
            </div>
          </div>
        </div>

        {sosAlert && (
          <div className="sos-toast">
            <span>🚨 Emergency in Room {sosAlert.roomNumber}</span>
            <div>
              <button className="view-btn" onClick={() => navigate("/warden/safety")}>
                View
              </button>
              <button className="close-btn" onClick={() => setSosAlert(null)}>
                ❌
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
