import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FiMail, FiLock } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Apply animation classes after component mounts
    const card = document.querySelector(".login-card");
    const inputs = document.querySelectorAll(".input-group");
    const btn = document.querySelector(".login-btn");
    const footer = document.querySelector(".login-footer");

    setTimeout(() => {
      card?.classList.add("animate");
      inputs.forEach((input, idx) => {
        setTimeout(() => input.classList.add("animate"), idx * 60);
      });
      setTimeout(() => btn?.classList.add("animate"), inputs.length * 60);
      setTimeout(() => footer?.classList.add("animate"), inputs.length * 60 + 60);
    }, 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      console.log("Login success:", data);

      // ✅ Save all student info to localStorage
      localStorage.setItem(
        "student",
        JSON.stringify(data.student)
      );


      // Redirect to profile/dashboard
      navigate("/student/dashboard");

    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <HiSparkles className="sparkle-icon" />
          <h1>Welcome Back</h1>
          <p>Login to manage your hostel services</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="College Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-footer">
          <span>New here?</span>
          <strong
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/student/signup")}
          >
            Create an account
          </strong>
        </div>
      </div>
    </div>
  );
}
