import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { subscribeAudioActivity } from "../utils/audio";

// 1. Aerodynamic Wind-Tunnel Streamline Ribbons
const AeroFlowRibbons = ({ mouse, audioIntensity }) => {
  const ribbonsGroupRef = useRef(null);

  // Generate 10 distinct wind-tunnel ribbon paths
  const ribbonConfigs = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const yBase = -1.6 + (i / 11) * 3.4; // Distributed vertically
      const zBase = -1.8 + Math.sin(i * 1.1) * 1.4;
      const speed = 0.8 + (i % 3) * 0.4;
      const color = i % 3 === 0 ? "#d2ff00" : i % 2 === 0 ? "#f4f4ed" : "#3b412e";
      const opacity = i % 3 === 0 ? 0.85 : 0.45;
      const lineWidth = i % 3 === 0 ? 2.5 : 1.2;

      // 40 segment points along X axis (-6 to +6)
      const segments = 45;
      const points = [];
      for (let s = 0; s <= segments; s++) {
        const x = -6.5 + (s / segments) * 13;
        points.push(new THREE.Vector3(x, yBase, zBase));
      }

      return { yBase, zBase, speed, color, opacity, lineWidth, points, segments, seed: i * 0.7 };
    });
  }, []);

  const lineObjects = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const boost = 1 + audioIntensity * 2.5;

    ribbonConfigs.forEach((cfg, idx) => {
      const lineObj = lineObjects.current[idx];
      if (!lineObj) return;

      const posAttr = lineObj.geometry.attributes.position;
      const arr = posAttr.array;

      for (let s = 0; s <= cfg.segments; s++) {
        const x = -6.5 + (s / cfg.segments) * 13;

        // Laminar aerodynamic wave
        let y =
          cfg.yBase +
          Math.sin(x * 0.65 + t * cfg.speed * boost + cfg.seed) * 0.28 +
          Math.cos(x * 0.3 - t * 0.5) * 0.12;

        let z =
          cfg.zBase +
          Math.cos(x * 0.5 + t * 0.8 * boost + cfg.seed) * 0.2;

        // Mouse Aerodynamic Airfoil Deflection
        const mouseX = mouse.current.x * 3.5;
        const mouseY = mouse.current.y * 2.0;
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2.2) {
          const force = (2.2 - dist) / 2.2;
          y += (dy > 0 ? 1 : -1) * force * 0.6;
          z += force * 0.45;
        }

        arr[s * 3] = x;
        arr[s * 3 + 1] = y;
        arr[s * 3 + 2] = z;
      }

      posAttr.needsUpdate = true;
    });
  });

  return (
    <group ref={ribbonsGroupRef}>
      {ribbonConfigs.map((cfg, idx) => {
        const geom = new THREE.BufferGeometry().setFromPoints(cfg.points);
        return (
          <line
            key={idx}
            ref={(el) => (lineObjects.current[idx] = el)}
            geometry={geom}
          >
            <lineBasicMaterial
              color={cfg.color}
              transparent
              opacity={cfg.opacity}
              linewidth={cfg.lineWidth}
              blending={THREE.AdditiveBlending}
            />
          </line>
        );
      })}
    </group>
  );
};

// 2. Supersonic Slipstream Particles (High-Speed Vectors)
const SlipstreamParticles = ({ count = 360, mouse, audioIntensity }) => {
  const pointsRef = useRef(null);

  const [positions, speedFactors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.5; // Y
      pos[i * 3 + 2] = -3 + Math.random() * 5; // Z
      spd[i] = 1.8 + Math.random() * 3.2;
    }
    return [pos, spd];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array;
    const boost = 1 + audioIntensity * 3.5;

    for (let i = 0; i < count; i++) {
      // High-speed slipstream moving along X axis
      arr[i * 3] -= delta * speedFactors[i] * 3.8 * boost;

      // Wrap back around
      if (arr[i * 3] < -7.0) {
        arr[i * 3] = 7.0;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
        arr[i * 3 + 2] = -3 + Math.random() * 5;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        color="#d2ff00"
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 3. Perspective Racing Telemetry Ground Grid
const HorizonTelemetryGrid = ({ mouse }) => {
  const gridRef = useRef(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    const t = state.clock.elapsedTime * 0.4;
    gridRef.current.rotation.y = mouse.current.x * 0.08;
    gridRef.current.position.x = -mouse.current.x * 0.25;
  });

  return (
    <group position={[0, -2.4, -1]} rotation={[Math.PI / 12, 0, 0]} ref={gridRef}>
      <gridHelper
        args={[28, 36, "#d2ff00", "#1e2218"]}
        position={[0, 0, 0]}
      />
    </group>
  );
};

// 4. Kinetic Telemetry Reticle (Corner Aerospace Scanner)
const TelemetryReticle = ({ mouse, audioIntensity }) => {
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * (0.3 + audioIntensity * 0.8);
    if (ringRef.current) ringRef.current.rotation.z = t;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 1.4;
  });

  return (
    <group position={[3.2, 0.4, -1.8]}>
      {/* Outer Reticle Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[1.5, 1.515, 64]} />
        <meshBasicMaterial color="#d2ff00" transparent opacity={0.25} />
      </mesh>

      {/* Inner Segment Ring */}
      <mesh ref={ring2Ref}>
        <ringGeometry args={[1.2, 1.22, 6, 1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} wireframe />
      </mesh>
    </group>
  );
};

// Main Scene Controller
const SceneController = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const [audioIntensity, setAudioIntensity] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeAudioActivity((intensity) => {
      setAudioIntensity(intensity);
      setTimeout(() => setAudioIntensity(0), 400);
    });
    return () => unsubscribe();
  }, []);

  const handlePointerMove = (e) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  return (
    <group onPointerMove={handlePointerMove}>
      <ambientLight intensity={1.0} />
      <directionalLight position={[4, 6, 4]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-4, 2, 3]} intensity={3.0} color="#d2ff00" distance={12} />

      <AeroFlowRibbons mouse={mouse} audioIntensity={audioIntensity} />
      <SlipstreamParticles mouse={mouse} audioIntensity={audioIntensity} />
      <HorizonTelemetryGrid mouse={mouse} />
      <TelemetryReticle mouse={mouse} audioIntensity={audioIntensity} />
    </group>
  );
};

const HeroScene = () => {
  return (
    <div className="hero-three" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <Canvas
        camera={{
          position: [0, 0, 5.5],
          fov: 42,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <SceneController />
      </Canvas>
    </div>
  );
};

export default HeroScene;
