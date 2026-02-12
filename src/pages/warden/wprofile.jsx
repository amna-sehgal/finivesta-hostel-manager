import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import Navbar from "./wnavbar.jsx";
import styles from "./wprofile.module.css";

const Profile = () => {
  const comp = useRef(null);
  const [warden, setWarden] = useState(null);

  useEffect(() => {
    const storedWarden = localStorage.getItem("warden");
    if (storedWarden) setWarden(JSON.parse(storedWarden));
  }, []);

  useEffect(() => {
    if (!warden) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(`.${styles.glassCard}`, { opacity: 0, y: 80, duration: 1 })
        .from(`.${styles.profilePicContainer}`, { scale: 0, duration: 0.6 }, "-=0.5")
        .from(`.${styles.reveal}`, { opacity: 0, y: 20, stagger: 0.1 }, "-=0.4")
        .from(`.${styles.statItem}`, { opacity: 0, y: 20, stagger: 0.1 }, "-=0.3")
        .from(`.${styles.actionTile}`, { scale: 0.9, opacity: 0, stagger: 0.08 }, "-=0.3");
    }, comp);

    return () => ctx.revert();
  }, [warden]);

  if (!warden) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className={styles.wrapper} ref={comp}>
        <div className={styles.glassCard}>

          {/* HEADER */}
          <div className={styles.header}>
            <div className={styles.profilePicContainer}>
              <img
                src={warden.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
                className={styles.profilePic}
              />
              <div className={styles.activeGlow}></div>
            </div>

            <div>
              <h1 className={styles.reveal}>{warden.fullName}</h1>
              <p className={`${styles.subtitle} ${styles.reveal}`}>
                Administrator • {warden.hostel}
              </p>

              <div className={`${styles.detailRow} ${styles.reveal}`}>
                {warden.email && (
                  <div className={styles.detailItem}>
                    <FaEnvelope /> {warden.email}
                  </div>
                )}
                {warden.phone && (
                  <div className={styles.detailItem}>
                    <FaPhone /> {warden.phone}
                  </div>
                )}
              </div>

              <div className={`${styles.badges} ${styles.reveal}`}>
                <span>Warden</span>
                <span>Safety Certified</span>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span>{warden.totalStudents || 420}</span>
              <p>Students</p>
            </div>
            <div className={styles.statItem}>
              <span>{warden.pendingLeaves || 15}</span>
              <p>Pending Leaves</p>
            </div>
            <div className={styles.statItem}>
              <span>{warden.complaints || 3}</span>
              <p>Complaints</p>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className={`${styles.performance} ${styles.reveal}`}>
            <div className={styles.perfTop}>
              <span>Discipline Score</span>
              <span>{warden.disciplineScore || 92}%</span>
            </div>

            <div className={styles.barBg}>
              <div
                className={styles.barFill}
                style={{ width: `${warden.disciplineScore || 92}%` }}
              ></div>
            </div>
          </div>

          {/* ACTIONS */}
          <div>
            <h3 className={styles.reveal}>Management Center</h3>

            <div className={styles.actionsGrid}>
              <div className={styles.actionTile}>📢 Broadcast</div>
              <div className={styles.actionTile}>📝 Reports</div>
              <div className={styles.actionTile}>🛠 Maintenance</div>
              <div className={styles.actionTile}>⚙ Settings</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;


