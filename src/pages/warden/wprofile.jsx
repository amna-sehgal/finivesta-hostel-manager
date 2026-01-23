import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaEnvelope, FaPhone, FaHome } from "react-icons/fa";
import Navbar from "./wnavbar.jsx";
import "./wprofile.css";

const Profile = () => {
  const comp = useRef(null);
  const [warden, setWarden] = useState(null);

  // Load warden from localStorage
  useEffect(() => {
    const storedWarden = localStorage.getItem("warden");
    if (storedWarden) {
      setWarden(JSON.parse(storedWarden));
    }
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!warden) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".glass-card", { opacity: 0, y: 100, duration: 1.2 })
        .from(".profile-pic-container", { scale: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6")
        .from(".reveal-text", { y: 20, opacity: 0, stagger: 0.1 }, "-=0.4")
        .from(".stat-item", { opacity: 0, y: 30, stagger: 0.15 }, "-=0.3")
        .from(".action-tile", { scale: 0.8, opacity: 0, stagger: 0.1 }, "-=0.5");
    }, comp);

    return () => ctx.revert();
  }, [warden]);

  // Loading state
  if (!warden) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="profile-wrapper" ref={comp}>
        <div className="glass-card">

          {/* HEADER */}
          <div className="profile-header">
            <div className="profile-pic-container">
              <img
                src={warden.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"}
                alt="Warden"
                className="profile-pic"
              />
              <div className="active-glow"></div>
            </div>

            <div className="profile-bio">
              <h1 className="reveal-text">{warden.fullName}</h1>
              <p className="reveal-text subtitle">
                Administrator • {warden.hostel}
              </p>

              <div className="detail-row reveal-text">
                {warden.email && (
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span>{warden.email}</span>
                  </div>
                )}
                {warden.phone && (
                  <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <span>{warden.phone}</span>
                  </div>
                )}
              </div>

              <div className="badge-row reveal-text">
                <span className="badge">Warden</span>
                <span className="badge">Safety Certified</span>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-val">{warden.totalStudents || 420}</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{warden.pendingLeaves || 15}</span>
              <span className="stat-label">Pending Leaves</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{warden.complaints || 3}</span>
              <span className="stat-label">Complaints</span>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className="performance-section reveal-text">
            <div className="perf-info">
              <span>Hostel Discipline Score</span>
              <span>{warden.disciplineScore || "92%"}%</span>
            </div>
            <div className="perf-bar-bg">
              <div
                className="perf-bar-fill"
                style={{ width: warden.disciplineScore || "92%" }}
              ></div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="actions-section">
            <h3 className="reveal-text">Management Center</h3>
            <div className="actions-grid">
              <div className="action-tile">📢 Broadcast</div>
              <div className="action-tile">📝 Reports</div>
              <div className="action-tile">🛠️ Maintenance</div>
              <div className="action-tile">⚙️ Settings</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;

