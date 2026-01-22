import { useState } from "react";
import "./Login.css";
import { FiMail, FiLock } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <HiSparkles className="sparkle-icon" />
          <h1>Welcome Back</h1>
          <p>Login to manage your hostel services</p>
        </div>

        {/* Form */}
        <form className="login-form">
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

          <div className="login-options">
            <span className="forgot">Forgot password?</span>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <span>New here?</span>
          <strong>Create an account</strong>
        </div>
      </div>
    </div>
  );
}
