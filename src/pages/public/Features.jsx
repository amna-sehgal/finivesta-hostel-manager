import { useEffect } from "react";
import styles from "./Features.module.css";
import {
  FaUserGraduate,
  FaUserShield,
  FaUtensils,
  FaTshirt,
  FaBell,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaRobot,
  FaBed,
  FaComments,
  FaWallet,
} from "react-icons/fa";

export default function Features() {

  // scroll reveal
  useEffect(() => {
    const elements = document.querySelectorAll(`.${styles.reveal}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={`${styles.hero} ${styles.reveal}`}>
        <h1>Everything needed to run a modern hostel</h1>
        <p>
          Dual portals, smart complaint tracking, budgeting tools,
          and AI-powered assistance — all in one platform.
        </p>
      </section>

      {/* PORTALS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Two Powerful Portals</h2>

        <div className={styles.portalGrid}>

          <div className={`${styles.card} ${styles.reveal}`}>
            <FaUserGraduate className={styles.icon}/>
            <h3>Student Portal</h3>
            <ul>
              <li>Dashboard & profile</li>
              <li>Mess menu tracking</li>
              <li>Laundry updates</li>
              <li>Outpass requests</li>
              <li>Roommate expense split</li>
              <li>Monthly budget manager</li>
              <li>Raise complaints</li>
              <li>SOS emergency button</li>
            </ul>
          </div>

          <div className={`${styles.card} ${styles.reveal}`}>
            <FaUserShield className={styles.icon}/>
            <h3>Warden Portal</h3>
            <ul>
              <li>Complaint dashboard</li>
              <li>Outpass approvals</li>
              <li>Notice system</li>
              <li>Student records</li>
              <li>Emergency alerts</li>
              <li>Activity tracking</li>
              <li>Analytics overview</li>
            </ul>
          </div>

        </div>
      </section>

      {/* CORE FEATURES */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Core Features</h2>

        <div className={styles.grid}>

          <Feature icon={<FaUtensils />} title="Mess Management" />
          <Feature icon={<FaTshirt />} title="Laundry Tracking" />
          <Feature icon={<FaBell />} title="Notices & Notifications" />
          <Feature icon={<FaMoneyBillWave />} title="Expense Sharing" />
          <Feature icon={<FaBed />} title="Outpass System" />
          <Feature icon={<FaComments />} title="Complaint System" />
          <Feature icon={<FaExclamationTriangle />} title="SOS Emergency" />
          <Feature icon={<FaWallet />} title="Monthly Budget Manager" />

        </div>
      </section>

      {/* AI SECTION */}
      <section className={`${styles.aiSection} ${styles.reveal}`}>
        <h2>AI-Powered Features</h2>

        <div className={styles.aiGrid}>
          <div className={styles.aiCard}>
            <FaRobot className={styles.aiIcon}/>
            <h3>AI Issue Priority</h3>
            <p>
              Urgent issues like water failure get higher priority than minor
              issues automatically.
            </p>
          </div>

          <div className={styles.aiCard}>
            <FaRobot className={styles.aiIcon}/>
            <h3>Warden Chatbot</h3>
            <p>
              Smart assistant to help manage queries, complaints and student data.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div className={`${styles.cardSmall} ${styles.reveal}`}>
      <div className={styles.icon}>{icon}</div>
      <h3>{title}</h3>
    </div>
  );
}
