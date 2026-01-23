import './wmess.css';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../wnavbar';

function Mess() {
    const messRef = useRef();
    const leftRef = useRef();
    const rightRef = useRef();

    useEffect(() => {
        gsap.from(leftRef.current, {
            x: -60,
            duration: 0.8,
            ease: 'power3.out',
        });
        gsap.from('.mess-tagline', {
            y: 30,
            duration: 0.7,
            delay: 0.5,
            ease: 'power2.out',
        });
        gsap.from('.row-section', {
            y: 40,
            duration: 0.7,
            stagger: 0.15,
            delay: 0.7,
            ease: 'power2.out',
        });
    }, []);

    const rating = 3;
    const weekMenu = {
        Monday: { breakfast: 'Poha 🥣', lunch: 'Dal Rice 🍛', snacks: 'Samosa 🥟', dinner: 'Paneer Butter Masala 🥘' },
        Tuesday: { breakfast: 'Idli ⚪', lunch: 'Rajma Rice 🍛', snacks: 'Pakora ☕', dinner: 'Chole Bhature 🥯' },
        Wednesday: { breakfast: 'Paratha 🫓', lunch: 'Kadhi Chawal 🍚', snacks: 'Bhel 🥗', dinner: 'Aloo Gobi 🥦' },
        Thursday: { breakfast: 'Upma 🍛', lunch: 'Sambar Rice 🥣', snacks: 'Cutlet 🍘', dinner: 'Veg Biryani 🍚' },
        Friday: { breakfast: 'Dosa 🥞', lunch: 'Dal Makhani 🍲', snacks: 'Bread Roll 🥖', dinner: 'Mix Veg 🥗' },
        Saturday: { breakfast: 'Chole Kulche 🥯', lunch: 'Paneer Rice 🍚', snacks: 'Kachori 🥐', dinner: 'Malai Kofta 🍲' },
        Sunday: { breakfast: 'Aloo Puri 🥘', lunch: 'Jeera Rice 🍚', snacks: 'Pastry 🍰', dinner: 'Shahi Paneer 🧀' },
    };

    const poll = [
        { item: 'Kadhi Chawal', dislikes: 12 },
        { item: 'Aloo Gobi', dislikes: 8 },
        { item: 'Upma', dislikes: 5 },
        { item: 'Mix Veg', dislikes: 3 },
    ];

    const demandSummary = [
        'More fruit options for breakfast',
        'Less oil in curries',
        'Add ice cream on Sundays',
        'Include more South Indian dishes',
        'Spicy food on Fridays',
    ];

    return (
        <>
        <Navbar/>
            <div className="mess-container" ref={messRef}>
                <div className="mess-top">
                    <div className="mess-branding-row">
                        <img
                            ref={leftRef}
                            className="mess-img"
                            src="https://t3.ftcdn.net/jpg/05/88/38/88/360_F_588388858_dQCgiLncb8Yijqial32JuXjD8fNcxNNM.jpg"
                            alt="Mess Food"
                        />
                        <div className="mess-header-block">
                            <h1 className="mess-tagline">Because You Deserve Homemade Happiness.</h1>
                            <div className="mess-rating-section">
                                <span className="rating-label">This Week's Rating</span>
                                <div className="mess-stars">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mess-bottom-rows">
                    <section className="row-section menu-box">
                        <h2 className="section-title">📅 Weekly Menu</h2>
                        <div className="table-wrapper">
                            <table className="mess-table">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Breakfast</th>
                                        <th>Lunch</th>
                                        <th>Snacks</th>
                                        <th>Dinner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(weekMenu).map(([day, meals]) => (
                                        <tr key={day}>
                                            <td><strong>{day}</strong></td>
                                            <td>{meals.breakfast}</td>
                                            <td>{meals.lunch}</td>
                                            <td>{meals.snacks}</td>
                                            <td>{meals.dinner}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="row-section poll-box">
                        <h2 className="section-title">📊 Menu Poll (Least Liked Dishes)</h2>
                        <div className="poll-list">
                            {poll.map(item => (
                                <div key={item.item} className="poll-item">
                                    <span className="poll-dish">{item.item}</span>
                                    <div className="bar-bg">
                                        <div className="bar-fill" style={{ width: `${item.dislikes * 5}%` }}></div>
                                    </div>
                                    <span className="poll-count">{item.dislikes} dislikes 👎</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="row-section demand-box">
                        <h2 className="section-title">💡 Demand Box (Student Suggestions)</h2>
                        <ul className="demand-list">
                            {demandSummary.map((demand, idx) => (
                                <li key={idx} className="demand-item">{demand}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Mess;