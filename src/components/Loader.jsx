import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { playLoaderTick, playBootSound } from "../utils/audio";
import "./Loader.css";

const greetings = [
  { text: "Hello", lang: "EN" },
  { text: "Bonjour", lang: "FR" },
  { text: "नमस्ते", lang: "HI" },
  { text: "Ciao", lang: "IT" },
  { text: "Hola", lang: "ES" },
  { text: "こんにちは", lang: "JA" },
  { text: "Olá", lang: "PT" },
  { text: "Hallo", lang: "DE" },
];

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const contentRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through greetings and increment progress to 100%
  useEffect(() => {
    let prog = 0;

    const progressInterval = setInterval(() => {
      prog += Math.floor(Math.random() * 4) + 2;
      if (prog >= 100) {
        prog = 100;
        setProgress(100);
        clearInterval(progressInterval);
        playBootSound();
      } else {
        setProgress(prog);
      }
    }, 32);

    const greetingInterval = setInterval(() => {
      setCurrentIndex((prev) => {
        playLoaderTick();
        return (prev + 1) % greetings.length;
      });
    }, 240);

    return () => {
      clearInterval(progressInterval);
      clearInterval(greetingInterval);
    };
  }, []);

  // Exit animation when progress hits 100%
  useEffect(() => {
    if (progress !== 100) return;

    const timer = setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      tl.to(contentRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      })
        .to(
          loaderRef.current,
          {
            yPercent: -100,
            duration: 0.75,
            ease: "power4.inOut",
          },
          "-=0.1"
        )
        .set(loaderRef.current, { display: "none" });
    }, 450);

    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  const currentGreeting = greetings[currentIndex] || greetings[0];

  return (
    <aside className="hello-loader-screen" ref={loaderRef} aria-label="Loading Screen">
      {/* TOP STATUS HUD */}
      <div className="loader-top-hud">
        <div className="hud-pill">
          <span className="pulse-beacon"></span>
          <span>RR // INITIALIZING</span>
        </div>
        <span className="hud-title">RITESH RAJ · PORTFOLIO</span>
        <span className="hud-edition">{currentGreeting.lang} // GREETING</span>
      </div>

      {/* CENTER: ICONIC BOLD HELLO STAGE */}
      <div className="hello-center-stage" ref={contentRef}>
        <div className="hello-main-row">
          <span className="hello-dot" />
          <h1 className="hello-headline">HELLO</h1>
        </div>

        <div className="hello-sub-row">
          <div className="hello-greeting-pill">
            <span className="hello-intl-text">{currentGreeting.text}</span>
            <span className="hello-lang-badge">[{currentGreeting.lang}]</span>
          </div>
          <span className="hello-arch-text">FULL STACK ENGINEER & MERN SPECIALIST</span>
        </div>
      </div>

      {/* BOTTOM HUD & PROGRESS TRACK */}
      <div className="loader-bottom-hud">
        <div className="loader-status-col">
          <span className="status-indicator-dot"></span>
          <span className="status-live-text">
            {progress < 100 ? "COMPILING KERNEL & ASSETS..." : "WORKSPACE INITIALIZED"}
          </span>
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
    </aside>
  );
};

export default Loader;
