import React, { useEffect, useRef, useState } from "react";
import "./Home.css";

export default function Home() {
  const videoRef = useRef(null);
  const [fadeText, setFadeText] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const checkTime = () => {
      const duration = video.duration;
      const current = video.currentTime;

      // Fade text when video is about to end
      if (duration - current < 1.5) {
        setFadeText(true);
      } else {
        setFadeText(false);
      }
    };

    video.addEventListener("timeupdate", checkTime);
    return () => video.removeEventListener("timeupdate", checkTime);
  }, []);

  return (
    <div className="home-page">

      {/* VIDEO HERO SECTION */}
      <section className="hero-section">
        <video
          ref={videoRef}
          className="hero-video"
          src="/video1.mp4"
          autoPlay
          muted
          loop
        />

        <div className={`hero-text ${fadeText ? "fade-out" : ""}`}>
          <h1>AirStride</h1>
          <p>Breathing technology built for runners.</p>
          <button className="explore-btn">Explore Products</button>
        </div>
      </section>

      {/* PARALLAX SECTION 1 */}
      <section className="parallax parallax-one">
        <div className="parallax-content">
          <h2>Performance Meets Breathing Science</h2>
          <p>
            AirStride enhances lung efficiency through lightweight, smart
            airflow engineering. Built for comfort, endurance and real results.
          </p>
        </div>
      </section>

      {/* CONTENT BLOCK AFTER PARALLAX */}
      <section className="content-section">
        <h2>Why Runners Choose AirStride</h2>
        <p>
          Our tech focuses on airflow optimization, heat reduction,
          respiratory support and long-distance performance.
        </p>
      </section>

      {/* PARALLAX SECTION 2 */}
      <section className="parallax parallax-two">
        <div className="parallax-content">
          <h2>Technology That Moves With You</h2>
          <p>
            A seamless fusion of biomechanics and breathable materials ensures
            a natural running experience.
          </p>
        </div>
      </section>

      {/* FINAL CONTENT SECTION */}
      <section className="content-section">
        <h2>Ready to Upgrade Your Run?</h2>
        <button className="cta-bottom">Shop the Collection</button>
      </section>
    </div>
  );
}
