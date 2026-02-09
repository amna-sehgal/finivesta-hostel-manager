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
import styles from "./Sprofile.module.css";

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
    localStorage.removeItem("studentToken"); // remove token
    localStorage.removeItem("warden");
    navigate("/");
  };

  const handleSave = () => {
    const token = localStorage.getItem("studentToken"); // get JWT

    fetch(`http://localhost:5000/api/student/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // <-- send token
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStudent(data); // backend returns updated student
          localStorage.setItem("student", JSON.stringify(data));
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
      <div className={styles.profileRoot}>
        {/* HEADER */}
        <div className={styles.profileHeader}>
          <FaUserCircle className={styles.profileAvatar} />
          <div className={styles.profileName}>
            <h1>{student.fullName}</h1>
            <p>Student, {student.branch}</p>
          </div>
        </div>

        {/* DETAILS */}
        <div className={styles.profileDetails}>
          <div className={styles.detailItem}>
            <FaEnvelope className={styles.detailIcon} />
            <span>{student.email}</span>
          </div>
          <div className={styles.detailItem}>
            <FaPhoneAlt className={styles.detailIcon} />
            <span>{student.phone || "Not provided"}</span>
          </div>
          <div className={styles.detailItem}>
            <FaCalendarAlt className={styles.detailIcon} />
            <span>Entry Date: {student.entryDate}</span>
          </div>
          <div className={styles.detailItem}>
            <FaHome className={styles.detailIcon} />
            <span>
              Hostel: {student.hostel}, Room {student.roomno}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.profileActions}>
          <button className={styles.editBtn} onClick={() => setEditOpen(true)}>
            Edit Profile
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* MODAL */}
      {editOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
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
                value={formData.entryDate}
                onChange={(e) =>
                  setFormData({ ...formData, entryDate: e.target.value })
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

            <div className={styles.modalActions}>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save
              </button>
              <button
                className={styles.cancelBtn}
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




