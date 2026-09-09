import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gauge } from "lucide-react";
import { playClickSound, playHoverSound, playTelemetryScan } from "../utils/audio";
import "./ScrollHUD.css";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: "home", label: "01 HOME" },
  { id: "track", label: "02 TRACK" },
  { id: "on-off-code", label: "03 DUALITY" },
  { id: "hall-of-fame", label: "04 WORK" },
  { id: "dossier", label: "05 DOSSIER" },
  { id: "tech-stack", label: "06 TECH" },
  { id: "contact", label: "07 DISPATCH" },
];

const ScrollHUD = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [gear, setGear] = useState("N");
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const decayTimeout = useRef(null);

  useEffect(() => {
    // 1. Track scroll velocity & progress (Formula 1 Speedometer Simulation)
    const handleScroll = () => {
      const now = Date.now();
      const currentY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      const deltaY = Math.abs(currentY - lastScrollY.current);
      const deltaTime = Math.max(10, now - lastScrollTime.current);
      const rawSpeed = (deltaY / deltaTime) * 100; // speed units
      const simulatedKmh = Math.min(352, Math.round(rawSpeed * 3.2));

      setVelocity(simulatedKmh);

      // Determine Gear (N, 1 - 8)
      if (simulatedKmh < 10) {
        setGear("N");
      } else if (simulatedKmh < 60) {
        setGear("1");
      } else if (simulatedKmh < 110) {
        setGear("2");
      } else if (simulatedKmh < 160) {
        setGear("3");
      } else if (simulatedKmh < 210) {
        setGear("4");
      } else if (simulatedKmh < 260) {
        setGear("5");
      } else if (simulatedKmh < 300) {
        setGear("6");
      } else if (simulatedKmh < 330) {
        setGear("7");
      } else {
        setGear("8");
      }

      lastScrollY.current = currentY;
      lastScrollTime.current = now;

      // Smooth decay to zero when stopped
      if (decayTimeout.current) clearTimeout(decayTimeout.current);
      decayTimeout.current = setTimeout(() => {
        setVelocity(0);
        setGear("N");
      }, 250);
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
      if (decayTimeout.current) clearTimeout(decayTimeout.current);
      triggers.forEach((t) => t && t.kill());
    };
  }, []);

  const scrollToSection = (id) => {
    playTelemetryScan();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* VERTICAL SECTION SPY RAIL & DOTS */}
      <aside className="scroll-hud" aria-label="Page Telemetry Navigation">
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
              onMouseEnter={() => playHoverSound(50)}
              title={`Jump to ${sec.label}`}
            >
              <span className="hud-dot"></span>
              <span className="hud-label">{sec.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  </>
);
};

export default ScrollHUD;
