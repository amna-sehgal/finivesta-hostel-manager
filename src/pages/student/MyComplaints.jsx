import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import {
  MdOutlineWater,
  MdOutlineElectricalServices,
  MdWifi,
  MdCleaningServices,
  MdReportProblem,
} from "react-icons/md";
import { FaFan } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import "./MyComplaints.css";

function MyComplaints() {
  // Dummy complaints data
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      category: "Water",
      description: "Water leakage in bathroom",
      status: "Pending",
      priority: "Critical",
      date: "2026-01-22",
    },
    {
      id: 2,
      category: "WiFi",
      description: "WiFi not working in room",
      status: "In Progress",
      priority: "Normal",
      date: "2026-01-21",
    },
    {
      id: 3,
      category: "Cleanliness",
      description: "Washroom not cleaned properly",
      status: "Resolved",
      priority: "Low",
      date: "2026-01-20",
    },
  ]);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Water":
        return <MdOutlineWater style={{ color: "#3498db" }} />;
      case "Electrical":
        return <MdOutlineElectricalServices style={{ color: "#f1c40f" }} />;
      case "WiFi":
        return <MdWifi style={{ color: "#1abc9c" }} />;
      case "Cleanliness":
        return <MdCleaningServices style={{ color: "#2ecc71" }} />;
      case "Fan":
        return <FaFan style={{ color: "#e67e22" }} />;
      default:
        return <MdReportProblem style={{ color: "#95a5a6" }} />;
    }
  };

  return (
    <>
      <Navbar />

      <div className="complaints-root">
        <div className="page-header">
          <GiNotebook className="header-icon" />
          <h2>My Complaints</h2>
        </div>

        <div className="complaints-list">
          {complaints.map((c) => (
            <div key={c.id} className="complaint-card">
              <div className="complaint-top">
                <div className="cat-icon">{getCategoryIcon(c.category)}</div>
                <h3>{c.category}</h3>
                <span className={`status-badge ${c.status.toLowerCase().replace(" ", "-")}`}>
                  {c.status}
                </span>
              </div>
              <p className="complaint-desc">{c.description}</p>
              <div className="complaint-footer">
                <span className={`priority-badge ${c.priority.toLowerCase()}`}>
                  {c.priority}
                </span>
                <span className="complaint-date">{c.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyComplaints;
