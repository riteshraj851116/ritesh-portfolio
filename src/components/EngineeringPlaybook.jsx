import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  FileText,
  Code2,
  Cpu,
  ShieldCheck,
  Zap,
  Globe,
  Award,
} from "lucide-react";
import {
  playPaperFlipSound,
  playHoverSound,
  playTelemetryScan,
  playCockpitWhoosh,
} from "../utils/audio";
import "./EngineeringPlaybook.css";

const pagesData = [
  // SPREAD 0: COVER
  {
    type: "cover",
    title: "TECHNICAL DOSSIER",
    subtitle: "RITESH RAJ // MERN & DSA PLAYBOOK",
    issue: "VOL. 01 — 2026 CHASSIS SPEC",
    serial: "DOC-RR-MERN-851116",
    status: "VERIFIED & PRODUCTION READY",
    dept: "DEPARTMENT OF FULL-STACK SYSTEMS",
    stamp: "OFFICIAL TELEMETRY SPECIFICATION",
  },
  // SPREAD 1: JOBSPHERE SYSTEM BLUEPRINT & LATENCY TELEMETRY
  {
    type: "spread",
    pageLeft: {
      pageNum: "01",
      category: "SYSTEM ARCHITECTURE",
      title: "JobSphere Real-Time Pipeline",
      docId: "SPEC-MERN-40API",
      diagram: true,
      sections: [
        {
          label: "01 / CLIENT LAYER",
          value: "React 19 + Vite + Tailwind/Custom CSS. Optimistic UI updates with instant message caching.",
        },
        {
          label: "02 / EVENT BUS (SOCKET.IO)",
          value: "Bi-directional WebSocket protocol running with <50ms roundtrip delivery for candidate-recruiter messaging.",
        },
        {
          label: "03 / REST BACKEND (NODE / EXPRESS)",
          value: "40+ modular endpoints: candidate submission, recruiter workflows, JWT cryptographic token verification, and bcrypt hashing.",
        },
        {
          label: "04 / DATA PERSISTENCE (MONGODB)",
          value: "Mongoose ODM schemas with indexed queries on applicant statuses, user roles, and chat channels.",
        },
      ],
      note: "Architecture verified for high concurrent socket connections.",
    },
    pageRight: {
      pageNum: "02",
      category: "LATENCY & SECURITY BENCHMARKS",
      title: "Production Performance Metrics",
      docId: "METRIC-BENCH-02",
      benchmarks: [
        { metric: "<50ms", desc: "WebSocket Packet Latency", tag: "OPTIMAL" },
        { metric: "100%", desc: "Bcrypt Salting & JWT Defense", tag: "SECURED" },
        { metric: "40+", desc: "Structured REST Endpoints", tag: "DOCUMENTED" },
        { metric: "95+", desc: "Lighthouse Performance Index", tag: "AUDITED" },
      ],
      codeSnippet: `// Cryptographic JWT Auth & Socket Handshake
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("AUTH_REQUIRED"));
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("TOKEN_INVALID"));
    socket.userId = decoded.id;
    next();
  });
});`,
      note: "Tested under simulated multi-client recruiter traffic conditions.",
    },
  },
  // SPREAD 2: DSA & ALGORITHMIC RIGOR + ACADEMICS
  {
    type: "spread",
    pageLeft: {
      pageNum: "03",
      category: "ALGORITHMIC LOGBOOK",
      title: "Java DSA & Complexity Notes",
      docId: "DSA-JAVA-200",
      sections: [
        {
          label: "CURRICULUM MASTERY",
          value: "200+ LeetCode problems solved across Java DSA (Apna College Alpha Cohort).",
        },
        {
          label: "DATA STRUCTURE REPERTOIRE",
          value: "Binary Trees, BST, Graphs (BFS/DFS, Dijkstra), Dynamic Programming (0/1 Knapsack, LCS), Tries, and Backtracking.",
        },
        {
          label: "OPTIMIZATION PARADIGM",
          value: "Prioritizing O(1) auxiliary memory where applicable and O(N log N) asymptotic upper bounds.",
        },
      ],
      complexityGrid: [
        { algo: "Two-Pointer Sort", time: "O(N)", space: "O(1)" },
        { algo: "Binary Tree DFS", time: "O(N)", space: "O(H)" },
        { algo: "Graph Dijkstra", time: "O((V+E)logV)", space: "O(V)" },
        { algo: "DP Memoization", time: "O(N*W)", space: "O(N*W)" },
      ],
      note: "Rigorous algorithmic problem solving for robust backend data processing.",
    },
    pageRight: {
      pageNum: "04",
      category: "VERIFIED CREDENTIALS",
      title: "Academic Track & Certification",
      docId: "EDU-GU-2027",
      milestones: [
        {
          year: "2023 - 2027",
          title: "B.Tech Computer Science & Engineering",
          inst: "Galgotias University, Greater Noida",
          highlight: "Core: Data Structures, OOP, DBMS, OS, Computer Networks.",
        },
        {
          year: "2024",
          title: "MERN Stack Development Certification",
          inst: "Ducat India",
          highlight: "Hands-on Full-Stack Architecture, Node/Express, React, MongoDB.",
        },
        {
          year: "2024",
          title: "Java Data Structures & Algorithms",
          inst: "Apna College Alpha Cohort",
          highlight: "200+ Core algorithmic challenges solved with verified completion.",
        },
        {
          year: "2023",
          title: "Senior Secondary Education (CBSE Class 12)",
          inst: "Kendriya Vidyalaya, Bihar (65% Science)",
          highlight: "Physics, Chemistry, Mathematics foundational focus.",
        },
      ],
      note: "All academic credentials and certifications backed by verified institutional records.",
    },
  },
  // SPREAD 3: DISPATCH CONTRACT (BACK COVER)
  {
    type: "backcover",
    title: "READY FOR FLIGHT",
    subtitle: "FULL-STACK MERN ENGINEER AVAILABLE FOR CONTRACT / ROLE",
    stamp: "FINAL INSPECTION PASSED",
    contact: {
      email: "riteshraj851116@gmail.com",
      phone: "+91 9709721676",
      github: "github.com/riteshraj851116",
      linkedin: "linkedin.com/in/ritesh-raj-9b52162a7",
      location: "Bihar, India (Open for Remote & Relocation to NCR / Bangalore)",
    },
  },
];

