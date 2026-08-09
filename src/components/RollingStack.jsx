import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./RollingStack.css";

const technologies = [
  "MERN",
  "REACT",
  "NODE.JS",
  "EXPRESS",
  "MONGODB",
  "JAVASCRIPT",
  "GSAP",
  "THREE.JS",
  "HTML",
  "CSS",
  "GITHUB",
];

const RollingStack = () => {
  const cylinderRef = useRef(null);

  useEffect(() => {
    const cylinder = cylinderRef.current;

    if (!cylinder) return;

    const animation = gsap.to(cylinder, {
      rotateY: 360,
      duration: 22,
      repeat: -1,
      ease: "none",
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <section className="rolling-stack" id="skills">

      {/* HEADER */}
      <div className="rolling-stack-header">
        <span>02 / TECHNOLOGY</span>
        <span>MY STACK</span>
      </div>

      {/* 3D SCENE */}
      <div className="cylinder-scene">

        {/* Glow */}
        <div className="cylinder-glow"></div>

        {/* Cylinder */}
        <div
          className="technology-cylinder"
          ref={cylinderRef}
        >
          {technologies.map((tech, index) => {
            const angle =
              (360 / technologies.length) * index;

            return (
              <div
                className="cylinder-item"
                key={tech}
                style={{
                  transform: `
                    rotateY(${angle}deg)
                    translateZ(420px)
                  `,
                }}
              >
                <span>{tech}</span>
              </div>
            );
          })}
        </div>

        {/* Center */}
        <div className="cylinder-center">
          <span className="center-small">
            FULL STACK
          </span>

          <span className="center-main">
            MERN
          </span>

          <span className="center-small">
            DEVELOPER
          </span>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="rolling-stack-footer">
        <span>REACT</span>
        <span>NODE.JS</span>
        <span>GSAP</span>
        <span>THREE.JS</span>
      </div>

    </section>
  );
};

export default RollingStack;