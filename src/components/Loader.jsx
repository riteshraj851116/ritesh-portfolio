import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Terminal, Sparkles } from "lucide-react";
import { playLoaderTick, playBootSound } from "../utils/audio";
import "./Loader.css";

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Animate progress counter from 0 to 100 with audio telemetry ticks
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += Math.floor(Math.random() * 9) + 5;
      if (start >= 100) {
        start = 100;
        setProgress(100);
        playBootSound();
        clearInterval(interval);
      } else {
        setProgress(start);
        playLoaderTick(start);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Main GSAP animation timeline
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    tl.fromTo(
      ".loader-name-line",
      {
        y: "110%",
      },
      {
        y: "0%",
        duration: 1.1,
        stagger: 0.08,
        ease: "power4.out",
      }
    )
      .fromTo(
        ".loader-icon",
        {
          scale: 0,
          opacity: 0,
          rotate: -180,
        },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
        },
        "-=0.6"
      )
      .fromTo(
        ".loader-telemetry",
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.4"
      )
      .to({}, { duration: 1.1 })
      .to(".loader-name-line", {
        y: "-110%",
        duration: 0.8,
        stagger: 0.05,
        ease: "power4.in",
      })
      .to(
        ".loader-icon",
        {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
        },
        "-=0.6"
      )
      .to(
        ".loader-telemetry",
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.4"
      )
      .to(
        loaderRef.current,
        {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        },
        "-=0.1"
      )
      .set(loaderRef.current, {
        display: "none",
      });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="loader" ref={loaderRef}>
      {/* TOP STATUS BAR */}
      <div className="loader-top">
        <div className="loader-status-pill">
          <span className="live-dot-pulse"></span>
          <span>RRS / SYSTEM BOOT</span>
        </div>

        <span>RITESH RAJ SINGH</span>

        <span>PORTFOLIO / 2026</span>
      </div>

      {/* CENTER HERO NAME */}
      <div className="loader-center">
        <div className="loader-name">
          <div className="loader-name-line">RITESH</div>
          <div className="loader-name-line loader-outline">RAJ</div>
        </div>

        <div className="loader-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* PROGRESS & TELEMETRY */}
        <div className="loader-telemetry">
          <div className="telemetry-bar">
            <div
              className="telemetry-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="telemetry-info">
            <span className="telemetry-item">
              <Terminal size={11} />
              <span>INITIALIZING MERN STACK</span>
            </span>

            <span className="telemetry-percentage">{progress}%</span>

            <span className="telemetry-item">
              <Sparkles size={11} />
              <span>SYSTEM READY</span>
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="loader-bottom">
        <span>DESIGN / CODE / MOTION</span>
        <span>MERN · THREE.JS · GSAP</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </div>
  );
};

export default Loader;
