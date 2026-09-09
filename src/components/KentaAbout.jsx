import { useEffect } from "react";
import { ArrowUp, ExternalLink } from "lucide-react";
import KentaCanvas from "./KentaCanvas";
import { playHoverSound, playClickSound } from "../utils/audio";
import "./KentaAbout.css";

// Ritesh Raj Real Portfolio Data styled in 100% Kenta Toshikura Minimalist Editorial Format
const riteshData = {
  name: "RITESH RAJ",
  headline: "FULL STACK SOFTWARE ENGINEER AND MERN SPECIALIST BASED IN INDIA.",
  meta: [
    { label: "Location", val: "Greater Noida & Bihar, India" },
    { label: "Alma Mater", val: "Galgotias University (B.Tech CSE 2023–2027)" },
    { label: "Specialization", val: "MERN Stack, Real-time Socket.IO, Java DSA" },
  ],
  awards: [
    { title: "LEETCODE & CODEHELP", desc: "200+ DSA IN JAVA, CONCURRENCY & OOP" },
    { title: "APNA COLLEGE", desc: "CERTIFIED JAVA DATA STRUCTURES & ALGORITHMS" },
    { title: "GALGOTIAS UNIVERSITY", desc: "B.TECH COMPUTER SCIENCE & ENGINEERING (CGPA 7.3)" },
    { title: "CODEHELP (LOVE BABBAR)", desc: "FULL-STACK MERN ARCHITECTURE CERTIFICATION" },
  ],
  contact: [
    { label: "GITHUB", handle: "github.com/riteshraj851116", href: "https://github.com/riteshraj851116" },
    { label: "LINKEDIN", handle: "linkedin.com/in/ritesh-raj", href: "https://www.linkedin.com/in/ritesh-raj-9b52162a7/" },
    { label: "MAIL", handle: "riteshraj851116@gmail.com*", href: "mailto:riteshraj851116@gmail.com" },
    { label: "LOCATION", handle: "Greater Noida, NCR, India", href: "mailto:riteshraj851116@gmail.com" },
  ],
  contactNote: "*Currently open for high-impact software engineering roles & technical collaborations.",
  recentWorks: [
    { name: "JobSphere Recruitment Engine", role: "Full Stack MERN, Cloudinary, REST", url: "https://jobsphere-topaz.vercel.app/" },
    { name: "VeloceDrive Luxury Rentals", role: "React, Tailwind, Node.js, Stripe", url: "https://github.com/riteshraj851116" },
    { name: "RCB Fan Experience & Team App", role: "Full Stack MERN, Interactive 3D", url: "https://github.com/riteshraj851116" },
    { name: "ChatPulse Realtime Engine", role: "Socket.IO, Express, Redis, MERN", url: "https://github.com/riteshraj851116" },
    { name: "Algorithmic Problem Suite", role: "Java, Collections, 200+ Solved", url: "https://github.com/riteshraj851116" },
    { name: "CodeHelp Full-Stack Platform", role: "React, Node.js, MongoDB, JWT", url: "https://github.com/riteshraj851116" },
    { name: "Terminal Portfolio Engine", role: "React, Custom Shell Emulator", url: "#" },
    { name: "Telemetry Monocoque 3D", role: "Three.js, WebGL Shaders, GSAP", url: "#" },
  ],
  archive: [
    { title: "Folio - 2024 (Lando Norris Edition)", url: "#work" },
    { title: "GitHub Repositories (Public Source Index)", url: "https://github.com/riteshraj851116?tab=repositories" },
  ],
};

