import React, { useState } from "react";
import FAQChat from "./FAQChat.jsx"; // AI Chatbot component
import Footer from "../../components/Footer/Footer";
import "./FAQStyles.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTopic, setSearchTopic] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [faqs, setFaqs] = useState([
    // General
    { topic: "General", q: "What is AirStride?", a: "AirStride is an e-commerce store specializing in sports health products like breathing trainers, jogging shoes, and more." },
    { topic: "General", q: "Can I track my order?", a: "Yes, tracking information is sent to your email after shipment." },
    { topic: "General", q: "Do you have a mobile app?", a: "Not yet, but it's coming soon!" },
    { topic: "General", q: "Do you offer discounts?", a: "Yes, we have seasonal discounts and offers." },
    { topic: "General", q: "How can I contact support?", a: "You can reach us via the contact page or email support@airstride.com." },
    { topic: "General", q: "Is my personal data safe?", a: "Yes, we follow strict data protection protocols." },

    // Shipping
    { topic: "Shipping", q: "How long does shipping take?", a: "Orders usually arrive within 5–7 business days, depending on your location." },
    { topic: "Shipping", q: "Do you ship internationally?", a: "Currently we ship to select countries; check the shipping page for details." },
    { topic: "Shipping", q: "Can I change my address after ordering?", a: "Yes, contact support within 24 hours to modify the address." },
    { topic: "Shipping", q: "What are the shipping fees?", a: "Fees vary by region and order size." },
    { topic: "Shipping", q: "Do you offer express delivery?", a: "Yes, express shipping options are available at checkout." },
    { topic: "Shipping", q: "What happens if my package is lost?", a: "We will track and replace lost packages promptly." },

    // Products
    { topic: "Products", q: "Do you offer product warranties?", a: "Yes, all our products come with a 1-year limited warranty." },
    { topic: "Products", q: "Are your shoes suitable for beginners?", a: "Yes, they are designed for all levels." },
    { topic: "Products", q: "Can I return a product?", a: "Yes, within 30 days of purchase." },
    { topic: "Products", q: "Are your products eco-friendly?", a: "We are working towards sustainability in all products." },
    { topic: "Products", q: "Do you have size guides?", a: "Yes, check each product page for sizing details." },
    { topic: "Products", q: "Can I pre-order upcoming products?", a: "Yes, pre-order options are sometimes available." },
  ]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setFaqs([...faqs, { topic: "User Submitted", q: newQuestion, a: "Awaiting answer..." }]);
      setNewQuestion("");
      alert("Your question has been submitted!");
    }
  };

  const filteredFaqs = searchTopic
    ? faqs.filter((faq) => faq.topic.toLowerCase().includes(searchTopic.toLowerCase()))
    : faqs;

  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.topic]) acc[faq.topic] = [];
    acc[faq.topic].push(faq);
    return acc;
  }, {});

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <p className="faq-intro">
        Have a question about any sports equipment or products? You can ask our AI chatbot below or browse the FAQs.
      </p>

      {/* Search bar */}
      <div className="faq-search">
        <input
          type="text"
          placeholder="Search by topic..."
          value={searchTopic}
          onChange={(e) => setSearchTopic(e.target.value)}
        />
      </div>

      {/* FAQ List */}
      <div className="faq-list">
        {Object.keys(groupedFaqs).map((topic) => (
          <div key={topic} className="faq-topic-group">
            <h2 className="faq-topic">{topic}</h2>
            {groupedFaqs[topic].map((faq) => (
              <div
                key={faq.q}
                className={`faq-item ${openIndex === faq.q ? "open" : ""}`}
                onClick={() => toggleFAQ(faq.q)}
              >
                <div className="faq-question">
                  {faq.q}
                  <span className={`faq-arrow ${openIndex === faq.q ? "open" : ""}`}>▾</span>
                </div>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Submit Question Form */}
      <div className="faq-submit">
        <h2>Ask a Question</h2>
        <textarea
          placeholder="Type your question here..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button onClick={handleAddQuestion}>Submit Question</button>
      </div>

      {/* AI Chatbot */}
      <FAQChat />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQ;
