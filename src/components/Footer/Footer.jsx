  // src/components/Footer.jsx
  import React, { useState } from "react";
  import { FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";
  import "./Footer.css";

  export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribedEmails, setSubscribedEmails] = useState([]);
    const [popup, setPopup] = useState({ show: false, message: "" });
    const [modal, setModal] = useState({ show: false, title: "", content: "" });

    const handleSubscribe = () => {
      if (!email) {
        setPopup({ show: true, message: "Please enter a valid email." });
        return;
      }

      if (subscribedEmails.includes(email)) {
        setPopup({ show: true, message: `${email} is already part of our team!` });
        return;
      }

      setSubscribedEmails([...subscribedEmails, email]);
      setPopup({ show: true, message: `You have successfully registered ${email} to the AirStride newsletter!` });
      setEmail(""); // clear input
    };

    const openModal = (type) => {
      if (type === "terms") {
        setModal({
          show: true,
          title: "Terms of Service",
          content: `**TERMS AND CONDITIONS**

  **Last Updated: November 25, 2025**

  Welcome to AirStride. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully.

  **1. Acceptance of Terms**

  By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.

  **2. Use of Service**

  You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.

  **3. User Accounts**

  When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.

  **4. Intellectual Property Rights**

  The content on this website, including but not limited to text, graphics, logos, images, videos, and software, is the property of AirStride or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.

  **5. User-Generated Content**

  By posting content on our website, you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, and distribute your content. You represent and warrant that you own or have the necessary rights to all content you post and that such content does not violate any third-party rights.

  **6. Sports Betting and Gambling Disclaimer**

  If our website contains information related to sports betting or gambling, you acknowledge that:
  - You must be of legal gambling age in your jurisdiction
  - Gambling involves risk and you may lose money
  - We are not responsible for any gambling losses
  - You should gamble responsibly and seek help if needed
  - We do not endorse or promote gambling activities

  **7. Accuracy of Information**

  While we strive to provide accurate sports scores, statistics, news, and information, we cannot guarantee the completeness or accuracy of all content. Sports information is provided for entertainment purposes only and should not be the sole basis for any betting or financial decisions.

  **8. Third-Party Links**

  Our website may contain links to third-party websites that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites. You acknowledge and agree that we shall not be responsible for any damage or loss caused by your use of such websites.

  **9. Limitation of Liability**

  To the maximum extent permitted by applicable law, AirStride shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your access to or use of or inability to access or use the service.

  **10. Disclaimer of Warranties**

  Our service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, timely, secure, or error-free.

  **11. Modifications to Terms**

  We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. Your continued use of the website after such modifications constitutes acceptance of the updated Terms.

  **12. Termination**

  We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.

  **13. Governing Law**

  These Terms shall be governed by and construed in accordance with the laws of South Africa, without regard to its conflict of law provisions. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts in South Africa.

  **14. Contact Information**

  If you have any questions about these Terms and Conditions, please contact us at:
  - Email: support@airstride.com
  - Address: Johannesburg, Gauteng, South Africa
  - Phone: +27 11 123 4567

  By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.`
        });
      } else if (type === "privacy") {
        setModal({
          show: true,
          title: "Privacy Policy",
          content: `**PRIVACY POLICY**

  **Last Updated: November 25, 2025**

  At AirStride, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

  **1. Information We Collect**

  **Personal Information:**
  We may collect personal information that you voluntarily provide to us when you:
  - Register for an account (name, email address, phone number, date of birth)
  - Subscribe to our newsletter
  - Participate in contests or promotions
  - Post comments or interact with our content
  - Contact our customer support team

  **Automatically Collected Information:**
  When you visit our website, we automatically collect certain information about your device, including:
  - IP address
  - Browser type and version
  - Operating system
  - Referring URLs
  - Pages viewed and time spent on pages
  - Device identifiers
  - Location data (if you grant permission)

  **Cookies and Tracking Technologies:**
  We use cookies, web beacons, and similar tracking technologies to enhance your experience, analyze trends, and gather demographic information. You can control cookie preferences through your browser settings.

  **2. How We Use Your Information**

  We use the information we collect to:
  - Provide, operate, and maintain our website
  - Process your transactions and manage your account
  - Send you updates about sports news, scores, and events
  - Respond to your comments, questions, and customer service requests
  - Personalize your experience and deliver targeted content
  - Analyze usage patterns to improve our services
  - Detect, prevent, and address technical issues and security threats
  - Comply with legal obligations
  - Send promotional communications (with your consent)

  **3. How We Share Your Information**

  We may share your information in the following circumstances:

  **Service Providers:**
  We may share your information with third-party service providers who perform services on our behalf, such as hosting, analytics, email delivery, and payment processing. These providers are contractually obligated to protect your information.

  **Business Transfers:**
  If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.

  **Legal Requirements:**
  We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).

  **With Your Consent:**
  We may share your information with third parties when you have given us explicit consent to do so.

  **Aggregate Information:**
  We may share anonymized, aggregated information that cannot be used to identify you individually.

  **4. Third-Party Authentication**

  We offer authentication through third-party services (Google, Facebook, GitHub, Twitter). When you authenticate using these services, they may share certain information with us according to their own privacy policies. We encourage you to review the privacy policies of these third-party services.

  **5. Data Security**

  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.

  **6. Data Retention**

  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.

  **7. Your Privacy Rights**

  Depending on your location, you may have the following rights:

  - **Access:** Request access to the personal information we hold about you
  - **Correction:** Request correction of inaccurate or incomplete information
  - **Deletion:** Request deletion of your personal information
  - **Objection:** Object to our processing of your personal information
  - **Restriction:** Request restriction of processing your information
  - **Portability:** Request transfer of your information to another service
  - **Withdraw Consent:** Withdraw consent for processing where we rely on consent

  To exercise these rights, please contact us using the information provided below.

  **8. Children's Privacy**

  Our website is not intended for children under the age of 13 (or 16 in some jurisdictions). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will take steps to delete such information.

  **9. International Data Transfers**

  Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your jurisdiction. We take appropriate measures to ensure your information receives adequate protection.

  **10. Do Not Track Signals**

  Some browsers include a "Do Not Track" feature. Currently, our website does not respond to Do Not Track signals. However, you can control cookies and tracking through your browser settings.

  **11. California Privacy Rights**

  If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA), including:
  - The right to know what personal information we collect, use, and share
  - The right to delete personal information
  - The right to opt-out of the sale of personal information (we do not sell personal information)
  - The right to non-discrimination for exercising your privacy rights

  **12. GDPR Rights (European Users)**

  If you are located in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR), including the rights outlined in Section 7 above. Our lawful basis for processing your information includes consent, contractual necessity, legal obligations, and legitimate interests.

  **13. Changes to This Privacy Policy**

  We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.

  **14. Contact Us**

  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:

  **AirStride**
  - Email: privacy@airstride.com
  - Address: Johannesburg, Gauteng, South Africa
  - Phone: +27 11 123 4567

  **15. Cookies Policy**

  **What Are Cookies:**
  Cookies are small text files stored on your device that help us provide and improve our services.

  **Types of Cookies We Use:**
  - **Essential Cookies:** Necessary for the website to function properly
  - **Analytics Cookies:** Help us understand how visitors interact with our website
  - **Functional Cookies:** Enable personalized features and remember your preferences
  - **Advertising Cookies:** Deliver relevant advertisements based on your interests

  **Managing Cookies:**
  You can control and manage cookies through your browser settings. Note that disabling certain cookies may limit your ability to use some features of our website.

  By using our website, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.`
        });
      }
    };

    return (
      <footer className="footer">
        {/* Newsletter popup */}
        {popup.show && (
          <div className="newsletter-popup">
            <span className="popup-close" onClick={() => setPopup({ ...popup, show: false })}>
              &times;
            </span>
            <p>{popup.message}</p>
          </div>
        )}

        {/* Full-screen modal for terms/privacy */}
        {modal.show && (
          <div className="full-modal">
            <div className="modal-content">
              <span className="modal-close" onClick={() => setModal({ ...modal, show: false })}>
                &times;
              </span>
              <h2>{modal.title}</h2>
              <div className="modal-text">
                {modal.content}
              </div>
            </div>
          </div>
        )}

        {/* Upper Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <h2>AirStride</h2>
            <p>Breathe better. Run further.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-newsletter">
            <h4>Subscribe</h4>
            <p>Get updates and exclusive offers</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleSubscribe}>Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Section */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AirStride. All rights reserved.</p>
          <div className="legal-links">
            <button className="legal-link-btn" onClick={() => openModal("terms")}>Terms of Service</button>
            <button className="legal-link-btn" onClick={() => openModal("privacy")}>Privacy Policy</button>
          </div>
        </div>
      </footer>
    );
  }