import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CheckCircle2, ShieldCheck, Terminal, Cpu, Sparkles, BookOpen } from "lucide-react";
import { playLoaderTick, playBootSound, playPaperFlipSound } from "../utils/audio";
import "./Loader.css";

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const bookRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0 (Cover), 1, 2, 3, 4 (Base)
  const [statusText, setStatusText] = useState("CALIBRATING ARCHITECTURE...");

  // Audio, Progress & Milestone Flipping Sequence
  useEffect(() => {
    let current = 0;
    let lastTickMilestone = 0;
    let pageTrack = 0;

    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 3) + 2;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        setCurrentPage(4);
        setStatusText("INITIALIZATION COMPLETE · MOUNTING PORTFOLIO");
        playBootSound();
        clearInterval(interval);
      } else {
        setProgress(current);

        // Gentle horology escapement tick only at 10% increments
        const currentMilestone = Math.floor(current / 10);
        if (currentMilestone > lastTickMilestone) {
          lastTickMilestone = currentMilestone;
          playLoaderTick();
        }

        // Realistic tactile page flips at key narrative milestones
        if (current >= 75 && pageTrack < 3) {
          pageTrack = 3;
          setCurrentPage(3);
          setStatusText("COMPILING FLAGSHIP ARCHITECTURE...");
          playPaperFlipSound();
        } else if (current >= 50 && pageTrack < 2) {
          pageTrack = 2;
          setCurrentPage(2);
          setStatusText("VALIDATING JAVA DSA BENCHMARKS (200+)...");
          playPaperFlipSound();
        } else if (current >= 25 && pageTrack < 1) {
          pageTrack = 1;
          setCurrentPage(1);
          setStatusText("INITIALIZING MERN FULL STACK KERNEL...");
          playPaperFlipSound();
        }
      }
    }, 38);

    return () => clearInterval(interval);
  }, []);

  // GSAP Exit Transition when complete
  useEffect(() => {
    if (progress !== 100) return;

    const timeout = setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      tl.to(".loader-book-wrap", {
        scale: 1.05,
        rotateX: -8,
        boxShadow: "0 25px 60px rgba(146, 64, 14, 0.25)",
        duration: 0.45,
        ease: "power2.out",
      })
        .to(".loader-book-wrap", {
          scale: 0.9,
          opacity: 0,
          y: -35,
          duration: 0.45,
          ease: "power3.in",
        })
        .to(
          loaderRef.current,
          {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
          },
          "-=0.15"
        )
        .set(loaderRef.current, { display: "none" });
    }, 650);

    return () => clearTimeout(timeout);
  }, [progress, onComplete]);

  return (
    <div className="loader-screen" ref={loaderRef} aria-label="Loading Portfolio Dossier">
      {/* TOP STATUS HUD */}
      <div className="loader-top-hud">
        <div className="hud-pill">
          <span className="pulse-beacon"></span>
          <span>RRS // SYSTEM INITIALIZATION</span>
        </div>
        <span className="hud-title">RITESH RAJ · FULL STACK DOSSIER</span>
        <span className="hud-edition">2026 ARCHIVAL EDITION</span>
      </div>

      {/* CENTER: 3D LUXURY ARCHITECTURAL DOSSIER */}
      <div className="loader-book-container">
        <div className="loader-book-wrap" ref={bookRef}>
          {/* STATIC BASE (PAGE 04 / SYSTEM COMPLETE) */}
          <div className="loader-page static-base">
            <div className="page-inner">
              <div className="base-header">
                <span className="b-badge">SYSTEM VERIFIED</span>
                <span className="b-id">INDEX 04 // 04</span>
              </div>
              <div className="base-content">
                <div className="base-icon-wrap">
                  <CheckCircle2 size={42} className="text-brown" />
                </div>
                <h3 className="b-title">WORKSPACE INITIALIZED</h3>
                <p className="b-desc">
                  Full stack environment, reactive telemetry & motion kinematics ready for inspection.
                </p>
                <div className="b-specs">
                  <div className="spec-row">
                    <span className="spec-dot"></span>
                    <span>MERN KERNEL: ACTIVE</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-dot"></span>
                    <span>SOCKET.IO LATENCY: &lt;50MS</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-dot"></span>
                    <span>JAVA DSA (200+ SOLVED): VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FLIPPABLE SPREAD 3: PROJECTS DISPATCH */}
          <div className={`loader-page flip-page p3 ${currentPage >= 3 ? "flipped" : ""}`}>
            <div className="page-inner">
              <div className="page-header">
                <span className="p-badge">FLAGSHIP SYSTEMS</span>
                <span className="p-num">PAGE 03</span>
              </div>
              <div className="page-body">
                <div className="p-chip-row">
                  <Cpu size={16} className="text-brown" />
                  <strong>PRODUCTIONS SHIPPED</strong>
                </div>
                <ul className="p-list">
                  <li>
                    <strong className="text-dark">JobSphere:</strong> Realtime Job Portal with Role-Based Access
                  </li>
                  <li>
                    <strong className="text-dark">VeloceDrive:</strong> F1-Grade Vehicle Telemetry & Rental
                  </li>
                  <li>
                    <strong className="text-dark">RCB Fan Hub:</strong> Realtime Chat, Live Score & Team Wall
                  </li>
                </ul>
                <div className="p-stamp">VERIFIED PORTFOLIO</div>
              </div>
            </div>
          </div>

          {/* FLIPPABLE SPREAD 2: DSA BENCHMARKS */}
          <div className={`loader-page flip-page p2 ${currentPage >= 2 ? "flipped" : ""}`}>
            <div className="page-inner">
              <div className="page-header">
                <span className="p-badge">ALGORITHMS & DSA</span>
                <span className="p-num">PAGE 02</span>
              </div>
              <div className="page-body">
                <div className="p-chip-row">
                  <Terminal size={16} className="text-brown" />
                  <strong>PROBLEM SOLVING</strong>
                </div>
                <div className="p-stat-box">
                  <span className="p-stat-num">200+</span>
                  <span className="p-stat-lbl">Java DSA Problems Solved</span>
                </div>
                <p className="p-subtext">
                  Data Structures, Trees, Dynamic Programming, Graphs & System Design Foundations.
                </p>
                <div className="p-stamp verified">APNA COLLEGE CERTIFIED</div>
              </div>
            </div>
          </div>

          {/* FLIPPABLE SPREAD 1: CORE ARCHITECTURE */}
          <div className={`loader-page flip-page p1 ${currentPage >= 1 ? "flipped" : ""}`}>
            <div className="page-inner">
              <div className="page-header">
                <span className="p-badge">CORE STACK</span>
                <span className="p-num">PAGE 01</span>
              </div>
              <div className="page-body">
                <div className="p-chip-row">
                  <Sparkles size={16} className="text-brown" />
                  <strong>FULL STACK WEB</strong>
                </div>
                <div className="stack-grid">
                  <span className="stack-tag">React.js</span>
                  <span className="stack-tag">Node.js</span>
                  <span className="stack-tag">Express</span>
                  <span className="stack-tag">MongoDB</span>
                  <span className="stack-tag">Socket.IO</span>
                  <span className="stack-tag">Redux Toolkit</span>
                </div>
                <p className="p-subtext">
                  Production Web Engineering Certified by Love Babbar (CodeHelp).
                </p>
              </div>
            </div>
          </div>

          {/* FLIPPABLE COVER: LEATHER BOUND ARCHIVAL DOSSIER */}
          <div className={`loader-page flip-page cover ${currentPage >= 1 ? "flipped" : ""}`}>
            <div className="page-inner cover-inner">
              <div className="cover-spine-accent"></div>
              <div className="cover-header">
                <span className="cover-tag">TECHNICAL DOSSIER</span>
                <span className="cover-year">RRS // 2026</span>
              </div>
              <div className="cover-center">
                <div className="cover-monogram">RR</div>
                <h2 className="cover-name">RITESH RAJ</h2>
                <span className="cover-role">FULL STACK ARCHITECT</span>
                <div className="cover-divider"></div>
                <span className="cover-cred">GALGOTIAS UNIV · B.TECH CSE</span>
              </div>
              <div className="cover-footer">
                <span className="corner-turn-hint">OPENING DOSSIER...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM PROGRESS METRICS & STATUS */}
      <div className="loader-bottom-hud">
        <div className="loader-status-col">
          <span className="status-indicator-dot"></span>
          <span className="status-live-text">{statusText}</span>
        </div>

        <div className="loader-progress-wrap">
          <div className="loader-bar-track">
            <div
              className="loader-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="loader-percentage">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
