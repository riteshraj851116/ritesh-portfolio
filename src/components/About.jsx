import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { playClickSound, playHoverSound } from "../utils/audio";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: "03+", label: "PRODUCTION BUILDS", desc: "Full-Stack MERN & High-Perf SPA" },
  { value: "40+", label: "REST ENDPOINTS", desc: "Clean, Scalable Node/Express APIs" },
  { value: "<50ms", label: "CHAT LATENCY", desc: "Real-time Bi-directional Socket.IO" },
  { value: "90+", label: "LIGHTHOUSE SCORE", desc: "Vite Bundling & CSS Performance" },
];

const capabilities = [
  {
    title: "MERN Stack Architecture",
    description: "End-to-end web engineering with React 19, Node.js runtime, Express routing, and MongoDB schema indexing.",
    badge: "CORE STACK",
  },
  {
    title: "Real-time Event Systems",
    description: "Low-latency bidirectional WebSocket communication with Socket.IO for instant live messaging and active user states.",
    badge: "REAL-TIME",
  },
  {
    title: "Database Optimization",
    description: "Complex MongoDB aggregation pipelines, Mongoose indexing, relational modeling, and query execution under 200ms.",
    badge: "BACKEND",
  },
  {
    title: "Interactive 3D & GSAP",
    description: "Creative web development using Three.js, React Three Fiber, and GSAP ScrollTrigger for fluid, tactile interfaces.",
    badge: "CREATIVE UI",
  },
];

const journeyTimeline = [
  {
    period: "2024 — PRESENT",
    role: "Full Stack MERN Developer",
    organization: "Independent Product Engineering",
    details: "Architected JobSphere (full-stack job portal with live Socket.IO chat) and VeloceDrive (car rental system with owner analytics).",
  },
  {
    period: "2021 — 2025",
    role: "Computer Science & Engineering",
    organization: "Bachelor of Technology (B.Tech)",
    details: "Deep grounding in Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, and Web Technologies.",
  },
];

const About = () => {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-reveal",
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about",
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTabChange = (tabId) => {
    playClickSound();
    setActiveTab(tabId);
  };

  return (
    <section className="about" id="about" ref={sectionRef}>
      {/* TOP */}
      <div className="about-top">
        <span className="about-reveal">03 / ABOUT & CAPABILITIES</span>
        <span className="about-reveal">ARCHITECTING FOR SCALABILITY & AESTHETICS</span>
      </div>

      {/* CONTENT */}
      <div className="about-content">
        <div className="about-left">
          <div className="about-heading about-reveal">
            I BUILD
            <br />
            <span>FOR THE WEB.</span>
          </div>

          {/* METRICS GRID */}
          <div className="about-metrics-grid about-reveal">
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="metric-card"
                onMouseEnter={playHoverSound}
              >
                <div className="metric-header">
                  <span className="metric-val">{metric.value}</span>
                  <Sparkles size={13} className="metric-icon" />
                </div>
                <strong className="metric-label">{metric.label}</strong>
                <span className="metric-desc">{metric.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-right">
          {/* INTERACTIVE NAVIGATION TABS */}
          <div className="about-tabs about-reveal">
            <button
              className={`about-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => handleTabChange("overview")}
              onMouseEnter={playHoverSound}
            >
              01 // OVERVIEW
            </button>
            <button
              className={`about-tab-btn ${activeTab === "journey" ? "active" : ""}`}
              onClick={() => handleTabChange("journey")}
              onMouseEnter={playHoverSound}
            >
              02 // JOURNEY
            </button>
            <button
              className={`about-tab-btn ${activeTab === "capabilities" ? "active" : ""}`}
              onClick={() => handleTabChange("capabilities")}
              onMouseEnter={playHoverSound}
            >
              03 // CAPABILITIES
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="about-tab-content">
              <p className="about-text">
                I'm <strong>Ritesh Raj Singh</strong>, a full-stack engineer driven by building robust backend architectures and sleek, tactile frontend experiences.
              </p>

              <p className="about-text">
                My primary focus revolves around the <strong>MERN ecosystem</strong> — creating performant REST APIs with Node.js & Express, designing indexed MongoDB data schemas, and orchestrating reactive UIs with React and Three.js.
              </p>

              <div className="about-info">
                <div>
                  <span>LOCATION</span>
                  <strong>INDIA (BIHAR)</strong>
                </div>
                <div>
                  <span>STATUS</span>
                  <strong className="status-highlight">
                    <span className="status-dot"></span> OPEN FOR OPPORTUNITIES
                  </strong>
                </div>
                <div>
                  <span>CORE SPECIALIZATION</span>
                  <strong>FULL STACK MERN & 3D WEB</strong>
                </div>
                <div>
                  <span>DEVELOPMENT PHILOSOPHY</span>
                  <strong>CLEAN CODE · FAST QUERIES · USER DELIGHT</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JOURNEY */}
          {activeTab === "journey" && (
            <div className="about-tab-content journey-list">
              {journeyTimeline.map((item, idx) => (
                <div key={idx} className="journey-card" onMouseEnter={playHoverSound}>
                  <div className="journey-header">
                    <span className="journey-period">{item.period}</span>
                    <span className="journey-org">{item.organization}</span>
                  </div>
                  <h4 className="journey-role">{item.role}</h4>
                  <p className="journey-details">{item.details}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CAPABILITIES */}
          {activeTab === "capabilities" && (
            <div className="about-tab-content capabilities-list">
              {capabilities.map((cap, idx) => (
                <div key={idx} className="capability-card" onMouseEnter={playHoverSound}>
                  <div className="capability-top">
                    <h4 className="capability-title">{cap.title}</h4>
                    <span className="capability-badge">{cap.badge}</span>
                  </div>
                  <p className="capability-desc">{cap.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* RESUME & CONTACT CTA */}
          <div className="about-actions about-reveal">
            <a
              href="#contact"
              className="about-cta-btn primary"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
            >
              <span>DISCUSS A PROJECT</span>
              <ArrowUpRight size={16} />
            </a>

            <a
              href="https://github.com/riteshraj851116"
              target="_blank"
              rel="noopener noreferrer"
              className="about-cta-btn secondary"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
            >
              <span>GITHUB PROFILE</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="about-bottom">
        <span>03 / 05</span>
        <span>SCALABLE ARCHITECTURE · INTENTIONAL DESIGN</span>
        <span>BUILD — SHIP — SCALE</span>
      </div>
    </section>
  );
};

export default About;
