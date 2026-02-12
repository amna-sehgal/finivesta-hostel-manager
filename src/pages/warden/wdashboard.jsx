import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import styles from "./wdashboard.module.css";
import Navbar from "./wnavbar";

function Dashboard() {
  const svgRef = useRef(null);
  const navigate = useNavigate();

  const [activeComplaints, setActiveComplaints] = useState(0);
  const [sosAlert, setSosAlert] = useState(null);

  const statsData = [
    { label: "Total Students", value: 20, max: 100, color: "#3B82F6" },
    { label: "Active Complaints", value: activeComplaints, max: 20, color: "#EF4444" },
    { label: "Critical Alerts", value: 2, max: 10, color: "#F59E0B" },
    { label: "Mess Rating", value: 3, max: 5, color: "#10B981" },
  ];

  const ringData = statsData;

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints/warden/active-count")
      .then(res => res.json())
      .then(data => setActiveComplaints(data.count))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    gsap.from(`.${styles.heading}`, { opacity: 0, y: -20, duration: 0.8, ease: "power2.out" });
    gsap.from(`.${styles.container}`, { opacity: 0, y: 20, duration: 0.8, delay: 0.2, ease: "power2.out" });
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const rings = svgRef.current.querySelectorAll(`.${styles.ringProgress}`);

    rings.forEach((ring, index) => {
      const radius = 60 + index * 40;
      const circumference = 2 * Math.PI * radius;

      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference;

      gsap.to(ring, {
        strokeDashoffset: circumference * (1 - ringData[index].value / ringData[index].max),
        duration: 1.4,
        ease: "power2.out",
      });
    });
  }, [activeComplaints]);

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

  return (
    <>
      <Navbar />

      <div className={styles.wrapper}>
        {/* HEADER */}
        <div className={styles.heading}>
          <h1>Warden's Dashboard</h1>
          <p>Hostel Management Overview</p>
        </div>

        <div className={styles.container}>
          {/* ANALYSIS SECTION */}
          <div className={styles.analysis}>
            <h2>Analysis & Statistics</h2>
            <div className={styles.statsGrid}>
              {statsData.map((stat, index) => (
                <div key={index} className={styles.statCard}>
                  <div className={styles.statLabel}>{stat.label}</div>
                  <div className={styles.statValue}>{stat.value}/{stat.max}</div>
                  <div className={styles.statBar}>
                    <div
                      className={styles.statFill}
                      style={{ width: `${(stat.value / stat.max) * 100}%`, backgroundColor: stat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PERFORMANCE SECTION */}
          <div className={styles.performance}>
            <div className={styles.ringSection}>
              <h2>Performance Rings</h2>

              <svg ref={svgRef} viewBox="0 0 300 300" className={styles.ringChart} preserveAspectRatio="xMidYMid meet">
                {ringData.map((ring, index) => {
                  const radius = 60 + index * 40;
                  return (
                    <g key={index}>
                      <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        fill="none"
                        stroke="#020617"
                        strokeWidth="10"
                      />
                      <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        fill="none"
                        stroke={ring.color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        className={styles.ringProgress}
                        style={{ transform: "rotate(-90deg)", transformOrigin: "150px 150px" }}
                      />
                      <text
                        x="150"
                        y={150 - radius + 15}
                        textAnchor="middle"
                        fontSize="12"
                        fill={ring.color}
                        fontWeight="700"
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

            <div className={styles.infoColumn}>
              <div className={styles.infoCard}>
                <span className={styles.infoIcon}>⚡</span>
                <span className={styles.infoLabel}>Power Usage</span>
                <span className={styles.infoValue}>200 units/room</span>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.infoIcon}>😊</span>
                <span className={styles.infoLabel}>Hostel Mood</span>
                <span className={styles.infoValue}>Happy</span>
              </div>
            </div>
          </div>
        </div>

        {/* SOS TOAST */}
        {sosAlert && (
          <div className={styles.toast}>
            <span>🚨 Emergency in Room {sosAlert.roomNumber}</span>
            <button className={styles.viewBtn} onClick={() => navigate("/warden/safety")}>
              View
            </button>
            <button className={styles.closeBtn} onClick={() => setSosAlert(null)}>
              ❌
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
