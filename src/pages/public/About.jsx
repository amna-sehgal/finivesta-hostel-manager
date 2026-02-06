import { useEffect } from "react";
import styles from "./About.module.css";
import { FaUsers, FaShieldAlt, FaRobot, FaBolt } from "react-icons/fa";

export default function About() {

  useEffect(() => {
    const els = document.querySelectorAll(`.${styles.reveal}`);
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add(styles.show);
        }
      });
    },{threshold:0.15});

    els.forEach(el=>observer.observe(el));
  },[]);

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={`${styles.hero} ${styles.reveal}`}>
        <h1>Redefining Hostel Management</h1>
        <p>
          A calm, modern system built for students and wardens to manage hostel
          life effortlessly.
        </p>
        <div className={styles.heroGlow}></div>
      </section>

      {/* STORY TIMELINE */}
      <section className={styles.timelineSection}>

        <div className={`${styles.timelineCard} ${styles.reveal}`}>
          <h2>The Problem</h2>
          <p>
            Notices on paper. Complaints lost. Outpass chaos.  
            Hostel management still runs on outdated systems.
          </p>
        </div>

        <div className={`${styles.timelineCard} ${styles.reveal}`}>
          <h2>The Idea</h2>
          <p>
            What if students and wardens had one unified platform?
            Clean dashboards. Clear communication. Smart tracking.
          </p>
        </div>

        <div className={`${styles.timelineCard} ${styles.reveal}`}>
          <h2>The Product</h2>
          <p>
            A dual-portal hostel management system with automation,
            safety features and AI-powered assistance.
          </p>
        </div>

      </section>

      {/* STATS */}
      <section className={`${styles.statsSection} ${styles.reveal}`}>
        <div className={styles.stat}>
          <FaUsers/>
          <h3>2 Portals</h3>
          <p>Student & Warden</p>
        </div>

        <div className={styles.stat}>
          <FaShieldAlt/>
          <h3>Safety First</h3>
          <p>SOS + approvals</p>
        </div>

        <div className={styles.stat}>
          <FaBolt/>
          <h3>Automation</h3>
          <p>Complaints & notices</p>
        </div>

        <div className={styles.stat}>
          <FaRobot/>
          <h3>AI Ready</h3>
          <p>Smart prioritisation</p>
        </div>
      </section>

      {/* VISION */}
      <section className={`${styles.vision} ${styles.reveal}`}>
        <h2>Our Vision</h2>
        <p>
          To make hostels smarter, safer and more organised using
          automation, real-time communication and AI.
        </p>
      </section>

      {/* FUTURE */}
      <section className={`${styles.future} ${styles.reveal}`}>
        <h2>What’s coming next</h2>

        <div className={styles.futureGrid}>
          <div className={styles.futureCard}>
            <h3>AI Issue Priority</h3>
            <p>Water issues ranked above minor repairs automatically.</p>
          </div>

          <div className={styles.futureCard}>
            <h3>Warden AI Assistant</h3>
            <p>Chatbot for handling student queries and complaints.</p>
          </div>

          <div className={styles.futureCard}>
            <h3>Smart Analytics</h3>
            <p>Usage insights and hostel activity tracking.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
