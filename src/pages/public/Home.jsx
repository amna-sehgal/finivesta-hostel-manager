import { useState, useEffect } from "react";
import { FaRegClipboard, FaUtensils, FaIdCard, FaTshirt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    // ✅ MODAL STATE (MUST BE INSIDE COMPONENT)
    const [showRoleModal, setShowRoleModal] = useState(false);

    const taglines = [
        "Your ultimate hostel companion",
        "Track complaints, outpasses & mess easily",
        "Stay updated with your hostel life",
        "Experience hassle-free living"
    ];

    const [currentText, setCurrentText] = useState("");
    const [taglineIndex, setTaglineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const typingSpeed = 100;

        if (charIndex < taglines[taglineIndex].length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + taglines[taglineIndex][charIndex]);
                setCharIndex(prev => prev + 1);
            }, typingSpeed);

            return () => clearTimeout(timeout);
        } else {
            const wait = setTimeout(() => {
                setCurrentText("");
                setCharIndex(0);
                setTaglineIndex(prev => (prev + 1) % taglines.length);
            }, 1500);

            return () => clearTimeout(wait);
        }
    }, [charIndex, taglineIndex]);

    const handleGetStarted = () => {
        const student = localStorage.getItem("student");
        const warden = localStorage.getItem("warden");

        if (student) {
            // if a student is logged in, go to dashboard
            navigate("/student/dashboard");
        } else if (warden) {
            // if a warden is logged in, go to dashboard
            navigate("/warden/dashboard");
        } else {
            // user is logged out → show modal and remove any stale data
            localStorage.removeItem("student");
            localStorage.removeItem("warden");
            setShowRoleModal(true); // show modal to choose role
        }
    };


    return (
        <div className="home-root">

            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-left">
                    <h1 className="main-heading">STAYMATE</h1>

                    <div className="typing-container">
                        <h2 className="typing-effect">
                            {currentText}
                            <span className="cursor">|</span>
                        </h2>
                    </div>
                </div>

                <div className="hero-right">
                    <img
                        src="/istockphoto-1285471579-612x612.jpg"
                        alt="Hostel Illustration"
                        className="hero-image"
                    />
                </div>
            </section>

            {/* BUTTONS */}
            <div className="hero-buttons">
                <button className="btn get-started-btn" onClick={handleGetStarted}>
                    Get Started
                </button>

                <button
                    className="btn student-btn"
                    onClick={() => navigate("/student/signup")}
                >
                    Register as Student
                </button>

                <button
                    className="btn warden-btn"
                    onClick={() => navigate("/warden/register")}
                >
                    Register as Warden
                </button>
            </div>

            {/* ABOUT SECTION */}
            <section className="about-section">
                <h2>About Staymate</h2>
                <p>
                    STAYMATE is your all-in-one hostel companion. Easily manage complaints,
                    outpasses, mess ratings, and laundry requests while staying updated
                    with hostel activities.
                </p>

                <div className="about-icons">
                    <div>
                        <FaRegClipboard className="about-icon" />
                        <span>Complaints</span>
                    </div>
                    <div>
                        <FaUtensils className="about-icon" />
                        <span>Mess & Food</span>
                    </div>
                    <div>
                        <FaIdCard className="about-icon" />
                        <span>Outpasses</span>
                    </div>
                    <div>
                        <FaTshirt className="about-icon" />
                        <span>Laundry</span>
                    </div>
                </div>

                <p className="team">Created by Shreya, Amna, and Ananya</p>
            </section>

            {/* ROLE MODAL */}
            {showRoleModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowRoleModal(false)}
                >
                    <div
                        className="role-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Continue as</h3>

                        <button
                            className="modal-btn student"
                            onClick={() => navigate("/student/login")}
                        >
                            Student
                        </button>

                        <button
                            className="modal-btn warden"
                            onClick={() => navigate("/warden/login")}
                        >
                            Warden
                        </button>

                        <span
                            className="close-modal"
                            onClick={() => setShowRoleModal(false)}
                        >
                            ✕
                        </span>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;


