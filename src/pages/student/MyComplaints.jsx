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
import styles from "./MyComplaints.module.css";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    const email = student?.email;
    if (!email) return;
    fetch(`http://localhost:5000/api/complaints/student/${email}`)
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
        return <MdOutlineWater style={{ color: "#38bdf8" }} />;
      case "Electrical":
        return <MdOutlineElectricalServices style={{ color: "#facc15" }} />;
      case "WiFi":
        return <MdWifi style={{ color: "#22d3ee" }} />;
      case "Cleanliness":
        return <MdCleaningServices style={{ color: "#34d399" }} />;
      case "Fan":
        return <FaFan style={{ color: "#f97316" }} />;
      default:
        return <MdReportProblem style={{ color: "#94a3b8" }} />;
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/complaints/student/${id}`, {
      method: "DELETE",
    });
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <>
      <Navbar />

      <div className={styles.complaintsRoot}>
        <div className={styles.pageHeader}>
          <GiNotebook className={styles.headerIcon} />
          <h2>My Complaints</h2>
        </div>

        <div className={styles.filterBar}>
          {["All", "Water", "WiFi", "Cleanliness", "Fan", "Electrical", "Other"].map((cat) => (
            <button
              key={cat}
              className={filter === cat ? styles.active : ""}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className={styles.loadingText}>Loading...</p>
        ) : filteredComplaints.length === 0 ? (
          <div className={styles.emptyState}>
            <img src="/Screenshot 2026-01-25 120147.png" alt="No complaints" />
            <p>No complaints found!</p>
          </div>
        ) : (
          <div className={styles.complaintsList}>
            {filteredComplaints.map((c) => (
              <div key={c.id} className={styles.complaintCard}>
                <div className={styles.complaintTop}>
                  <div className={styles.catIcon}>{getCategoryIcon(c.category)}</div>
                  <h3>{c.category}</h3>

                  <span
                    className={`${styles.statusBadge} ${styles[c.status.toLowerCase().replace(" ", "-")]}`}
                  >
                    {c.status}
                  </span>
                </div>

                <p className={styles.complaintDesc}>{c.description}</p>

                <div className={styles.complaintFooter}>
                  <span className={`${styles.priorityBadge} ${styles[c.priority.toLowerCase()]}`}>
                    {c.priority}
                  </span>

                  <div className={styles.footerRight}>
                    <span className={styles.complaintDate}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    <MdDeleteOutline
                      className={styles.deleteIcon}
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


