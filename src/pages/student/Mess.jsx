import Navbar from "../../components/common/Navbar";
import {
    FaUtensils,
    FaStar,
    FaRegStar,
    FaClock,
    FaVoteYea,
} from "react-icons/fa";
import { MdBreakfastDining, MdLunchDining, MdDinnerDining } from "react-icons/md";
import "./Mess.css";
import { useState } from "react";

function Mess() {
    const [rating, setRating] = useState(0);
    const [selectedChip, setSelectedChip] = useState(null);

    const feedbackChips = [
        { label: "Tasty 😋", color: "green" },
        { label: "Too Salty 🧂", color: "pink" },
        { label: "Cold Food 🥶", color: "blue" },
        { label: "Late Serving 🕒", color: "orange" },
        { label: "Clean & Hygienic 🧼", color: "teal" },
    ];

    return (
        <>
            <Navbar />

            <div className="mess-root">
                {/* HEADER */}
                <div className="mess-header">
                    <FaUtensils className="mess-icon" />
                    <div>
                        <h1>Mess & Dining</h1>
                        <p>Today’s menu, ratings & feedback</p>
                    </div>
                </div>

                {/* MENU */}
                <div className="menu-card glass">
                    <div className="menu-section">
                        <MdBreakfastDining />
                        <div>
                            <h3>Breakfast</h3>
                            <p>Poha, Boiled Eggs, Milk</p>
                        </div>
                    </div>

                    <div className="menu-section">
                        <MdLunchDining />
                        <div>
                            <h3>Lunch</h3>
                            <p>Dal, Rice, Roti, Salad</p>
                        </div>
                    </div>

                    <div className="menu-section">
                        <MdDinnerDining />
                        <div>
                            <h3>Dinner</h3>
                            <p>Paneer Curry, Roti, Sweet</p>
                        </div>
                    </div>

                    <div className="timing">
                        <FaClock />
                        <span>Mess Timings: 7–9 AM | 12–2 PM | 7–9 PM</span>
                    </div>
                </div>

                {/* RATING */}
                <div className="rating-card glass">
                    <h2>Rate Today’s Food</h2>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((num) =>
                            num <= rating ? (
                                <FaStar
                                    key={num}
                                    className="star filled"
                                    onClick={() =>
                                        setRating((prev) => (prev === num ? 0 : num))
                                    }
                                />
                            ) : (
                                <FaRegStar
                                    key={num}
                                    className="star"
                                    onClick={() =>
                                        setRating((prev) => (prev === num ? 0 : num))
                                    }
                                />
                            )
                        )}
                    </div>

                    {rating > 0 && <p>You rated today’s food {rating}/5 ⭐</p>}
                </div>

                {/* FEEDBACK */}
                <div className="feedback-card glass">
                    <h2>Quick Feedback</h2>
                    <div className="chip-container">
                        {feedbackChips.map((chip, i) => (
                            <button
                                key={i}
                                className={`chip ${chip.color} ${selectedChip === chip.label ? "active" : ""
                                    }`}
                                onClick={() =>
                                    setSelectedChip(
                                        selectedChip === chip.label ? null : chip.label
                                    )
                                }
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* POLL */}
                <div className="poll-card glass">
                    <h2>
                        <FaVoteYea /> What should we have tomorrow?
                    </h2>

                    <div className="poll-options">
                        <button>Momos 🥟</button>
                        <button>Chole Bhature 🫓</button>
                        <button>Pasta 🍝</button>
                        <button>Paneer Butter Masala 🍛</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Mess;