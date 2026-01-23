import { useEffect, useState } from "react";
import Navbar from "../../components/common/sNavbar";
import {
  MdReportProblem,
  MdNotificationsActive,
  MdSecurity,
} from "react-icons/md";
import { FaIdCard, FaClipboardList, FaStar, FaUserCircle } from "react-icons/fa";
import { HiBadgeCheck, HiSparkles } from "react-icons/hi";

import "./Dashboard.css";

function Dashboard() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  if (!student) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-root">

        {/* HERO SECTION */}
        <div className="hero">
          <div className="welcome-text">
            <FaUserCircle className="welcome-icon" />
            <h1>
              Welcome, {student.fullName} <HiSparkles className="sparkle" />
            </h1>
          </div>

          <p>
            Room {student.roomno} · {student.hostel}
          </p>

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
        <div className="stats-row">
          <div className="stat-box">
            <MdReportProblem className="stat-icon" />
            <div>
              <strong>2</strong>
              <p>Active Complaints</p>
            </div>
          </div>

          <div className="stat-box">
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
            </div>
          </div>

          <div className="stat-box">
            <div className="mess-stars">
              <FaStar className="star" />
              <FaStar className="star" />
              <FaStar className="star" />
              <FaStar className="star" />
              <FaStar className="star faded" />
            </div>
            <p>Mess Rating</p>
          </div>
        </div>

        {/* ACTION CARDS */}
        <div className="actions-grid">
          <div className="action-card purple">
            <MdReportProblem />
            <h3>Raise Complaint</h3>
            <span>Report hostel issues</span>
          </div>

          <div className="action-card blue">
            <FaClipboardList />
            <h3>My Complaints</h3>
            <span>Track status & history</span>
          </div>

          <div className="action-card green">
            <FaIdCard />
            <h3>Outpass</h3>
            <span>Apply for leave</span>
          </div>

          <div className="action-card gray">
            <MdNotificationsActive />
            <h3>Notices</h3>
            <span>Hostel updates</span>
          </div>
        </div>

        {/* EMERGENCY BUTTON */}
        <button className="sos-button">
          🚨 Emergency Assistance
        </button>

      </div>
    </>
  );
}

export default Dashboard;

