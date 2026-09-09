import { playStampThud } from "../utils/audio";
import "./PostageStamp.css";

const PostageStamp = () => {
  return (
    <div
      className="paper-postage-stamp"
      aria-label="Official Identity Postage Stamp"
      onClick={() => {
        try { playStampThud(); } catch (e) {}
      }}
      title="Click to stamp"
      style={{ cursor: "pointer" }}
    >
      <div className="stamp-perforations">
        {/* SUNBURST ICON (Exact Niccolo Miranda emblem) */}
        <div className="stamp-sunburst-container">
          <svg className="stamp-sunburst" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sun rays radiating upwards */}
            <line x1="50" y1="50" x2="50" y2="10" stroke="var(--terracotta)" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="50" x2="25" y2="15" stroke="var(--terracotta)" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="50" x2="75" y2="15" stroke="var(--terracotta)" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="50" x2="10" y2="30" stroke="var(--terracotta)" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="50" x2="90" y2="30" stroke="var(--terracotta)" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="50" x2="5" y2="50" stroke="var(--terracotta)" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="50" x2="95" y2="50" stroke="var(--terracotta)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="50" r="14" fill="var(--terracotta)" />
          </svg>
        </div>

        {/* ARTISAN SIGNATURE */}
        <div className="stamp-signature-wrapper">
          <svg className="stamp-signature" viewBox="0 0 160 50" fill="none">
            <path
              d="M10 35 C 30 10, 45 45, 60 15 C 75 5, 85 40, 100 20 C 115 10, 130 35, 150 25"
              stroke="#1d1d1b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* TYPEWRITER METADATA */}
        <div className="stamp-metadata">
          <p className="stamp-meta-row">
            <span className="stamp-meta-label">NAME:</span>
            <span className="stamp-meta-val">Ritesh Raj</span>
          </p>
          <p className="stamp-meta-row">
            <span className="stamp-meta-label">ROLE:</span>
            <span className="stamp-meta-val">Full Stack MERN</span>
          </p>
          <p className="stamp-meta-row">
            <span className="stamp-meta-label">DEGREE:</span>
            <span className="stamp-meta-val">B.Tech CSE (7.3)</span>
          </p>
          <p className="stamp-meta-row">
            <span className="stamp-meta-label">PHONE:</span>
            <span className="stamp-meta-val">+91-9709721676</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostageStamp;
