import React from "react";
import Sidebar from "../../components/Sidebar";
import "./Home.css";

// Pull a friendly name without touching your auth logic
const getUserName = () => {
  const fromLocal =
    localStorage.getItem("user_name") ||
    [localStorage.getItem("firstName"), localStorage.getItem("lastName")]
      .filter(Boolean)
      .join(" ");
  return fromLocal && fromLocal.trim().length > 0 ? fromLocal : "Athlete";
};

const Home = () => {
  const userName = getUserName();

  return (
    <div className="home-container">
      <Sidebar />

      {/* Top-right welcome chip */}
      <header className="topbar">
        <div className="welcome-chip">
          <span className="wave">👋</span> Welcome, <strong>{userName}</strong>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        {/* Background video */}
        <video
          className="hero-video"
          src="/videos/airstride-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/home-dashboard-picture.jpg"
        />
        {/* soft brand overlay */}
        <div className="hero-overlay" />

        <div className="hero-inner">
          <h1 className="hero-title">Elevate Your Fitness Journey</h1>
          <p className="hero-sub">
            AirStride helps runners breathe smarter and stride further. Track
            your sessions, optimize breathing cadence, and unlock performance
            insights—beautifully visualized and tuned to your goals.
          </p>

          <a className="cta" href="/products">Start Your Free Trial →</a>
        </div>

        {/* floating accents */}
        <div className="floaters">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
        </div>
      </section>

      {/* FEATURES (below video area) */}
      <section className="features">
        <article className="feature-card">
          <div className="feature-icon"><i className="fas fa-shoe-prints" /></div>
          <h3>Track Your Activity</h3>
          <p>Precision logs for pace, distance, cadence, and calories—synced to your AirStride profile.</p>
        </article>

        <article className="feature-card">
          <div className="feature-icon"><i className="fas fa-wind" /></div>
          <h3>Master Your Breathing</h3>
          <p>Guided breath rhythms and recovery timers to reduce fatigue and sharpen focus.</p>
        </article>

        <article className="feature-card">
          <div className="feature-icon"><i className="fas fa-chart-line" /></div>
          <h3>Insights That Matter</h3>
          <p>Smart recommendations turn your data into clear next steps for stronger runs.</p>
        </article>
      </section>

      {/* STATS RIBBON */}
      <section className="ribbon">
        <div className="ribbon-item">
          <div className="num">+120k</div>
          <div className="label">Sessions Tracked</div>
        </div>
        <div className="ribbon-item">
          <div className="num">98%</div>
          <div className="label">User Satisfaction</div>
        </div>
        <div className="ribbon-item">
          <div className="num">15%</div>
          <div className="label">Avg. Pace Improvement</div>
        </div>
      </section>

      {/* STORY / MISSION */}
      <section className="story">
        <div className="story-card">
          <h2>Our Mission</h2>
          <p>Empower athletes with tools that make every breath and every stride count.</p>
        </div>
        <div className="story-card">
          <h2>Our Promise</h2>
          <p>Design-first experiences, reliable data, and performance features that stay out of your way.</p>
        </div>
        <div className="story-card">
          <h2>Join the Crew</h2>
          <p>Connect with runners worldwide, share progress, and celebrate personal bests.</p>
        </div>
      </section>

      <footer className="footer">© 2025 AirStride</footer>
    </div>
  );
};

export default Home;
