import { useEffect, useRef } from "react";

/**
 * HeroBackgroundCanvas
 * Pure Obsidian Luxury Deep Space Canvas with Radiant Golden Amber Interactive Filaments
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

    const mouse = {
      x: width * 0.7,
      y: height * 0.4,
      targetX: width * 0.7,
      targetY: height * 0.4,
      radius: 200,
    };

    // Refined Golden Amber & Starlight Micro-Nodes
    const nodeCount = Math.min(50, Math.floor(width / 30));
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.8,
        color: Math.random() > 0.45 ? "rgba(245, 158, 11," : "rgba(251, 191, 36,",
        baseAlpha: Math.random() * 0.35 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

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
      time += 0.018;

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Subtle Precision Crosses (+)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      const gridSize = 160;
      for (let x = (width % gridSize) / 2; x < width; x += gridSize) {
        for (let y = (height % gridSize) / 2; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();
        }
      }

      // Update & Draw interactive constellation nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dxMouse = mouse.x - n.x;
        const dyMouse = mouse.y - n.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        let alpha = n.baseAlpha + Math.sin(time * n.pulseSpeed + n.pulseOffset) * 0.12;
        if (distMouse < mouse.radius) {
          const factor = 1 - distMouse / mouse.radius;
          alpha += factor * 0.55;
          n.x -= (dxMouse / distMouse) * factor * 0.7;
          n.y -= (dyMouse / distMouse) * factor * 0.7;
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

          if (dist < 135) {
            const lineAlpha = (1 - dist / 135) * 0.16;
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
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
      {/* 1. Pure Obsidian Background Base */}
      <div className="hero-bg-white-base"></div>

      {/* 2. Radiant Golden Amber Ambient Glows */}
      <div className="hero-bg-aurora-glow glow-brown"></div>
      <div className="hero-bg-aurora-glow glow-ivory"></div>

      {/* 3. Subtle Editorial Micro-Grid */}
      <div className="hero-bg-light-texture"></div>

      {/* 4. Interactive Constellation Canvas */}
      <canvas ref={canvasRef} className="hero-bg-canvas" />

      {/* 5. Radial Edge Vignette */}
      <div className="hero-bg-edge-vignette-light"></div>
    </div>
  );
};

export default HeroBackgroundCanvas;