export default function KentaAbout({ onSwitchToWork }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="kenta-page-wrapper">
      {/* 3D WEBGL OBSIDIAN CRYSTAL SHARDS BACKGROUND (#js-back) */}
      <KentaCanvas />

      {/* FIXED EDITORIAL HEADER */}
      <header className="kenta-header">
        <div
          className="kenta-header-left"
          onClick={() => {
            playClickSound();
            if (onSwitchToWork) onSwitchToWork();
          }}
          onMouseEnter={playHoverSound}
          title="View Interactive 3D Work Portfolio"
        >
          <span className="kenta-dot" />
          <span className="kenta-site-name">{riteshData.name}</span>
        </div>

        <div className="kenta-header-right">
          <div className="kenta-loaded-status">
            <span className="kenta-loaded-num">100%</span>
            <span>Loaded</span>
          </div>

          {onSwitchToWork && (
            <button
              className="kenta-nav-link"
              onClick={() => {
                playClickSound();
                onSwitchToWork();
              }}
              onMouseEnter={playHoverSound}
            >
              WORK
            </button>
          )}

          <button
            className="kenta-nav-link active"
            onClick={scrollToTop}
            onMouseEnter={playHoverSound}
          >
            PROFILE
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN PRECISION EDITORIAL GRID */}
      <main className="kenta-container">
        {/* 1. PROFILE */}
        <section className="kenta-section" id="profile">
          <div className="kenta-section-tag">1. PROFILE</div>
          <div className="kenta-section-content">
            <h1 className="kenta-headline">{riteshData.headline}</h1>

            <div className="kenta-profile-meta">
              {riteshData.meta.map((m, i) => (
                <div key={i} className="kenta-profile-meta-item">
                  <span className="kenta-meta-label">{m.label}</span>
                  <span className="kenta-meta-val">{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. AWARDS */}
        <section className="kenta-section" id="awards">
          <div className="kenta-section-tag">2. AWARDS</div>
          <div className="kenta-section-content">
            <div className="kenta-awards-list">
              {riteshData.awards.map((award, i) => (
                <div
                  key={i}
                  className="kenta-award-row"
                  onMouseEnter={playHoverSound}
                >
                  <span className="kenta-award-title">{award.title}</span>
                  <span className="kenta-award-desc">{award.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CONTACT */}
        <section className="kenta-section" id="contact">
          <div className="kenta-section-tag">3. CONTACT</div>
          <div className="kenta-section-content">
            <div className="kenta-contact-list">
              {riteshData.contact.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kenta-contact-link"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                >
                  <span>
                    {c.label} – {c.handle}
                  </span>
                </a>
              ))}
            </div>
            <p className="kenta-contact-note">{riteshData.contactNote}</p>
          </div>
        </section>

        {/* 4. RECENT WORKS */}
        <section className="kenta-section" id="works">
          <div className="kenta-section-tag">4. RECENT WORKS</div>
          <div className="kenta-section-content">
            <div className="kenta-works-table">
              <div className="kenta-table-head">
                <span>Name</span>
                <span>Role</span>
              </div>
              <div className="kenta-table-body">
                {riteshData.recentWorks.map((work, i) => (
                  <a
                    key={i}
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kenta-table-row"
                    onMouseEnter={playHoverSound}
                    onClick={playClickSound}
                  >
                    <span className="kenta-row-name">
                      {work.name}
                      {work.url !== "#" && <ExternalLink size={10} style={{ opacity: 0.5 }} />}
                    </span>
                    <span className="kenta-row-role">{work.role}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. ARCHIVE */}
        <section className="kenta-section" id="archive">
          <div className="kenta-section-tag">5. ARCHIVE</div>
          <div className="kenta-section-content">
            <div className="kenta-archive-list">
              {riteshData.archive.map((arch, i) => (
                <a
                  key={i}
                  href={arch.url}
                  onClick={(e) => {
                    if (arch.url === "#work" && onSwitchToWork) {
                      e.preventDefault();
                      playClickSound();
                      onSwitchToWork();
                    } else {
                      playClickSound();
                    }
                  }}
                  target={arch.url.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="kenta-archive-item"
                  onMouseEnter={playHoverSound}
                >
                  <span>{arch.title}</span>
                  <ExternalLink size={10} style={{ opacity: 0.5 }} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING AMBIENT BOTTOM CONTROLS */}
      <footer className="kenta-floating-bottom">
        <div className="kenta-scroll-indicator">
          <span className="kenta-scroll-arrow">↓</span>
          <span>scroll</span>
        </div>

        <div className="kenta-bottom-right">
          <button
            className="kenta-top-btn"
            onClick={scrollToTop}
            onMouseEnter={playHoverSound}
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </footer>
    </div>
  );
}
