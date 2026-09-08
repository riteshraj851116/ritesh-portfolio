import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ExternalLink,
  Layers,
  Sparkles,
  Eye,
  CheckCircle2,
  X,
  Code2,
  Terminal,
  Activity,
  Server,
  Zap,
  Search,
  Cpu,
  MonitorPlay,
  Flame,
  Globe,
  Radio,
  Clock,
  ChevronRight,
  BookmarkCheck,
} from "lucide-react";
import "./Projects.css";

gsap.registerPlugin(ScrollTrigger);

// Custom GitHub Icon SVG
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
    categoryKey: "fullstack",
    subtitle: "FULL STACK JOB PORTAL",
    category: "CAREER RECRUITMENT & REAL-TIME PLATFORM",
    tagline: "Full-stack job portal connecting job seekers & recruiters with real-time Socket.IO chat.",
    description:
      "A full-stack job portal designed to connect job seekers and recruiters smoothly on a single unified platform. Features secure JWT/bcrypt authentication, 40+ REST API endpoints for job search and profiles, and real-time live messaging powered by Socket.IO with sub-50ms message latency.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Socket.IO", "bcrypt", "REST APIs"],
    highlights: [
      "Secure user authentication with JWT and bcrypt ensuring 100% data protection for passwords",
      "Clean RESTful APIs (40+ endpoints) in Node.js to handle job postings, profiles, and queries",
      "Socket.IO integration for real-time live chat between users with message delay under 50ms",
      "Dynamic candidate search, recruiter ATS pipeline, and status tracking",
    ],
    accentColor: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.28)",
    liveUrl: "https://riteshraj851116.github.io/jobsphere/",
    githubUrl: "https://github.com/riteshraj851116/jobsphere",
    badge: "MERN & SOCKET.IO",
    architecture: "Event-driven MERN stack architecture with JWT authorization and Socket.IO bidirectional channels.",
    status: "Live Project",
    metrics: { "REST Endpoints": "40+ APIs", "Chat Delay": "<50ms", "Data Security": "JWT + Bcrypt", "Recruiter ATS": "100% Automated" },
    terminalCode: {
      framework: "Express / Socket.IO",
      auth: "JWT + Bcrypt Encryption",
      dbQuery: "db.jobs.aggregate([{$match: {status: 'ACTIVE'}}])",
      uptime: "99.98% Healthy",
    },
  },
  {
    id: "02",
    number: "02",
    name: "VELOCEDRIVE",
    categoryKey: "fullstack",
    subtitle: "CAR RENTAL MANAGEMENT SYSTEM",
    category: "FLEET BOOKING & VEHICLE MANAGEMENT",
    tagline: "Complete car rental platform with Mongoose dynamic filter engine and owner dashboard.",
    description:
      "A comprehensive car rental application handling everything from searching verified cars to final booking. Built with a fast search and filter system in Mongoose (<200ms latency), a dedicated owner dashboard with 15+ reusable React components, and secure Express middleware.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "REST APIs", "Tailwind CSS"],
    highlights: [
      "End-to-end car rental booking lifecycle from search queries to final reservation",
      "Fast Mongoose query optimization enabling vehicle filtering in under 200ms",
      "Dedicated owner admin dashboard crafted with 15+ reusable, modular React components",
      "Secured backend operations and sensitive data using industry-standard Express middleware",
    ],
    accentColor: "#3b82f6",
    accentGlow: "rgba(59, 130, 246, 0.28)",
    liveUrl: "https://riteshraj851116.github.io/teracar/",
    githubUrl: "https://github.com/riteshraj851116/teracar",
    badge: "MERN STACK",
    architecture: "RESTful MERN architecture with Mongoose indexing, JWT auth, and modular React component design.",
    status: "Production Ready",
    metrics: { "Query Speed": "<200ms", "UI Components": "15+ Reusable", "API Security": "Express Shield", "Fleet Engine": "Full Lifecycle" },
    terminalCode: {
      framework: "Node.js / Express",
      orm: "Mongoose Indexed Models",
      bookingLogic: "Vehicle.find({available: true, dates: {$nin: range}})",
      protection: "Helmet + JWT Middleware",
    },
  },
  {
    id: "03",
    number: "03",
    name: "RCB FAN TEAM",
    categoryKey: "frontend",
    subtitle: "HIGH-PERFORMANCE FRONTEND WEB",
    category: "SPORTS PORTAL & TEAM EXPERIENCE",
    tagline: "Ultra-responsive fan website scoring 90+ on Lighthouse with real-time roster updates.",
    description:
      "A fast, modern, and responsive fan website built using React.js and Vite, achieving a 90+ score on Lighthouse performance audits. Features seamless React state management for live match updates and team rosters without page reloads, styled with responsive CSS Grid and Flexbox.",
    tech: ["React.js", "JavaScript (ES6+)", "HTML5", "CSS3", "Vite", "CSS Grid & Flexbox"],
    highlights: [
      "Scored 90+ on Lighthouse performance audits through optimized Vite builds",
      "React state management delivering live match updates and roster views without reloads",
      "Pixel-perfect responsive layouts crafted with CSS Grid & Flexbox across all screen sizes",
      "Smooth micro-interactions and high-fidelity team showcase visual layout",
    ],
    accentColor: "#ef4444",
    accentGlow: "rgba(239, 68, 68, 0.28)",
    liveUrl: "https://riteshraj851116.github.io/rcb-fan-website/",
    githubUrl: "https://github.com/riteshraj851116/rcb-fan-website",
    badge: "REACT & VITE",
    architecture: "Optimized Vite build pipeline with atomic component structure and responsive CSS architecture.",
    status: "90+ Lighthouse",
    metrics: { "Lighthouse Score": "90+ Performance", "Bundle Engine": "Vite ESM", "Layout Architecture": "Grid & Flexbox", "Page Reloads": "Zero / SPA" },
    terminalCode: {
      bundler: "Vite Rollup ESM",
      performance: "Lighthouse 90+ Verified",
      renderEngine: "React 19 Concurrent UI",
      styling: "Pure CSS Architecture",
    },
  },
];

