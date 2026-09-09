import { playHoverBlip, playClickSound } from "../utils/audio";
import "./NewspaperProjects.css";

const projectsData = [
  {
    id: "jobsphere",
    badge: "NEW",
    title: "JOBSPHERE",
    subtitle: "Full Stack Job Portal (2026)",
    desc: "Production-ready recruitment ecosystem connecting applicants and hiring teams with role-based dashboards. Built with JWT & bcrypt stateless authentication, 40+ modular RESTful API endpoints, and sub-50ms Socket.IO live messaging.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=900&auto=format&fit=crop",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Socket.IO", "REST APIs"],
    demoUrl: "https://riteshraj851116.github.io/jobsphere/",
    githubUrl: "https://github.com/riteshraj851116/jobsphere",
  },
  {
    id: "velocedrive",
    badge: "NEW",
    title: "VELOCEDRIVE",
    subtitle: "Car Rental Management System (2026)",
    desc: "End-to-end car rental platform managing fleet discovery, real-time availability checks, and booking pipelines. Features Mongoose query optimization under 200ms, 15+ atomic React components, and custom auth middleware.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&auto=format&fit=crop",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "Tailwind CSS"],
    demoUrl: "https://riteshraj851116.github.io/teracar/",
    githubUrl: "https://github.com/riteshraj851116/teracar",
  },
  {
    id: "rcbfan",
    badge: "LIGHTHOUSE 90+",
    title: "RCB FAN PORTAL",
    subtitle: "Frontend Sports Web Application (2026)",
    desc: "Responsive sports platform achieving a 90+ Lighthouse performance score. Features dynamic client-side state streaming live match feeds, player rosters, and statistics without page reloads using fluid CSS Grid & Flexbox.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=900&auto=format&fit=crop",
    tech: ["React.js", "JavaScript ES6+", "HTML5", "CSS3", "Vite", "CSS Grid"],
    demoUrl: "https://riteshraj851116.github.io/rcb-fan-website/",
    githubUrl: "https://github.com/riteshraj851116/rcb-fan-website",
  },
];

const NewspaperProjects = () => {
  return (
    <section className="newspaper-projects-section" id="work">
      {/* SECTION HEADER EDITORIAL SPREAD */}
      <div className="projects-editorial-header">
        <div className="header-column-left">
          <span className="section-label">UPCOMING & RECENT WORKS</span>
          <h2 className="projects-headline-lead">
            Fresh entries — A curated catalog of full-stack engineering releases.
          </h2>
        </div>
        <div className="header-column-right">
          <h2 className="projects-headline-huge">
            <span>THINK, CODE</span>
            <span className="deliver-word">DELIVERED</span>
          </h2>
        </div>
      </div>

      {/* BROADSHEET PROJECT GRID */}
      <div className="projects-broadsheet-grid">
        {projectsData.map((project, index) => (
          <article
            key={project.id}
            className="project-broadsheet-card"
            onMouseEnter={() => {
              try { playHoverBlip(); } catch (e) {}
            }}
          >
            <div className="card-top-bar">
              <span className="card-edition-num">EDITION 0{index + 1} // RELEASE</span>
              <span className="card-badge">{project.badge}</span>
            </div>

            <div className="card-visual-frame">
              <img src={project.image} alt={project.title} className="card-visual-img" loading="lazy" />
              <div className="visual-overlay-stamp">
                <span>VERIFIED BUILD</span>
              </div>
            </div>

            <div className="card-body">
              <h3 className="card-title">{project.title}</h3>
              <h4 className="card-subtitle">{project.subtitle}</h4>
              <p className="card-description">{project.desc}</p>

              <div className="card-tech-strip">
                {project.tech.map((t) => (
                  <span key={t} className="tech-pill">
                    {t}
                  </span>
                ))}
              </div>

              <div className="card-actions-bar">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="action-link-fill"
                  onClick={() => {
                    try { playClickSound(); } catch (e) {}
                  }}
                >
                  LIVE LAUNCH ↗
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="action-link-line"
                  onClick={() => {
                    try { playClickSound(); } catch (e) {}
                  }}
                >
                  SOURCE CODE ↗
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewspaperProjects;
