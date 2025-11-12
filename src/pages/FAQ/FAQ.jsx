import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import { Plus, Minus, ArrowRight, Lightbulb, MessageCircle } from "lucide-react"; // Added Lightbulb, MessageCircle for potential icons
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
  const [showAll, setShowAll] = useState(false);

  const faqsToShow = showAll ? initialFaqs : initialFaqs.slice(0, 5);
  
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <section className="dynamic-header">
        <div className="dynamic-header-bg">
          <div className="header-content-wrapper-exciting">
            
            {/* LEFT SECTION: Exciting Illustration / Title Area */}
            <div className="illustration-zone">
                <div className="decorative-shape-1"></div>
                <div className="decorative-shape-2"></div>
                <h1 className="main-faq-title-exciting">
                    <Lightbulb className="title-icon" size={60} />
                    <span>Frequently</span> <br/> <span>Asked</span> <span className="highlight-orange">Questions</span>
                </h1>
                <p className="faq-subtitle-exciting">Your answers are just a click away!</p>
            </div>

            {/* RIGHT SECTION: FAQ List Container */}
            <div className="faq-list-container-exciting">
              <h2 className="faq-list-sub-title">Top Questions</h2>
              <div className="faq-accordion-list">
                {faqsToShow.map((faq, index) => (
                  <div
                    key={index}
                    className={`faq-item-design-exciting ${openIndex === index ? "open" : ""}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="faq-question-design-exciting">
                      <span>{faq.q}</span>
                      <span className="faq-icon-exciting">
                        {openIndex === index ? <Minus size={22} /> : <Plus size={22} />}
                      </span>
                    </div>
                    <div className="faq-answer-design-exciting">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}

                {/* 'Show others' navigation */}
                {!showAll && initialFaqs.length > 5 && (
                  <div className="show-others-nav-exciting">
                    <span onClick={() => setShowAll(true)}>See All FAQs</span>
                    <span className="nav-page-info">1/2</span>
                    <button className="nav-arrow-exciting" onClick={() => setShowAll(true)}>
                        <ArrowRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* BOTTOM WAVE SECTION - More pronounced and abstract */}
          <div className="bottom-wave-section">
             <span className="floating-element-1"><MessageCircle size={40} /></span> 
             <span className="floating-element-2">?</span> 
             <span className="copyright-exciting">© AirStride.com</span>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default FAQ;