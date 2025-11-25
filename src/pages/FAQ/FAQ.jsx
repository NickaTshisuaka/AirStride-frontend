import React, { useState } from "react";
import { Plus, Minus, Lightbulb, SendHorizonal } from "lucide-react";
import emailjs from "@emailjs/browser";
import "./FAQ.css";

const initialFaqs = [
  { topic: "General", q: "How long does shipping take?", a: "Orders usually arrive within 5–7 business days, depending on your location." },
  { topic: "Products", q: "Do you offer product warranties?", a: "Yes, all our fitness trackers and shoes come with a 1-year limited warranty." },
  { topic: "Orders", q: "Can I track my order status?", a: "Yes, tracking information is sent to your email 24 hours after shipment." },
  { topic: "Returns", q: "What is your return policy?", a: "We offer 30-day free returns on all unworn items in their original packaging." },
  { topic: "Payments", q: "Do you accept PayPal or installment payments?", a: "We accept all major credit cards and PayPal. Installment options will be added soon." },
  { topic: "Support", q: "How can I contact customer support?", a: "You can reach us via email at support@airstride.com or use the chat widget on the site." },
  { topic: "Products", q: "Are your breathing trainers FDA approved?", a: "Our trainers comply with all relevant health and safety standards." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [expandAll, setExpandAll] = useState(false);

  // EmailJS form state
  const [questionForm, setQuestionForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sentMsg, setSentMsg] = useState("");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const topics = ["All", ...new Set(initialFaqs.map(faq => faq.topic))];

  const filteredFaqs = initialFaqs.filter((faq) => {
    const matchesTopic = selectedTopic === "All" || faq.topic === selectedTopic;
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleExpandAll = () => {
    setExpandAll(!expandAll);
    setOpenIndex(expandAll ? null : -1);
  };

  const sendQuestion = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_uztg1lh",
        "template_jjnrawp",
        {
          name: questionForm.name,
          email: questionForm.email,
          message: questionForm.message,
          time: new Date().toLocaleString(),
        },
        "RIlnlcSIlbll-IpKa"
      )
      .then(() => {
        setSentMsg("Thank you! Your question has been sent. We’ll respond within 2–3 business days.");
        setQuestionForm({ name: "", email: "", message: "" });
        setTimeout(() => setSentMsg(""), 3000);
      })
      .catch(() => {
        setSentMsg("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="faq-page">

      {/* MAIN FAQ SECTION */}
      <section className="dynamic-header-bg">
        <div className="header-content-wrapper-exciting">

          <div className="illustration-zone">
            <h1 className="main-faq-title-exciting">
              <Lightbulb className="title-icon" size={60} />
              <span>Frequently</span> <br /> <span>Asked</span> <span className="highlight-orange">Questions</span>
            </h1>
            <p className="faq-subtitle-exciting">Your answers are just a click away!</p>
          </div>

          <div className="faq-list-container-exciting">
            <div className="faq-controls">
              <div className="faq-tabs">
                {topics.map((topic, i) => (
                  <button
                    key={i}
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
                  className={`faq-item-design-exciting ${
                    openIndex === index || openIndex === -1 ? "open" : ""
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="faq-question-design-exciting">
                    <span>{faq.q}</span>
                    <span className="faq-icon-exciting">
                      {openIndex === index || openIndex === -1 ? (
                        <Minus size={22} />
                      ) : (
                        <Plus size={22} />
                      )}
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

      {/* CONTACT SECTION */}
      <section className="ask-question-container">
        <h2 className="ask-title">Don't see your question?</h2>
        <p className="ask-subtitle">
          Ask it below and we’ll get back to you within <strong>2–3 business days</strong>.
        </p>

        <form className="ask-form" onSubmit={sendQuestion}>
          <input
            type="text"
            placeholder="Your Name"
            required
            value={questionForm.name}
            onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Your Email"
            required
            value={questionForm.email}
            onChange={(e) => setQuestionForm({ ...questionForm, email: e.target.value })}
          />

          <textarea
            placeholder="Type your question here..."
            required
            value={questionForm.message}
            onChange={(e) => setQuestionForm({ ...questionForm, message: e.target.value })}
          />

          <button type="submit" className="ask-submit">
            Send Question <SendHorizonal size={18} />
          </button>
        </form>

        {sentMsg && <p className="ask-confirmation">{sentMsg}</p>}
      </section>

    </div>
  );
};

export default FAQ;