const categories = [
  { id: "all", label: "ALL WORK" },
  { id: "fullstack", label: "FULL STACK / MERN" },
  { id: "frontend", label: "FRONTEND & UI" },
];

const Projects = () => {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCardTab, setActiveCardTab] = useState({}); // { [projectId]: 'terminal' | 'metrics' | 'architecture' }
  const [copiedId, setCopiedId] = useState(null);

  const getTabForProject = (id) => activeCardTab[id] || "terminal";

  const setTabForProject = (id, tab) => {
    setActiveCardTab((prev) => ({ ...prev, [id]: tab }));
  };

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProjects = projectsData.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.categoryKey === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".project-row");

      rows.forEach((row, index) => {
        gsap.fromTo(
          row,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [activeCategory, searchQuery]);

  const openProjectModal = (project) => {
    setSelectedProject(project);
  };

  const handleMouseMove = (event) => {
    if (window.innerWidth <= 768) return;

    const row = event.currentTarget;
    const card = row.querySelector(".project-card");
    const cardContent = row.querySelector(".project-card-content");
    const giantText = row.querySelector(".project-giant-text");

    if (!card) return;

    const rect = card.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (mouseX - centerX) / centerX;
    const percentY = (mouseY - centerY) / centerY;

    const rotateY = percentX * 14;
    const rotateX = percentY * -10;

    gsap.to(card, {
      rotateX,
      rotateY,
      rotateZ: percentX * 1.5,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (cardContent) {
      gsap.to(cardContent, {
        x: percentX * 15,
        y: percentY * 15,
        z: 45,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (giantText) {
      gsap.to(giantText, {
        x: percentX * -10,
        y: percentY * -6,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseEnter = (event) => {
    if (window.innerWidth <= 768) return;
    const row = event.currentTarget;
    const card = row.querySelector(".project-card");
    if (!card) return;

    gsap.to(card, {
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (event) => {
    const row = event.currentTarget;
    const card = row.querySelector(".project-card");
    const cardContent = row.querySelector(".project-card-content");
    const giantText = row.querySelector(".project-giant-text");

    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      overwrite: "auto",
    });

    if (cardContent) {
      gsap.to(cardContent, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (giantText) {
      gsap.to(giantText, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  return (
    <section className="projects-section" id="projects" ref={sectionRef}>
      {/* SECTION HEADER */}
      <div className="projects-top">
        <div className="projects-top-left">
          <span className="projects-tag">04 / SELECTED WORK</span>
          <span className="projects-subtag">ENGINEERED FOR PRODUCTION</span>
        </div>

        <div className="projects-top-right">
          <span className="live-status-pill">
            <Radio size={12} className="pulse-icon text-green" />
            <span>ALL PROJECTS LIVE</span>
          </span>
          <span className="projects-count-indicator">
            {filteredProjects.length.toString().padStart(2, "0")} OF {projectsData.length.toString().padStart(2, "0")} SHOWCASED
          </span>
        </div>
      </div>

      {/* FILTER CATEGORY PILLS & LIVE SEARCH */}
      <div className="projects-filter-bar">
        <div className="projects-filter-left">
          <div className="projects-filter-label">
            <Layers size={13} />
            <span>FILTER STACK</span>
          </div>
          <div className="projects-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
                {cat.id === "all" ? (
                  <span className="filter-count">{projectsData.length}</span>
                ) : (
                  <span className="filter-count">
                    {projectsData.filter((p) => p.categoryKey === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* LIVE SEARCH BAR */}
        <div className="projects-search-box">
          <Search size={13} className="search-icon" />
          <input
            type="text"
            placeholder="Search projects (e.g. JobSphere, VeloceDrive, RCB)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="projects-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="search-clear-btn"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* PROJECTS LIST */}
      <div className="projects-list">
        {filteredProjects.length === 0 ? (
          <div className="no-projects-found">
            <span>NO MATCHING PROJECTS FOUND FOR "{searchQuery}"</span>
            <button
              className="reset-search-btn"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <article
              className="project-row"
              key={project.id}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ "--project-accent": project.accentColor, "--project-glow": project.accentGlow }}
            >
              {/* LEFT NUMBER */}
              <div className="project-number-col">
                <span className="project-number">{project.number}</span>
                <span className="project-dot" style={{ backgroundColor: project.accentColor }}></span>
              </div>

              {/* CENTER DETAILS */}
              <div className="project-details">
                <div className="project-heading-group">
                  <div className="project-heading">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-title-link"
                    >
                      <h2>{project.name}</h2>
                    </a>
                    <button
                      className="project-round-arrow"
                      onClick={() => openProjectModal(project)}
                      title="View Project Specifications"
                      aria-label={`View ${project.name} details`}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>

                  <div className="project-meta-badges">
                    <span className="project-category-badge">{project.subtitle}</span>
                    <span className="project-status-badge">
                      <span className="live-indicator-dot"></span>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="project-description-block">
                  <p className="project-summary">{project.description}</p>

                  {/* HIGHLIGHT FEATURES BULLETS */}
                  <div className="project-features-list">
                    {project.highlights.slice(0, 3).map((highlight, idx) => (
                      <div key={idx} className="feature-item">
                        <CheckCircle2 size={12} className="feature-check" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* TECH STACK BADGES */}
                  <div className="project-tech-tags">
                    {project.tech.map((t, idx) => (
                      <span key={idx} className="tech-badge">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="project-actions">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-btn project-btn-primary"
                  >
                    <Globe size={14} />
                    <span>LAUNCH LIVE DEMO</span>
                    <ExternalLink size={13} />
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-btn project-btn-secondary"
                  >
                    <GithubIcon size={15} />
                    <span>VIEW GITHUB REPO</span>
                  </a>

                  <button
                    onClick={() => openProjectModal(project)}
                    className="project-btn project-btn-details"
                  >
                    <Eye size={14} />
                    <span>SPECS & ARCHITECTURE</span>
                  </button>
                </div>
              </div>

              {/* RIGHT 3D INTERACTIVE VISUAL CARD */}
              <div className="project-visual">
                <div
                  className="project-card"
                  role="region"
                  aria-label={`${project.name} interactive card`}
                >
                  <div className="project-card-background"></div>
                  <div className="project-lines"></div>
                  <div
                    className="project-glow"
                    style={{ background: project.accentGlow }}
                  ></div>

                  {/* GIANT BACKGROUND TITLE */}
                  <div className="project-giant-text">{project.name}</div>

                  {/* CARD CONTENT LAYER */}
                  <div className="project-card-content">
                    {/* CARD HEADER */}
                    <div className="card-top">
                      <div className="card-top-id">
                        <span className="card-badge" style={{ borderColor: project.accentColor }}>
                          {project.badge}
                        </span>
                        <span>RRS / {project.number}</span>
                      </div>

                      <div className="card-view-switchers">
                        <button
                          className={`switch-tab ${getTabForProject(project.id) === "terminal" ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTabForProject(project.id, "terminal");
                          }}
                        >
                          CONFIG
                        </button>
                        <button
                          className={`switch-tab ${getTabForProject(project.id) === "metrics" ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTabForProject(project.id, "metrics");
                          }}
                        >
                          METRICS
                        </button>
                      </div>
                    </div>

                    {/* CARD TERMINAL / DASHBOARD BODY */}
                    <div className="card-center">
                      <div className="card-mockup-window">
                        <div className="window-bar">
                          <div className="window-dots">
                            <span className="w-dot red"></span>
                            <span className="w-dot yellow"></span>
                            <span className="w-dot green"></span>
                          </div>
                          <span className="window-title">
                            <Terminal size={10} /> {project.name.toLowerCase().replace(/\s+/g, "-")}.config.js
                          </span>
                          <span className="window-status-pill">LIVE DEPLOY</span>
                        </div>

                        {getTabForProject(project.id) === "terminal" ? (
                          <div className="window-body">
                            <div className="code-line">
                              <span className="c-keyword">const</span>{" "}
                              <span className="c-var">{project.name.replace(/\s+/g, "")}</span> = {"{"}
                            </div>
                            <div className="code-line indent">
                              <span className="c-prop">framework:</span>{" "}
                              <span className="c-val">"{project.terminalCode.framework || project.badge}"</span>,
                            </div>
                            <div className="code-line indent">
                              <span className="c-prop">status:</span>{" "}
                              <span className="c-val green">"HEALTHY (200 OK)"</span>,
                            </div>
                            <div className="code-line indent">
                              <span className="c-prop">query:</span>{" "}
                              <span className="c-val yellow">"{project.terminalCode.dbQuery || project.terminalCode.bookingLogic || project.terminalCode.bundler}"</span>
                            </div>
                            <div className="code-line">{"};"}</div>
                          </div>
                        ) : (
                          <div className="window-metrics-body">
                            {Object.entries(project.metrics).map(([key, val], idx) => (
                              <div key={idx} className="metric-row-pill">
                                <span className="m-label">{key}</span>
                                <span className="m-val" style={{ color: project.accentColor }}>{val}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="card-caption-group">
                        <h3 className="card-project-title">{project.name}</h3>
                        <p className="card-tagline">{project.tagline}</p>
                      </div>
                    </div>

                    {/* CARD BOTTOM STATS BAR */}
                    <div className="card-bottom">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-direct-live-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe size={11} />
                        <span>OPEN APP</span>
                        <ArrowUpRight size={11} />
                      </a>

                      <button
                        onClick={() => openProjectModal(project)}
                        className="card-inspect-hint"
                      >
                        <span>FULL ARCHITECTURE</span>
                        <Zap size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="card-corner"></div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="projects-bottom">
        <div className="projects-bottom-left">
          <span>03 FEATURED PRODUCTION APPS</span>
          <span>•</span>
          <span>FULL STACK MERN & VITE ARCHITECTURES</span>
        </div>

        <div className="projects-bottom-right">
          <span>ALL PROJECTS HOSTED LIVE ON GITHUB</span>
          <a
            href="https://github.com/riteshraj851116"
            target="_blank"
            rel="noopener noreferrer"
            className="bottom-github-link"
          >
            <span>@riteshraj851116</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* PROJECT DETAILS SPEC MODAL */}
      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="project-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ "--modal-accent": selectedProject.accentColor }}
          >
            <button
              className="modal-close-btn"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="modal-header">
              <div className="modal-top-tags">
                <span className="modal-badge">{selectedProject.badge}</span>
                <span className="modal-number">PROJECT #{selectedProject.number}</span>
                <span className="modal-live-indicator">● LIVE DEMO ONLINE</span>
              </div>
              <h2 className="modal-title">{selectedProject.name}</h2>
              <p className="modal-subtitle">{selectedProject.subtitle}</p>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>
                  <Code2 size={15} /> OVERVIEW & OBJECTIVE
                </h4>
                <p>{selectedProject.description}</p>
              </div>

              <div className="modal-section">
                <h4>
                  <Sparkles size={15} /> KEY ENGINEERING HIGHLIGHTS
                </h4>
                <ul className="modal-highlights-list">
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} className="h-check" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h4>
                  <Server size={15} /> ARCHITECTURE & VERIFIED METRICS
                </h4>
                <div className="modal-architecture-box">
                  <p>{selectedProject.architecture}</p>
                  <div className="modal-stats-grid">
                    {Object.entries(selectedProject.metrics).map(([k, v], i) => (
                      <div key={i} className="m-stat-card">
                        <span className="stat-label">{k.toUpperCase()}</span>
                        <span className="stat-value">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>
                  <Layers size={15} /> COMPLETE TECH STACK
                </h4>
                <div className="modal-tech-cloud">
                  {selectedProject.tech.map((tech, i) => (
                    <span key={i} className="modal-tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => handleCopyLink(selectedProject.liveUrl, selectedProject.id)}
                className="modal-btn modal-btn-secondary"
              >
                <BookmarkCheck size={15} />
                <span>{copiedId === selectedProject.id ? "LINK COPIED!" : "COPY LIVE URL"}</span>
              </button>

              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-btn modal-btn-secondary"
              >
                <GithubIcon size={16} />
                <span>GITHUB REPO</span>
              </a>

              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-btn modal-btn-primary"
              >
                <span>VISIT LIVE DEMO</span>
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