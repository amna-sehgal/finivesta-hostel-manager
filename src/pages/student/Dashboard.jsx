import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/sNavbar";

import {
  MdReportProblem,
  MdSecurity,
  MdCampaign,
} from "react-icons/md";
import {
  FaIdCard,
  FaClipboardList,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";
import { HiBadgeCheck, HiSparkles } from "react-icons/hi";

import "./Dashboard.css";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
      setTimeout(() => setAnimate(true), 100);
    }
  }, []);

  if (!student) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  const handleSOS = () => {
    alert("🚨 SOS alert sent to warden and security!");
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-root">

        {/* HERO */}
        <div className="hero">
          <div>
            <div className="welcome-text">
              <FaUserCircle className="welcome-icon" />
              <h1>
                Welcome, {student.fullName} <HiSparkles className="sparkle" />
              </h1>
            </div>
            <p>
              Room {student.roomno} · {student.hostel}
            </p>
          </div>

          <div className="hero-status">
            <span className="safe">
              <MdSecurity /> Hostel Safe
            </span>
            <span className="verified">
              <HiBadgeCheck /> Verified Student
            </span>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className={`stats-row ${animate ? "fade-up" : ""}`}>
          <div className="stat-box stat-hover">
            <MdReportProblem className="stat-icon" />
            <div>
              <strong>2</strong>
              <p>Active Complaints</p>
            </div>
          </div>

          <div className="stat-box stat-hover">
            <FaIdCard className="stat-icon" />
            <div>
              <p>Leave Balance</p>
              <div className="leave-circles">
                <span className="circle filled"></span>
                <span className="circle filled"></span>
                <span className="circle filled"></span>
                <span className="circle"></span>
                <span className="circle"></span>
              </div>
              <small style={{ color: "#555555" }}>3 / 5 remaining</small>
            </div>
          </div>

          <div className="stat-box stat-hover">
            <div>
              <div className="mess-stars">
                <FaStar className="star" />
                <FaStar className="star" />
                <FaStar className="star" />
                <FaStar className="star" />
                <FaStar className="star faded" />
              </div>
              <p>Mess Rating</p>
              <small style={{ color: "#555555" }}>4.2 avg (Today)</small>
            </div>
          </div>
        </div>

        {/* ACTION CARDS */}
        <div className={`actions-grid ${animate ? "fade-up" : ""}`}>
          <div
            className="action-card purple"
            onClick={() => navigate("/student/raise-complaint")}
          >
            <MdReportProblem />
            <h3>Raise Complaint</h3>
            <span>Report hostel issues</span>
          </div>

          <div
            className="action-card blue"
            onClick={() => navigate("/student/my-complaints")}
          >
            <FaClipboardList />
            <h3>My Complaints</h3>
            <span>Track status & history</span>
          </div>

          <div
            className="action-card green"
            onClick={() => navigate("/student/outpass")}
          >
            <FaIdCard />
            <h3>Outpass</h3>
            <span>Apply for leave</span>
          </div>

          <div
            className="action-card gray"
            onClick={() => navigate("/student/notices")}
          >
            <MdCampaign />
            <h3>Notices</h3>
            <span>Hostel updates</span>
          </div>
        </div>

        {/* ALERTS */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "10px" }}>🔔 Recent Alerts</h3>
          <ul style={{ color: "#555", paddingLeft: "18px" }}>
            <li>Your WiFi complaint is now <strong>In Progress</strong></li>
            <li>New notice: <strong>Mess closed on Sunday</strong></li>
          </ul>
        </div>

        {/* SOS */}
        <button className="sos-button" onClick={handleSOS}>
          🚨 Emergency Assistance
        </button>

      </div>
    </>
  );
}

export default Dashboard;



