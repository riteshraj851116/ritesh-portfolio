import "./NewspaperFooter.css";

const socialLinks = [
  { label: "GITHUB", href: "https://github.com/riteshraj851116" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/ritesh-raj-9b52162a7/" },
  { label: "EMAIL", href: "mailto:riteshraj851116@gmail.com" },
  { label: "PHONE", href: "tel:+919709721676" },
  { label: "VERCEL LIVE", href: "https://ritesh-portfolio-five-gamma.vercel.app/" },
];

const NewspaperFooter = () => {
  return (
    <footer className="newspaper-footer-broadsheet">
      <div className="footer-container">
        {/* LEFT: RAJ BRAND & LEGAL */}
        <div className="footer-left-col">
          <span className="footer-brand">RAJ©</span>
          <div className="footer-stamp-mini">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="var(--terracotta)">
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <span className="footer-colophon">
            Ritesh Raj · Galgotias University CSE (2023--2027) · CGPA 7.3
          </span>
        </div>

        {/* RIGHT: SOCIAL LINKS WITH STRIKETHROUGH */}
        <div className="footer-right-col">
          {socialLinks.map((item, index) => (
            <span key={item.label} className="footer-social-wrapper">
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="footer-social-anchor"
              >
                {item.label}
              </a>
              {index < socialLinks.length - 1 && <span className="footer-dot">•</span>}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default NewspaperFooter;
