import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useAnimationFrame, useTransform } from "motion/react";
import { gsap } from "gsap";
import { FaRegClipboard, FaUtensils, FaIdCard, FaTshirt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

/* ───────── SCROLL REVEAL (FIXED FOR CSS MODULES) ───────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const cards = el.querySelectorAll("[data-animate]");

        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add(styles.animate), i * 120);
          });
        } else {
          cards.forEach((card) => card.classList.remove(styles.animate));
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll("[data-section]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
}



// ─────────────────────────────────────────────
// 1.  GRADIENT TEXT  (animated shifting gradient)
// ─────────────────────────────────────────────
function GradientText({
  children,
  className = "",
  colors = ["#38bdf8", "#a78bfa", "#f472b6"],
  animationSpeed = 6,
  direction = "horizontal",
}) {
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const animationDuration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += delta;

    // yoyo
    const fullCycle = animationDuration * 2;
    const cycleTime = elapsedRef.current % fullCycle;
    progress.set(
      cycleTime < animationDuration
        ? (cycleTime / animationDuration) * 100
        : 100 - ((cycleTime - animationDuration) / animationDuration) * 100
    );
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, progress]);

  const backgroundPosition = useTransform(progress, (p) =>
    direction === "horizontal" ? `${p}% 50%` : `50% ${p}%`
  );

  const gradientAngle = direction === "horizontal" ? "to right" : "to bottom";
  const gradientColors = [...colors, colors[0]].join(", ");

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: "300% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <motion.div className={styles.gradientTextWrapper + " " + className}>
      <motion.div style={{ ...gradientStyle, backgroundPosition }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 2.  TYPING EFFECT  (gsap cursor blink)
// ─────────────────────────────────────────────
function TextType({
  text,
  typingSpeed = 55,
  pauseDuration = 1800,
  deletingSpeed = 28,
  loop = true,
  className = "",
  cursorCharacter = "|",
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const cursorRef = useRef(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  // cursor blink
  useEffect(() => {
    if (cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }
  }, []);

  // typing / deleting logic
  useEffect(() => {
    let timeout;
    const current = textArray[textIndex];

    if (isDeleting) {
      if (displayedText === "") {
        setIsDeleting(false);
        if (textIndex === textArray.length - 1 && !loop) return;
        setTextIndex((p) => (p + 1) % textArray.length);
        setCharIndex(0);
        timeout = setTimeout(() => { }, pauseDuration);
      } else {
        timeout = setTimeout(
          () => setDisplayedText((p) => p.slice(0, -1)),
          deletingSpeed
        );
      }
    } else {
      if (charIndex < current.length) {
        timeout = setTimeout(() => {
          setDisplayedText((p) => p + current[charIndex]);
          setCharIndex((p) => p + 1);
        }, typingSpeed);
      } else {
        if (!loop && textIndex === textArray.length - 1) return;
        timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, displayedText, isDeleting, textIndex, textArray, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={styles.textType + " " + className}>
      <span className={styles.textTypeContent}>{displayedText}</span>
      <span ref={cursorRef} className={styles.textTypeCursor}>
        {cursorCharacter}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────
// 3.  IMAGE CAROUSEL  (auto-play, drag)
// ─────────────────────────────────────────────
const CAROUSEL_IMAGES = [
  { id: 1, src: "/Screenshot 2026-02-06 172432.png", alt: "Hostel room" },
  { id: 2, src: "/Screenshot 2026-02-06 172510.png", alt: "Common area" },
  { id: 3, src: "/Screenshot 2026-02-06 172532.png", alt: "Mess hall" },
  { id: 4, src: "/Screenshot 2026-02-06 172556.png", alt: "Campus view" },
];

function ImageCarousel() {
  const [active, setActive] = useState(0);
  const total = CAROUSEL_IMAGES.length;

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % total), 3200);
    return () => clearInterval(t);
  }, [total]);

  return (
    <div className={styles.carouselRoot}>
      <div className={styles.carouselViewport}>
        {CAROUSEL_IMAGES.map((img, i) => (
          <div
            key={img.id}
            className={styles.carouselSlide}
            style={{
              transform: `translateX(${(i - active) * 100}%)`,
              transition: "transform .6s cubic-bezier(.4,0,.2,1)"
            }}
          >
            <img src={img.src} alt={img.alt} className={styles.carouselImg} />
          </div>
        ))}
      </div>

      {/* dots */}
      <div className={styles.carouselDots}>
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`${styles.carouselDot} ${i === active ? styles.active : ""}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>

      {/* arrows FIXED */}
      <button
        className={`${styles.carouselArrow} ${styles.left}`}
        onClick={() => setActive((p) => (p - 1 + total) % total)}
      >
        ‹
      </button>

      <button
        className={`${styles.carouselArrow} ${styles.right}`}
        onClick={() => setActive((p) => (p + 1) % total)}
      >
        ›
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4.  HOME  (main page – layout only, no logic change)
// ─────────────────────────────────────────────
const TAGLINES = [
  "Your ultimate hostel companion",
  "Track complaints & outpasses easily",
  "Stay updated with hostel life",
  "Experience hassle-free living",
];

const STEPS = [
  { number: "01", title: "Sign Up", desc: "Register as a student or warden in seconds." },
  { number: "02", title: "Set Up", desc: "Link your hostel and fill in your profile details." },
  { number: "03", title: "Stay Sorted", desc: "Manage complaints, outpasses, mess & laundry — all in one place." },
];

const FEATURES = [
  { Icon: FaRegClipboard, label: "Complaints", desc: "Raise & track complaints instantly." },
  { Icon: FaUtensils, label: "Mess & Food", desc: "Rate meals, view the daily menu." },
  { Icon: FaIdCard, label: "Outpasses", desc: "Apply and get approvals digitally." },
  { Icon: FaTshirt, label: "Laundry", desc: "Schedule & track your laundry requests." },
];

export default function Home() {
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);

  useScrollReveal();

  const handleGetStarted = () => {
    const student = localStorage.getItem("student");
    const warden = localStorage.getItem("warden");
    if (student) {
      navigate("/student/dashboard");
    } else if (warden) {
      navigate("/warden/dashboard");
    } else {
      localStorage.removeItem("student");
      localStorage.removeItem("warden");
      setShowRoleModal(true);
    }
  };

  return (
    <div className={styles.homeRoot}>
      {/* ── TOP NAV ── */}
      <nav className={styles.topNav}>
        <span className={styles.navLogo}>STAYMATE</span>
        <div className={styles.navLinks}>
          <a onClick={() => navigate("/features")}>Features</a>
          <a onClick={() => navigate("/about")}>About</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroLeft}>
          <GradientText className={styles.heroHeading}>STAYMATE</GradientText>

          <div className={styles.heroSubheading}>
            <TextType text={TAGLINES} typingSpeed={52} deletingSpeed={26} pauseDuration={1600} />
          </div>

          <p className={styles.heroDesc}>
            An all-in-one platform for students & wardens to manage hostel life
            — complaints, outpasses, mess ratings and more.
          </p>

          {/* 3 buttons – same nav targets */}
          <div className={styles.heroButtons}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleGetStarted}>
              Get Started
            </button>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => navigate("/student/signup")}>
              Register as Student
            </button>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => navigate("/warden/register")}>
              Register as Warden
            </button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <ImageCarousel />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.stepsSection} data-section>
        <h2 className={styles.sectionLabel}>How It Works</h2>
        <div className={styles.stepsRow}>
          {STEPS.map((s) => (
            <div key={s.number} className={styles.stepCard} data-animate>
              <span className={styles.stepNumber}>{s.number}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      {/* ── PRODUCT SHOWCASE ── */}
      <section className={styles.productSection} data-section>
        <h2 className={styles.sectionLabel}>Built for Real Hostel Life</h2>

        <div className={styles.productGrid}>
          <div className={styles.productCard} data-animate>
            <h3>All-in-one dashboard</h3>
            <p>
              Track complaints, outpasses, mess updates and laundry — everything from
              a single clean dashboard designed for speed and clarity.
            </p>
          </div>

          <div className={styles.productCard} data-animate>
            <h3>Instant updates</h3>
            <p>
              Get real-time notifications when your complaint is resolved, outpass is
              approved, or mess feedback changes.
            </p>
          </div>

          <div className={styles.productCard} data-animate>
            <h3>For students & wardens</h3>
            <p>
              A unified system that reduces chaos, saves time, and keeps hostel life
              running smoothly for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF / WHY ── */}
      <section className={styles.whySection} data-section>
        <h2 className={styles.sectionLabel}>Why Students Love Staymate</h2>

        <div className={styles.whyGrid}>
          <div className={styles.whyCard} data-animate>
            <span>⚡</span>
            <p>No more WhatsApp chaos</p>
          </div>

          <div className={styles.whyCard} data-animate>
            <span>📲</span>
            <p>Everything in one app</p>
          </div>

          <div className={styles.whyCard} data-animate>
            <span>🛠</span>
            <p>Faster complaint resolution</p>
          </div>

          <div className={styles.whyCard} data-animate>
            <span>🎓</span>
            <p>Made for modern hostels</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <h2>Ready to simplify hostel life?</h2>
        <p>Join students already using Staymate to stay organised.</p>

        <div className={styles.ctaButtons}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleGetStarted}>
            Get Started
          </button>

          <button
            className={`${styles.btn} ${styles.btnOutline}`}
            onClick={() => navigate("/student/signup")}
          >
            Create Student Account
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>STAYMATE</span>
        <p className={styles.footerCopy}>&copy; 2025 Staymate. All rights reserved.</p>
      </footer>

      {/* ── ROLE MODAL (unchanged behaviour) ── */}
      {showRoleModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRoleModal(false)}>
          <div className={styles.roleModal} onClick={(e) => e.stopPropagation()}>
            <h3>Continue as</h3>
            <button className={`${styles.modalBtn} ${styles.student}`} onClick={() => navigate("/student/login")}>
              Student
            </button>
            <button className={`${styles.modalBtn} ${styles.warden}`} onClick={() => navigate("/warden/login")}>
              Warden
            </button>
            <span className={styles.closeModal} onClick={() => setShowRoleModal(false)}>✕</span>
          </div>
        </div>
      )}
    </div>
  );
}