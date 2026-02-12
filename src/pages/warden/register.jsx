import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaLock, FaPhone, FaHome } from "react-icons/fa";
import styles from "./register.module.css";
import { HiSparkles } from "react-icons/hi2";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    hostel: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const card = document.querySelector("." + styles["signup-card"]);
    const inputs = document.querySelectorAll("." + styles["input-group"]);
    const btn = document.querySelector("." + styles["signup-btn"]);
    const link = document.querySelector("." + styles["login-link"]);

    setTimeout(() => {
      card?.classList.add("animate");

      inputs.forEach((el, i) => {
        setTimeout(() => el.classList.add("animate"), i * 80);
      });

      setTimeout(() => btn?.classList.add("animate"), inputs.length * 80);
      setTimeout(() => link?.classList.add("animate"), inputs.length * 80 + 80);
    }, 100);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { fullName, email, password, confirmPassword, hostel } = formData;

    if (!fullName || !email || !password || !confirmPassword || !hostel) {
      setError("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/warden/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
      } else {
        localStorage.setItem("wardenToken", data.token);
        localStorage.setItem("warden", JSON.stringify(data.user));
        navigate("/warden/dashboard");
      }
    } catch {
      setError("Backend not connected");
    }
  };

  return (
    <div className={styles["signup-root"]}>
      <div className={styles["signup-card"]}>
        <HiSparkles className={styles["sparkle-icon"]} />

        <h1>Welcome to StayMate</h1>
        <p>Create your warden account</p>

        <form onSubmit={handleSubmit} className={styles["signup-form"]}>
          <div className={styles["input-group"]}>
            <FaUserCircle className={styles["input-icon"]} />
            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange}/>
          </div>

          <div className={styles["input-group"]}>
            <FaEnvelope className={styles["input-icon"]} />
            <input name="email" type="email" placeholder="College Email" value={formData.email} onChange={handleChange}/>
          </div>

          <div className={styles["input-group"]}>
            <FaLock className={styles["input-icon"]} />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}/>
          </div>

          <div className={styles["input-group"]}>
            <FaLock className={styles["input-icon"]} />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}/>
          </div>

          <div className={styles["input-group"]}>
            <FaPhone className={styles["input-icon"]} />
            <input name="phone" placeholder="Phone (optional)" value={formData.phone} onChange={handleChange}/>
          </div>

          <div className={styles["input-group"]}>
            <FaHome className={styles["input-icon"]} />
            <select name="hostel" value={formData.hostel} onChange={handleChange}>
              <option value="">Select Hostel</option>
              <option value="Krishna">Krishna</option>
              <option value="Kaveri">Kaveri</option>
            </select>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className={styles["signup-btn"]}>Sign Up</button>
        </form>

        <p className={styles["login-link"]}>
          Already have an account?{" "}
          <Link to="/warden/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

