import { useRef, useEffect } from "react";
import { ArrowUpRight, Globe, Zap, Radio, CheckCircle2 } from "lucide-react";
import { playClickSound, playHoverSound, playEngineRevSound } from "../utils/audio";
import { attach3DCardTilt } from "../utils/gsapKinematics";
import "./FeaturedFlagship.css";

const GithubIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FeaturedFlagship = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      return attach3DCardTilt(cardRef.current, { maxTilt: 6, perspective: 1200 });
    }
  }, []);

  return (
    <section className="ln-flagship-section">
      <div className="lando-container ln-flagship-container" ref={cardRef}>
        {/* TOP STATUS BAR */}
        <div className="flagship-top">
          <div className="flagship-badge">
            <span className="pulse-beacon"></span>
            <span>FEATURED FLAGSHIP ARCHITECTURE</span>
          </div>
          <span className="flagship-id">RRS // PROD-01</span>
        </div>

        {/* HEADLINE */}
        <div className="flagship-titles">
          <h2 className="flagship-super-title">JOBSPHERE</h2>
          <h3 className="flagship-super-sub font-display text-lime">
            FULL-STACK CAREER RECRUITMENT ENGINE
          </h3>
        </div>

        {/* SUMMARY */}
        <p className="flagship-description">
          A high-availability full-stack MERN application connecting job candidates and corporate recruiters in real-time. Engineered with a low-latency bi-directional <strong>Socket.IO</strong> live messaging engine under 50ms, 40+ REST API endpoints in Node.js/Express, and robust JWT/bcrypt authentication shielding user credentials.
        </p>

        {/* VERIFIED PRODUCTION METRICS (LANDO NORRIS TELEMETRY UI) */}
        <div className="flagship-metrics-grid">
          <div className="flagship-metric-card">
            <span className="m-val text-lime">40+</span>
            <strong className="m-label">REST Endpoints</strong>
            <span className="m-detail">Modular Node.js/Express API design</span>
          </div>

          <div className="flagship-metric-card">
            <span className="m-val text-white">&lt;50ms</span>
            <strong className="m-label">Socket.IO Delay</strong>
            <span className="m-detail">Instant bi-directional live chat</span>
          </div>

          <div className="flagship-metric-card">
            <span className="m-val text-lime">100%</span>
            <strong className="m-label">Credential Defense</strong>
            <span className="m-detail">JWT + Bcrypt cryptographic auth</span>
          </div>

          <div className="flagship-metric-card">
            <span className="m-val text-white">Full ATS</span>
            <strong className="m-label">Applicant Pipeline</strong>
            <span className="m-detail">Automated candidate status lifecycle</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flagship-actions">
          <a
            href="https://riteshraj851116.github.io/jobsphere/"
            target="_blank"
            rel="noopener noreferrer"
            className="ln-btn ln-btn-lime"
            onClick={playEngineRevSound}
            onMouseEnter={() => playHoverSound(60)}
          >
            <Globe size={16} />
            <span>LAUNCH LIVE JOBSPHERE</span>
            <ArrowUpRight size={16} />
          </a>

          <a
            href="https://github.com/riteshraj851116/jobsphere"
            target="_blank"
            rel="noopener noreferrer"
            className="ln-btn ln-btn-outline"
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
          >
            <GithubIcon size={16} />
            <span>VIEW SOURCE ON GITHUB</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFlagship;
