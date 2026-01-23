import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaLock, FaPhone, FaHome, FaBuilding, FaDoorOpen, FaHeart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    hostel: "",
    branch: "",
    birthDate: "",
    roomno: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/student/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ⭐ THIS WAS MISSING
      localStorage.setItem("student", JSON.stringify(data.student));

      // redirect
      navigate("/student/dashboard");

    } catch (err) {
      alert("Backend not running");
    }
  };


  return (
    <div className="signup-root">
      <div className="signup-card glass">
        <HiSparkles className="sparkle-icon" />
        <h1>Welcome to StayMate</h1>
        <p>Create your account to get started</p>

        {error && <div style={{ color: "red", marginBottom: "12px" }}>{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Full Name */}
          <div className="input-group">
            <FaUserCircle className="input-icon" />
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
          </div>

          {/* College Email */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" name="email" placeholder="College Email" value={formData.email} onChange={handleChange} />
          </div>

          {/* Password */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          {/* Phone */}
          <div className="input-group">
            <FaPhone className="input-icon" />
            <input type="tel" name="phone" placeholder="Phone Number (Optional)" value={formData.phone} onChange={handleChange} />
          </div>

          {/* Hostel */}
          <div className="input-group">
            <FaHome className="input-icon" />
            <select name="hostel" value={formData.hostel} onChange={handleChange}>
              <option value="">Select Hostel</option>
              <option value="Hostel A">Hostel A</option>
              <option value="Hostel B">Hostel B</option>
              <option value="Hostel C">Hostel C</option>
            </select>
          </div>

          {/* Branch */}
          <div className="input-group">
            <FaBuilding className="input-icon" />
            <input type="text" name="branch" placeholder="Branch" value={formData.branch} onChange={handleChange} />
          </div>

          {/* Room Number */}
          <div className="input-group">
            <FaDoorOpen className="input-icon" />
            <input type="text" name="roomno" placeholder="Room Number" value={formData.roomno} onChange={handleChange} />
          </div>

          {/* Birth Date */}
          <div className="input-group">
            <FaHeart className="input-icon" />
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/student/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
