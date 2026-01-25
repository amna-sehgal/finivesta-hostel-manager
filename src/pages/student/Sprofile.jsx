import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/sNavbar.jsx";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaBirthdayCake,
  FaHome,
} from "react-icons/fa";
import "./Sprofile.css";
import { FaCalendarAlt } from "react-icons/fa";


function Sprofile() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("warden"); // 👈 IMPORTANT
    navigate("/");
  };


  if (!student) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="profile-root">
        {/* HEADER */}
        <div className="profile-header">
          <FaUserCircle className="profile-avatar" />
          <div className="profile-name">
            <h1>{student.fullName}</h1>
            <p>Student, {student.branch}</p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="profile-details glass">
          <div className="detail-item">
            <FaEnvelope className="detail-icon" />
            <span>{student.email}</span>
          </div>

          <div className="detail-item">
            <FaPhoneAlt className="detail-icon" />
            <span>{student.phone || "Not provided"}</span>
          </div>

          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <span>Entry Date: {student.birthDate}</span>
          </div>

          <div className="detail-item">
            <FaHome className="detail-icon" />
            <span>
              Hostel: {student.hostel}, Room {student.roomno}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="profile-actions">
          <button className="btn edit-btn">Edit Profile</button>
          <button className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sprofile;

