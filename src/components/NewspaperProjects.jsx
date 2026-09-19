import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { playHoverBlip, playClickSound } from "../utils/audio";
import "./NewspaperProjects.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GithubIcon = ({ size = 14 }) => (
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

const projectsData = [
  {
    id: "jobsphere",
    edition: "01",
    badge: "MERN & SOCKET.IO",
    category: "REAL-TIME & EVENT",
    title: "JOBSPHERE",
    subtitle: "Full Stack Recruitment Platform (2026)",
    desc: "Production-ready recruitment ecosystem connecting applicants and corporate hiring teams with automated candidate pipelines. Engineered with stateless JWT & bcrypt authentication, 40+ modular RESTful API endpoints, and sub-50ms Socket.IO live messaging.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=900&auto=format&fit=crop",
    urlDisplay: "jobsphere-vercel.vercel.app",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "Socket.IO", "REST APIs"],
    demoUrl: "https://jobsphere-vercel.vercel.app",
    githubUrl: "https://github.com/riteshraj851116/jobsphere",
    telemetry: [
      { label: "CHAT LATENCY", val: "<50ms", tag: "SUB-50MS SOCKET.IO" },
      { label: "REST ROUTES", val: "40+ APIs", tag: "MODULAR MVC ARCH" },
      { label: "AUTH DEFENSE", val: "100%", tag: "JWT + BCRYPT SALTING" },
      { label: "ATS PIPELINE", val: "AUTOMATED", tag: "STATUS LIFECYCLE" },
    ],
    highlights: [
      "Role-based applicant & recruiter dashboards with automated status progression",
      "Stateless security via JWT verification and cryptographic bcrypt salting",
      "40+ modular RESTful endpoints handling jobs, applications, profiles, and queries",
      "Low-latency Socket.IO bidirectional channels with sub-50ms packet delivery",
    ],
    blueprint: "React Client ↔ Express REST / Socket.IO Gateway ↔ Mongoose Collections (MongoDB)",
  },
  {
    id: "cineai",
    edition: "02",
    badge: "AI & DOLBY ATMOS",
    category: "AI & MULTIMODAL",
    title: "CINEAI",
    subtitle: "Intelligent Cinema & AI Booking Platform (2026)",
    desc: "Production-grade cinema ticketing platform featuring an AI Acoustic Sweet Spot calibration algorithm, real-time Web Speech conversational concierge with TTS narration, in-seat gourmet dining pre-orders, and cryptographically verified digital QR gate passes.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=900&auto=format&fit=crop",
    urlDisplay: "cineai-pi-steel.vercel.app",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Web Speech API", "REST APIs", "Tailwind CSS"],
    demoUrl: "https://cineai-pi-steel.vercel.app/",
    githubUrl: "https://github.com/riteshraj851116/cineai",
    telemetry: [
      { label: "ACOUSTIC ZONE", val: "DOLBY ATMOS", tag: "64-CH CALIBRATION" },
      { label: "VOICE AI ENGINE", val: "WEB SPEECH", tag: "STT & TTS NARRATION" },
      { label: "BOOKING FLOW", val: "4-STAGE", tag: "SEATS + CONCESSIONS" },
      { label: "PASS SECURITY", val: "256-BIT QR", tag: "CRYPTOGRAPHIC GATE" },
    ],
    highlights: [
      "Acoustic sweet spot algorithm optimizing seats based on Dolby Atmos sound & viewing angles",
      "Multimodal conversational cinema concierge with voice recognition & speech synthesis",
      "4-stage booking lifecycle: dynamic seat mapping, gourmet concessions, and coupon engine",
      "Zero-latency failover caching & Mongoose database guardrails ensuring 100% uptime",
    ],
    blueprint: "Vite SPA ↔ Express REST APIs ↔ Web Speech AI ↔ Cryptographic QR Passes",
  },
  {
    id: "velocedrive",
    edition: "03",
    badge: "MERN STACK",
    category: "FULL STACK MERN",
    title: "TERACAR",
    subtitle: "Car Rental Management System (2026)",
    desc: "End-to-end vehicle rental platform managing fleet discovery, real-time availability checks, and booking pipelines. Features Mongoose query optimization under 200ms, 15+ atomic React components, and custom auth middleware.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&auto=format&fit=crop",
    urlDisplay: "teracar-tan.vercel.app",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT Auth", "Tailwind CSS"],
    demoUrl: "https://teracar-tan.vercel.app/",
    githubUrl: "https://github.com/riteshraj851116/teracar",
    telemetry: [
      { label: "INDEX SCAN", val: "<200ms", tag: "COMPOUND INDEXING" },
      { label: "ATOMIC UI", val: "15+ COMP", tag: "REUSABLE REACT" },
      { label: "PAYLOAD SHIELD", val: "EXPRESS", tag: "CUSTOM MIDDLEWARE" },
      { label: "RESERVATION", val: "DATE-BASED", tag: "FLEET PIPELINE" },
    ],
    highlights: [
      "End-to-end car rental booking lifecycle from search queries to final reservation",
      "Mongoose compound index optimization reducing vehicle filter lookups to <200ms",
      "Responsive admin control dashboard crafted with 15+ modular React components",
      "Strict payload validation, JWT authorization, and structured error handling",
    ],
    blueprint: "React Client ↔ Express Middleware ↔ Indexed Mongoose Models (MongoDB)",
  },
];

