import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/sNavbar";
import EmergencySOS from "./Emergency";

import {
  MdReportProblem,
  MdSecurity,
  MdCampaign,
  MdElectricalServices,
} from "react-icons/md";
import {
  FaIdCard,
  FaClipboardList,
  FaStar,
} from "react-icons/fa";
import { HiBadgeCheck, HiSparkles } from "react-icons/hi";

import "./Dashboard.css";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [openSOS, setOpenSOS] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) setStudent(JSON.parse(storedStudent));
    setTimeout(() => setLoaded(true), 150);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: .12 });

    els.forEach(el => observer.observe(el));
  }, []);

  useEffect(() => {
    if (!student) return;

    fetch(`http://localhost:5000/api/complaints/student/${student.email}`)
      .then(res => res.json())
      .then(data => {
        const active = data.complaints.filter(c => c.status !== "Resolved");
        setActiveCount(active.length);
      })
      .catch(err => console.error(err));
  }, [student]);

  if (!student) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-root">

        {/* HERO */}
        <div className="hero">
          <div className="hero-left">

            <div>
              <h1 className="welcome-big">
                Welcome back, {student.fullName}
                <HiSparkles className="sparkle" />
              </h1>

              <p>
                Room {student.roomno} · {student.hostel}
              </p>

              <div className="hero-tags">
                <span className="tag safe">
                  <MdSecurity /> Safe Hostel
                </span>
                <span className="tag verified">
                  <HiBadgeCheck /> Verified
                </span>
              </div>
            </div>
          </div>

          <button className="sos-top" onClick={() => setOpenSOS(true)}>
            🚨 Emergency
          </button>
        </div>

        {/* STATS */}
        <div className={`stats-row ${loaded ? "show" : ""}`} reveal>
          <div className="stat-card">
            <MdReportProblem />
            <div>
              <h2>{activeCount}</h2>
              <p>Active Complaints</p>
            </div>
          </div>

          <div className="stat-card">
            <FaIdCard />
            <div>
              <h2>3 / 5</h2>
              <p>Leave Balance</p>
            </div>
          </div>

          <div className="stat-card">
            <FaStar />
            <div>
              <h2>4.2</h2>
              <p>Mess Rating</p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className={`actions-grid ${loaded ? "show" : ""}`} reveal>

          <div className="action-card" onClick={() => navigate("/student/raise-complaint")}>
            <MdReportProblem />
            <h3>Raise Complaint</h3>
            <span>Report hostel issues instantly</span>
          </div>

          <div className="action-card" onClick={() => navigate("/student/my-complaints")}>
            <FaClipboardList />
            <h3>My Complaints</h3>
            <span>Track all requests</span>
          </div>

          <div className="action-card" onClick={() => navigate("/student/outpass")}>
            <FaIdCard />
            <h3>Outpass</h3>
            <span>Apply for leave</span>
          </div>

          <div className="action-card" onClick={() => navigate("/student/utilities")}>
            <MdElectricalServices />
            <h3>Utilities</h3>
            <span>Electricity · WiFi · Water</span>
          </div>

          <div className="action-card" onClick={() => navigate("/student/notices")}>
            <MdCampaign />
            <h3>Notices</h3>
            <span>Hostel announcements</span>
          </div>

        </div>

        {/* ALERTS */}
        <div className={`alerts ${loaded ? "show" : ""}`} reveal>
          <h3>Recent Activity</h3>
          <ul>
            <li>Your WiFi complaint is <strong>In Progress</strong></li>
            <li>New notice: Mess closed Sunday</li>
          </ul>
        </div>

        <EmergencySOS isOpen={openSOS} onClose={() => setOpenSOS(false)} />
      </div>
    </>
  );
}

export default Dashboard;
