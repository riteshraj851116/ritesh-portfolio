import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { playClickSound } from "../utils/audio";
import "./DynamicTextRotater.css";

const titles = [
  "FULL STACK MERN SPECIALIST",
  "REAL-TIME SOCKET.IO ARCHITECT",
  "40+ MODULAR REST APIS ENGINEER",
  "JAVA ALGORITHMS (200+ SOLVED)",
  "B.TECH COMPUTER SCIENCE 2026",
];

const DynamicTextRotater = () => {
  const [index, setIndex] = useState(0);
  const textRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!textRef.current) return;

      // Smooth GSAP Out animation without jarring background audio ticking
      gsap.to(textRef.current, {
        y: -12,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setIndex((prev) => (prev + 1) % titles.length);
          // Smooth GSAP In animation
          gsap.fromTo(
            textRef.current,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
          );
        },
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleManualCycle = () => {
    if (!textRef.current) return;
    try { playClickSound(); } catch (e) {}
    gsap.to(textRef.current, {
      y: -12,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setIndex((prev) => (prev + 1) % titles.length);
        gsap.fromTo(
          textRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      },
    });
  };

  return (
    <div className="dynamic-rotater-container" onClick={handleManualCycle} title="Click to cycle role">
      <span className="rotater-prefix">DISPATCH // ROLE:</span>
      <span className="rotater-animated-text" ref={textRef}>
        {titles[index]}
      </span>
      <span className="rotater-cursor">_</span>
    </div>
  );
};

export default DynamicTextRotater;
