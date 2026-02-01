import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/sNavbar";
import {
  MdOutlineWater,
  MdOutlineElectricalServices,
  MdWifi,
  MdCleaningServices,
  MdReportProblem,
  MdDeleteOutline,
} from "react-icons/md";
import { FaFan } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import "./MyComplaints.css";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints/student/student@mail.com")
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data.complaints || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter((c) => c.category === filter);

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
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/complaints/student/${id}`, {
      method: "DELETE",
    });
    setComplaints(prev => prev.filter(c => c.id !== id));
  };


  return (
    <>
      <Navbar />

      <div className="complaints-root">
        <div className="page-header">
          <GiNotebook className="header-icon" />
          <h2>My Complaints</h2>
        </div>

        <div className="filter-bar">
          {["All", "Water", "WiFi", "Cleanliness", "Fan", "Electrical", "Other"].map((cat) => (
            <button
              key={cat}
              className={filter === cat ? "active" : ""}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <img src="/Screenshot 2026-01-25 120147.png" alt="No complaints" />
            <p>No complaints found!</p>
          </div>
        ) : (
          <div className="complaints-list">
            {filteredComplaints.map((c) => (
              <div key={c.id} className="complaint-card">
                <div className="complaint-top">
                  <div className="cat-icon">{getCategoryIcon(c.category)}</div>
                  <h3>{c.category}</h3>

                  <span
                    className={`status-badge ${c.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {c.status}
                  </span>
                </div>

                <p className="complaint-desc">{c.description}</p>

                <div className="complaint-footer">
                  <span
                    className={`priority-badge ${c.priority.toLowerCase()}`}
                  >
                    {c.priority}
                  </span>

                  <div className="footer-right">
                    <span className="complaint-date">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    <MdDeleteOutline
                      className="delete-icon"
                      onClick={() => handleDelete(c.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyComplaints;

