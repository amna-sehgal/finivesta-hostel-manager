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
import { HiSparkles } from "react-icons/hi";
import { FiUpload } from "react-icons/fi";
import { GiNotebook } from "react-icons/gi";
import "./RaiseComplaint.css";

function RaiseComplaint() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filePreview, setFilePreview] = useState(null);
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Normal");

    const categories = [
        { name: "Water", icon: <MdOutlineWater style={{ color: "#3498db" }} /> },
        { name: "Electrical", icon: <MdOutlineElectricalServices style={{ color: "#f1c40f" }} /> },
        { name: "WiFi", icon: <MdWifi style={{ color: "#1abc9c" }} /> },
        { name: "Cleanliness", icon: <MdCleaningServices style={{ color: "#2ecc71" }} /> },
        { name: "Fan", icon: <FaFan style={{ color: "#e67e22" }} /> },
        { name: "Other", icon: <MdReportProblem style={{ color: "#95a5a6" }} /> },
    ];

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFilePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleCategoryClick = (name) => {
        // Toggle selection: if already selected, deselect
        if (selectedCategory === name) {
            setSelectedCategory(""); // deselect
            setPriority("Normal");   // reset priority
        } else {
            setSelectedCategory(name);
            // Temporary AI priority placeholder
            if (name === "Water" || name === "Electrical") setPriority("Critical");
            else if (name === "Cleanliness") setPriority("Low");
            else setPriority("Normal");
        }
    };


    const handleSubmit = () => {
        alert(`Complaint submitted!\nCategory: ${selectedCategory}\nPriority: ${priority}`);
        setSelectedCategory("");
        setFilePreview(null);
        setDescription("");
        setPriority("Normal");
    };

    return (
        <>
            <Navbar />
            <div className="raise-root">

                {/* HEADING */}
                <div className="page-header">
                    <GiNotebook className="header-icon" />
                    <h2>Raise a Complaint <HiSparkles className="sparkle" /></h2>
                </div>

                {/* CATEGORY SELECTION AS CARDS */}
                <div className="category-grid">
                    {categories.map((cat) => (
                        <div
                            key={cat.name}
                            className={`category-card ${selectedCategory === cat.name ? "selected" : ""}`}
                            onClick={() => handleCategoryClick(cat.name)}
                        >
                            <div className="cat-icon">{cat.icon}</div>
                            <p>{cat.name}</p>
                        </div>
                    ))}
                </div>

                {/* PRIORITY DROPDOWN */}
                <div className="priority-dropdown">
                    <label>Priority:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="Critical">Critical</option>
                        <option value="Normal">Normal</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                {/* FILE UPLOAD */}
                <div className="upload-section">
                    <label htmlFor="file-upload" className="upload-label">
                        <FiUpload className="upload-icon" /> Upload Image/Video
                    </label>
                    <input type="file" id="file-upload" onChange={handleFileChange} />
                    {filePreview && (
                        <div className="file-preview">
                            <img src={filePreview} alt="Preview" />
                        </div>
                    )}
                </div>

                {/* DESCRIPTION */}
                <textarea
                    className="desc-input"
                    placeholder="Describe your complaint..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* SUBMIT BUTTON */}
                <button className="submit-btn" onClick={handleSubmit}>
                    Submit Complaint
                </button>
            </div>
        </>
    );
}

export default RaiseComplaint;