const NewspaperProjects = () => {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState({});
  const [activeFilter, setActiveFilter] = useState("ALL");

  const getCardTab = (id) => activeTab[id] || "overview";
  const setCardTab = (id, tab) => {
    try {
      playClickSound();
    } catch (e) {}
    setActiveTab((prev) => ({ ...prev, [id]: tab }));
  };

  const categories = ["ALL", "AI & MULTIMODAL", "REAL-TIME & EVENT", "FULL STACK MERN"];

  const filteredProjects =
    activeFilter === "ALL"
      ? projectsData
      : projectsData.filter((p) => p.category === activeFilter);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Editorial Header Reveal
      gsap.fromTo(
        ".projects-editorial-header",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".projects-editorial-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Project Cards Stagger Entrance
      gsap.fromTo(
        ".project-broadsheet-card",
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-broadsheet-grid",
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [activeFilter]);

  // GSAP 3D Perspective Tilt on Mouse Movement
  const handleCardMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 5;
    const rotateX = -(y / (rect.height / 2)) * 5;

    gsap.to(cardEl, {
      rotateX,
      rotateY,
      transformPerspective: 1200,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleCardMouseLeave = (cardEl) => {
    if (!cardEl) return;
    gsap.to(cardEl, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <section className="newspaper-projects-section" id="work" ref={sectionRef}>
      {/* SECTION HEADER EDITORIAL SPREAD */}
      <div className="projects-editorial-header">
        <div className="header-column-left">
          <div className="section-label-row">
            <span className="section-label font-blackletter">The Gazette of Works</span>
            <span className="section-dot-pulse" title="Production Verified" />
            <span className="section-meta-tag">VOL. 2026 // EDITIONS 01–03</span>
          </div>
          <h2 className="projects-headline-lead">
            Fresh entries — A curated catalog of verified full-stack engineering releases.
          </h2>

          {/* EDITORIAL CATEGORY FILTER TABS */}
          <div className="projects-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-tab-btn ${activeFilter === cat ? "is-active" : ""}`}
                onClick={() => {
                  try {
                    playClickSound();
                  } catch (e) {}
                  setActiveFilter(cat);
                }}
                onMouseEnter={() => {
                  try {
                    playHoverBlip();
                  } catch (e) {}
                }}
              >
                {cat === "ALL" ? `ALL EDITIONS (${projectsData.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="header-column-right">
          <h2 className="projects-headline-huge">
            <span>THINK, CODE</span>
            <span className="deliver-word font-blackletter">Delivered</span>
          </h2>
        </div>
      </div>

      {/* BROADSHEET PROJECT GRID WITH GSAP 3D TILT */}
      <div className="projects-broadsheet-grid">
        {filteredProjects.map((project) => {
          const currentTab = getCardTab(project.id);

          return (
            <article
              key={project.id}
              className="project-broadsheet-card"
              onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
              onMouseEnter={() => {
                try {
                  playHoverBlip();
                } catch (e) {}
              }}
            >
              {/* TOP BAR: EDITION & LIVE BADGE */}
              <div className="card-top-bar">
                <div className="card-top-left">
                  <span className="card-edition-num">EDITION {project.edition} // RELEASE</span>
                  <span className="status-live-beacon" title="Production System Active">
                    <span className="beacon-dot" />
                    LIVE // 200 OK
                  </span>
                </div>
                <span className="card-badge">{project.badge}</span>
              </div>

              {/* BROWSER WINDOW VISUAL FRAME */}
              <div className="card-browser-mock">
                <div className="browser-chrome-bar">
                  <div className="browser-window-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-amber" />
                    <span className="dot dot-green" />
                  </div>
                  <div className="browser-url-pill">
                    <span className="url-lock-icon">🔒</span>
                    <span className="url-domain">https://{project.urlDisplay}</span>
                  </div>
                  <span className="browser-status-chip">TLS 1.3</span>
                </div>

                <div className="card-visual-frame">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="card-visual-img"
                    loading="lazy"
                  />
                  <div className="visual-hover-backdrop">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="visual-hover-action-btn"
                      onClick={() => {
                        try {
                          playClickSound();
                        } catch (e) {}
                      }}
                    >
                      <span>LAUNCH APPLICATION</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                  <div className="visual-overlay-stamp">
                    <span>VERIFIED 2026 BUILD</span>
                  </div>
                </div>
              </div>

              {/* IN-CARD INTERACTIVE VIEW SWITCHER */}
              <div className="card-view-tabs">
                <button
                  type="button"
                  className={`card-tab-btn ${currentTab === "overview" ? "active" : ""}`}
                  onClick={() => setCardTab(project.id, "overview")}
                >
                  <span>✦ OVERVIEW</span>
                </button>
                <button
                  type="button"
                  className={`card-tab-btn ${currentTab === "telemetry" ? "active" : ""}`}
                  onClick={() => setCardTab(project.id, "telemetry")}
                >
                  <span>◈ TELEMETRY</span>
                </button>
                <button
                  type="button"
                  className={`card-tab-btn ${currentTab === "highlights" ? "active" : ""}`}
                  onClick={() => setCardTab(project.id, "highlights")}
                >
                  <span>✓ BLUEPRINT</span>
                </button>
              </div>

              {/* CARD BODY: DYNAMICALLY SWITCHED BASED ON TAB */}
              <div className="card-body">
                {currentTab === "overview" && (
                  <div className="tab-pane tab-overview animate-fade-in">
                    <div className="card-heading-group">
                      <h3 className="card-title">{project.title}</h3>
                      <h4 className="card-subtitle">{project.subtitle}</h4>
                    </div>
                    <p className="card-description">{project.desc}</p>

                    <div className="card-tech-strip">
                      {project.tech.map((t) => (
                        <span key={t} className="tech-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentTab === "telemetry" && (
                  <div className="tab-pane tab-telemetry animate-fade-in">
                    <div className="telemetry-header-bar">
                      <span className="telemetry-section-tag font-blackletter">System Telemetry</span>
                      <span className="telemetry-live-pill">BENCHMARKS</span>
                    </div>

                    <div className="card-telemetry-grid">
                      {project.telemetry.map((item) => (
                        <div key={item.label} className="telemetry-block">
                          <span className="telemetry-block-val">{item.val}</span>
                          <strong className="telemetry-block-label">{item.label}</strong>
                          <span className="telemetry-block-tag">{item.tag}</span>
                        </div>
                      ))}
                    </div>

                    <div className="card-blueprint-box">
                      <span className="blueprint-label">PIPELINE ARCHITECTURE:</span>
                      <code className="blueprint-code">{project.blueprint}</code>
                    </div>
                  </div>
                )}

                {currentTab === "highlights" && (
                  <div className="tab-pane tab-highlights animate-fade-in">
                    <div className="highlights-header-bar">
                      <span className="highlights-section-tag font-blackletter">Verified Engineering</span>
                      <span className="highlights-tag-pill">4 DELIVERABLES</span>
                    </div>

                    <ul className="card-highlights-list">
                      {project.highlights.map((h, i) => (
                        <li key={i} className="highlight-item">
                          <CheckCircle2 size={15} className="highlight-check-icon" />
                          <span className="highlight-text">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* BOTTOM ACTION BAR */}
                <div className="card-actions-bar">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="action-link-fill"
                    onClick={() => {
                      try {
                        playClickSound();
                      } catch (e) {}
                    }}
                  >
                    <span>LIVE LAUNCH</span>
                    <ArrowUpRight size={15} />
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="action-link-line"
                    onClick={() => {
                      try {
                        playClickSound();
                      } catch (e) {}
                    }}
                  >
                    <GithubIcon size={14} />
                    <span>SOURCE CODE</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default NewspaperProjects;
