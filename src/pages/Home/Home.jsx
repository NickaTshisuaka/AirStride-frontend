import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import "./Home.css";

/**
 * Home.jsx - cleaned & fixed version
 *
 * Fixes applied:
 *  - REMOVED manual wheel scrolling (was interfering with browser native scroll and Framer Motion).
 *  - useScroll now targets containerRef (correctly) and its value is smoothed with useSpring.
 *  - All animated elements use motion.* consistently.
 *  - Added small accessibility attributes and responsive sizing.
 */

const Home = () => {
  const containerRef = useRef(null);

  // useScroll watches the window scroll relative to a target ref (the full page container).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the raw progress value for visual polish.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const heroWords = ["UNLEASH", "YOUR", "POWER"];

  return (
    <div className="home-scroll-container" ref={containerRef}>
      {/* HERO */}
      <section className="hero-section" aria-label="Hero">
        <div className="hero-bg" aria-hidden>
          <video
            className="hero-video"
            src="/video1.mp4" 
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="hero-overlay" />
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1 className="hero-title" aria-label="Main headline">
            {heroWords.map((word, i) => (
              <motion.div
                key={word}
                className="hero-word"
                initial={{ opacity: 0, y: 80, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.4 + i * 0.14, duration: 0.7 }}
              >
                {word.split("").map((char, j) => (
                  <motion.span
                    key={`${word}-${j}`}
                    className="hero-char"
                    whileHover={{ y: -8, scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            ))}
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Premium sports gear that pushes you beyond your limits
          </motion.p>

          <motion.button
            className="hero-cta"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, type: "spring", stiffness: 220, damping: 18 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/products")}
            aria-label="Shop now"
          >
            Shop Now
          </motion.button>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-hidden
        >
          <span>↓</span>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="stats-section" aria-labelledby="stats-heading">
        <div className="stats-container">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="stat-number">50K+</div>
            <div className="stat-label">Athletes Trust Us</div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.16 }}
          >
            <div className="stat-number">200+</div>
            <div className="stat-label">Premium Products</div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.32 }}
          >
            <div className="stat-number">15</div>
            <div className="stat-label">Countries Worldwide</div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" aria-labelledby="features-heading">
        <div
          className="features-bg"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=80)",
          }}
          aria-hidden
        />
        <div className="features-overlay" />

        <div className="features-content">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            TRAIN LIKE A PRO
          </motion.h2>

          <div className="features-grid">
            {[
              { title: "Performance Tracking", desc: "Monitor every metric that matters" },
              { title: "Advanced Materials", desc: "Engineered for peak performance" },
              { title: "Pro Durability", desc: "Built to withstand your toughest sessions" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.14, duration: 0.6 }}
                whileHover={{ scale: 1.03, x: 6 }}
              >
                <div className="feature-icon">→</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOVERY */}
      <section className="recovery-section" aria-labelledby="recovery-heading">
        <div
          className="recovery-bg"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=2000&q=80)",
          }}
          aria-hidden
        />
        <div className="recovery-overlay" />

        <div className="recovery-content">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            RECOVER STRONGER
          </motion.h2>

          <motion.p
            className="section-description"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Your body is your temple. Our recovery gear helps you bounce back faster and stronger than ever.
          </motion.p>

          <div className="recovery-features">
            {["Muscle Recovery", "Injury Prevention", "Peak Performance"].map((item, i) => (
              <motion.div
                key={item}
                className="recovery-item"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 + i * 0.12, duration: 0.5 }}
                whileHover={{ scale: 1.07 }}
              >
                <span className="check-icon">✓</span>
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="community-section" aria-labelledby="community-heading">
        <div
          className="community-bg"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80)",
          }}
          aria-hidden
        />
        <div className="community-overlay" />

        <div className="community-content">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            JOIN THE ELITE
          </motion.h2>

          <motion.p
            className="section-description"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.7 }}
          >
            Be part of something bigger. Connect with athletes worldwide who share your passion and drive.
          </motion.p>

          <motion.button
            className="community-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => (window.location.href = "/signup")}
          >
            Start Your Journey
          </motion.button>
        </div>
      </section>

      {/* Scroll progress (smoothed) */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX: smoothProgress }}
        aria-hidden
      />
    </div>
  );
};

export default Home;
