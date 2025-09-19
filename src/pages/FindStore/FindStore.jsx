import React from "react";
import TopNav from "../../components/TopNav";
import "./FindStore.css";

export default function FindStore() {
  return (
    <div className="find-store-page">
      <TopNav />
      <div className="map-wrapper">
        <iframe
          title="AirStride Store Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3576.313636933726!2d28.04806137542159!3d-26.25872237698865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950f13b27d30f7%3A0x6d00f18272b91bf0!2s14%20Valda%20St%2C%20Townsview%2C%20Johannesburg%20South%2C%202190!5e0!3m2!1sen!2sza!4v1726410200000!5m2!1sen!2sza"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
