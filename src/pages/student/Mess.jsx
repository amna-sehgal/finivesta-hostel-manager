import Navbar from "../../components/common/sNavbar";
import {
    FaUtensils,
    FaStar,
    FaRegStar,
    FaClock,
    FaVoteYea,
} from "react-icons/fa";
import { MdBreakfastDining, MdLunchDining, MdDinnerDining } from "react-icons/md";
import styles from "./Mess.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Mess() {
    const [rating, setRating] = useState(0);
    const [selectedChip, setSelectedChip] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const [menu, setMenu] = useState({});
    const [pollOptions, setPollOptions] = useState([]);


    const feedbackChips = [
        { label: "Tasty 😋", color: "green" },
        { label: "Too Salty 🧂", color: "pink" },
        { label: "Cold Food 🥶", color: "blue" },
        { label: "Late Serving 🕒", color: "orange" },
        { label: "Clean & Hygienic 🧼", color: "teal" },
    ];
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 200);
    }, []);


    // Fetch today's menu
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/mess/student")
            .then((res) => setMenu(res.data.menu))
            .catch(console.error);
    }, []);
    useEffect(() => {
        axios.get("http://localhost:5000/api/mess/student")
            .then(res => {
                setMenu(res.data.menu);
                setPollOptions(res.data.pollOptions || []);
            })
            .catch(console.error);
    }, []);


    const submitFeedback = () => {
        console.log("SENDING →", {
            rating,
            selectedFood
        });
        const student = JSON.parse(localStorage.getItem("student"));

        if (!student) {
            alert("Student not logged in");
            return;
        }

        if (!rating && !selectedChip && !selectedFood) {
            alert("Please give some feedback");
            return;
        }

        axios
            .post("http://localhost:5000/api/mess/student/feedback", {
                studentName: student.fullName,
                rating,
                feedback: selectedChip,
                pollChoice: selectedFood,
            })
            .then(() => {
                alert("Feedback submitted successfully!");
                setRating(0);
                setSelectedChip(null);
                setSelectedFood(null);
            })
            .catch(() => alert("Something went wrong"));
    };

    return (
        <>
            <Navbar />

            <div className={styles.messRoot}>
                {/* HEADER */}
                <div className={styles.messHeader}>
                    <FaUtensils className={styles.messIcon} />
                    <div>
                        <h1>Mess & Dining</h1>
                        <p>Today’s menu, ratings & feedback</p>
                    </div>
                </div>

                {/* MENU */}
                <div className={`${styles.menuCard} ${styles.glass} ${visible ? styles.fadeIn : ""}`}>
                    <div className={styles.menuSection}>
                        <MdBreakfastDining />
                        <div>
                            <h3>Breakfast</h3>
                            <p>{menu?.breakfast}</p>
                        </div>
                    </div>

                    <div className={styles.menuSection}>
                        <MdLunchDining />
                        <div>
                            <h3>Lunch</h3>
                            <p>{menu?.lunch}</p>
                        </div>
                    </div>

                    <div className={styles.menuSection}>
                        <MdDinnerDining />
                        <div>
                            <h3>Dinner</h3>
                            <p>{menu?.dinner}</p>
                        </div>
                    </div>

                    <div className={styles.timing}>
                        <FaClock />
                        <span>Mess Timings: 7–9 AM | 12–2 PM | 7–9 PM</span>
                    </div>
                </div>

                {/* RATING */}
                <div className={`${styles.ratingCard} ${styles.glass} ${visible ? styles.fadeIn : ""}`}>
                    <h2>Rate Today’s Food</h2>
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map((num) =>
                            num <= rating ? (
                                <FaStar key={num} className={`${styles.star} ${styles.filled}`} onClick={() => setRating(num)} />
                            ) : (
                                <FaRegStar key={num} className={styles.star} onClick={() => setRating(num)} />
                            )
                        )}
                    </div>
                </div>

                {/* FEEDBACK */}
                <div className={`${styles.feedbackCard} ${styles.glass} ${visible ? styles.fadeIn : ""}`}>
                    <h2>Quick Feedback</h2>
                    <div className={styles.chipContainer}>
                        {feedbackChips.map((chip, i) => (
                            <button
                                key={i}
                                className={`${styles.chip} ${styles[chip.color]} ${selectedChip === chip.label ? styles.active : ""}`}
                                onClick={() => setSelectedChip(chip.label)}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* POLL */}
                <div className={`${styles.pollCard} ${styles.glass} ${visible ? styles.fadeIn : ""}`}>
                    <h2>
                        <FaVoteYea /> What should we have tomorrow?
                    </h2>

                    <div className={styles.pollOptions}>
                        {pollOptions.length === 0 ? (
                            <p className={styles.muted}>Poll not set yet</p>
                        ) : (
                            pollOptions.map((food, i) => (
                                <button
                                    key={i}
                                    className={`${styles.pollBtn} ${selectedFood === food ? styles.active : ""}`}
                                    onClick={() => setSelectedFood(food)}
                                    type="button"
                                >
                                    {food}
                                </button>
                            ))
                        )}
                    </div>

                    <button className={`${styles.submitBtn}`} onClick={submitFeedback}>
                        Submit Feedback
                    </button>
                </div>
            </div>
        </>
    );
}

export default Mess;

