import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import { playClickSound, playHoverSound } from "../utils/audio";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: "03+", label: "PRODUCTION BUILDS", desc: "Full-Stack MERN & High-Perf SPA" },
  { value: "40+", label: "REST ENDPOINTS", desc: "Clean, Scalable Node/Express APIs" },
  { value: "<50ms", label: "CHAT LATENCY", desc: "Real-time Bi-directional Socket.IO" },
  { value: "200+", label: "DSA SOLVED (JAVA)", desc: "Apna College Certified Algorithmics" },
];

const educationList = [
  {
    institution: "Galgotias University",
    location: "Greater Noida, India",
    degree: "B.Tech in Computer Science and Engineering",
    period: "2023 — 2027",
    score: "CGPA: 7.3 / 10",
    highlights: "Focus on Data Structures, OOP, Database Management Systems, and Web Engineering.",
  },
  {
    institution: "Vikas Vidyalaya",
    location: "Begusarai, Bihar",
    degree: "Senior Secondary (Class XII) — CBSE",
    period: "2021 — 2023",
    score: "68.4%",
    highlights: "Science stream with Physics, Chemistry, and Mathematics foundation.",
  },
  {
    institution: "DAV HFC Barauni",
    location: "Begusarai, Bihar",
    degree: "Secondary School (Class X) — CBSE",
    period: "2021",
    score: "77.2%",
    highlights: "Secondary education with strong academic foundation in science & logic.",
  },
];

const certificationsList = [
  {
    title: "MERN Stack Web Development Course",
    provider: "CodeHelp (Love Babbar)",
    year: "2025",
    link: "https://www.linkedin.com/posts/ritesh-raj-9b52162a7_share-7492473688705875968-sIML",
    details:
      "Completed 150+ hours of full-stack development curriculum, building scalable applications with React, Node.js, and MongoDB. Mastered REST API architecture, asynchronous operations, state management, and full-stack security practices.",
  },
  {
    title: "Data Structures & Algorithms (DSA) in Java",
    provider: "Apna College",
    year: "2025",
    link: "https://www.linkedin.com/posts/ritesh-raj-9b52162a7_share-7492476226008358913-u7y5",
    details:
      "Solved 200+ algorithm problems spanning Arrays, Linked Lists, Binary Trees, Graphs, and Dynamic Programming. Focused on optimizing Time and Space complexity analysis across computational problems.",
  },
];

const capabilities = [
  {
    title: "MERN Stack Architecture",
    description: "End-to-end web engineering with React, Node.js runtime, Express routing, and MongoDB schema indexing.",
    badge: "CORE STACK",
  },
  {
    title: "Real-time Event Systems",
    description: "Low-latency bidirectional WebSocket communication with Socket.IO for instant live messaging under 50ms.",
    badge: "REAL-TIME",
  },
  {
    title: "Database Optimization",
    description: "Complex MongoDB aggregation pipelines, Mongoose indexing, relational modeling, and query execution under 200ms.",
    badge: "BACKEND & DB",
  },
  {
    title: "Algorithmics & Core CS",
    description: "Robust understanding of Data Structures & Algorithms in Java (200+ problems solved), OOP paradigms, and DBMS.",
    badge: "CORE CS",
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
        <span className="about-reveal">03 / ABOUT & CREDENTIALS</span>
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
              className={`about-tab-btn ${activeTab === "education" ? "active" : ""}`}
              onClick={() => handleTabChange("education")}
              onMouseEnter={playHoverSound}
            >
              02 // EDUCATION
            </button>
            <button
              className={`about-tab-btn ${activeTab === "certifications" ? "active" : ""}`}
              onClick={() => handleTabChange("certifications")}
              onMouseEnter={playHoverSound}
            >
              03 // CERTIFICATIONS
            </button>
            <button
              className={`about-tab-btn ${activeTab === "capabilities" ? "active" : ""}`}
              onClick={() => handleTabChange("capabilities")}
              onMouseEnter={playHoverSound}
            >
              04 // CAPABILITIES
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="about-tab-content">
              <p className="about-text">
                I'm <strong>Ritesh Raj</strong>, a full-stack engineer and Computer Science undergraduate at <strong>Galgotias University</strong>. I specialize in the <strong>MERN stack</strong>, crafting secure REST APIs with Node.js & Express, performant MongoDB data models, and fluid interactive UIs with React and Three.js.
              </p>

              <p className="about-text">
                Certified in full-stack engineering by <strong>CodeHelp (Love Babbar)</strong> and in Java Data Structures & Algorithms by <strong>Apna College</strong>, I blend algorithmic discipline with modern software architecture.
              </p>

              <div className="about-info">
                <div>
                  <span>LOCATION</span>
                  <strong>INDIA (BIHAR / GREATER NOIDA)</strong>
                </div>
                <div>
                  <span>DEGREE</span>
                  <strong>B.TECH CSE (GALGOTIAS UNIV, 2023-2027)</strong>
                </div>
                <div>
                  <span>STATUS</span>
                  <strong className="status-highlight">
                    <span className="status-dot"></span> OPEN FOR FULL-TIME & INTERNSHIPS
                  </strong>
                </div>
                <div>
                  <span>CORE SPECIALIZATION</span>
                  <strong>MERN STACK · REAL-TIME SOCKET.IO · JAVA DSA</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDUCATION */}
          {activeTab === "education" && (
            <div className="about-tab-content journey-list">
              {educationList.map((edu, idx) => (
                <div key={idx} className="journey-card" onMouseEnter={playHoverSound}>
                  <div className="journey-header">
                    <span className="journey-period">{edu.period}</span>
                    <span className="journey-org">{edu.location}</span>
                  </div>
                  <h4 className="journey-role">{edu.institution}</h4>
                  <div className="education-degree-row">
                    <span className="education-degree">{edu.degree}</span>
                    <span className="education-score">{edu.score}</span>
                  </div>
                  <p className="journey-details">{edu.highlights}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CERTIFICATIONS */}
          {activeTab === "certifications" && (
            <div className="about-tab-content certifications-list">
              {certificationsList.map((cert, idx) => (
                <div key={idx} className="cert-card" onMouseEnter={playHoverSound}>
                  <div className="cert-top">
                    <div>
                      <div className="cert-provider-row">
                        <span className="cert-provider">{cert.provider}</span>
                        <span className="cert-year">{cert.year}</span>
                      </div>
                      <h4 className="cert-title">{cert.title}</h4>
                    </div>

                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-verify-btn"
                      onClick={playClickSound}
                      title="View Credential on LinkedIn"
                    >
                      <span>CREDENTIAL</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className="cert-details">{cert.details}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CAPABILITIES */}
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

          {/* ACTIONS */}
          <div className="about-actions about-reveal">
            <a
              href="#contact"
              className="about-cta-btn primary"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
            >
              <span>GET IN TOUCH</span>
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
        <span>RITESH RAJ · FULL STACK MERN SPECIALIST</span>
        <span>CODEHELP BABBAR & APNA COLLEGE CERTIFIED</span>
      </div>
    </section>
  );
};

export default About;
