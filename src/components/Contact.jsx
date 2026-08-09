
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import "./Contact.css";

const Contact = () => {
  const sectionRef = useRef(null);

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

  return (
    <section
      className="contact"
      id="contact"
      ref={sectionRef}
    >
      {/* TOP */}

      <div className="contact-top">
        <span>05 / CONTACT</span>

        <span>LET'S BUILD SOMETHING</span>
      </div>

      {/* MAIN */}

      <div className="contact-main">
        <div className="contact-heading">
          <span>LET'S</span>
          <span>CREATE</span>
          <span>TOGETHER</span>
        </div>

        <p className="contact-description">
          I'm a fresher full-stack developer focused on
          building modern, interactive and useful web
          experiences with the MERN stack.
        </p>

        {/* LINKS */}

        <div className="contact-links">
          <a
            href="mailto:riteshraj851116@gmail.com"
            className="contact-link"
          >
            <span>EMAIL</span>

            <span className="contact-link-value">
              riteshraj851116@gmail.com
            </span>

            <ArrowUpRight size={22} />
          </a>

          <a
            href="https://github.com/riteshraj851116"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span>GITHUB</span>

            <span className="contact-link-value">
             https://github.com/riteshraj851116
            </span>

            <ArrowUpRight size={22} />
          </a>

          <a
            href="https://www.linkedin.com/in/ritesh-raj-9b52162a7/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span>LINKEDIN</span>

            <span className="contact-link-value">
              https://www.linkedin.com/in/ritesh-raj-9b52162a7/
            </span>

            <ArrowUpRight size={22} />
          </a>
        </div>
      </div>

      {/* FOOTER */}

      <footer className="contact-footer">
        <span>RITESH RAJ SINGH</span>

        <span>FULL STACK DEVELOPER</span>

        <span>© 2026</span>
      </footer>
    </section>
  );
};

export default Contact;


