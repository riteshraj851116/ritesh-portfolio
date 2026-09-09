import { useRef } from "react";
import { ArrowUpRight, Award, GraduationCap, Code, CheckCircle, ExternalLink, ChevronRight } from "lucide-react";
import {
  playClickSound,
  playHoverSound,
  playTelemetryScan,
  playCockpitWhoosh,
} from "../utils/audio";
import "./CareerTrack.css";

const milestones = [
  {
    type: "DEGREE",
    period: "2023 — 2027",
    location: "GREATER NOIDA, INDIA",
    title: "GALGOTIAS UNIVERSITY",
    subtitle: "B.Tech in Computer Science & Engineering",
    score: "CGPA: 7.3 / 10",
    details:
      "Comprehensive CS curriculum: Advanced Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems (DBMS), and modern Web Engineering architectures.",
    badge: "UNDERGRADUATE CSE",
    verified: true,
  },
  {
    type: "CERTIFICATION",
    period: "2025",
    location: "ONLINE · CODEHELP",
    title: "MERN STACK WEB DEVELOPMENT",
    subtitle: "Certified by Love Babbar (CodeHelp)",
    score: "150+ HOURS CURRICULUM",
    details:
      "Mastered end-to-end full stack architecture building scalable applications with React, Node.js, Express, and MongoDB. Built 40+ REST API endpoints, JWT/bcrypt auth, and real-time Socket.IO systems.",
    badge: "MERN ARCHITECT",
    link: "https://www.linkedin.com/posts/ritesh-raj-9b52162a7_share-7492473688705875968-sIML",
    verified: true,
  },
  {
    type: "CERTIFICATION",
    period: "2025",
    location: "ONLINE · APNA COLLEGE",
    title: "JAVA DATA STRUCTURES & ALGORITHMS",
    subtitle: "Certified by Apna College",
    score: "200+ PROBLEMS SOLVED",
    details:
      "Solved 200+ algorithm challenges across Arrays, Linked Lists, Binary Trees, Graphs, and Dynamic Programming. Rigorous focus on Big-O time and space complexity optimization.",
    badge: "ALGORITHMS & DSA",
    link: "https://www.linkedin.com/posts/ritesh-raj-9b52162a7_share-7492476226008358913-u7y5",
    verified: true,
  },
  {
    type: "EDUCATION",
    period: "2021 — 2023",
    location: "BEGUSARAI, BIHAR",
    title: "VIKAS VIDYALAYA",
    subtitle: "Senior Secondary (Class XII) — CBSE",
    score: "68.4% (SCIENCE STREAM)",
    details:
      "Physics, Chemistry, and Mathematics focus developing analytical problem-solving rigor and foundational computing logic.",
    badge: "CBSE XII SCIENCE",
    verified: true,
  },
  {
    type: "EDUCATION",
    period: "2021",
    location: "BEGUSARAI, BIHAR",
    title: "DAV HFC BARAUNI",
    subtitle: "Secondary School (Class X) — CBSE",
    score: "77.2% (CBSE)",
    details:
      "Strong academic foundation in science, mathematics, and logic, sparking early interest in software engineering and technology.",
    badge: "CBSE X",
    verified: true,
  },
];

const CareerTrack = () => {
  const trackRef = useRef(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -450, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 450, behavior: "smooth" });
    }
  };

  return (
    <section className="ln-track-section" id="track">
      <div className="lando-container ln-track-header">
        <div className="track-header-left">
          <div className="track-eyebrow">
            <span className="eyebrow-num">02 / CAREER TRACK</span>
            <span className="eyebrow-sep">/</span>
            <span className="eyebrow-desc">VERIFIED ACADEMIC & CERTIFICATION MILESTONES</span>
          </div>
          <h2 className="track-title">
            THE CAREER <span className="font-display text-lime">TRACK</span>
          </h2>
        </div>

        <div className="track-header-right">
          <p className="track-intro">
            From foundational school education in Bihar to B.Tech Computer Science at Galgotias University, combined with elite certifications in MERN and Java DSA.
          </p>
          <div className="track-scroll-nav">
            <button
              className="track-nav-btn prev"
              onClick={() => {
                playCockpitWhoosh();
                scrollLeft();
              }}
              onMouseEnter={() => playHoverSound(30)}
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              className="track-nav-btn next"
              onClick={() => {
                playCockpitWhoosh();
                scrollRight();
              }}
              onMouseEnter={() => playHoverSound(70)}
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SCROLLING TRACK */}
      <div className="ln-horizontal-scroll-wrap" ref={trackRef}>
        <div className="ln-track-rail">
          {/* QUOTE CALLOUT CARD (MATCHING LANDONORRIS.COM FIRST LARGE TEXT CALLOUT) */}
          <div
            className="track-card callout-card"
            onMouseEnter={() => playHoverSound(40)}
          >
            <div className="callout-inner">
              <div className="callout-eyebrow">PHILOSOPHY // 01</div>
              <h3 className="callout-quote">
                It doesn’t matter <span className="text-lime font-display">where</span> you start, it’s{" "}
                <span className="text-white font-display">how</span> you progress and engineer from there.
              </h3>
              <div className="callout-footer">
                <svg
                  className="callout-sig"
                  viewBox="0 0 200 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 38 C 30 10, 50 5, 70 28 C 85 42, 100 12, 120 20 C 140 28, 155 8, 180 16 M60 22 L100 22 M140 32 L200 32"
                    stroke="var(--color--lime)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="callout-sig-name">RITESH RAJ · FULL STACK MERN</span>
              </div>
            </div>
          </div>

          {/* MILESTONE CARDS */}
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="track-card milestone-card"
              onMouseEnter={() => playHoverSound(idx * 35)}
            >
              <div className="card-top">
                <div className="card-badge-row">
                  <span className="card-pill">{item.badge}</span>
                  <span className="card-period">{item.period}</span>
                </div>
                <span className="card-location">{item.location}</span>
              </div>

              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <h4 className="card-subtitle">{item.subtitle}</h4>
                <div className="card-score-pill">
                  <span className="score-label">VERIFIED RECORD:</span>
                  <strong className="score-val text-lime">{item.score}</strong>
                </div>
                <p className="card-details">{item.details}</p>
              </div>

              <div className="card-footer">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-verify-btn"
                    onClick={playClickSound}
                    onMouseEnter={playHoverSound}
                  >
                    <span>VERIFY LINKEDIN CREDENTIAL</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <div className="card-verified-tag">
                    <CheckCircle size={14} className="text-lime" />
                    <span>AUTHENTIC ACADEMIC RECORD</span>
                  </div>
                )}
                <span className="card-index">0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerTrack;
