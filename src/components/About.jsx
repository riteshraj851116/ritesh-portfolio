
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./About.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";



gsap.registerPlugin(ScrollTrigger);
const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-reveal",
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about",
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="about"
      id="about"
      ref={sectionRef}
    >
      {/* TOP */}

      <div className="about-top">
        <span className="about-reveal">
          02 / ABOUT
        </span>

        <span className="about-reveal">
          A LITTLE ABOUT ME
        </span>
      </div>

      {/* CONTENT */}

      <div className="about-content">
        <div className="about-heading about-reveal">
          I BUILD
          <br />
          <span>FOR THE WEB.</span>
        </div>

        <div className="about-right">
          <p className="about-text about-reveal">
            I'm Ritesh Raj Singh, a fresher full-stack
            developer who enjoys turning ideas into
            clean, interactive and meaningful digital
            experiences.
          </p>

          <p className="about-text about-reveal">
            My main focus is the MERN stack — MongoDB,
            Express.js, React and Node.js. I also enjoy
            exploring animation, 3D interfaces and
            creative frontend development.
          </p>

          <div className="about-info about-reveal">
            <div>
              <span>LOCATION</span>
              <strong>INDIA</strong>
            </div>

            <div>
              <span>ROLE</span>
              <strong>FULL STACK DEVELOPER</strong>
            </div>

            <div>
              <span>FOCUS</span>
              <strong>MERN / UI / 3D</strong>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}

      <div className="about-bottom">
        <span>02</span>

        <span>CURIOUS BY DEFAULT</span>

        <span>BUILD — LEARN — REPEAT</span>
      </div>
    </section>
  );
};

export default About;
