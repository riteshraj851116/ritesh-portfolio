import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight, ArrowDown, Activity, ShieldCheck, Cpu, Terminal } from "lucide-react";
import profileImage from "../assets/Adobe Express - file.png";
import { scrambleText } from "../utils/scramble";
import {
  playClickSound,
  playHoverSound,
  playEngineRevSound,
  playCockpitWhoosh,
} from "../utils/audio";
import HeroBackgroundCanvas from "./HeroBackgroundCanvas";
import "./Hero.css";

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const hudRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.fromTo(
        ".ln-hero-eyebrow",
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          ".ln-hero-title-line",
          { y: 90, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, stagger: 0.12, ease: "power4.out" },
          "-=0.5"
        )
        .fromTo(
          ".ln-hero-tagline",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          imageRef.current,
          { scale: 0.92, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
          "-=0.7"
        )
        .fromTo(
          hudRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ".ln-hero-hud-chip",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" },
          "-=0.5"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // 3D Parallax tilt on profile showcase
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth <= 768) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          x: x * 10,
          y: y * 10,
          rotateY: x * 6,
          rotateX: -y * 6,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="ln-hero-section" id="home" ref={heroRef}>
      {/* HIGH-PERFORMANCE INTERACTIVE CYBER TELEMETRY CANVAS BACKDROP */}
      <HeroBackgroundCanvas />

      <div className="lando-container ln-hero-container">
        {/* TOP STATUS BAR (MISSION CONTROL TELEMETRY) */}
        <div className="ln-hero-topbar">
          <div className="ln-topbar-item">
            <span className="topbar-radar-dot"></span>
            <span className="ln-topbar-label">SYSTEM TELEMETRY:</span>
            <strong className="ln-topbar-val">LIVE // 24MS PING</strong>
          </div>

          <div className="ln-topbar-item center">
            <span className="ln-topbar-label">ACADEMIC CREDENTIAL:</span>
            <strong className="ln-topbar-val">GALGOTIAS UNIV · B.TECH CSE (2023-2027)</strong>
          </div>

          <div className="ln-topbar-item right">
            <span className="pulse-beacon"></span>
            <strong className="ln-topbar-val text-lime">AVAILABLE FOR HIRE 2026</strong>
          </div>
        </div>

        {/* MAIN HERO GRID */}
        <div className="ln-hero-main-grid">
          {/* LEFT: MASSIVE F1 TYPOGRAPHY & IMPACT VALUE PROP */}
          <div className="ln-hero-left">
            <div className="ln-hero-eyebrow">
              <span className="eyebrow-beacon"></span>
              <span className="eyebrow-pill">MERN ARCHITECTURE</span>
              <span className="eyebrow-sep">/</span>
              <span className="eyebrow-text">PRODUCTION WEB ENGINEERING</span>
            </div>

            <div className="ln-hero-title">
              <div className="ln-title-row">
                <h1
                  className="ln-hero-title-line"
                  onMouseEnter={(e) => {
                    scrambleText(e.currentTarget, "RITESH");
                    playHoverSound(90);
                  }}
                >
                  RITESH
                </h1>
              </div>
              <div className="ln-title-row">
                <h1
                  className="ln-hero-title-line is-accent"
                  onMouseEnter={(e) => {
                    scrambleText(e.currentTarget, "RAJ");
                    playHoverSound(140);
                  }}
                >
                  RAJ
                </h1>
              </div>
            </div>

            {/* HIGH-IMPACT STATEMENT */}
            <div className="ln-hero-tagline">
              <p className="ln-tagline-text">
                <span className="tagline-highlight">Redefining limits</span>, fighting for{" "}
                <span className="tagline-white">performance</span>, bringing precision to every
                line of code. Architecting <span className="tagline-highlight">high-throughput MERN systems</span> and
                ultra-fast distributed web applications.
              </p>
            </div>

            {/* ACTION CTA BUTTONS */}
            <div className="ln-hero-actions">
              <a
                href="#hall-of-fame"
                className="ln-btn ln-btn-lime"
                onClick={playEngineRevSound}
                onMouseEnter={() => playHoverSound(80)}
              >
                <span>EXPLORE WORK</span>
                <ArrowUpRight size={16} />
              </a>

              <a
                href="#track"
                className="ln-btn ln-btn-outline"
                onClick={playClickSound}
                onMouseEnter={() => playHoverSound(40)}
              >
                <span>CAREER TRACK</span>
                <ArrowDown size={15} />
              </a>

              <a
                href="https://github.com/riteshraj851116"
                target="_blank"
                rel="noopener noreferrer"
                className="ln-btn ln-btn-dark"
                onClick={playClickSound}
                onMouseEnter={() => playHoverSound(60)}
              >
                <span>GITHUB @riteshraj851116</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            {/* TELEMETRY METRICS CHIPS */}
            <div className="ln-hero-hud-chips">
              <div
                className="ln-hero-hud-chip"
                onMouseEnter={() => playHoverSound(20)}
              >
                <div className="chip-header">
                  <span className="chip-metric">03+</span>
                  <span className="chip-pulse-dot"></span>
                </div>
                <span className="chip-label">Production Apps</span>
                <div className="chip-bar"><div className="chip-bar-fill" style={{ width: "95%" }}></div></div>
              </div>

              <div
                className="ln-hero-hud-chip"
                onMouseEnter={() => playHoverSound(60)}
              >
                <div className="chip-header">
                  <span className="chip-metric">40+</span>
                  <span className="chip-pulse-dot"></span>
                </div>
                <span className="chip-label">REST APIs Built</span>
                <div className="chip-bar"><div className="chip-bar-fill" style={{ width: "90%" }}></div></div>
              </div>

              <div
                className="ln-hero-hud-chip is-accent-chip"
                onMouseEnter={() => playHoverSound(100)}
              >
                <div className="chip-header">
                  <span className="chip-metric text-lime">&lt;50ms</span>
                  <span className="chip-pulse-dot lime"></span>
                </div>
                <span className="chip-label">Socket.IO Delay</span>
                <div className="chip-bar"><div className="chip-bar-fill fill-lime" style={{ width: "98%" }}></div></div>
              </div>

              <div
                className="ln-hero-hud-chip"
                onMouseEnter={() => playHoverSound(140)}
              >
                <div className="chip-header">
                  <span className="chip-metric">200+</span>
                  <span className="chip-pulse-dot"></span>
                </div>
                <span className="chip-label">Java DSA Solved</span>
                <div className="chip-bar"><div className="chip-bar-fill" style={{ width: "88%" }}></div></div>
              </div>
            </div>
          </div>

          {/* RIGHT: ULTRA-LUXURY DRIVER TELEMETRY SHOWCASE */}
          <div className="ln-hero-right">
            <div
              className="ln-profile-card-container"
              ref={imageRef}
              onMouseEnter={playCockpitWhoosh}
            >
              {/* BACKDROP AMBIENT GLOW */}
              <div className="card-ambient-spotlight"></div>

              {/* HOLOGRAPHIC PROFILE FRAME */}
              <div className="ln-profile-frame">
                {/* HUD Precision Corner Calipers */}
                <span className="caliper top-left"></span>
                <span className="caliper top-right"></span>
                <span className="caliper bottom-left"></span>
                <span className="caliper bottom-right"></span>

                {/* Laser scan line effect */}
                <div className="hud-scan-beam"></div>

                {/* Profile Image with subtle cinematic grading */}
                <img
                  src={profileImage}
                  alt="Ritesh Raj Singh"
                  className="ln-profile-img"
                />

                {/* Gradient bottom mask for clean transition */}
                <div className="profile-img-mask"></div>

                {/* Floating Driver Badge */}
                <div className="ln-profile-badge-overlay">
                  <div className="badge-left">
                    <span className="pulse-beacon"></span>
                    <span className="badge-code">RRS // 2026</span>
                  </div>
                  <span className="badge-spec">FULL STACK SPECIALIST</span>
                </div>
              </div>

              {/* TELEMETRY STATUS DASHBOARD */}
              <div className="ln-hero-telemetry-box" ref={hudRef}>
                <div className="telemetry-header">
                  <div className="telemetry-live-dot">
                    <Activity size={12} className="text-lime" />
                    <span>SYSTEM TELEMETRY // STABLE</span>
                  </div>
                  {/* Live Equalizer Bars */}
                  <div className="telemetry-eq">
                    <span className="eq-bar bar-1"></span>
                    <span className="eq-bar bar-2"></span>
                    <span className="eq-bar bar-3"></span>
                    <span className="eq-bar bar-4"></span>
                    <span className="eq-bar bar-5"></span>
                  </div>
                </div>

                <div className="telemetry-body">
                  <div className="telemetry-row">
                    <span className="t-label">
                      <Cpu size={11} className="inline-icon" /> Core Stack:
                    </span>
                    <strong className="t-val text-lime">MERN Stack + Socket.IO</strong>
                  </div>
                  <div className="telemetry-row">
                    <span className="t-label">
                      <Terminal size={11} className="inline-icon" /> Certification:
                    </span>
                    <strong className="t-val">CodeHelp (Love Babbar) MERN</strong>
                  </div>
                  <div className="telemetry-row">
                    <span className="t-label">
                      <ShieldCheck size={11} className="inline-icon" /> Algorithms:
                    </span>
                    <strong className="t-val">Apna College Java DSA (200+)</strong>
                  </div>
                  <div className="telemetry-row">
                    <span className="t-label">
                      <Activity size={11} className="inline-icon" /> Academics:
                    </span>
                    <strong className="t-val">B.Tech CSE · CGPA 7.3</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM TELEMETRY TICKER */}
        <div className="ln-hero-bottom-bar">
          <div className="bottom-bar-left">
            <span className="text-muted">SCROLL VELOCITY ACTIVE</span>
            <span className="bar-sep">·</span>
            <span className="text-lime">100% AUTHENTIC CREDENTIALS</span>
          </div>

          <a
            href="#track"
            className="bottom-scroll-trigger"
            onClick={playClickSound}
            onMouseEnter={() => playHoverSound(50)}
          >
            <span>DISCOVER JOURNEY</span>
            <ArrowDown size={14} className="bounce-arrow" />
          </a>

          <div className="bottom-bar-right">
            <span>GALGOTIAS UNIVERSITY CSE // BIHAR → GREATER NOIDA</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
