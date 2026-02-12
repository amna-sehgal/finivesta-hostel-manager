import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaHome,
  FaBuilding,
  FaDoorOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import styles from "./Signup.module.css";

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
    entryDate: "",
    roomno: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(styles.animate);
          }, idx * 60);
        }
      });
    }, observerOptions);

    // card animation
    const card = document.querySelector(`.${styles["signup-card"]}`);
    if (card) card.classList.add(styles.animate);

    // observe input groups
    const inputGroups = document.querySelectorAll(
      `.${styles["input-group"]}`
    );
    inputGroups.forEach((group) => observer.observe(group));

    const btn = document.querySelector(`.${styles["signup-btn"]}`);
    if (btn) observer.observe(btn);

    const link = document.querySelector(`.${styles["login-link"]}`);
    if (link) observer.observe(link);

    return () => {
      inputGroups.forEach((group) => observer.unobserve(group));
      if (btn) observer.unobserve(btn);
      if (link) observer.unobserve(link);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/student/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("student", JSON.stringify(data.user));

      navigate("/student/dashboard");
    } catch {
      alert("Backend not running");
    }
  };

  return (
    <div className={styles["signup-root"]}>
      <div className={`${styles["signup-card"]} ${styles.glass}`}>
        <HiSparkles className={styles["sparkle-icon"]} />

        <h1>Welcome to StayMate</h1>
        <p>Create your account to get started</p>

        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}

        <form
          onSubmit={handleSubmit}
          className={styles["signup-form"]}
        >
          <div className={styles["input-group"]}>
            <FaUserCircle className={styles["input-icon"]} />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className={styles["input-group"]}>
            <FaEnvelope className={styles["input-icon"]} />
            <input
              type="email"
              name="email"
              placeholder="College Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles["input-group"]}>
            <FaLock className={styles["input-icon"]} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className={styles["input-group"]}>
            <FaLock className={styles["input-icon"]} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className={styles["input-group"]}>
            <FaPhone className={styles["input-icon"]} />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles["input-group"]}>
            <FaHome className={styles["input-icon"]} />
            <select
              name="hostel"
              value={formData.hostel}
              onChange={handleChange}
            >
              <option value="">Select Hostel</option>
              <option value="Krishna">Krishna</option>
              <option value="Kaveri">Kaveri</option>
            </select>
          </div>

          <div className={styles["input-group"]}>
            <FaBuilding className={styles["input-icon"]} />
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              onChange={handleChange}
            />
          </div>

          <div className={styles["input-group"]}>
            <FaDoorOpen className={styles["input-icon"]} />
            <input
              type="text"
              name="roomno"
              placeholder="Room Number"
              value={formData.roomno}
              onChange={handleChange}
            />
          </div>

          <div className={styles["input-group"]}>
            <FaCalendarAlt className={styles["input-icon"]} />
            <input
              type="date"
              name="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className={styles["signup-btn"]}
          >
            Sign Up
          </button>
        </form>

        <p className={styles["login-link"]}>
          Already have an account?{" "}
          <a href="/student/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
