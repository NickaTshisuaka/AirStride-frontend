import React from "react";
import "./About.css";

const AboutPage = () => {
  return (
    <div className="about">
      {/* OUR STORY */}
      <section className="story fade-in">
        <div className="story-img">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
            alt="Our Story"
          />
        </div>
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            It all began with a small team and a bold idea — to reimagine how
            technology could serve humanity, not just efficiency. What started
            as a late-night project in a cramped apartment soon grew into a
            vibrant company built on innovation and purpose.
          </p>
          <p>
            From our first prototype to the thriving ecosystem we have today,
            we’ve been guided by a single principle: progress with heart. Each
            challenge we faced became fuel for creativity, and every success
            reminded us that growth is most powerful when shared.
          </p>
          <p>
            Today, our mission continues — not just to make great products, but
            to build tools that empower people to live fuller, freer, and more
            connected lives.
          </p>
        </div>
      </section>

      {/* EXPANDING HUMAN POTENTIAL */}
      <section className="potential fade-in">
        <h2>Expanding Human Potential</h2>
        <p>
          At the heart of everything we do lies a belief — that people are
          limitless when given the right tools. Our journey is not about
          replacing human effort, but amplifying it through compassion-driven
          innovation.
        </p>

        <div className="potential-grid">
          <div className="potential-item">
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
              alt="Innovation"
            />
            <h3>Innovation</h3>
            <p>
              We push boundaries fearlessly, experimenting boldly to unlock new
              frontiers in design and experience.
            </p>
          </div>
          <div className="potential-item">
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80"
              alt="Community"
            />
            <h3>Community</h3>
            <p>
              Our strength lies in togetherness — collaborating, supporting, and
              growing as one global family.
            </p>
          </div>
          <div className="potential-item">
            <img
              src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80"
              alt="Purpose"
            />
            <h3>Purpose</h3>
            <p>
              Beyond profit, we exist to create meaning — shaping a future where
              technology uplifts rather than replaces humanity.
            </p>
          </div>
          <div className="potential-item">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
              alt="Compassion"
            />
            <h3>Compassion</h3>
            <p>
              Compassion guides every innovation. We build with empathy to
              ensure every solution uplifts real people, not just metrics.
            </p>
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="team fade-in">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <img
              src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=500&q=80"
              alt="Alex Johnson"
            />
            <h3>Alex Johnson</h3>
            <p className="role">Creative Director</p>
            <p>
              Alex transforms ideas into visual stories, blending emotion with
              design to create unforgettable experiences.
            </p>
          </div>

          <div className="team-card">
            <img
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80"
              alt="Taylor Smith"
            />
            <h3>Taylor Smith</h3>
            <p className="role">Lead Developer</p>
            <p>
              Taylor turns imagination into code, building the solid digital
              foundations that power everything we create.
            </p>
          </div>

          <div className="team-card">
            <img
              src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80"
              alt="Jordan Lee"
            />
            <h3>Jordan Lee</h3>
            <p className="role">Marketing Strategist</p>
            <p>
              Jordan ensures our message speaks to the right hearts — turning
              connection into momentum.
            </p>
          </div>

          <div className="team-card">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80"
              alt="Sophia Brown"
            />
            <h3>Sophia Brown</h3>
            <p className="role">UI/UX Designer</p>
            <p>
              Sophia crafts seamless user journeys with elegance, ensuring every
              pixel has a purpose and every click feels intuitive.
            </p>
          </div>

          {/* <div className="team-card">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80"
              alt="Ethan White"
            />
            <h3>Ethan White</h3>
            <p className="role">Operations Manager</p>
            <p>
              Ethan ensures everything runs like clockwork, aligning people,
              projects, and performance toward excellence.
            </p>
          </div> */}
{/* 
          <div className="team-card">
            <img
              src="https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=500&q=80"
              alt="Isabella Green"
            />
            <h3>Isabella Green</h3>
            <p className="role">Product Analyst</p>
            <p>
              Isabella bridges the gap between insight and innovation — ensuring
              our products solve real human problems.
            </p>
          </div> */}
        </div>
      </section>

      {/* CEO SECTION */}
      <section className="ceo fade-in">
        <div className="ceo-content">
          <div className="ceo-text">
            <h2>Meet Our CEO</h2>
            <h3>Jamie Parker</h3>
            <p>
              Jamie founded this company on one simple truth: innovation means
              nothing without empathy. With a decade of leadership experience,
              Jamie continues to guide our mission with vision, humility, and
              fierce creativity — ensuring that technology always serves people,
              never the other way around.
            </p>
          </div>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUuyBRX-ucL25j-pn8GT9OTTeyHYnhUaV8kA&s"
            alt="CEO"
          />
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
