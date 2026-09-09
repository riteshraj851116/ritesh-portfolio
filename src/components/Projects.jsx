import { useState, useEffect } from "react";
import { ArrowUpRight, ExternalLink, CheckCircle2, X, Globe, Zap } from "lucide-react";
import {
  playClickSound,
  playHoverSound,
  playTelemetryScan,
  playEngineRevSound,
  playCockpitWhoosh,
} from "../utils/audio";
import { attach3DCardTilt } from "../utils/gsapKinematics";
import "./Projects.css";

const GithubIcon = ({ size = 15 }) => (
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
    id: "01",
    number: "01",
    name: "JOBSPHERE",
    subtitle: "FULL STACK RECRUITMENT PLATFORM",
    category: "CAREER PORTAL & REAL-TIME CHAT",
    badge: "MERN & SOCKET.IO",
    year: "2025",
    tagline: "Full-stack job portal connecting job seekers & recruiters with real-time Socket.IO chat.",
    description:
      "A complete full-stack job portal designed to connect job seekers and recruiters smoothly on a single platform. Features secure JWT/bcrypt authentication, 40+ REST API endpoints for job search, application pipelines, and real-time live messaging powered by Socket.IO with sub-50ms message latency.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.IO", "JWT Auth", "Bcrypt", "REST APIs"],
    highlights: [
      "Secure user authentication with JWT and bcrypt ensuring complete data protection",
      "Clean RESTful APIs (40+ endpoints) in Node.js to handle job postings, profiles, and queries",
      "Socket.IO integration for real-time live chat between users with message delay under 50ms",
      "Dynamic candidate search, recruiter ATS pipeline, and status tracking",
    ],
    metrics: { "REST APIs": "40+ Endpoints", "Chat Latency": "<50ms", "Auth Security": "JWT + Bcrypt", "Pipeline": "Automated ATS" },
    accentColor: "#d2ff00",
    liveUrl: "https://jobsphere-vercel.vercel.app",
    githubUrl: "https://github.com/riteshraj851116/jobsphere",
    terminalCode: {
      framework: "Express.js / Socket.IO",
      security: "JWT + Bcrypt Encryption",
      query: "db.jobs.aggregate([{$match: {status: 'ACTIVE'}}])",
      health: "200 OK — Production Live",
    },
  },
  {
    id: "02",
    number: "02",
    name: "TERACAR (VELOCEDRIVE)",
    subtitle: "CAR RENTAL MANAGEMENT SYSTEM",
    category: "FLEET BOOKING & VEHICLE ENGINE",
    badge: "MERN STACK",
    year: "2025",
    tagline: "Complete car rental platform with Mongoose dynamic filter engine and owner dashboard.",
    description:
      "A comprehensive car rental application handling everything from searching verified cars to final booking. Built with a fast search and filter system in Mongoose (<200ms latency), a dedicated owner dashboard with 15+ reusable React components, and secure Express middleware.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "Tailwind CSS", "JWT Auth", "REST APIs"],
    highlights: [
      "End-to-end car rental booking lifecycle from search queries to final reservation",
      "Fast Mongoose query optimization enabling vehicle filtering in under 200ms",
      "Dedicated owner admin dashboard crafted with 15+ reusable, modular React components",
      "Secured backend operations and sensitive data using industry-standard Express middleware",
    ],
    metrics: { "Query Latency": "<200ms", "UI Components": "15+ Modular", "Backend Shield": "Express Middleware", "Fleet Logic": "Full Lifecycle" },
    accentColor: "#38bdf8",
    liveUrl: "https://teracar-tan.vercel.app/",
    githubUrl: "https://github.com/riteshraj851116/teracar",
    terminalCode: {
      framework: "Node.js / Express / Mongoose",
      orm: "Indexed MongoDB Collections",
      query: "Vehicle.find({available: true, dates: {$nin: range}})",
      health: "Production Ready",
    },
  },
  {
    id: "03",
    number: "03",
    name: "RCB FAN TEAM",
    subtitle: "HIGH-PERFORMANCE FRONTEND WEB",
    category: "SPORTS PORTAL & TEAM EXPERIENCE",
    badge: "REACT & VITE",
    year: "2024",
    tagline: "Ultra-responsive fan website scoring 90+ on Lighthouse with real-time roster updates.",
    description:
      "A fast, modern, and responsive fan website built using React.js and Vite, achieving a 90+ score on Lighthouse performance audits. Features seamless React state management for live match updates and team rosters without page reloads, styled with responsive CSS Grid and Flexbox.",
    tech: ["React.js", "JavaScript ES6+", "HTML5", "CSS3 Grid/Flexbox", "Vite ESM Bundler"],
    highlights: [
      "Scored 90+ on Lighthouse performance audits through optimized Vite builds",
      "React state management delivering live match updates and roster views without reloads",
      "Pixel-perfect responsive layouts crafted with CSS Grid & Flexbox across all screen sizes",
      "Smooth micro-interactions and high-fidelity team showcase visual layout",
    ],
    metrics: { "Lighthouse": "90+ Score", "Build Tool": "Vite ESM", "Layout Model": "Grid & Flexbox", "Reloads": "Zero / SPA" },
    accentColor: "#f43f5e",
    liveUrl: "https://riteshraj851116.github.io/rcb-fan-website/",
    githubUrl: "https://github.com/riteshraj851116/rcb-fan-website",
    terminalCode: {
      bundler: "Vite Rollup ESM",
      audit: "Lighthouse 90+ Verified",
      renderEngine: "React 19 Concurrent UI",
      health: "Ultra Fast SPA",
    },
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTabs, setActiveTabs] = useState({});

  const getTab = (id) => activeTabs[id] || "config";
  const setTab = (id, tab) => setActiveTabs((prev) => ({ ...prev, [id]: tab }));

  useEffect(() => {
    const cards = document.querySelectorAll(".ln-helmet-card-wrap");
    const cleanups = [];
    cards.forEach((card) => {
      cleanups.push(attach3DCardTilt(card, { maxTilt: 7, perspective: 1000 }));
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section className="ln-helmets-section" id="hall-of-fame">
      <div className="lando-container">
        {/* TITLE LAYOUT (EXACT LANDONORRIS.COM HELMETS TITLE) */}
        <div className="ln-helmets-header">
          <div className="helmets-header-left">
            <span className="helmets-eyebrow">04 // SELECTED PRODUCTIONS</span>
            <h2 className="helmets-title">
              PROJECTS
              <br />
              <span className="font-display text-lime-off">HALL OF FAME</span>
            </h2>
          </div>

          <div className="helmets-header-right">
            <p className="helmets-desc">
              From real-time Socket.IO architectures with sub-50ms latency to high-performance Vite builds and complex MERN applications, each project represents full-stack precision engineered for production.
            </p>
            <div className="helmets-status-badge">
              <span className="pulse-beacon"></span>
              <span>ALL 3 PRODUCTIONS VERIFIED & LIVE</span>
            </div>
          </div>
        </div>

        {/* HELMETS GRID (EXACT LANDO NOTCHED POLYGON CARD GRID) */}
        <div className="ln-helmets-grid">
          {projectsData.map((project) => (
            <div key={project.id} className="ln-helmet-card-wrap">
              {/* THE NOTCHED CUT-CORNER SVG BORDER */}
              <div className="ln-helmet-frame-box">
                {/* LIME HOVER FRAME */}
                <svg
                  className="ln-helmet-svg is-hover"
                  viewBox="0 0 407 411"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1h390.89a7 7 0 0 1 7 7v356.983a7 7 0 0 1-7 7H263.329a23.999 23.999 0 0 0-18.766 9.038l-16.499 20.694A21.999 21.999 0 0 1 210.862 410H8a7 7 0 0 1-7-7V8a7 7 0 0 1 7-7Z"
                    stroke="var(--color--lime)"
                    strokeWidth="2.5"
                  />
                </svg>

                {/* BASE CARBON FRAME */}
                <svg
                  className="ln-helmet-svg is-base"
                  viewBox="0 0 407 411"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 .5h390.89a7.5 7.5 0 0 1 7.5 7.5v356.983a7.5 7.5 0 0 1-7.5 7.5H263.329a23.502 23.502 0 0 0-18.375 8.849l-16.499 20.695a22.502 22.502 0 0 1-17.593 8.473H8A7.5 7.5 0 0 1 .5 403V8A7.5 7.5 0 0 1 8 .5Z"
                    stroke="rgba(244, 244, 237, 0.2)"
                    strokeWidth="2"
                  />
                </svg>

                {/* INNER CARD BODY */}
                <div className="ln-helmet-inner">
                  {/* CARD TOP INFO */}
                  <div className="ln-card-top-row">
                    <div className="ln-card-pills">
                      <span className="ln-project-badge">{project.badge}</span>
                      <span className="ln-project-num">#{project.number}</span>
                    </div>

                    <div className="ln-card-view-tabs">
                      <button
                        className={`ln-tab-btn ${getTab(project.id) === "config" ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTab(project.id, "config");
                          playTelemetryScan();
                        }}
                        onMouseEnter={() => playHoverSound(30)}
                      >
                        CONFIG
                      </button>
                      <button
                        className={`ln-tab-btn ${getTab(project.id) === "metrics" ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTab(project.id, "metrics");
                          playTelemetryScan();
                        }}
                        onMouseEnter={() => playHoverSound(60)}
                      >
                        METRICS
                      </button>
                    </div>
                  </div>

                  {/* DISPLAY TERMINAL / METRICS */}
                  <div className="ln-card-window">
                    <div className="window-header">
                      <div className="window-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="window-title">
                        {project.name.toLowerCase().replace(/\s+/g, "-")}.config.js
                      </span>
                    </div>

                    {getTab(project.id) === "config" ? (
                      <div className="window-body">
                        <div className="code-line">
                          <span className="c-key">const</span> <span className="c-name">{project.name}</span> = &#123;
                        </div>
                        <div className="code-line indent">
                          <span className="c-prop">stack:</span> <span className="c-val">"{project.badge}"</span>,
                        </div>
                        <div className="code-line indent">
                          <span className="c-prop">status:</span> <span className="c-val text-lime">"{project.terminalCode.health}"</span>,
                        </div>
                        <div className="code-line indent">
                          <span className="c-prop">query:</span> <span className="c-val text-off-white">"{project.terminalCode.query || project.terminalCode.audit}"</span>
                        </div>
                        <div className="code-line">&#125;;</div>
                      </div>
                    ) : (
                      <div className="window-metrics">
                        {Object.entries(project.metrics).map(([k, v], i) => (
                          <div key={i} className="metric-item">
                            <span className="m-label">{k}</span>
                            <span className="m-val text-lime">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PROJECT META */}
                  <div className="ln-card-meta">
                    <div className="ln-meta-titles">
                      <h3 className="ln-project-title">{project.name}</h3>
                      <span className="ln-project-subtitle">{project.subtitle}</span>
                    </div>
                    <p className="ln-project-tagline">{project.tagline}</p>
                  </div>

                  {/* HIGHLIGHT FEATURES */}
                  <div className="ln-card-highlights">
                    {project.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="ln-highlight-row">
                        <CheckCircle2 size={12} className="text-lime" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* TECH PILLS */}
                  <div className="ln-card-tech">
                    {project.tech.slice(0, 4).map((t, i) => (
                      <span key={i} className="tech-chip">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* ACTION LAUNCH BAR */}
                  <div className="ln-card-actions">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ln-action-btn primary"
                      onClick={playEngineRevSound}
                      onMouseEnter={() => playHoverSound(50)}
                    >
                      <Globe size={13} />
                      <span>LAUNCH APP</span>
                      <ArrowUpRight size={13} />
                    </a>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ln-action-btn secondary"
                      onClick={playClickSound}
                      onMouseEnter={() => playHoverSound(20)}
                    >
                      <GithubIcon size={14} />
                      <span>GITHUB</span>
                    </a>

                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        playCockpitWhoosh();
                      }}
                      className="ln-action-btn spec"
                      onMouseEnter={() => playHoverSound(70)}
                    >
                      <span>SPECS</span>
                      <Zap size={12} />
                    </button>
                  </div>
                </div>

                {/* EXTENDER LIME CORNER (FROM LANDO NORRIS EXTENDER MASK) */}
                <div className="ln-helmet-extender">
                  <div className="extender-notch-line"></div>
                </div>
              </div>

              {/* CARD BOTTOM LABEL & YEAR */}
              <div className="ln-helmet-bottom-label">
                <span className="label-name">{project.name}</span>
                <span className="label-year">{project.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SPECIFICATIONS MODAL */}
      {selectedProject && (
        <div className="ln-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="ln-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="ln-modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="modal-top">
              <div className="modal-badge-row">
                <span className="modal-badge text-lime">{selectedProject.badge}</span>
                <span className="modal-num">PROJECT #{selectedProject.number}</span>
                <span className="modal-live-tag">● PRODUCTION DEPLOYED</span>
              </div>
              <h2 className="modal-title">{selectedProject.name}</h2>
              <p className="modal-subtitle">{selectedProject.subtitle}</p>
            </div>

            <div className="modal-sections">
              <div className="modal-sec">
                <h4>OVERVIEW & ARCHITECTURE</h4>
                <p>{selectedProject.description}</p>
              </div>

              <div className="modal-sec">
                <h4>KEY VERIFIED HIGHLIGHTS</h4>
                <ul className="modal-list">
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} className="text-lime" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-sec">
                <h4>VERIFIED METRICS</h4>
                <div className="modal-metrics-grid">
                  {Object.entries(selectedProject.metrics).map(([k, v], i) => (
                    <div key={i} className="modal-m-card">
                      <span className="m-label">{k}</span>
                      <strong className="m-val text-lime">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-sec">
                <h4>COMPLETE TECH STACK</h4>
                <div className="modal-tech-cloud">
                  {selectedProject.tech.map((t, i) => (
                    <span key={i} className="m-tech-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer-actions">
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ln-btn ln-btn-outline"
                onClick={playClickSound}
              >
                <GithubIcon size={16} />
                <span>GITHUB CODE</span>
              </a>

              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ln-btn ln-btn-lime"
                onClick={playClickSound}
              >
                <span>OPEN LIVE WEB APP</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;