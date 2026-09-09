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
  const wordRef = useRef(null);

  // Cycle through greetings and increment progress to 100%
  useEffect(() => {
    let prog = 0;

    const progressInterval = setInterval(() => {
      prog += Math.floor(Math.random() * 3) + 2;
      if (prog >= 100) {
        prog = 100;
        setProgress(100);
        clearInterval(progressInterval);
        try { playBootSound(); } catch (e) {}
      } else {
        setProgress(prog);
      }
    }, 38);

    const greetingInterval = setInterval(() => {
      try { playLoaderTick(); } catch (e) {}
      if (wordRef.current) {
        gsap.fromTo(
          wordRef.current,
          { y: 15, opacity: 0.2 },
          { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" }
        );
      }
      setCurrentIndex((prev) => (prev + 1) % greetings.length);
    }, 250);

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
        <span className="hud-title">RITESH RAJ</span>
        <span className="hud-edition">{currentGreeting.lang} // GREETING</span>
      </div>

      {/* CENTER: ICONIC BOLD HELLO STAGE */}
      <div className="hello-center-stage" ref={contentRef}>
        <div className="hello-main-row">
          <span className="hello-dot-accent" />
          <h1 className="hello-word-display" ref={wordRef}>{currentGreeting.text}</h1>
        </div>

        <div className="hello-sub-meta">
          <span className="meta-lang">[{currentGreeting.lang}]</span>
          <span className="meta-divider">//</span>
          <span className="meta-role">FULL STACK MERN ENGINEER</span>
        </div>
      </div>

      {/* BOTTOM HUD: PROGRESS & TELEMETRY */}
      <div className="loader-bottom-hud">
        <div className="loader-progress-track">
          <div
            className="loader-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="bottom-telemetry-row">
          <span className="telemetry-val">
            {progress < 100 ? "COMPILING KERNEL & ASSETS..." : "WORKSPACE INITIALIZED"}
          </span>
          <span className="bottom-tagline">GALGOTIAS UNIVERSITY CSE · CGPA 7.3</span>
          <span className="telemetry-val">{progress}%</span>
        </div>
      </div>
    </aside>
  );
};

export default Loader;
