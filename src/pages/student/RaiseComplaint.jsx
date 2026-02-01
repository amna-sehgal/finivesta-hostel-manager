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
import "./RaiseComplaint.css";

function RaiseComplaint() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filePreview, setFilePreview] = useState(null);
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Normal");
    const [loading, setLoading] = useState(false);

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
                    studentEmail: "student@mail.com", // later from auth
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
            <div className="raise-root">

                <div className="page-header">
                    <GiNotebook className="header-icon" />
                    <h2>Raise a Complaint <HiSparkles className="sparkle" /></h2>
                </div>

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

                <div className="priority-dropdown">
                    <label>Priority:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="Critical">Critical</option>
                        <option value="Normal">Normal</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

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

                <textarea
                    className="desc-input"
                    placeholder="Describe your complaint..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button className="submit-btn1" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Submitting..." : "Submit Complaint"}
                </button>
            </div>
        </>
    );
}

export default RaiseComplaint;
