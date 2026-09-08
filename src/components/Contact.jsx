import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check, Copy, Clock, Send, Terminal } from "lucide-react";
import { playClickSound, playHoverSound, playSuccessSound } from "../utils/audio";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "Full-Stack Opportunity / Project",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Live IST Clock (Asia/Kolkata)
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
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-heading span",
        {
          y: 120,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".contact",
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText("riteshraj851116@gmail.com");
    setCopied(true);
    playSuccessSound();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playSuccessSound();
    setFormSubmitted(true);

    // Open mailto with prefilled information
    const subjectEncoded = encodeURIComponent(formState.subject || "Collaboration Inquiry");
    const bodyEncoded = encodeURIComponent(
      `Hello Ritesh,\n\n${formState.message}\n\nBest regards,\n${formState.name}\n${formState.email}`
    );
    window.location.href = `mailto:riteshraj851116@gmail.com?subject=${subjectEncoded}&body=${bodyEncoded}`;

    setTimeout(() => {
      setFormSubmitted(false);
      setFormState({
        name: "",
        email: "",
        subject: "Full-Stack Opportunity / Project",
        message: "",
      });
    }, 4000);
  };

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      {/* TOP */}
      <div className="contact-top">
        <div className="contact-top-left">
          <span>05 / CONTACT</span>
          <span className="contact-status-live">
            <span className="pulse-circle"></span>
            AVAILABLE FOR HIRE
          </span>
        </div>

        {/* TIMEZONE & LOCAL TIME */}
        <div className="contact-time-badge">
          <Clock size={11} />
          <span>BIHAR, INDIA (IST) — {localTime || "12:00 PM"}</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="contact-main">
        <div className="contact-heading">
          <span>LET'S</span>
          <span>CREATE</span>
          <span>TOGETHER</span>
        </div>

        <div className="contact-grid">
          {/* LEFT: INFO & LINKS */}
          <div className="contact-left-col">
            <p className="contact-description">
              I build production-grade web applications with the MERN stack, robust API architectures, and dynamic interactive interfaces. Let's discuss your next breakthrough project or engineering role.
            </p>

            {/* LINKS */}
            <div className="contact-links">
              <a
                href="mailto:riteshraj851116@gmail.com"
                className="contact-link"
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
              >
                <span>EMAIL</span>
                <span className="contact-link-value">riteshraj851116@gmail.com</span>
                <ArrowUpRight size={20} />
              </a>

              <a
                href="https://github.com/riteshraj851116"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
              >
                <span>GITHUB</span>
                <span className="contact-link-value">@riteshraj851116</span>
                <ArrowUpRight size={20} />
              </a>

              <a
                href="https://www.linkedin.com/in/ritesh-raj-9b52162a7/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
              >
                <span>LINKEDIN</span>
                <span className="contact-link-value">in/ritesh-raj-9b52162a7</span>
                <ArrowUpRight size={20} />
              </a>
            </div>

            {/* QUICK ACTIONS */}
            <div className="contact-quick-actions">
              <button
                type="button"
                className={`quick-copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopyEmail}
                onMouseEnter={playHoverSound}
              >
                {copied ? (
                  <>
                    <Check size={14} className="icon-check" />
                    <span>EMAIL COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>COPY EMAIL ADDRESS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE DIRECT TRANSMISSION FORM */}
          <div className="contact-form-container">
            <div className="contact-form-header">
              <div className="form-header-pill">
                <Terminal size={12} />
                <span>DIRECT TRANSMISSION</span>
              </div>
              <span className="form-tagline">MERN DISPATCH</span>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">NAME</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your Name or Organization"
                  value={formState.name}
                  onChange={handleInputChange}
                  onFocus={playHoverSound}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                  value={formState.email}
                  onChange={handleInputChange}
                  onFocus={playHoverSound}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">MESSAGE</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me about your project, timeline, or team role..."
                  value={formState.message}
                  onChange={handleInputChange}
                  onFocus={playHoverSound}
                ></textarea>
              </div>

              <button
                type="submit"
                className={`form-submit-btn ${formSubmitted ? "submitted" : ""}`}
                onMouseEnter={playHoverSound}
                disabled={formSubmitted}
              >
                {formSubmitted ? (
                  <>
                    <Check size={16} />
                    <span>TRANSMISSION INITIALIZED!</span>
                  </>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="contact-footer">
        <span>RITESH RAJ SINGH</span>
        <span>FULL STACK MERN DEVELOPER</span>
        <span>© 2026 · ALL RIGHTS RESERVED</span>
      </footer>
    </section>
  );
};

export default Contact;
