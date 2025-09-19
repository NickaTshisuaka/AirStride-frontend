import React, { useState } from "react";
import "./FAQStyles.css";

const FAQChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
  const res = await fetch("http://localhost:3001/api/ai/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: input, history: messages }),
  });

  // Check if the response is ok
  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const data = await res.json(); // safely parse JSON
  setMessages((prev) => [...prev, { role: "bot", content: data.answer }]);
} catch (error) {
  console.error("AI fetch error:", error);
  setMessages((prev) => [...prev, { role: "bot", content: "Sorry, something went wrong." }]);
} finally {
  setLoading(false);
}

  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="faq-chat-container">
      <h2>AI Chatbot</h2>
      <div className="faq-chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`faq-chat-message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="faq-chat-message bot">Typing...</div>}
      </div>
      <div className="faq-chat-input">
        <input
          type="text"
          placeholder="Ask the AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default FAQChat;
