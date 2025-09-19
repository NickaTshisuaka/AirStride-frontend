import React from "react";
import Lottie from "lottie-react";
import animations from "./assets/animations/runninganime.json"; 

export default function Animation() {
  return (
    <div className="animation-wrapper">
      <Lottie animationData={animations} loop={false} />
    </div>
  );
}
