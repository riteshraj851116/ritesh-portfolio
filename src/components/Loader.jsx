import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Terminal, Sparkles, CheckCircle2, FileText, Cpu, Radio } from "lucide-react";
import { playLoaderTick, playBootSound, playPaperFlipSound } from "../utils/audio";
import "./Loader.css";

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const bookRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0, 1, 2, 3, 4

  // Audio & Counter Sequence
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 5) + 3;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        setCurrentPage(4);
        playBootSound();
        clearInterval(interval);
      } else {
        setProgress(current);
        playLoaderTick(current);

        // Turn pages at milestones
        if (current >= 75 && currentPage < 3) {
          setCurrentPage(3);
          playPaperFlipSound();
        } else if (current >= 50 && currentPage < 2) {
          setCurrentPage(2);
          playPaperFlipSound();
        } else if (current >= 25 && currentPage < 1) {
          setCurrentPage(1);
          playPaperFlipSound();
        }
      }
    }, 45);

    return () => clearInterval(interval);
  }, [currentPage]);

  // GSAP Exit Sequence on 100% Progress
  useEffect(() => {
    if (progress !== 100) return;

    const timeout = setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      tl.to(".loader-book-wrap", {
        scale: 1.06,
        rotateX: -10,
        boxShadow: "0 0 50px rgba(210, 255, 0, 0.4)",
        duration: 0.5,
        ease: "power2.out",
      })
        .to(".loader-book-wrap", {
          scale: 0.85,
          opacity: 0,
          y: -40,
          duration: 0.5,
          ease: "power3.in",
        })
        .to(
          loaderRef.current,
          {
            yPercent: -100,
            duration: 0.85,
            ease: "power4.inOut",
          },
          "-=0.2"
        )
        .set(loaderRef.current, { display: "none" });
    }, 600);

    return () => clearTimeout(timeout);
  }, [progress, onComplete]);

  return (
    <div className="loader-screen" ref={loaderRef}>
      {/* TOP STATUS BAR */}
      <div className="loader-top-hud">
        <div className="hud-pill">
          <span className="pulse-beacon"></span>
          <span>RRS // SYSTEM INITIALIZATION</span>
        </div>
        <span className="hud-title">RITESH RAJ · FULL STACK DOSSIER</span>
        <span className="hud-year">2026 // EDITION</span>
      </div>

      {/* CENTER: 3D INTERACTIVE FLIPPING PAPER BOOK */}
      <div className="loader-book-container">
        <div className="loader-book-wrap" ref={bookRef}>
          {/* STATIC BASE (RIGHT BACK COVER) */}
          <div className="loader-page static-base">
            <div className="page-inner">
              <div className="base-header">
                <span className="b-badge">SYSTEM READY</span>
                <span className="b-id">PAGE 04 / 04</span>
              </div>
              <div className="base-content">
                <CheckCircle2 size={44} className="text-lime" />
                <h3 className="b-title">INITIALIZATION COMPLETE</h3>
                <p className="b-desc">
                  Full stack environment, WebGL shaders & GSAP physics online.
                </p>
                <div className="b-specs">
                  <span>· MERN KERNEL: READY</span>
                  <span>· WEBSOCKETS: &lt;50ms</span>
                  <span>· 200+ JAVA DSA: VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          {/* FLIPPING PAGE 3 (DSA & ACADEMIC CREDENTIALS) */}
          <div className={`loader-page flip-page p3 ${currentPage >= 3 ? "is-flipped" : ""}`}>
            <div className="page-face front">
              <div className="page-inner">
                <div className="page-header">
                  <Cpu size={14} className="text-lime" />
                  <span>03 // ALGORITHMIC RIGOR</span>
                </div>
                <div className="page-body">
                  <h4 className="p-title">200+ JAVA DSA</h4>
                  <p className="p-text">Data Structures & Algorithms verified.</p>
                  <div className="code-snippet">
                    <code>GALGOTIAS CSE · CGPA 7.3</code>
                  </div>
                </div>
                <span className="page-num">03</span>
              </div>
            </div>
            <div className="page-face back">
              <div className="page-inner back-inner">
                <span className="tech-badge">DISPATCH</span>
                <p className="back-quote">"Precision to every line of code."</p>
              </div>
            </div>
          </div>

          {/* FLIPPING PAGE 2 (SOCKET.IO TELEMETRY) */}
          <div className={`loader-page flip-page p2 ${currentPage >= 2 ? "is-flipped" : ""}`}>
            <div className="page-face front">
              <div className="page-inner">
                <div className="page-header">
                  <Radio size={14} className="text-lime" />
                  <span>02 // LIVE TELEMETRY</span>
                </div>
                <div className="page-body">
                  <h4 className="p-title">SOCKET.IO ENGINE</h4>
                  <p className="p-text">Low-latency live stream under 50ms.</p>
                  <div className="code-snippet">
                    <code>40+ REST API ENDPOINTS</code>
                  </div>
                </div>
                <span className="page-num">02</span>
              </div>
            </div>
            <div className="page-face back">
              <div className="page-inner back-inner">
                <span className="tech-badge">STREAM</span>
                <p className="back-quote">"Real-time bi-directional pipeline."</p>
              </div>
            </div>
          </div>

          {/* FLIPPING PAGE 1 (FRONT COVER: RITESH RAJ DOSSIER) */}
          <div className={`loader-page flip-page p1 ${currentPage >= 1 ? "is-flipped" : ""}`}>
            <div className="page-face front">
              <div className="page-inner cover-inner">
                <div className="cover-brand">
                  <div className="cover-monogram">
                    <span>RR</span>
                    <small>01</small>
                  </div>
                  <span className="cover-spec">MERN SPECIALIST</span>
                </div>
                <div className="cover-title-box">
                  <span className="c-tag">TECHNICAL DOSSIER</span>
                  <h2 className="cover-title">RITESH RAJ</h2>
                  <span className="cover-sub">ENGINEERING SPECIFICATION 2026</span>
                </div>
                <div className="cover-footer">
                  <span className="c-corner">TURN PAGE ↓</span>
                  <span className="c-auth">100% AUTHENTIC</span>
                </div>
              </div>
            </div>
            <div className="page-face back">
              <div className="page-inner back-inner">
                <span className="tech-badge">BOOT</span>
                <p className="back-quote">"Redefining limits, fighting for performance."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM TELEMETRY BAR & PERCENTAGE */}
      <div className="loader-bottom-hud">
        <div className="telemetry-progress-line">
          <div
            className="telemetry-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="telemetry-bar-info">
          <div className="telemetry-left">
            <Terminal size={13} className="text-lime" />
            <span>
              {progress < 25
                ? "LOADING TECHNICAL COVER..."
                : progress < 50
                ? "UNPACKING SOCKET.IO TELEMETRY..."
                : progress < 75
                ? "VERIFYING 200+ JAVA DSA LEDGER..."
                : progress < 100
                ? "FINALIZING WEBSOCKET PIPELINES..."
                : "SYSTEM FLIGHT CHECK PASSED"}
            </span>
          </div>

          <div className="telemetry-pct-box">
            <span className="pct-num">{progress}</span>
            <span className="pct-sign">%</span>
          </div>

          <div className="telemetry-right">
            <Sparkles size={13} className="text-lime" />
            <span>PAGE {Math.min(4, currentPage + 1)} / 04</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
