import { useState } from "react";
import { ArrowUpRight, ArrowRight, Code2, Cpu, Terminal, Sparkles } from "lucide-react";
import {
  playClickSound,
  playHoverSound,
  playCockpitWhoosh,
  playTelemetryScan,
} from "../utils/audio";
import "./OnTrackOffTrack.css";

const OnTrackOffTrack = () => {
  const [activeSide, setActiveSide] = useState("left");

  return (
    <section className="ln-otoc-section" id="on-off-code">
      <div className="ln-otoc-container">
        {/* LEFT COLUMN: ON CODE */}
        <div
          className={`ln-otoc-col is-on-code ${activeSide === "left" ? "is-expanded" : ""}`}
          onMouseEnter={() => {
            if (activeSide !== "left") {
              setActiveSide("left");
              playCockpitWhoosh();
            }
          }}
        >
          <div className="ln-otoc-inner">
            <div className="otoc-top-eyebrow">
              <span className="otoc-badge">03 // ENGINEERING DISCIPLINE</span>
              <span className="otoc-status">ACTIVE DEPLOYMENT</span>
            </div>

            <div className="otoc-title-wrap">
              <h2 className="otoc-super-brier font-display text-lime">ON</h2>
              <h2 className="otoc-super-mona text-white">CODE</h2>
            </div>

            <p className="otoc-description">
              Production web engineering, low-latency Socket.IO event buses (&lt;50ms), scalable Express.js REST APIs (40+ endpoints), and reactive React user interfaces.
            </p>

            <div className="otoc-highlights">
              <div className="otoc-pill">MERN ARCHITECTURE</div>
              <div className="otoc-pill">REAL-TIME SOCKET.IO</div>
              <div className="otoc-pill">LIGHTHOUSE 90+</div>
            </div>

            <div className="otoc-action">
              <a
                href="#hall-of-fame"
                className="otoc-circle-btn"
                onClick={playClickSound}
                onMouseEnter={playHoverSound}
                aria-label="View On Code Projects"
              >
                <ArrowRight size={22} />
              </a>
              <span className="otoc-action-label">EXPLORE PRODUCTION BUILDS</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OFF CODE (DSA & THEORY) */}
        <div
          className={`ln-otoc-col is-off-code ${activeSide === "right" ? "is-expanded" : ""}`}
          onMouseEnter={() => {
            if (activeSide !== "right") {
              setActiveSide("right");
              playTelemetryScan();
            }
          }}
        >
          <div className="ln-otoc-inner">
            <div className="otoc-top-eyebrow">
              <span className="otoc-badge">04 // FOUNDATIONAL RIGOR</span>
              <span className="otoc-status">ALGORITHMIC LOGIC</span>
            </div>

            <div className="otoc-title-wrap">
              <h2 className="otoc-super-brier font-display text-lime-off">OFF</h2>
              <h2 className="otoc-super-mona text-white">CODE</h2>
            </div>

            <p className="otoc-description">
              Computational rigor with Data Structures & Algorithms in Java (200+ LeetCode problems solved with Apna College), OOP software architecture, and DBMS relational modeling.
            </p>

            <div className="otoc-highlights">
              <div className="otoc-pill">200+ JAVA DSA</div>
              <div className="otoc-pill">OOP PARADIGMS</div>
              <div className="otoc-pill">SYSTEM ARCHITECTURE</div>
            </div>

            <div className="otoc-action">
              <a
                href="#track"
                className="otoc-circle-btn is-lime"
                onClick={playClickSound}
                onMouseEnter={playHoverSound}
                aria-label="View Off Code Credentials"
              >
                <ArrowRight size={22} />
              </a>
              <span className="otoc-action-label">VIEW CREDENTIALS & DSA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnTrackOffTrack;
