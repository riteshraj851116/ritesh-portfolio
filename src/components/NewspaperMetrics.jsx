import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./NewspaperMetrics.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const metrics = [
  {
    sub: "PRODUCTION FULL-STACK",
    title: "APPS",
    targetVal: 3,
    prefix: "0",
    suffix: "",
    display: "03",
  },
  {
    sub: "SCALABLE REST ARCHITECTURES",
    title: "APIS",
    targetVal: 40,
    prefix: "",
    suffix: "+",
    display: "40+",
  },
  {
    sub: "SOCKET.IO BI-DIRECTIONAL",
    title: "DELAY",
    targetVal: 50,
    prefix: "<",
    suffix: "ms",
    display: "<50",
  },
  {
    sub: "DATA STRUCTURES & ALGORITHMS",
    title: "SOLVED",
    targetVal: 200,
    prefix: "",
    suffix: "+",
    display: "200+",
  },
];

const NewspaperMetrics = () => {
  const containerRef = useRef(null);
  const numRefs = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Entrance animation for items
      gsap.fromTo(
        ".metric-strip-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Smooth number counter on scroll
      metrics.forEach((item, idx) => {
        const el = numRefs.current[idx];
        if (!el) return;

        const counter = { val: 0 };
        gsap.to(counter, {
          val: item.targetVal,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            const current = Math.floor(counter.val);
            if (item.prefix === "0") {
              el.innerText = `0${current}`;
            } else if (item.prefix === "<") {
              el.innerText = `<${current}`;
            } else {
              el.innerText = `${current}${item.suffix}`;
            }
          },
          onComplete: () => {
            el.innerText = item.display;
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="newspaper-metrics-broadside" ref={containerRef}>
      <div className="metrics-strip-grid">
        {metrics.map((item, index) => (
          <div key={index} className="metric-strip-item">
            <div className="metric-text-group">
              <span className="metric-sub">{item.sub}</span>
              <h3 className="metric-title">{item.title}</h3>
            </div>
            <div className="metric-number-group">
              <span
                className="metric-giant-number"
                ref={(el) => (numRefs.current[index] = el)}
              >
                {item.display}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewspaperMetrics;
