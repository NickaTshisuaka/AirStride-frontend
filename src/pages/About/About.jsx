import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaLightbulb, FaHeartbeat, FaRunning, FaUsers } from "react-icons/fa";
import "./About.css";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.7 } };
const fadeIn = { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.8 } };

export default function AboutPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  // Smooth parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !videoRef.current) return;

      const scrollY = window.scrollY;
      // Move video slightly slower than scroll
      videoRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="about-page">

      {/* HERO */}
      <header className="hero" ref={heroRef}>
        <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline>
          <source src="/videos/vid3.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <motion.div {...fadeUp} className="hero-inner" viewport={{ once: true }}>
          <h1>About AirStride</h1>
          <p className="subtitle">Helping joggers breathe better, run further, and live healthier.</p>
          <button className="hero-cta" onClick={() => navigate("/products")}>
            Explore Products
          </button>
        </motion.div>
      </header>

      {/* STORY */}
      <section className="story-section">
        <motion.div className="story-media" {...fadeIn} viewport={{ once: true }}>
          <img src="https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=950&q=80" alt="Runner breathing during a run" />
        </motion.div>

        <motion.article className="story-text" {...fadeUp} viewport={{ once: true }}>
          <h2>Our Story</h2>
          <p>
            AirStride began from a simple observation: many joggers struggle to find efficient,
            controlled breathing while running. We studied breathing patterns, airflow resistance,
            and endurance mechanics — then turned those insights into practical, wearable solutions.
          </p>
          <p>
            What started as a small research project evolved into a mission: to create breathing
            technology that helps athletes and everyday joggers breathe easier, run further, and
            feel stronger.
          </p>
          <button className="cta-btn" onClick={() => navigate("/products")}>Explore Products</button>
        </motion.article>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <h2 className="section-title">Our Values</h2>
        <div className="values-grid">
          <motion.div {...fadeUp} className="value-card" viewport={{ once: true }}>
            <FaLightbulb className="value-icon" />
            <h4>Innovation</h4>
            <p>Research-driven design and continuous iteration.</p>
          </motion.div>
          <motion.div {...fadeUp} className="value-card" transition={{ delay: 0.15 }} viewport={{ once: true }}>
            <FaHeartbeat className="value-icon" />
            <h4>Health</h4>
            <p>Prioritizing long-term breathing efficiency and wellbeing.</p>
          </motion.div>
          <motion.div {...fadeUp} className="value-card" transition={{ delay: 0.3 }} viewport={{ once: true }}>
            <FaRunning className="value-icon" />
            <h4>Performance</h4>
            <p>Empowering runners to go further and feel confident doing it.</p>
          </motion.div>
          <motion.div {...fadeUp} className="value-card" transition={{ delay: 0.45 }} viewport={{ once: true }}>
            <FaUsers className="value-icon" />
            <h4>Community</h4>
            <p>Supporting runners of all levels through education and product access.</p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="potential-section">
        <h2 className="section-title">Expanding Human Potential</h2>
        <p className="lead">We build tools that amplify human effort — combining empathy with technology to make every run feel easier.</p>

        <div className="potential-grid">
          <motion.div className="potential-item" {...fadeIn} viewport={{ once: true }}>
            <img src="/pic1.jpeg" alt="Research-backed" />
            <h4>Research-backed</h4>
            <p>Devices and training aids built on peer-reviewed breathing and endurance science.</p>
          </motion.div>
          <motion.div className="potential-item" {...fadeIn} transition={{ delay: 0.15 }} viewport={{ once: true }}>
            <img src="/group.jpeg" alt="Community-driven" />
            <h4>Community-driven</h4>
            <p>Programs and content that help runners practice breathing techniques safely.</p>
          </motion.div>
          <motion.div className="potential-item" {...fadeIn} transition={{ delay: 0.3 }} viewport={{ once: true }}>
            <img src="/pic2.jpeg" alt="Purpose-led" />
            <h4>Purpose-led</h4>
            <p>We measure success by real improvements in endurance and comfort.</p>
          </motion.div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section">
        <h2 className="section-title">Meet the Team</h2>
        <div className="team-grid">
          <motion.div className="team-card" {...fadeUp} viewport={{ once: true }}>
            <div className="team-img-wrap"><img src="/pic3.jpeg" alt="Jordan Miles" /></div>
            <h4>Jordan Miles</h4>
            <p className="role">Breathing Science Researcher</p>
          </motion.div>
          <motion.div className="team-card" {...fadeUp} transition={{ delay: 0.12 }} viewport={{ once: true }}>
            <div className="team-img-wrap"><img src="/pic4.jpeg" alt="Casey Morgan" /></div>
            <h4>Casey Morgan</h4>
            <p className="role">Fitness & Endurance Specialist</p>
          </motion.div>
          <motion.div className="team-card" {...fadeUp} transition={{ delay: 0.24 }} viewport={{ once: true }}>
            <div className="team-img-wrap"><img src="/pic5.jpeg" alt="Sam Taylor" /></div>
            <h4>Sam Taylor</h4>
            <p className="role">Lead Developer</p>
          </motion.div>
          <motion.div className="team-card" {...fadeUp} transition={{ delay: 0.36 }} viewport={{ once: true }}>
            <div className="team-img-wrap"><img src="/pic6.jpeg" alt="Alex Reed" /></div>
            <h4>Alex Reed</h4>
            <p className="role">Product Designer</p>
          </motion.div>
        </div>
      </section>

      {/* CEO */}
      <section className="ceo-section">
        <motion.div className="ceo-inner" {...fadeUp} viewport={{ once: true }}>
          <img className="ceo-img" src="/pic7.jpeg" alt="Founder - Jamie Parker" />
          <div className="ceo-text">
            <h3>A Message From Our Founder</h3>
            <h4>Jamie Parker</h4>
            <p>
              "Every runner deserves to breathe freely. AirStride isn't just a product — it's a movement toward healthier,
              stronger, more confident athletes everywhere."
            </p>
            <button className="cta-btn" onClick={() => navigate("/faq")}>Contact the Founder</button>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
