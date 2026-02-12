import { useEffect, useState } from "react";
import styles from "./safety.module.css";
import Navbar from "../wnavbar";

const Safety = () => {
    const [alerts, setAlerts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);

    /* ---------- FETCH SOS ALERTS ---------- */
    useEffect(() => {
        setTimeout(() => setVisible(true), 200);

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

            setAlerts(prev => prev.filter(a => a.id !== selected.id));
            setSelected(null);
        } catch (err) {
            console.error(err);
            alert("Failed to resolve SOS");
        }
    };

    return (
        <>
            <Navbar />

            <div className={styles.root}>
                {/* HEADER */}
                <div className={styles.header}>
                    <div className={styles.headerIcon}>🚨</div>
                    <div>
                        <h1>Emergency Alerts</h1>
                        <p>Active SOS requests from students</p>
                    </div>
                </div>

                <div className={`${styles.layout} ${visible ? styles.fadeIn : ""}`}>
                    
                    {/* LEFT LIST */}
                    <div className={`${styles.listCard} ${styles.glass}`}>
                        <h2>Active Alerts</h2>

                        {alerts.length === 0 ? (
                            <p className={styles.muted}>No emergency alerts</p>
                        ) : (
                            alerts.map(alert => (
                                <div
                                    key={alert.id}
                                    className={`${styles.alertItem} ${selected?.id === alert.id ? styles.active : ""}`}
                                    onClick={() => handleOpenAlert(alert)}
                                >
                                    <strong>{alert.issue}</strong>
                                    <p>Room {alert.roomNumber}</p>
                                    <span>
                                        {new Date(alert.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* RIGHT DETAILS */}
                    <div className={`${styles.detailsCard} ${styles.glass}`}>
                        {selected ? (
                            <>
                                <h2>{selected.issue} Emergency</h2>

                                <div className={styles.infoRow}>
                                    <span>Student</span>
                                    <p>{selected.studentName}</p>
                                </div>

                                <div className={styles.infoRow}>
                                    <span>Room</span>
                                    <p>{selected.roomNumber}</p>
                                </div>

                                <div className={styles.messageBox}>
                                    {selected.message}
                                </div>

                                <button
                                    className={styles.resolveBtn}
                                    onClick={handleResolve}
                                >
                                    Mark as Resolved
                                </button>
                            </>
                        ) : (
                            <p className={styles.mutedCenter}>
                                Select an alert to view details
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Safety;

