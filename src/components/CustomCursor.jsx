import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./CustomCursor.css";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastX = mouseX;
    let lastY = mouseY;

    // High performance GSAP quickTo setters for 120fps fluid physics
    const setDotX = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power3" });
    const setDotY = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power3" });
    const setRingX = gsap.quickTo(ringRef.current, "x", { duration: 0.28, ease: "power2.out" });
    const setRingY = gsap.quickTo(ringRef.current, "y", { duration: 0.28, ease: "power2.out" });

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      setDotX(mouseX);
      setDotY(mouseY);
      setRingX(mouseX);
      setRingY(mouseY);

      // Velocity calculation for dynamic stretching
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const speed = Math.hypot(dx, dy);

      if (speed > 2 && ringRef.current) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const stretch = Math.min(speed * 0.012, 0.4);

        gsap.to(ringRef.current, {
          scaleX: 1 + stretch,
          scaleY: Math.max(0.65, 1 - stretch * 0.4),
          rotation: angle,
          duration: 0.18,
          ease: "power1.out",
          overwrite: "auto",
        });
      } else if (ringRef.current) {
        gsap.to(ringRef.current, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.4,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto",
        });
      }

      lastX = mouseX;
      lastY = mouseY;
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const checkHover = (e) => {
      const target = e.target;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".project-card") ||
        target.closest(".contact-link") ||
        target.closest(".preset-btn") ||
        target.closest("[data-hover]")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousemove", checkHover, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div className={`custom-cursor-container ${isVisible ? "visible" : ""}`}>
      <div
        ref={dotRef}
        className={`cursor-dot ${isHovered ? "hovered" : ""} ${isClicking ? "clicking" : ""}`}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovered ? "hovered" : ""} ${isClicking ? "clicking" : ""}`}
      />
    </div>
  );
};

export default CustomCursor;
