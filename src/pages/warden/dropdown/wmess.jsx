import "./wmess.css";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Navbar from "../wnavbar";
import axios from "axios";

function Mess() {
    const messRef = useRef();
    const leftRef = useRef();

    const [weekMenu, setWeekMenu] = useState({});
    const [pollResults, setPollResults] = useState({});
    const [demandSummary, setDemandSummary] = useState([]);
    const [ratingsByDay, setRatingsByDay] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [pollInput, setPollInput] = useState("");


    useEffect(() => {
        gsap.from(leftRef.current, { x: -60, duration: 0.8 });
        gsap.from(".row-section", { y: 40, stagger: 0.15 });
        fetchWardenData();
    }, []);

    const fetchWardenData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/mess/warden");
            setWeekMenu(res.data.weekMenu);
            setPollResults(res.data.pollResults);
            setDemandSummary(res.data.demandSummary);
            setRatingsByDay(res.data.ratingsByDay);
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
            await axios.post(
                "http://localhost:5000/api/mess/warden/menu",
                { weeklyMenu: weekMenu }
            );
            alert("Weekly menu updated successfully!");
            setEditMode(false);
        } catch (err) {
            console.error(err);
            alert("Error updating menu!");
        }
    };

    // 🔴 RESET POLL + DEMAND
    const resetPollAndDemand = async () => {
        console.log("RESET BUTTON CLICKED");
        if (!window.confirm("Clear poll results and demand box for next day?")) return;

        try {
            await axios.post("http://localhost:5000/api/mess/warden/reset");
            alert("Poll and demand box reset successfully!");
            fetchWardenData();
        } catch (err) {
            console.error(err);
            alert("Error resetting data");
        }
    };

    return (
        <>
            <Navbar />

            <div className="mess-container" ref={messRef}>
                {/* Top Branding */}
                <div className="mess-top">
                    <div className="mess-branding-row">
                        <img
                            ref={leftRef}
                            className="mess-img"
                            src="/Screenshot 2026-01-25 171032.png"
                            alt="Mess"
                        />
                        <div className="mess-header-block">
                            <h1 className="mess-tagline">
                                Because You Deserve Homemade Happiness.
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="mess-bottom-rows">

                    {/* Weekly Menu */}
                    <section className="row-section menu-box">
                        <h2>📅 Weekly Menu</h2>

                        <table className="mess-table">
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
                                                        type="text"
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
                                                <>
                                                    {[...Array(Math.round(ratingsByDay[day]))].map((_, i) => (
                                                        <span key={i} className="star filled">★</span>
                                                    ))}
                                                    {[...Array(5 - Math.round(ratingsByDay[day]))].map((_, i) => (
                                                        <span key={i} className="star">★</span>
                                                    ))}
                                                    <span> ({ratingsByDay[day].toFixed(1)})</span>
                                                </>
                                            ) : (
                                                "No ratings"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ marginTop: "15px" }}>
                            {editMode ? (
                                <button type="button" className="save-btn" onClick={saveMenu}>
                                    Save Menu
                                </button>
                            ) : (
                                <button type="button" className="edit-btn" onClick={() => setEditMode(true)}>
                                    Edit Menu
                                </button>
                            )}
                        </div>
                    </section>
                    <section className="row-section poll-box">
                        <h2>🗳️ Set Tomorrow’s Poll</h2>

                        <input
                            type="text"
                            placeholder="Comma separated dishes (e.g. Momos, Pasta, Rajma Chawal)"
                            value={pollInput}
                            onChange={e => setPollInput(e.target.value)}
                        />

                        <button
                            type="button"
                            className="save-btn"
                            onClick={async () => {
                                const options = pollInput.split(",").map(o => o.trim()).filter(Boolean);
                                await axios.post("http://localhost:5000/api/mess/warden/poll", { options });
                                alert("Poll options updated!");
                                setPollInput("");
                            }}
                        >
                            Update Poll
                        </button>
                    </section>


                    {/* Poll Results */}
                    <section className="row-section poll-box">
                        <h2>📊 Poll Results</h2>
                        {Object.entries(pollResults).map(([dish, count]) => (
                            <p key={dish}>{dish}: {count} votes</p>
                        ))}
                    </section>

                    {/* Demand Box */}
                    <section className="row-section demand-box">
                        <h2>💡 Demand Box</h2>
                        <ul>
                            {demandSummary.map((d, i) => (
                                <li key={i}>{d}</li>
                            ))}
                        </ul>
                    </section>

                    {/* 🔴 RESET BUTTON */}
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <button type="button" className="reset-btn" onClick={resetPollAndDemand}>
                            Reset Poll & Demand Box
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Mess;

