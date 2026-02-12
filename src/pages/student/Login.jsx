import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { FiMail, FiLock } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const card = document.querySelector("." + styles["login-card"]);
    const inputs = document.querySelectorAll("." + styles["input-group"]);
    const btn = document.querySelector("." + styles["login-btn"]);
    const footer = document.querySelector("." + styles["login-footer"]);

    setTimeout(() => {
      card?.classList.add("animate");

      inputs.forEach((input, idx) => {
        setTimeout(() => {
          input.classList.add("animate");
        }, idx * 60);
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

      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("student", JSON.stringify(data.user));

      navigate("/student/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend");
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-card"]}>
        <div className={styles["login-header"]}>
          <HiSparkles className={styles["sparkle-icon"]} />
          <h1>Welcome Back</h1>
          <p>Login to manage your hostel services</p>
        </div>

        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <FiMail className={styles["input-icon"]} />
            <input
              type="email"
              placeholder="College Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles["input-group"]}>
            <FiLock className={styles["input-icon"]} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={styles["error-text"]}>{error}</p>}

          <button type="submit" className={styles["login-btn"]}>
            Login
          </button>
        </form>

        <div className={styles["login-footer"]}>
          <span>New here?</span>
          <strong onClick={() => navigate("/student/signup")}>
            Create an account
          </strong>
        </div>
      </div>
    </div>
  );
}
