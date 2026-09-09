import { useState, useEffect } from "react";
import { ArrowUpRight, Copy, Check, Clock, Send, Terminal, Phone, Mail, Globe, Sparkles } from "lucide-react";
import {
  playClickSound,
  playHoverSound,
  playSuccessSound,
  playCockpitWhoosh,
  playTelemetryScan,
} from "../utils/audio";
import "./Contact.css";

const GithubIcon = ({ size = 18 }) => (
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

const LinkedinIcon = ({ size = 18 }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "Full-Stack Engineering Opportunity",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // IST Live Time
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date());
        setLocalTime(timeStr);
      } catch {
        setLocalTime("12:00 PM");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText("riteshraj851116@gmail.com");
    setCopied(true);
    playSuccessSound();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playSuccessSound();
    setSubmitted(true);

    const subjectEncoded = encodeURIComponent(formState.subject);
    const bodyEncoded = encodeURIComponent(
      `Hello Ritesh,\n\n${formState.message}\n\nBest regards,\n${formState.name}\n${formState.email}`
    );
    window.location.href = `mailto:riteshraj851116@gmail.com?subject=${subjectEncoded}&body=${bodyEncoded}`;

    setTimeout(() => {
      setSubmitted(false);
      setFormState({
        name: "",
        email: "",
        subject: "Full-Stack Engineering Opportunity",
        message: "",
      });
    }, 4000);
  };

  return (
    <section className="ln-contact-wrapper" id="contact">
      {/* WHAT'S UP ON SOCIALS (LANDO NORRIS EXACT CALLOUT SECTION) */}
      <div className="ln-socials-block">
        <div className="lando-container">
          <div className="ln-socials-header">
            <span className="socials-eyebrow">06 // DIRECT TRANSMISSION</span>
            <h2 className="socials-title">
              WHAT’S UP <span className="font-display text-lime">ON SOCIALS</span>
            </h2>
          </div>

          <div className="ln-socials-grid">
            {/* PHONE */}
            <a
              href="tel:+919709721676"
              className="social-card"
              onClick={playClickSound}
              onMouseEnter={() => playHoverSound(20)}
            >
              <div className="social-card-top">
                <span className="s-tag">DIRECT CALL</span>
                <Phone size={18} className="s-icon" />
              </div>
              <h3 className="s-title">+91 9709721676</h3>
              <div className="social-card-bottom">
                <span>TELEPHONY DISPATCH</span>
                <ArrowUpRight size={16} />
              </div>
            </a>

            {/* EMAIL */}
            <a
              href="mailto:riteshraj851116@gmail.com"
              className="social-card is-highlight"
              onClick={playClickSound}
              onMouseEnter={() => playHoverSound(60)}
            >
              <div className="social-card-top">
                <span className="s-tag text-lime">DIRECT MAIL</span>
                <Mail size={18} className="s-icon text-lime" />
              </div>
              <h3 className="s-title">riteshraj851116@gmail.com</h3>
              <div className="social-card-bottom">
                <span>INSTANT INBOX</span>
                <ArrowUpRight size={16} />
              </div>
            </a>

            {/* GITHUB */}
            <a
              href="https://github.com/riteshraj851116"
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
              onClick={playClickSound}
              onMouseEnter={() => playHoverSound(100)}
            >
              <div className="social-card-top">
                <span className="s-tag">OPEN SOURCE</span>
                <GithubIcon size={18} />
              </div>
              <h3 className="s-title">@riteshraj851116</h3>
              <div className="social-card-bottom">
                <span>VIEW REPOSITORIES</span>
                <ArrowUpRight size={16} />
              </div>
            </a>

            {/* LINKEDIN */}
            <a
              href="https://www.linkedin.com/in/ritesh-raj-9b52162a7/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
              onClick={playClickSound}
              onMouseEnter={() => playHoverSound(140)}
            >
              <div className="social-card-top">
                <span className="s-tag">PROFESSIONAL</span>
                <LinkedinIcon size={18} />
              </div>
              <h3 className="s-title">in/ritesh-raj</h3>
              <div className="social-card-bottom">
                <span>CONNECT ON LINKEDIN</span>
                <ArrowUpRight size={16} />
              </div>
            </a>
          </div>

          {/* QUICK COPY & DIRECT FORM ROW */}
          <div className="ln-contact-split">
            {/* QUICK ACTIONS */}
            <div className="ln-quick-contact-col">
              <h4 className="quick-title">READY FOR HIGH PERFORMANCE</h4>
              <p className="quick-desc">
                Currently open for Full-Stack Developer roles, MERN software engineering internships, and high-performance digital product builds.
              </p>

              <button
                className={`ln-copy-pill ${copied ? "copied" : ""}`}
                onClick={handleCopyEmail}
                onMouseEnter={playCockpitWhoosh}
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-lime" />
                    <span>EMAIL COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>COPY EMAIL: riteshraj851116@gmail.com</span>
                  </>
                )}
              </button>

              <div className="quick-telemetry-badge">
                <Clock size={14} className="text-lime" />
                <span>BIHAR, INDIA (IST) — {localTime}</span>
              </div>
            </div>

            {/* DIRECT TRANSMISSION FORM */}
            <div className="ln-form-col">
              <div className="form-card">
                <div className="form-header">
                  <span className="pulse-beacon"></span>
                  <span className="form-title">TRANSMISSION TERMINAL</span>
                </div>

                <form onSubmit={handleSubmit} className="ln-msg-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label>NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name / Organization"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>EMAIL</label>
                      <input
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>MESSAGE</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share details on your project, engineering role, or timeline..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className={`ln-btn ln-btn-lime ${submitted ? "submitted" : ""}`}
                    disabled={submitted}
                    onMouseEnter={playHoverSound}
                  >
                    {submitted ? (
                      <>
                        <Check size={16} />
                        <span>TRANSMISSION SENT!</span>
                      </>
                    ) : (
                      <>
                        <span>INITIALIZE DISPATCH</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ICONIC CURVED MASK FOOTER (EXACT LANDONORRIS.COM MASKED FOOTER) */}
      <footer className="ln-curved-footer">
        {/* TOP CURVED MASK CUTOUT */}
        <div className="footer-cutout-notch">
          <svg
            className="footer-curve-svg"
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0 C 480 80, 960 80, 1440 0 L 1440 80 L 0 80 Z"
              fill="#080709"
            />
          </svg>
        </div>

        <div className="lando-container footer-content-container">
          {/* GIANT FOOTER IMPACT HEADLINE (LANDO: 'Always bringing the fight.') */}
          <div className="footer-headline-wrap">
            <h2 className="footer-headline">
              Always <span className="font-display text-lime">architecting</span> for performance.
            </h2>
          </div>

          {/* MIDDLE ROW: SIGNATURE + NAVIGATION */}
          <div className="footer-middle-row">
            <div className="footer-sig-block">
              <svg
                className="footer-signature"
                viewBox="0 0 260 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 50 C 35 12, 60 8, 80 35 C 100 55, 120 18, 140 28 C 165 40, 185 10, 215 22 C 235 28, 245 18, 255 20 M70 28 L120 28 M165 42 L245 42"
                  stroke="var(--color--lime)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="footer-auth-label">
                <strong>RITESH RAJ</strong>
                <span>FULL STACK MERN SPECIALIST · BIHAR / GREATER NOIDA</span>
              </div>
            </div>

            <div className="footer-nav-links">
              <a href="#home" onClick={playClickSound}>01 // HOME</a>
              <a href="#work" onClick={playClickSound}>02 // WORK</a>
              <a href="#track" onClick={playClickSound}>03 // TRACK</a>
              <a href="#hall-of-fame" onClick={playClickSound}>04 // HALL OF FAME</a>
              <a href="#tech-stack" onClick={playClickSound}>05 // TECH</a>
              <a href="#contact" onClick={playClickSound}>06 // TRANSMISSION</a>
            </div>
          </div>

          {/* BOTTOM METADATA & COPYRIGHT */}
          <div className="footer-bottom-bar">
            <div className="footer-copy">
              <span>© 2026 RITESH RAJ SINGH. ALL RIGHTS RESERVED.</span>
              <span className="footer-sep">·</span>
              <span>100% AUTHENTIC DATA</span>
            </div>

            <div className="footer-telemetry">
              <span className="pulse-beacon"></span>
              <span>INDIA (IST) — {localTime}</span>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