const EngineeringPlaybook = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState("forward");
  const playbookRef = useRef(null);

  const totalPages = pagesData.length;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection("forward");
      setIsFlipping(true);
      playPaperFlipSound();
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsFlipping(false);
      }, 500);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection("backward");
      setIsFlipping(true);
      playPaperFlipSound();
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsFlipping(false);
      }, 500);
    }
  };

  const jumpToPage = (idx) => {
    if (idx !== currentPage && !isFlipping) {
      setFlipDirection(idx > currentPage ? "forward" : "backward");
      setIsFlipping(true);
      playPaperFlipSound();
      setTimeout(() => {
        setCurrentPage(idx);
        setIsFlipping(false);
      }, 500);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goToNextPage();
      if (e.key === "ArrowLeft") goToPrevPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, isFlipping]);

  const activeSpread = pagesData[currentPage];

  return (
    <section className="ln-playbook-section" id="dossier">
      <div className="lando-container">
        {/* HEADER */}
        <div className="ln-playbook-header">
          <div className="playbook-header-left">
            <div className="playbook-eyebrow">
              <span className="eyebrow-badge">05 // TECHNICAL NOTEBOOK</span>
              <span className="eyebrow-sep">/</span>
              <span className="eyebrow-desc">3D INTERACTIVE FLIPPING DOSSIER</span>
            </div>
            <h2 className="playbook-title">
              THE ENGINEER’S <span className="font-display text-lime">PLAYBOOK</span>
            </h2>
          </div>

          <div className="playbook-header-right">
            <p className="playbook-intro">
              Explore authentic handwritten architectural blueprints, low-latency Socket.IO telemetry notes, and verified DSA algorithms in this 3D tactile flipping logbook.
            </p>

            {/* FLIP CONTROLS */}
            <div className="playbook-nav-controls">
              <button
                className="playbook-turn-btn"
                onClick={goToPrevPage}
                disabled={currentPage === 0 || isFlipping}
                onMouseEnter={() => playHoverSound(30)}
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
                <span>PREV PAGE</span>
              </button>

              <div className="playbook-page-counter">
                <span className="current-num text-lime">
                  0{currentPage + 1}
                </span>
                <span className="counter-sep">/</span>
                <span className="total-num">0{totalPages}</span>
              </div>

              <button
                className="playbook-turn-btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1 || isFlipping}
                onMouseEnter={() => playHoverSound(60)}
                aria-label="Next Page"
              >
                <span>NEXT PAGE</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* BOOKMARK TABS FOR DIRECT JUMP */}
        <div className="playbook-bookmarks">
          {pagesData.map((page, idx) => {
            let label = "COVER";
            if (idx === 1) label = "ARCHITECTURE & SOCKET.IO";
            if (idx === 2) label = "DSA & ACADEMIC TRACK";
            if (idx === 3) label = "DISPATCH CONTRACT";

            const isActive = currentPage === idx;
            return (
              <button
                key={idx}
                className={`bookmark-tab ${isActive ? "active" : ""}`}
                onClick={() => jumpToPage(idx)}
                onMouseEnter={() => playHoverSound(idx * 30)}
              >
                <Bookmark size={12} className={isActive ? "text-lime" : ""} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* 3D PAPER FLIP WORKBENCH */}
        <div
          className="ln-playbook-workbench"
          ref={playbookRef}
        >
          <div
            className={`playbook-sheet-container ${
              isFlipping ? `flipping-${flipDirection}` : ""
            }`}
            onClick={(e) => {
              // Clicking right half flips forward, left half flips backward
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              if (clickX > rect.width * 0.5) {
                goToNextPage();
              } else {
                goToPrevPage();
              }
            }}
          >
            {/* CORNER PEEL HINT */}
            <div className="sheet-corner-peel" title="Click to flip sheet">
              <span className="peel-triangle"></span>
              <span className="peel-label">FLIP</span>
            </div>

            {/* BINDER RINGS / CENTER SPINE */}
            <div className="book-center-spine">
              <div className="spine-wire-ring"></div>
              <div className="spine-wire-ring"></div>
              <div className="spine-wire-ring"></div>
              <div className="spine-wire-ring"></div>
              <div className="spine-wire-ring"></div>
              <div className="spine-wire-ring"></div>
            </div>

            {/* SPREAD CONTENT */}
            {activeSpread.type === "cover" && (
              <div className="sheet-face sheet-cover">
                <div className="cover-border-emboss">
                  <div className="cover-header-tag">
                    <span className="tag-code">{activeSpread.serial}</span>
                    <span className="tag-status text-lime">{activeSpread.status}</span>
                  </div>

                  <div className="cover-center-content">
                    <div className="cover-monogram-seal">
                      <div className="seal-outer-ring">
                        <span className="seal-text">FULL STACK ENGINEERING ARCHITECTURE</span>
                      </div>
                      <div className="seal-inner-core">
                        <span className="seal-initials">RR</span>
                        <span className="seal-sub text-lime">2026</span>
                      </div>
                    </div>

                    <h3 className="cover-super-title">{activeSpread.title}</h3>
                    <h4 className="cover-super-sub text-lime">{activeSpread.subtitle}</h4>
                    <p className="cover-dept">{activeSpread.dept}</p>
                  </div>

                  <div className="cover-footer">
                    <div className="cover-stamp-pill">
                      <ShieldCheck size={14} className="text-lime" />
                      <span>{activeSpread.stamp}</span>
                    </div>
                    <div className="cover-click-hint">
                      <span>CLICK SHEET TO OPEN PLAYBOOK →</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSpread.type === "spread" && (
              <div className="sheet-face sheet-spread">
                {/* LEFT PAGE */}
                <div className="spread-page spread-left">
                  <div className="page-header">
                    <span className="page-doc-cat">{activeSpread.pageLeft.category}</span>
                    <span className="page-doc-num">{activeSpread.pageLeft.docId}</span>
                  </div>

                  <h3 className="page-title">{activeSpread.pageLeft.title}</h3>

                  {activeSpread.pageLeft.sections && (
                    <div className="page-sections-list">
                      {activeSpread.pageLeft.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="page-sec-item">
                          <strong className="sec-label text-lime">{sec.label}</strong>
                          <p className="sec-val">{sec.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSpread.pageLeft.complexityGrid && (
                    <div className="complexity-table-wrap">
                      <div className="c-table-header">
                        <span>ALGORITHM</span>
                        <span>TIME COMP</span>
                        <span>SPACE COMP</span>
                      </div>
                      {activeSpread.pageLeft.complexityGrid.map((c, cIdx) => (
                        <div key={cIdx} className="c-table-row">
                          <span className="c-name">{c.algo}</span>
                          <span className="c-time text-lime">{c.time}</span>
                          <span className="c-space">{c.space}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="page-footer">
                    <span className="page-number">{activeSpread.pageLeft.pageNum}</span>
                    <span className="page-note">{activeSpread.pageLeft.note}</span>
                  </div>
                </div>

                {/* RIGHT PAGE */}
                <div className="spread-page spread-right">
                  <div className="page-header">
                    <span className="page-doc-cat">{activeSpread.pageRight.category}</span>
                    <span className="page-doc-num">{activeSpread.pageRight.docId}</span>
                  </div>

                  <h3 className="page-title">{activeSpread.pageRight.title}</h3>

                  {activeSpread.pageRight.benchmarks && (
                    <div className="benchmarks-grid">
                      {activeSpread.pageRight.benchmarks.map((b, bIdx) => (
                        <div key={bIdx} className="benchmark-card">
                          <div className="b-val text-lime">{b.metric}</div>
                          <div className="b-desc">{b.desc}</div>
                          <span className="b-tag">{b.tag}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSpread.pageRight.codeSnippet && (
                    <div className="page-code-snippet">
                      <div className="snippet-bar">
                        <span className="snippet-dot"></span>
                        <span className="snippet-title">telemetry-socket-auth.js</span>
                      </div>
                      <pre className="snippet-content">
                        <code>{activeSpread.pageRight.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {activeSpread.pageRight.milestones && (
                    <div className="playbook-milestones-list">
                      {activeSpread.pageRight.milestones.map((m, mIdx) => (
                        <div key={mIdx} className="p-milestone-item">
                          <div className="p-m-top">
                            <span className="p-m-year text-lime">{m.year}</span>
                            <strong className="p-m-title">{m.title}</strong>
                          </div>
                          <div className="p-m-inst">{m.inst}</div>
                          <p className="p-m-hl">{m.highlight}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="page-footer">
                    <span className="page-note">{activeSpread.pageRight.note}</span>
                    <span className="page-number">{activeSpread.pageRight.pageNum}</span>
                  </div>
                </div>
              </div>
            )}

            {activeSpread.type === "backcover" && (
              <div className="sheet-face sheet-backcover">
                <div className="backcover-border-emboss">
                  <div className="backcover-header">
                    <div className="cover-stamp-pill active-green">
                      <ShieldCheck size={16} className="text-lime" />
                      <span>{activeSpread.stamp}</span>
                    </div>
                    <span className="backcover-serial">RR-VERIFIED-2026</span>
                  </div>

                  <div className="backcover-body">
                    <h3 className="backcover-title">{activeSpread.title}</h3>
                    <p className="backcover-subtitle text-lime">
                      {activeSpread.subtitle}
                    </p>

                    <div className="backcover-details-grid">
                      <div className="b-detail-item">
                        <span className="b-d-label">DIRECT EMAIL</span>
                        <a href="mailto:riteshraj851116@gmail.com" className="b-d-link text-lime">
                          {activeSpread.contact.email}
                        </a>
                      </div>

                      <div className="b-detail-item">
                        <span className="b-d-label">PHONE DISPATCH</span>
                        <a href="tel:+919709721676" className="b-d-link">
                          {activeSpread.contact.phone}
                        </a>
                      </div>

                      <div className="b-detail-item">
                        <span className="b-d-label">GITHUB REPOSITORIES</span>
                        <a
                          href="https://github.com/riteshraj851116"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="b-d-link text-lime"
                        >
                          {activeSpread.contact.github}
                        </a>
                      </div>

                      <div className="b-detail-item">
                        <span className="b-d-label">LINKEDIN NETWORK</span>
                        <a
                          href="https://www.linkedin.com/in/ritesh-raj-9b52162a7/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="b-d-link"
                        >
                          {activeSpread.contact.linkedin}
                        </a>
                      </div>
                    </div>

                    <div className="backcover-location">
                      <span className="loc-label">BASE STATION:</span>
                      <span className="loc-text">{activeSpread.contact.location}</span>
                    </div>
                  </div>

                  <div className="backcover-footer">
                    <a
                      href="#contact"
                      className="ln-btn ln-btn-lime"
                      onClick={(e) => {
                        e.stopPropagation();
                        playCockpitWhoosh();
                      }}
                    >
                      <Zap size={14} />
                      <span>INITIALIZE TRANSMISSION</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineeringPlaybook;
