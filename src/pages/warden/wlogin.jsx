import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./wlogin.module.css";
import { FiMail, FiLock } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useEffect } from "react";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/warden/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("wardenToken", data.token);
        localStorage.setItem("warden", JSON.stringify(data.user));
        navigate("/warden/dashboard");
      }
    } catch (err) {
      setError("Backend not connected");
    }
  };

  useEffect(() => {
    const card = document.querySelector(`.${styles.card}`);
    const inputs = document.querySelectorAll(`.${styles.inputGroup}`);
    const btn = document.querySelector(`.${styles.button}`);
    const footer = document.querySelector(`.${styles.footer}`);

    setTimeout(() => {
      card?.classList.add("animate");

      inputs.forEach((el, i) => {
        setTimeout(() => el.classList.add("animate"), i * 80);
      });

      setTimeout(() => btn?.classList.add("animate"), 300);
      setTimeout(() => footer?.classList.add("animate"), 450);
    }, 100);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* header */}
        <div className={styles.header}>
          <div className={styles.sparkleWrap}>
            <HiSparkles className={styles.sparkle} />
          </div>

          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Login to manage hostel services</p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.inputGroup}>
            <FiMail className={styles.icon} />
            <input
              type="email"
              placeholder="College Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FiLock className={styles.icon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        {/* footer */}
        <div className={styles.footer}>
          <span>New here?</span>
          <strong onClick={() => navigate("/warden/signup")}>
            Create an account
          </strong>
        </div>

      </div>
    </div>
  );
}
