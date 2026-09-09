import { useState, useRef } from "react";
import gsap from "gsap";
import { playScrambleTick, playHoverBlip } from "../utils/audio";
import "./ScrambleText.css";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%&*+=/?@";

/**
 * ScrambleText Component
 * Renders text with an authentic mechanical broadsheet letter-shuffle effect on hover,
 * complete with GSAP spring transition and typewriter audio ticks.
 */
const ScrambleText = ({ text, className = "", as = "span" }) => {
  const [displayText, setDisplayText] = useState(text);
  const isAnimating = useRef(false);
  const elementRef = useRef(null);

  const handleMouseEnter = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    try { playHoverBlip(); } catch (e) {}

    // Subtle GSAP punch
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { scale: 1.02, color: "var(--terracotta)" },
        { scale: 1, color: "inherit", duration: 0.45, ease: "power2.out" }
      );
    }

    let iteration = 0;
    const interval = setInterval(() => {
      try { playScrambleTick(); } catch (e) {}

      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "!" || char === "/" || char === "-") return char;
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        isAnimating.current = false;
      }

      iteration += 1 / 2;
    }, 28);
  };

  const Component = as;

  return (
    <Component
      ref={elementRef}
      className={`scramble-text-hover ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ display: "inline-block", cursor: "default" }}
      title="Hover for mechanical broadsheet decode"
    >
      {displayText}
    </Component>
  );
};

export default ScrambleText;
