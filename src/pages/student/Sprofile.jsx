import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/sNavbar.jsx";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaHome,
  FaCalendarAlt,
} from "react-icons/fa";
import "./Sprofile.css";

function Sprofile() {
  const [student, setStudent] = useState(null);
  const [editOpen, setEditOpen] = useState(false); // modal toggle
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      const parsed = JSON.parse(storedStudent);
      setStudent(parsed);
      setFormData({
        fullName: parsed.fullName,
        phone: parsed.phone || "",
        birthDate: parsed.birthDate || "",
        hostel: parsed.hostel || "",
        roomno: parsed.roomno || "",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("warden");
    navigate("/");
  };

  const handleSave = () => {
    // Send updated data to backend
    fetch(`http://localhost:5000/api/student/update/${student.email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.student) {
          // Update state & localStorage only after successful server update
          setStudent(data.student);
          localStorage.setItem("student", JSON.stringify(data.student));
          setEditOpen(false);
        } else {
          alert(data.message || "Failed to update profile");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error while updating profile");
      });
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
            <span>Birth Date: {student.birthDate}</span>
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
          <button className="btn edit-btn" onClick={() => setEditOpen(true)}>
            Edit Profile
          </button>
          <button className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* MODAL */}
      {editOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <label>
              Full Name
              <input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </label>
            <label>
              Phone
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </label>
            <label>
              Entry Date
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
              />
            </label>
            <label>
              Hostel
              <input
                value={formData.hostel}
                onChange={(e) =>
                  setFormData({ ...formData, hostel: e.target.value })
                }
              />
            </label>
            <label>
              Room Number
              <input
                value={formData.roomno}
                onChange={(e) =>
                  setFormData({ ...formData, roomno: e.target.value })
                }
              />
            </label>

            <div className="modal-actions">
              <button className="btn save-btn" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn cancel-btn"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sprofile;



