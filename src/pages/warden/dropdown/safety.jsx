import { useEffect, useState } from "react";
import "./Safety.css";
import Navbar from "../wnavbar";

const Safety = () => {
    const [alerts, setAlerts] = useState([]);
    const [selected, setSelected] = useState(null);

    /* ---------- FETCH SOS ALERTS ---------- */
    useEffect(() => {
        fetch("http://localhost:5000/api/sos/active")
            .then(res => res.json())
            .then(data => setAlerts(data))
            .catch(err => console.error(err));
    }, []);

    const handleOpenAlert = (alert) => {
        setSelected(alert);
    };

    const handleResolve = async () => {
        if (!selected) return;

        try {
            await fetch(`http://localhost:5000/api/sos/${selected.id}`, {
                method: "PATCH",
            });

            // remove from list
            setAlerts(prev => prev.filter(a => a.id !== selected.id));

            // clear details panel
            setSelected(null);
        } catch (err) {
            console.error(err);
            alert("Failed to resolve SOS");
        }
    };



    return (
        <>
            <Navbar />

            <div className="safety-container">
                <h1>🚨 Emergency Alerts</h1>

                <div className="safety-layout">
                    {/* LEFT: ALERT LIST */}
                    <div className="alert-list">
                        {alerts.length === 0 ? (
                            <p>No emergency alerts</p>
                        ) : (
                            alerts.map(alert => (
                                <div
                                    key={alert.id}
                                    className={`alert-card ${alert.status === "active" ? "new" : ""}`}
                                    onClick={() => handleOpenAlert(alert)}
                                >
                                    <strong>{alert.issue}</strong>
                                    <p>Room {alert.roomNumber}</p>
                                    <small>{new Date(alert.createdAt).toLocaleString()}</small>
                                </div>
                            ))

                        )}
                    </div>

                    {/* RIGHT: ALERT DETAILS */}
                    <div className="alert-details">
                        {selected ? (
                            <>
                                <h2>{selected.issue} Emergency</h2>
                                <p><strong>Student:</strong> {selected.studentName}</p>
                                <p><strong>Room:</strong> {selected.roomNumber}</p>
                                <p><strong>Message:</strong></p>

                                <div className="alert-message">
                                    {selected.message}
                                </div>

                                <button
                                    className="resolve-btn"
                                    onClick={handleResolve}
                                    style={{ marginTop: "16px" }}
                                >
                                    Resolved
                                </button>
                            </>
                        ) : (
                            <p>Select an alert to view details</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Safety;
