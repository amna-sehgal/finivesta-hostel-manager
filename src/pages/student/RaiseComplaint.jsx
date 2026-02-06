import React, { useState } from "react";
import Navbar from "../../components/common/sNavbar";
import {
  MdOutlineWater,
  MdOutlineElectricalServices,
  MdWifi,
  MdCleaningServices,
  MdReportProblem,
} from "react-icons/md";
import { FaFan } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { FiUpload } from "react-icons/fi";
import { GiNotebook } from "react-icons/gi";
import styles from "./RaiseComplaint.module.css";

function RaiseComplaint() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: "Water", icon: <MdOutlineWater /> },
    { name: "Electrical", icon: <MdOutlineElectricalServices /> },
    { name: "WiFi", icon: <MdWifi /> },
    { name: "Cleanliness", icon: <MdCleaningServices /> },
    { name: "Fan", icon: <FaFan /> },
    { name: "Other", icon: <MdReportProblem /> },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFilePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCategoryClick = (name) => {
    if (selectedCategory === name) {
      setSelectedCategory("");
      setPriority("Normal");
    } else {
      setSelectedCategory(name);
      if (name === "Water" || name === "Electrical") setPriority("Critical");
      else if (name === "Cleanliness") setPriority("Low");
      else setPriority("Normal");
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !description.trim()) {
      alert("Please select a category and enter description");
      return;
    }

    try {
      setLoading(true);
      await fetch("http://localhost:5000/api/complaints/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: "student@mail.com",
          studentName: "Student",
          hostel: "A Block",
          roomNumber: "203",
          category: selectedCategory,
          description,
          priority,
        }),
      });
      alert("Complaint submitted successfully!");
      setSelectedCategory("");
      setFilePreview(null);
      setDescription("");
      setPriority("Normal");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.raiseRoot}>
        {/* HEADER */}
        <div className={styles.pageHeader}>
          <GiNotebook className={styles.headerIcon} />
          <h2>
            Raise a Complaint <HiSparkles className={styles.sparkleIcon} />
          </h2>
        </div>

        {/* CATEGORY GRID */}
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`${styles.categoryCard} ${
                selectedCategory === cat.name ? styles.selected : ""
              }`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className={styles.catIcon}>{cat.icon}</div>
              <p>{cat.name}</p>
            </div>
          ))}
        </div>

        {/* PRIORITY */}
        <div className={styles.priorityDropdown}>
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Critical">Critical</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* FILE UPLOAD */}
        <div className={styles.uploadSection}>
          <label htmlFor="file-upload" className={styles.uploadLabel}>
            <FiUpload className={styles.uploadIcon} /> Upload Image/Video
          </label>
          <input type="file" id="file-upload" onChange={handleFileChange} />
          {filePreview && (
            <div className={styles.filePreview}>
              <img src={filePreview} alt="Preview" />
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <textarea
          className={styles.descInput}
          placeholder="Describe your complaint..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* SUBMIT */}
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </div>
    </>
  );
}

export default RaiseComplaint;

