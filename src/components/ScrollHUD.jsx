import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playClickSound, playHoverSound } from "../utils/audio";
import "./ScrollHUD.css";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: "home", label: "01 HOME" },
  { id: "skills", label: "02 TECH" },
  { id: "about", label: "03 ABOUT" },
  { id: "projects", label: "04 WORK" },
  { id: "contact", label: "05 CONTACT" },
];

const ScrollHUD = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Track overall scroll progress
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 2. Section spy using ScrollTrigger
    const triggers = sections.map((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return null;

      return ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        end: "bottom 45%",
        onEnter: () => setActiveSection(sec.id),
        onEnterBack: () => setActiveSection(sec.id),
      });
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      triggers.forEach((t) => t && t.kill());
    };
  }, []);

  const scrollToSection = (id) => {
    playClickSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="scroll-hud" aria-label="Page Navigation">
      {/* VERTICAL PROGRESS LINE */}
      <div className="hud-progress-rail">
        <div
          className="hud-progress-indicator"
          style={{ height: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* SECTION NAV DOTS */}
      <div className="hud-sections">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              className={`hud-section-btn ${isActive ? "active" : ""}`}
              onClick={() => scrollToSection(sec.id)}
              onMouseEnter={playHoverSound}
              title={`Scroll to ${sec.label}`}
            >
              <span className="hud-dot"></span>
              <span className="hud-label">{sec.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default ScrollHUD;
