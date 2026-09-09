import "./NewspaperPlaybook.css";

const endorsements = [
  {
    badge: "CERTIFIED 2025",
    title: "MERN Stack Development",
    quote: "“150+ hours of full-stack engineering curriculum mastering React, Node.js, Express, MongoDB, RESTful architectures, and security practices.”",
    author: "CodeHelp (Love Babbar)",
    link: "https://www.linkedin.com/posts/ritesh-raj-9b52162a7_share-7492473688705875968-sIML",
    linkLabel: "VERIFY CREDENTIAL ↗",
  },
  {
    badge: "ALGORITHMS 2025",
    title: "Data Structures in Java",
    quote: "“200+ algorithm problems solved spanning Binary Trees, Graphs, Dynamic Programming, and rigorous computational complexity analysis.”",
    author: "Apna College (Shradha Khapra)",
    link: "https://www.linkedin.com/posts/ritesh-raj-9b52162a7_share-7492476226008358913-u7y5",
    linkLabel: "VERIFY CREDENTIAL ↗",
  },
  {
    badge: "ACADEMIC HONORS",
    title: "B.Tech Computer Science",
    quote: "“Galgotias University CSE candidate (2023 -- 2027) with CGPA 7.3/10. Specializing in Distributed Systems, OOP, and Database Architecture.”",
    author: "Galgotias University",
    link: "https://www.linkedin.com/in/ritesh-raj-9b52162a7/",
    linkLabel: "LINKEDIN DOSSIER ↗",
  },
  {
    badge: "PRODUCTION CORE",
    title: "Real-Time & REST Systems",
    quote: "“Architecting sub-50ms bidirectional Socket.IO event channels, stateless JWT authentication with bcrypt, and 40+ modular endpoints.”",
    author: "Core Competency",
    link: "https://github.com/riteshraj851116",
    linkLabel: "GITHUB REPOSITORIES ↗",
  },
];

const NewspaperPlaybook = () => {
  return (
    <section className="newspaper-playbook-section" id="playbook">
      {/* 01 — INVERTED BLACK BANNER: CREDENTIALS (AUTHENTIC OLD ENGLISH BLACKLETTER) */}
      <div className="inverted-black-banner">
        <h2 className="banner-gigantic-title font-blackletter" title="Credentials">
          Credentials
        </h2>
      </div>

      {/* 02 — EDITORIAL STATEMENT SPREAD */}
      <div className="playbook-statement-spread">
        <div className="statement-lead-col">
          <p className="statement-paragraph">
            Formal technical education, certified full-stack mastery, and algorithmic problem-solving verified across recognized industry curriculums.
          </p>
          <div className="statement-tags">
            <span className="statement-tag">JAVA DSA (200+ SOLVED)</span>
            <span className="statement-tag">MERN STACK EXPERT</span>
            <span className="statement-tag">GALGOTIAS UNIV CSE</span>
          </div>
        </div>

        <div className="statement-side-col">
          <span className="side-col-badge">OFFICIAL DISPATCH</span>
          <h3 className="side-col-title">VERIFIED CREDENTIALS</h3>
          <p className="side-col-desc">
            Direct authenticated certificate links published on LinkedIn and verified against institutional standards.
          </p>
        </div>
      </div>

      {/* 03 — STITCHED COUPON TICKET CARDS */}
      <div className="stitched-cards-grid">
        {endorsements.map((item, idx) => (
          <div key={idx} className="stitched-ticket-card">
            <div className="ticket-inner">
              <div>
                <span className="side-col-badge">{item.badge}</span>
                <h4 className="ticket-author" style={{ fontSize: "1.2rem", margin: "0.25rem 0 0.75rem" }}>{item.title}</h4>
                <p className="ticket-quote">{item.quote}</p>
              </div>
              <div className="ticket-author-bar">
                <span className="ticket-role" style={{ fontWeight: 600, color: "var(--ink-black)", marginBottom: "0.4rem" }}>{item.author}</span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="ticket-verify-anchor"
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "var(--terracotta)",
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  {item.linkLabel}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewspaperPlaybook;
