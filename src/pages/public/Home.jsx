import { useState, useEffect } from "react";
import { FaRegClipboard, FaUtensils, FaIdCard, FaTshirt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import "./Home.css";

function Home() {
    const navigate = useNavigate(); // ✅ get navigate function

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
                setCurrentText((prev) => prev + taglines[taglineIndex][charIndex]);
                setCharIndex((prev) => prev + 1);
            }, typingSpeed);

            return () => clearTimeout(timeout);
        } else {
            const wait = setTimeout(() => {
                setCurrentText("");
                setCharIndex(0);
                setTaglineIndex((prev) => (prev + 1) % taglines.length);
            }, 1500);

            return () => clearTimeout(wait);
        }
    }, [charIndex, taglineIndex]);

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

            {/* BUTTONS BELOW HERO */}
            <div className="hero-buttons">
                <button
                    className="btn student-btn"
                    onClick={() => navigate("/student/signup")} // ✅ add path
                >
                    Register as Student
                </button>
                <button
                    className="btn warden-btn"
                    onClick={() => navigate("/warden/register")} // ✅ add path
                >
                    Register as Warden
                </button>
            </div>

            {/* ABOUT SECTION */}
            <section className="about-section">
                <h2>About Staymate</h2>
                <p>
                    STAYMATE is your all-in-one hostel companion. Easily manage complaints, outpasses, mess ratings, and laundry requests while staying updated with hostel activities. Simplify your life and enjoy hassle-free living in your hostel!
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
        </div>
    );
}

export default Home;

