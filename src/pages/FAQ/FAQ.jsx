// src/pages/FAQ/FAQ.jsx
import React, { useState } from "react";
import { Plus, Minus, Lightbulb, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import "./FAQ.css";

const initialFaqs = [
  { topic: "General", q: "How long does shipping take?", a: "Orders usually arrive within 5–7 business days, depending on your location." },
  { topic: "Products", q: "Do you offer product warranties?", a: "Yes, all our fitness trackers and shoes come with a 1-year limited warranty." },
  { topic: "Orders", q: "Can I track my order status?", a: "Yes, tracking information is sent to your email 24 hours after shipment." },
  { topic: "Returns", q: "What is your return policy?", a: "We offer 30-day free returns on all unworn items in their original packaging." },
  { topic: "Payments", q: "Do you accept PayPal or installment payments?", a: "We accept all major credit cards and PayPal. Installment options will be added soon." },
  { topic: "Support", q: "How can I contact customer support?", a: "Reach us via email at support@airstride.com or use the chat widget on the site." },
  { topic: "Products", q: "Are your breathing trainers FDA approved?", a: "Our trainers comply with all relevant health and safety standards." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [expandAll, setExpandAll] = useState(false);

  // Contact form states
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [showPopup, setShowPopup] = useState(false);

  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const topics = ["All", ...new Set(initialFaqs.map(f => f.topic))];

  const filteredFaqs = initialFaqs.filter(faq => {
    const matchesTopic = selectedTopic === "All" || faq.topic === selectedTopic;
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleExpandAll = () => {
    setExpandAll(!expandAll);
    setOpenIndex(expandAll ? null : -1);
  };

  const handleSend = (e) => {
    e.preventDefault();

    emailjs.send(
      "service_uztg1lh",
      "template_jjnrawp",
      {
        name: contact.name,
        email: contact.email,
        message: contact.message,
        time: new Date().toLocaleString(),
      },
      "QHlWzILAc5e7iyW4S"
    )
    .then(() => {
      setShowPopup(true);
      setContact({ name: "", email: "", message: "" });
    })
    .catch((err) => console.log(err));
  };

  return (
    <div className="faq-page">
      <section className="dynamic-header-bg">
        <div className="header-content-wrapper-exciting">

          {/* LEFT SIDE — Title & Contact Form */}
          <div className="illustration-zone">
            <h1 className="main-faq-title-exciting">
              <Lightbulb className="title-icon" size={60} />
              <span>Frequently</span> <br />
              <span>Asked</span> <span className="highlight-orange">Questions</span>
            </h1>
            <p className="faq-subtitle-exciting">
              Your answers are just a click away!
            </p>

            {/* ★ New Contact Form Box */}
            <div className="faq-contact-box">
              <h3>Don’t see your question?</h3>
              <p>Ask it here — we’ll respond within <strong>2–3 business days</strong>.</p>

              <form className="faq-contact-form" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Your Question…"
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  required
                />

                <button className="send-btn">
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE — FAQ */}
          <div className="faq-list-container-exciting">
            <div className="faq-controls">
              <div className="faq-tabs">
                {topics.map((topic, index) => (
                  <button
                    key={index}
                    className={`faq-tab ${selectedTopic === topic ? "active" : ""}`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <input
                type="text"
                className="faq-search"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button className="faq-expand-btn" onClick={handleExpandAll}>
                {expandAll ? "Collapse All" : "Expand All"}
              </button>
            </div>

            <div className="faq-accordion-list">
              {filteredFaqs.length === 0 && <p>No FAQs found for your search.</p>}

              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item-design-exciting ${openIndex === index || openIndex === -1 ? "open" : ""}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="faq-question-design-exciting">
                    <span>{faq.q}</span>
                    <span className="faq-icon-exciting">
                      {openIndex === index || openIndex === -1 ? <Minus size={22} /> : <Plus size={22} />}
                    </span>
                  </div>

                  <div className="faq-answer-design-exciting">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popup confirmation */}
      {showPopup && (
        <div className="faq-popup-overlay">
          <div className="faq-popup">
            <h2>Message Sent 🎉</h2>
            <p>We’ve received your question and will respond within 2–3 business days.</p>
            <button onClick={() => setShowPopup(false)}>Okay</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
