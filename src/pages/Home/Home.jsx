import React, { useEffect, useRef, useState } from "react";
import TopNav from "../../components/TopNav";
import "./Home.css";

export default function Home() {
  const videoRef = useRef(null);
  const [fadeOutHeroText, setFadeOutHeroText] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;
      if (remaining <= 10) {
        setFadeOutHeroText(true); // start fade out
      } else {
        setFadeOutHeroText(false); // show text
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <div className="page-wrapper">
      {/* Navbar */}
      <TopNav />

      {/* HERO */}
      <section className="hero">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src="/videos/sports.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        {/* Floating spheres */}
        <div className="floaters">
          <span className="floater floater-1"></span>
          <span className="floater floater-2"></span>
          <span className="floater floater-3"></span>
          <span className="floater floater-4"></span>
          <span className="floater floater-5"></span>
        </div>

        {/* Hero Text (fades out last 10s) */}
        <div className={`hero-inner ${fadeOutHeroText ? "fade-out" : ""}`}>
          <h1 className="hero-title">
            You don’t need to be an Olympian to work out like a winner
          </h1>
          <a className="cta" href="/products">Start your journey →</a>
        </div>
      </section>

      {/* ===== Rest of Home Page Sections ===== */}

      {/* Mission */}
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          At <strong>AirStride</strong>, we believe fitness should be accessible,
          inspiring, and fun. Our products are designed to help you breathe
          better, move smarter, and live stronger.
        </p>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stat-card">
          <h3>50k+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat-card">
          <h3>120+</h3>
          <p>Stores Worldwide</p>
        </div>
        <div className="stat-card">
          <h3>15</h3>
          <p>Years of Innovation</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <p>"AirStride changed the way I train — I feel unstoppable!"</p>
            <span>- Alex M.</span>
          </div>
          <div className="testimonial">
            <p>"The best investment I’ve made for my fitness journey."</p>
            <span>- Sarah L.</span>
          </div>
          <div className="testimonial">
            <p>"Breathing trainers are a game changer. Highly recommend."</p>
            <span>- James K.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
