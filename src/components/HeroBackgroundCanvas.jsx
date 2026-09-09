import { useEffect, useRef } from "react";

/**
 * HeroBackgroundCanvas
 * Luxury White Background with Warm Brown and Crisp Black Telemetry Elements
 */
const HeroBackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth lerp
    const mouse = {
      x: width * 0.7,
      y: height * 0.4,
      targetX: width * 0.7,
      targetY: height * 0.4,
      radius: 180,
    };

    // Telemetry micro-nodes (Brown & Black tones on White)
    const nodeCount = Math.min(45, Math.floor(width / 34));
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 1,
        color: Math.random() > 0.4 ? "rgba(146, 64, 14, " : "rgba(24, 24, 27, ",
        baseAlpha: Math.random() * 0.35 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Telemetry marks
    const telemetryMarks = [
      { x: width * 0.12, y: height * 0.28, text: "[SYS.ONLINE // STABLE]" },
      { x: width * 0.88, y: height * 0.18, text: "APEX // 01" },
      { x: width * 0.48, y: height * 0.85, text: "+ LAT: 28.47°N" },
      { x: width * 0.08, y: height * 0.75, text: "TEL_BUF: 64KB" },
      { x: width * 0.92, y: height * 0.78, text: "RRS_CORE // 2026" },
    ];

    // High-speed telemetry laser streaks in warm brown/bronze
    const streaks = [];
    const spawnStreak = () => {
      if (streaks.length < 3 && Math.random() < 0.025) {
        streaks.push({
          x: -100,
          y: Math.random() * (height * 0.85) + height * 0.05,
          length: Math.random() * 180 + 100,
          speed: Math.random() * 16 + 12,
          opacity: Math.random() * 0.25 + 0.15,
          color: "rgba(180, 83, 9,",
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.02;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Precision Coordinate Crosses (+)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
      ctx.lineWidth = 1;
      const gridSize = 140;
      for (let x = (width % gridSize) / 2; x < width; x += gridSize) {
        for (let y = (height % gridSize) / 2; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x - 4, y);
          ctx.lineTo(x + 4, y);
          ctx.moveTo(x, y - 4);
          ctx.lineTo(x, y + 4);
          ctx.stroke();
        }
      }

      // 2. Telemetry labels in soft brown/grey
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(120, 53, 15, 0.4)";
      telemetryMarks.forEach((mark) => {
        ctx.fillText(mark.text, mark.x, mark.y);
      });

      // 3. Speed streaks
      spawnStreak();
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x += s.speed;

        const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.length, s.y);
        gradient.addColorStop(0, `${s.color} ${s.opacity})`);
        gradient.addColorStop(0.5, `${s.color} ${s.opacity * 0.5})`);
        gradient.addColorStop(1, `${s.color} 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length, s.y);
        ctx.stroke();

        if (s.x - s.length > width) {
          streaks.splice(i, 1);
        }
      }

      // 4. Update & Draw interactive nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dxMouse = mouse.x - n.x;
        const dyMouse = mouse.y - n.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        let alpha = n.baseAlpha + Math.sin(time * n.pulseSpeed + n.pulseOffset) * 0.1;
        if (distMouse < mouse.radius) {
          const factor = 1 - distMouse / mouse.radius;
          alpha += factor * 0.5;
          n.x -= (dxMouse / distMouse) * factor * 0.8;
          n.y -= (dyMouse / distMouse) * factor * 0.8;
        }

        ctx.fillStyle = `${n.color} ${Math.min(1, alpha)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.18;
            ctx.strokeStyle = `rgba(146, 64, 14, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="hero-bg-canvas-container" aria-hidden="true">
      {/* 1. Crisp White Background Base */}
      <div className="hero-bg-white-base"></div>

      {/* 2. Soft Luxury Brown & Ivory Lighting Glows */}
      <div className="hero-bg-aurora-glow glow-brown"></div>
      <div className="hero-bg-aurora-glow glow-ivory"></div>

      {/* 3. Subtle Editorial Micro-Grid */}
      <div className="hero-bg-light-texture"></div>

      {/* 4. Interactive Telemetry Canvas */}
      <canvas ref={canvasRef} className="hero-bg-canvas" />

      {/* 5. Edge Vignette */}
      <div className="hero-bg-edge-vignette-light"></div>
    </div>
  );
};

export default HeroBackgroundCanvas;
