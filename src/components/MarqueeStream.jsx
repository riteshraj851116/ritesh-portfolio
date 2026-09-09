import { useEffect, useRef } from "react";
import { Sparkles, Terminal, Activity, Zap, Star } from "lucide-react";
import "./MarqueeStream.css";

const MarqueeStream = () => {
  const tickerItems1 = [
    "FULL STACK MERN SPECIALIST",
    "REAL-TIME SOCKET.IO CHAT (<50MS)",
    "40+ REST API ENDPOINTS",
    "200+ JAVA DSA PROBLEMS SOLVED",
    "GALGOTIAS UNIVERSITY B.TECH CSE",
    "CODEHELP BABBAR CERTIFIED",
    "APNA COLLEGE CERTIFIED",
    "LIGHTHOUSE 90+ HIGH PERFORMANCE",
  ];

  const tickerItems2 = [
    "REACT 19",
    "NODE.JS RUNTIME",
    "EXPRESS.JS APIS",
    "MONGODB AGGREGATIONS",
    "SOCKET.IO WEBSOCKETS",
    "THREE.JS WEBGL",
    "JWT & BCRYPT SECURITY",
    "RESTFUL ARCHITECTURES",
    "TAILWIND CSS",
    "VITE ESM BUNDLER",
  ];

  return (
    <section className="ln-marquee-section" id="work">
      {/* STREAM 1: LEFTWARD HIGH VELOCITY */}
      <div className="ln-marquee-track">
        <div className="ln-marquee-inner left">
          {[...tickerItems1, ...tickerItems1, ...tickerItems1].map((text, i) => (
            <div key={i} className="ln-marquee-item is-lime">
              <span className="ln-marquee-star">★</span>
              <span className="ln-marquee-text">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STREAM 2: RIGHTWARD STREAM (CONTRAST COLOR) */}
      <div className="ln-marquee-track">
        <div className="ln-marquee-inner right">
          {[...tickerItems2, ...tickerItems2, ...tickerItems2].map((text, i) => (
            <div key={i} className="ln-marquee-item is-dark">
              <span className="ln-marquee-bullet">/</span>
              <span className="ln-marquee-text">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MANIFESTO IMPACT STATEMENT (EXACT LANDONORRIS.COM IMPACT BLOCK) */}
      <div className="lando-container ln-manifesto-container">
        <div className="ln-manifesto-badge">
          <div className="badge-dot-live"></div>
          <span>ENGINEERING MANIFESTO</span>
        </div>

        <h2 className="ln-manifesto-headline">
          <span className="font-display text-lime">Redefining</span> limits, fighting for{" "}
          <span className="font-display text-white">performance</span>, bringing it all in all ways. Defining a{" "}
          <span className="font-display text-lime">legacy</span> in modern software architecture on and off the screen.
        </h2>

        <div className="ln-manifesto-footer">
          <div className="manifesto-meta">
            <span className="meta-num">01 / MANIFESTO</span>
            <span className="meta-text">ENGINEERED FOR RESILIENCE & SCALE</span>
          </div>
          <div className="manifesto-sig-wrap">
            <svg
              className="ln-signature-svg"
              viewBox="0 0 240 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 45 C 30 10, 50 5, 70 30 C 85 48, 100 15, 120 25 C 140 35, 155 10, 180 20 C 195 25, 210 15, 230 18 M60 25 L100 25 M140 38 L210 38"
                stroke="var(--color--lime)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sig-caption">RITESH RAJ — AUTHORIZED SIGNATURE</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarqueeStream;
