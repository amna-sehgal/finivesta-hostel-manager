import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './profile.css';

const Profile = () => {
  const comp = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".glass-card", { 
        opacity: 0, 
        y: 100, 
        duration: 1.2, 
        delay: 0.2 
      })
      .from(".profile-pic-container", { 
        scale: 0, 
        duration: 0.8, 
        ease: "back.out(1.7)" 
      }, "-=0.6")
      .from(".reveal-text", { 
        y: 20, 
        opacity: 0, 
        stagger: 0.1 
      }, "-=0.4")
      .from(".stat-item", { 
        opacity: 0, 
        y: 30, 
        stagger: 0.15 
      }, "-=0.3")
      .from(".action-tile", { 
        scale: 0.8, 
        opacity: 0, 
        stagger: 0.1 
      }, "-=0.5");
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <div className="profile-wrapper" ref={comp}>
      <div className="glass-card">
        {/* Top Header Section */}
        <div className="profile-header">
          <div className="profile-pic-container">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" 
              alt="Warden" 
              className="profile-pic"
            />
            <div className="active-glow"></div>
          </div>
          
          <div className="profile-bio">
            <h1 className="reveal-text">Warden Harshvardhan</h1>
            <p className="reveal-text subtitle">Administrator • Boys Hostel Block-C</p>
            <div className="badge-row reveal-text">
              <span className="badge">Senior Staff</span>
              <span className="badge">Safety Certified</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-val">420</span>
            <span className="stat-label">Students</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">15</span>
            <span className="stat-label">Pending Leaves</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">03</span>
            <span className="stat-label">Complaints</span>
          </div>
        </div>

        {/* Performance Bar (Modern UI Touch) */}
        <div className="performance-section reveal-text">
          <div className="perf-info">
            <span>Hostel Discipline Score</span>
            <span>92%</span>
          </div>
          <div className="perf-bar-bg">
            <div className="perf-bar-fill" style={{ width: '92%' }}></div>
          </div>
        </div>

        {/* Quick Actions Center */}
        <div className="actions-section">
          <h3 className="reveal-text">Management Center</h3>
          <div className="actions-grid">
            <div className="action-tile">
              <span className="tile-icon">📢</span>
              <p>Broadcast</p>
            </div>
            <div className="action-tile">
              <span className="tile-icon">📝</span>
              <p>Reports</p>
            </div>
            <div className="action-tile">
              <span className="tile-icon">🛠️</span>
              <p>Maintenance</p>
            </div>
            <div className="action-tile">
              <span className="tile-icon">⚙️</span>
              <p>Settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;