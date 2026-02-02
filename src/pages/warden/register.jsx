import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaLock, FaPhone, FaHome } from "react-icons/fa";
import "./register.css";
import { HiSparkles } from "react-icons/hi2";
import { Link } from "react-router-dom";

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                // ✅ Save warden data to localStorage
                // Make sure data contains at least fullName and hostel
                localStorage.setItem("warden", JSON.stringify({
                    fullName: data.warden.fullName,
                    hostel: data.warden.hostel,
                    phone: data.warden.phone || "",
                    email: data.warden.email || "",
                }));


                // Redirect to dashboard/profile
                navigate("/warden/dashboard");
            }
        } catch (err) {
            setError("Backend not connected");
        }
    };

    return (
        <div className="signup-root">
            <div className="signup-card glass">
                <HiSparkles className="sparkle-icon" />
                <h1>Welcome to StayMate</h1>
                <p>Create your warden account</p>

                <form onSubmit={handleSubmit} className="signup-form">

                    <div className="input-group">
                        <FaUserCircle className="input-icon" />
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="College Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <FaPhone className="input-icon" />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone (optional)"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <FaHome className="input-icon" />
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

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <button type="submit" className="signup-btn">
                        Sign Up
                    </button>
                </form>

                <p className="login-link">
                    Already have an account?{" "}
                    <Link to="/warden/login" className="login-link-btn">
                        Login here
                    </Link>
                </p>

            </div>
        </div>
    );
}
