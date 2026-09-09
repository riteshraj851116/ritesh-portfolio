import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight, ArrowDown, Sparkles, Code2, Server, Zap } from "lucide-react";
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
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, stagger: 0.12, ease: "power4.out" },
          "-=0.5"
        )
        .fromTo(
          ".ln-hero-tagline",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ".ln-hero-actions",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          imageRef.current,
          { scale: 0.94, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
          "-=0.7"
        )
        .fromTo(
          ".ln-hero-hud-chip",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" },
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
          rotateY: x * 7,
          rotateX: -y * 7,
          duration: 0.65,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="ln-hero-section" id="home" ref={heroRef}>
      {/* PURE OBSIDIAN AMBIENT CANVAS */}
      <HeroBackgroundCanvas />

      <div className="lando-container ln-hero-container">
        {/* MAIN HERO GRID */}
        <div className="ln-hero-main-grid">
          {/* LEFT: MASSIVE EDITORIAL TYPOGRAPHY & MANIFESTO */}
          <div className="ln-hero-left">
            <div className="ln-hero-eyebrow">
              <span className="eyebrow-beacon"></span>
              <span className="eyebrow-pill">FULL STACK ENGINEER</span>
              <span className="eyebrow-sep">/</span>
              <span className="eyebrow-text">MERN & REAL-TIME ARCHITECT</span>
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

            {/* HIGH-IMPACT EDITORIAL VALUE PROPOSITION */}
            <div className="ln-hero-tagline">
              <p className="ln-tagline-text">
                Engineering <span className="tagline-highlight">high-throughput distributed systems</span>,
                sub-50ms real-time <span className="tagline-white">Socket.IO pipelines</span>, and
                high-performance full-stack web applications with mathematical precision and luxury aesthetics.
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

            {/* INTEGRATED METRICS CAPSULE STRIP */}
            <div className="ln-hero-hud-chips">
              <div
                className="ln-hero-hud-chip"
                onMouseEnter={() => playHoverSound(20)}
              >
                <div className="chip-header">
                  <span className="chip-metric">03+</span>
                  <Code2 size={13} className="text-lime" />
                </div>
                <span className="chip-label">Production Apps</span>
              </div>

              <div
                className="ln-hero-hud-chip"
                onMouseEnter={() => playHoverSound(60)}
              >
                <div className="chip-header">
                  <span className="chip-metric">40+</span>
                  <Server size={13} className="text-lime" />
                </div>
                <span className="chip-label">REST APIs Built</span>
              </div>

              <div
                className="ln-hero-hud-chip is-accent-chip"
                onMouseEnter={() => playHoverSound(100)}
              >
                <div className="chip-header">
                  <span className="chip-metric text-lime">&lt;50ms</span>
                  <Zap size={13} className="text-lime" />
                </div>
                <span className="chip-label">Socket.IO Delay</span>
              </div>

              <div
                className="ln-hero-hud-chip"
                onMouseEnter={() => playHoverSound(140)}
              >
                <div className="chip-header">
                  <span className="chip-metric">200+</span>
                  <Sparkles size={13} className="text-lime" />
                </div>
                <span className="chip-label">Java DSA Solved</span>
              </div>
            </div>
          </div>

          {/* RIGHT: LUXURY EDITORIAL PORTRAIT & CREDENTIAL MONOLITH */}
          <div className="ln-hero-right">
            <div
              className="ln-profile-card-container"
              ref={imageRef}
              onMouseEnter={playCockpitWhoosh}
            >
              {/* BACKDROP AMBIENT GLOW */}
              <div className="card-ambient-spotlight"></div>

              {/* HIGH-FASHION EDITORIAL PORTRAIT FRAME */}
              <div className="ln-profile-frame">
                {/* Profile Image with subtle cinematic grading */}
                <img
                  src={profileImage}
                  alt="Ritesh Raj — Full Stack Engineer"
                  className="ln-profile-img"
                />

                {/* Subtle dark gradient overlay for depth */}
                <div className="profile-img-mask"></div>

                {/* Floating Driver Badge */}
                <div className="ln-profile-badge-overlay">
                  <div className="badge-left">
                    <span className="pulse-beacon"></span>
                    <span className="badge-code">RITESH RAJ</span>
                  </div>
                  <span className="badge-spec">FULL STACK SPECIALIST</span>
                </div>
              </div>

              {/* REFINED CREDENTIAL CAPTION */}
              <div className="hero-editorial-footer-bar">
                <div className="editorial-stat-item">
                  <span className="editorial-label">ACADEMIC CREDENTIAL</span>
                  <strong className="editorial-val">GALGOTIAS UNIV · B.TECH CSE</strong>
                </div>
                <div className="editorial-stat-item right">
                  <span className="editorial-label">AVAILABILITY</span>
                  <strong className="editorial-val text-lime">OPEN FOR ROLES 2026</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM MINIMALIST SCROLL PROMPT */}
        <div className="ln-hero-bottom-bar">
          <div className="bottom-bar-left">
            <span className="text-muted">SYSTEM ONLINE</span>
            <span className="bar-sep">·</span>
            <span className="text-lime">100% PRODUCTION VERIFIED</span>
          </div>

          <a
            href="#track"
            className="bottom-scroll-trigger"
            onClick={playClickSound}
            onMouseEnter={() => playHoverSound(50)}
          >
            <span>EXPLORE TIMELINE</span>
            <ArrowDown size={14} className="bounce-arrow" />
          </a>

          <div className="bottom-bar-right">
            <span>GREATER NOIDA, INDIA · GLOBAL DISPATCH</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
