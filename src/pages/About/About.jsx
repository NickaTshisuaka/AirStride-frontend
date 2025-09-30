import React, { useEffect, useRef } from "react";
import "./About.css";
import Footer from "../../components/Footer/Footer";

const About = () => {
  const productGridRef = useRef();

  // Auto-scroll horizontally using requestAnimationFrame
  useEffect(() => {
    const grid = productGridRef.current;
    let scrollPos = 0;

    const step = () => {
      scrollPos += 1; // pixels per frame, adjust for speed
      if (scrollPos >= grid.scrollWidth - grid.clientWidth) scrollPos = 0;
      grid.scrollLeft = scrollPos;
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, []);

  const products = [
    {
      id: 1,
      image: "/prod1.jpeg",
      name: "Breathing Trainer Pro",
      description:
        "Enhances lung capacity and endurance for runners and athletes.",
    },
    {
      id: 2,
      image: "/prod2.jpeg",
      name: "AirStride Jogging Shoes",
      description: "Lightweight, cushioned, and performance-optimized.",
    },
    {
      id: 3,
      image: "/prod3.jpeg",
      name: "Performance Tracker",
      description:
        "Tracks heart rate, VO2 max, and stamina with real-time insights.",
    },
    {
      id: 4,
      image: "/prod4.jpeg",
      name: "Resistance Training Bands",
      description: "Durable bands for strength and flexibility training.",
    },
    {
      id: 5,
      image: "/prod5.jpeg",
      name: "Smart Hydration Bottle",
      description: "Monitors water intake and syncs with the app for tracking.",
    },
    {
      id: 6,
      image: "/prod6.jpeg",
      name: "Performance Apparel",
      description: "Lightweight, breathable clothing for running and training.",
    },
  ];

  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About AirStride</h1>
        <p className="about-tagline">Breathe. Stride. Achieve.</p>

        {/* Our Company */}
        <section className="about-section">
          <div className="about-card">
            <h2>Our Company</h2>
            <p>
              AirStride was founded to revolutionize athletic performance. We
              combine technology with scientific research to create innovative
              breathing trainers and performance gear.
            </p>
            <div className="mini-blocks">
              <div className="mini-block">
                <img src="/build1.jpeg" alt="Company Journey" />
                <p>Our journey began with a simple breathing trainer designed for runners.</p>
              </div>
              <div className="mini-block">
                <img src="/build2.jpeg" alt="Innovation" />
                <p>Innovation drives every product we make, tested by athletes worldwide.</p>
              </div>
              <div className="mini-block">
                <img src="/build3.jpeg" alt="Global Reach" />
                <p>AirStride now supports athletes across the globe, helping them reach peak performance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our People */}
        <section className="about-section">
          <div className="about-card">
            <h2>Our People</h2>
            <p>
              Meet the passionate team behind AirStride! Founders, engineers,
              nutritionists, and fitness coaches make up our incredible team.
            </p>
            <div className="people-grid">
              <div className="person-card">
                <img src="/man1.jpeg" alt="John Walker" />
                <h3>John Walker - Founder & CEO</h3>
                <p>John drives AirStride's vision globally.</p>
                <p>Interests: Marathon running, fitness tech.</p>
                <p>Achievements: Launched 3 product lines, awarded Sports Innovation Leader.</p>
              </div>
              <div className="person-card">
                <img src="/women1.jpeg" alt="Jane Smith" />
                <h3>Jane Smith - CTO</h3>
                <p>Jane leads product engineering and innovation.</p>
                <p>Interests: Biomechanics, wearable tech.</p>
                <p>Achievements: Patented 2 performance tracking devices.</p>
              </div>
              <div className="person-card">
                <img src="/women2.jpeg" alt="Mikeala Johnson" />
                <h3>Mikeala Johnson - Lead Investor</h3>
                <p>Mikeala supports growth and strategy alignment.</p>
                <p>Interests: Venture capital, sports startups.</p>
                <p>Achievements: Funded 10+ sports tech companies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Products */}
        <section className="about-section">
          <div className="about-card">
            <h2>Our Products</h2>
            <p>AirStride products are designed to elevate your training experience:</p>
            <div className="product-grid-horizontal" ref={productGridRef}>
              {products.map((product) => (
                <div className="product-card" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
              ))}
            </div>
            <a href="#" className="explore-btn">
              Explore More
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
