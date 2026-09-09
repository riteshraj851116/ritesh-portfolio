import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X, Radio, Sparkles, Mail } from "lucide-react";
import { playClickSound, playHoverSound, playEngineRevSound } from "../utils/audio";
import AudioController from "./AudioController";
import "./Navbar.css";

const GithubIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Navbar = ({ onOpenAbout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [activeSection, setActiveSection] = useState("home");

  // Scroll listener for sticky compact navbar & active section spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sectionIds = [
        { id: "home", navId: "home" },
        { id: "track", navId: "track" },
        { id: "on-off-code", navId: "on-off-code" },
        { id: "hall-of-fame", navId: "work" },
        { id: "work", navId: "work" },
        { id: "dossier", navId: "dossier" },
        { id: "tech-stack", navId: "tech-stack" },
        { id: "contact", navId: "contact" },
      ];

      const scrollPos = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i].navId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update IST local time
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date());
        setLocalTime(timeStr);
      } catch {
        setLocalTime("12:00 PM");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { id: "work", label: "01 WORK", href: "#hall-of-fame" },
    { id: "track", label: "02 TRACK", href: "#track" },
    { id: "on-off-code", label: "03 DUALITY", href: "#on-off-code" },
    { id: "dossier", label: "04 DOSSIER", href: "#dossier" },
    { id: "tech-stack", label: "05 TECH", href: "#tech-stack" },
    { id: "about", label: "06 ABOUT", href: "#about", isAbout: true },
  ];

  return (
    <header className={`ln-nav-wrapper ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="ln-nav-container">
        {/* LEFT: BRAND MONOGRAM & PILOT IDENTITY */}
        <a
          href="#home"
          className="ln-nav-brand"
          onClick={playClickSound}
          onMouseEnter={playHoverSound}
          aria-label="Ritesh Raj Portfolio Homepage"
        >
          <div className="ln-brand-monogram">
            <span className="ln-monogram-text">RR</span>
            <span className="ln-monogram-num">01</span>
          </div>
          <div className="ln-brand-title">
            <span className="ln-title-name">RITESH RAJ</span>
            <span className="ln-title-sub">FULL STACK MERN</span>
          </div>
        </a>

        {/* CENTER: AERODYNAMIC DESKTOP NAVIGATION PILLS */}
        <div className="ln-nav-center-group">
          <div className="ln-nav-links-desktop">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`ln-nav-item ${isActive ? "is-active" : ""}`}
                  onClick={(e) => {
                    if (link.isAbout && onOpenAbout) {
                      e.preventDefault();
                      playClickSound();
                      onOpenAbout();
                    } else {
                      playClickSound();
                    }
                  }}
                  onMouseEnter={playHoverSound}
                >
                  <span className="ln-item-text">{link.label}</span>
                  {isActive && <span className="ln-item-indicator"></span>}
                </a>
              );
            })}
          </div>
        </div>

        {/* RIGHT: TELEMETRY + AUDIO + CTA CONTROLS */}
        <div className="ln-nav-right-group">
          {/* COMPACT TELEMETRY STATUS PILL */}
          <div className="ln-nav-status-pill">
            <span className="pulse-beacon"></span>
            <span className="status-label">ONLINE</span>
            <span className="status-sep">/</span>
            <span className="status-time">IST {localTime}</span>
          </div>

          {/* F1 SOUND ENGINE CONTROLLER */}
          <AudioController />

          {/* DIRECT CALL TO ACTION */}
          <a
            href="#contact"
            className="ln-nav-cta"
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
          >
            <span>LET'S TALK</span>
            <ArrowUpRight size={14} className="ln-cta-arrow" />
          </a>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            className="ln-nav-mobile-toggle"
            onClick={() => {
              playClickSound();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Toggle mobile navigation menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* LUXURY MOTORSPORT FULLSCREEN MOBILE DRAWER */}
      <div className={`ln-mobile-drawer ${menuOpen ? "is-open" : ""}`}>
        <div className="ln-drawer-header">
          <div className="ln-brand-monogram">
            <span className="ln-monogram-text">RR</span>
            <span className="ln-monogram-num">01</span>
          </div>
          <div className="ln-drawer-pill">
            <Radio size={11} className="text-lime" />
            <span>AVAILABLE FOR HIRE 2026</span>
          </div>
          <button
            className="ln-drawer-close"
            onClick={() => {
              playClickSound();
              setMenuOpen(false);
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="ln-drawer-links">
          {[
            { label: "01 // WORK & PROJECTS", href: "#hall-of-fame" },
            { label: "02 // CAREER TRACK", href: "#track" },
            { label: "03 // ON / OFF CODE", href: "#on-off-code" },
            { label: "04 // 3D PLAYBOOK DOSSIER", href: "#dossier" },
            { label: "05 // TECH TELEMETRY", href: "#tech-stack" },
            { label: "06 // TRANSMISSION DISPATCH", href: "#contact" },
            { label: "07 // KENTA EDITORIAL ABOUT", href: "#about", isAbout: true },
          ].map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="ln-drawer-item"
              onClick={(e) => {
                if (link.isAbout && onOpenAbout) {
                  e.preventDefault();
                  playClickSound();
                  setMenuOpen(false);
                  onOpenAbout();
                } else {
                  playClickSound();
                  setMenuOpen(false);
                }
              }}
            >
              <span>{link.label}</span>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </div>

        <div className="ln-drawer-cockpit-bar">
          <button
            className="ln-drawer-rev-btn"
            onClick={() => {
              playEngineRevSound();
            }}
          >
            <Sparkles size={14} className="text-lime" />
            <span>TEST F1 ENGINE REV SOUND</span>
          </button>
        </div>

        <div className="ln-drawer-footer">
          <div className="ln-drawer-status">
            <span>LOCATION: BIHAR / GREATER NOIDA, IN</span>
            <span>DEGREE: B.TECH CSE (GALGOTIAS UNIVERSITY)</span>
            <span>STATUS: READY FOR SDE-1 / MERN ROLES</span>
          </div>

          <div className="ln-drawer-actions">
            <a
              href="mailto:riteshraj851116@gmail.com"
              className="ln-drawer-contact-btn"
              onClick={playClickSound}
            >
              <Mail size={16} />
              <span>riteshraj851116@gmail.com</span>
            </a>

            <div className="ln-drawer-socials">
              <a
                href="https://github.com/riteshraj851116"
                target="_blank"
                rel="noreferrer"
                className="ln-drawer-social-link"
                onClick={playClickSound}
              >
                <GithubIcon size={16} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/ritesh-raj-851116/"
                target="_blank"
                rel="noreferrer"
                className="ln-drawer-social-link"
                onClick={playClickSound}
              >
                <LinkedinIcon size={16} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
