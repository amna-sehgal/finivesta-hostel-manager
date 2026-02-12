import styles from "./wmess.module.css";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Navbar from "../wnavbar";
import axios from "axios";

const API = "http://localhost:5000/api/mess";

function Mess() {
    const messRef = useRef();
    const leftRef = useRef();

    const [weekMenu, setWeekMenu] = useState({});
    const [pollResults, setPollResults] = useState({});
    const [demandSummary, setDemandSummary] = useState([]);
    const [ratingsByDay, setRatingsByDay] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [pollInput, setPollInput] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 200);
        gsap.from(leftRef.current, { x: -60, duration: 0.8 });
        gsap.from(".row-section", { y: 40, stagger: 0.15 });
        fetchWardenData();
    }, []);

    const fetchWardenData = async () => {
        try {
            const res = await axios.get(`${API}/warden`);
            setWeekMenu(res.data.weekMenu || {});
            setPollResults(res.data.pollResults || {});
            setDemandSummary(res.data.demandSummary || []);
            setRatingsByDay(res.data.ratingsByDay || {});
        } catch (err) {
            console.error(err);
        }
    };

    const handleMenuChange = (day, meal, value) => {
        setWeekMenu(prev => ({
            ...prev,
            [day]: { ...prev[day], [meal]: value }
        }));
    };

    const saveMenu = async () => {
        try {
            await axios.post(`${API}/warden/menu`, { weeklyMenu: weekMenu });
            alert("Weekly menu updated!");
            setEditMode(false);
            fetchWardenData();
        } catch {
            alert("Error updating menu");
        }
    };

    const resetPollAndDemand = async () => {
        if (!window.confirm("Clear poll results and demand box?")) return;

        try {
            await axios.post(`${API}/warden/reset`);
            alert("Reset successful!");
            fetchWardenData();
        } catch {
            alert("Error resetting");
        }
    };

    return (
        <>
            <Navbar />

            <div className={styles.messRoot} ref={messRef}>
                {/* HEADER */}
                <div className={styles.messHeader}>
                    <img
                        ref={leftRef}
                        src="/Screenshot 2026-01-25 171032.png"
                        alt="Mess"
                        className={styles.headerImg}
                    />
                    <div>
                        <h1>Mess Management</h1>
                        <p>Control weekly menu, polls & demand</p>
                    </div>
                </div>

                {/* WEEKLY MENU */}
                <div className={`${styles.card} ${styles.glass} row-section ${visible ? styles.fadeIn : ""}`}>
                    <h2>Weekly Menu</h2>

                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Breakfast</th>
                                    <th>Lunch</th>
                                    <th>Dinner</th>
                                    <th>Avg Rating</th>
                                </tr>
                            </thead>

                            <tbody>
                                {Object.entries(weekMenu).map(([day, meals]) => (
                                    <tr key={day}>
                                        <td>{day}</td>

                                        {["breakfast", "lunch", "dinner"].map(meal => (
                                            <td key={meal}>
                                                {editMode ? (
                                                    <input
                                                        value={meals[meal]}
                                                        onChange={e =>
                                                            handleMenuChange(day, meal, e.target.value)
                                                        }
                                                    />
                                                ) : (
                                                    meals[meal]
                                                )}
                                            </td>
                                        ))}

                                        <td>
                                            {ratingsByDay[day] ? (
                                                <div className={styles.ratingStars}>
                                                    {[...Array(Math.round(ratingsByDay[day]))].map((_, i) => (
                                                        <span key={i} className={`${styles.star} ${styles.filled}`}>★</span>
                                                    ))}
                                                    {[...Array(5 - Math.round(ratingsByDay[day]))].map((_, i) => (
                                                        <span key={i} className={styles.star}>★</span>
                                                    ))}
                                                    <span className={styles.ratingNum}>
                                                        ({ratingsByDay[day].toFixed(1)})
                                                    </span>
                                                </div>
                                            ) : (
                                                "No ratings"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.menuBtns}>
                        {editMode ? (
                            <button className={styles.saveBtn} onClick={saveMenu}>
                                Save Menu
                            </button>
                        ) : (
                            <button className={styles.editBtn} onClick={() => setEditMode(true)}>
                                Edit Menu
                            </button>
                        )}
                    </div>
                </div>

                {/* POLL SET */}
                <div className={`${styles.card} ${styles.glass} row-section ${visible ? styles.fadeIn : ""}`}>
                    <h2>Set Tomorrow’s Poll</h2>

                    <input
                        className={styles.input}
                        placeholder="Comma separated dishes"
                        value={pollInput}
                        onChange={e => setPollInput(e.target.value)}
                    />

                    <button
                        className={styles.saveBtn}
                        onClick={async () => {
                            const options = pollInput.split(",").map(o => o.trim()).filter(Boolean);
                            await axios.post(`${API}/warden/poll`, { options });
                            alert("Poll updated!");
                            setPollInput("");
                        }}
                    >
                        Update Poll
                    </button>
                </div>

                {/* POLL RESULTS */}
                <div className={`${styles.card} ${styles.glass} row-section ${visible ? styles.fadeIn : ""}`}>
                    <h2>Poll Results</h2>

                    <div className={styles.pollResults}>
                        {Object.entries(pollResults).map(([dish, count]) => (
                            <div key={dish} className={styles.pollRow}>
                                <span>{dish}</span>
                                <span>{count} votes</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DEMAND */}
                <div className={`${styles.card} ${styles.glass} row-section ${visible ? styles.fadeIn : ""}`}>
                    <h2>Demand Box</h2>

                    <ul className={styles.demandList}>
                        {demandSummary.map((d, i) => (
                            <li key={i}>{d}</li>
                        ))}
                    </ul>
                </div>

                {/* RESET */}
                <button className={styles.resetBtn} onClick={resetPollAndDemand}>
                    Reset Poll & Demand
                </button>
            </div>
        </>
    );
}

export default Mess;

