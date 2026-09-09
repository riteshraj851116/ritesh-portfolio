import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import "./GlobalCanvas.css";

const ParticleField = ({ count = 650 }) => {
  const pointsRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollY = useRef(0);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#d2ff00"), // neon lime
      new THREE.Color("#ffffff"), // bright white
      new THREE.Color("#f4f4ed"), // off-white
      new THREE.Color("#282c20"), // deep racing olive
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 36;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY || window.pageYOffset;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    // Smooth mouse lerp
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    // Drift with time
    const t = state.clock.elapsedTime * 0.04;
    pointsRef.current.rotation.y = t * 0.5 + mouse.current.x * 0.15;
    pointsRef.current.rotation.x = t * 0.25 - mouse.current.y * 0.15;

    // Scroll depth parallax: moves through the particle universe
    const targetZ = -(scrollY.current * 0.008);
    pointsRef.current.position.z += (targetZ - pointsRef.current.position.z) * 0.06;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.048}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const GlobalCanvas = () => {
  return (
    <div className="global-canvas-container" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default GlobalCanvas;
