import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Html, OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import {
  playClickSound,
  playHoverSound,
  playTelemetryScan,
  subscribeAudioActivity,
} from "../utils/audio";
import { Layers, Wind, Eye, Cpu, Activity, Radio, Sparkles, CheckCircle2 } from "lucide-react";
import "./TelemetryMonocoque3D.css";

// 1. Aerodynamic Wind Tunnel Particle Streamlines
const AeroStreamlines = ({ count = 480, mode, audioBoost }) => {
  const pointsRef = useRef(null);

  const [positions, speedFactors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Flow along X axis (wind tunnel simulation)
      pos[i * 3] = (Math.random() - 0.5) * 8; // X: -4 to 4
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.2; // Y: -1.6 to 1.6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4; // Z: -2 to 2

      spd[i] = 0.8 + Math.random() * 1.5;
    }
    return [pos, spd];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const array = positionsAttr.array;

    const baseSpeed = (mode === "aero" ? 3.5 : 1.2) * (1 + audioBoost * 2);

    for (let i = 0; i < count; i++) {
      // Move particles backwards along X axis
      array[i * 3] -= delta * speedFactors[i] * baseSpeed;

      // Aerodynamic deflection around chassis center
      const x = array[i * 3];
      const y = array[i * 3 + 1];
      const z = array[i * 3 + 2];
      const distFromCenter = Math.sqrt(y * y + z * z);

      if (Math.abs(x) < 2.0 && distFromCenter < 1.4) {
        // Deflect outwards
        array[i * 3 + 1] += (y > 0 ? 1 : -1) * 0.015;
        array[i * 3 + 2] += (z > 0 ? 1 : -1) * 0.015;
      }

      // Loop back to front
      if (array[i * 3] < -4.2) {
        array[i * 3] = 4.2;
        array[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
        array[i * 3 + 2] = (Math.random() - 0.5) * 3.8;
      }
    }

    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={mode === "aero" ? 0.045 : 0.025}
        color={mode === "aero" ? "#d2ff00" : "#ffffff"}
        transparent
        opacity={mode === "aero" ? 0.85 : 0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 2. Procedural Formula 1 Monocoque Chassis & Cockpit Halo
const MonocoqueChassis = ({ mode, audioBoost, activeNode, onSelectNode }) => {
  const chassisGroupRef = useRef(null);
  const coreRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.4;
      coreRef.current.rotation.y = t * 0.6;

      const pulse = 1 + Math.sin(t * 3) * 0.08 + audioBoost * 0.25;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const isWireframe = mode === "wireframe";

  return (
    <group ref={chassisGroupRef}>
      {/* AERODYNAMIC NOSE CONE */}
      <mesh position={[1.5, -0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.42, 2.2, 32]} />
        <meshStandardMaterial
          color={isWireframe ? "#0d0d0d" : "#141512"}
          wireframe={isWireframe}
          roughness={0.2}
          metalness={0.9}
          emissive={isWireframe ? "#d2ff00" : "#282c20"}
          emissiveIntensity={isWireframe ? 0.6 : 0.15}
        />
      </mesh>

      {/* COCKPIT TUB & MONOCOQUE CENTER */}
      <mesh position={[-0.2, 0.1, 0]}>
        <boxGeometry args={[2.2, 0.65, 0.95]} />
        <meshStandardMaterial
          color={isWireframe ? "#0d0d0d" : "#171814"}
          wireframe={isWireframe}
          roughness={0.15}
          metalness={0.95}
          emissive={isWireframe ? "#d2ff00" : "#111112"}
          emissiveIntensity={isWireframe ? 0.5 : 0.1}
        />
      </mesh>

      {/* COCKPIT HALO STRUCTURE */}
      <mesh position={[-0.1, 0.62, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.52, 0.045, 16, 64, Math.PI * 1.3]} />
        <meshStandardMaterial
          color="#d2ff00"
          wireframe={isWireframe}
          roughness={0.2}
          metalness={0.9}
          emissive="#d2ff00"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* HALO CENTRAL PYLON */}
      <mesh position={[0.3, 0.45, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* FRONT WINGS / CANARDS */}
      <group position={[2.1, -0.2, 0]}>
        {/* Left Winglet */}
        <mesh position={[0, 0, 0.85]} rotation={[0.08, 0, 0.1]}>
          <boxGeometry args={[0.5, 0.03, 1.2]} />
          <meshStandardMaterial
            color="#d2ff00"
            metalness={0.9}
            roughness={0.2}
            wireframe={isWireframe}
          />
        </mesh>
        {/* Right Winglet */}
        <mesh position={[0, 0, -0.85]} rotation={[-0.08, 0, 0.1]}>
          <boxGeometry args={[0.5, 0.03, 1.2]} />
          <meshStandardMaterial
            color="#d2ff00"
            metalness={0.9}
            roughness={0.2}
            wireframe={isWireframe}
          />
        </mesh>
      </group>

      {/* REAR DIFFUSER & ENGINE INTAKE */}
      <mesh position={[-1.4, 0.35, 0]}>
        <cylinderGeometry args={[0.32, 0.48, 0.9, 32]} />
        <meshStandardMaterial
          color={isWireframe ? "#0d0d0d" : "#22251e"}
          wireframe={isWireframe}
          roughness={0.3}
          metalness={0.85}
          emissive="#d2ff00"
          emissiveIntensity={isWireframe ? 0.7 : 0.15}
        />
      </mesh>

      {/* INTERNAL REACTION POWER UNIT (Glowing Core) */}
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={coreRef} position={[-0.2, 0.1, 0]}>
          <icosahedronGeometry args={[0.42, 3]} />
          <MeshDistortMaterial
            color="#d2ff00"
            roughness={0.15}
            metalness={0.95}
            distort={0.45 + audioBoost * 0.4}
            speed={4 + audioBoost * 6}
            emissive="#d2ff00"
            emissiveIntensity={0.8 + audioBoost * 1.5}
            transparent
            opacity={0.92}
          />
        </mesh>
      </Float>

      {/* DUAL GYROSCOPIC TELEMETRY RINGS */}
      <group position={[-0.2, 0.1, 0]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.1, 0.012, 16, 100]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.35}
            wireframe
          />
        </mesh>
        <mesh rotation={[-Math.PI / 4, 0, Math.PI / 3]}>
          <torusGeometry args={[1.3, 0.01, 16, 80]} />
          <meshBasicMaterial
            color="#d2ff00"
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      </group>

      {/* 4 INTERACTIVE 3D RAYCASTING TELEMETRY NODES */}
      <InspectionPin
        position={[1.5, 0.5, 0]}
        id="mern"
        label="01 // MERN KERNEL"
        spec="React 19 · Node.js · Express"
        active={activeNode === "mern"}
        onSelect={onSelectNode}
      />
      <InspectionPin
        position={[-0.2, 0.9, 0]}
        id="socket"
        label="02 // SOCKET.IO TELEMETRY"
        spec="<50ms Low-Latency Stream"
        active={activeNode === "socket"}
        onSelect={onSelectNode}
      />
      <InspectionPin
        position={[-1.4, 0.85, 0]}
        id="dsa"
        label="03 // 200+ JAVA DSA RIGOR"
        spec="LeetCode · Algorithms"
        active={activeNode === "dsa"}
        onSelect={onSelectNode}
      />
      <InspectionPin
        position={[0.2, -0.6, 0.8]}
        id="galgotias"
        label="04 // GALGOTIAS B.TECH CSE"
        spec="2023-2027 · CGPA 7.3"
        active={activeNode === "galgotias"}
        onSelect={onSelectNode}
      />
    </group>
  );
};

// 3. Interactive 3D Inspection Pin Component
const InspectionPin = ({ position, id, label, spec, active, onSelect }) => {
  const pinRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!pinRef.current) return;
    const t = state.clock.elapsedTime * 2;
    const scale = active || hovered ? 1.35 : 1.0 + Math.sin(t) * 0.08;
    pinRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group position={position}>
      {/* 3D Visual Marker */}
      <mesh
        ref={pinRef}
        onClick={(e) => {
          e.stopPropagation();
          playTelemetryScan();
          onSelect(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          playHoverSound();
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color={active || hovered ? "#ffffff" : "#d2ff00"}
          emissive="#d2ff00"
          emissiveIntensity={active || hovered ? 1.8 : 0.8}
        />
      </mesh>

      {/* Floating 3D HTML Tooltip */}
      <Html distanceFactor={8} position={[0, 0.22, 0]} center>
        <div
          className={`three-pin-pill ${active ? "is-active" : ""} ${
            hovered ? "is-hovered" : ""
          }`}
          onClick={() => {
            playTelemetryScan();
            onSelect(id);
          }}
        >
          <span className="pin-dot"></span>
          <div className="pin-text-wrap">
            <span className="pin-label">{label}</span>
            <span className="pin-spec">{spec}</span>
          </div>
        </div>
      </Html>
    </group>
  );
};

// 4. Main Telemetry Scene Wrapper
const TelemetryMonocoque3D = () => {
  const [mode, setMode] = useState("aero"); // 'aero' | 'chassis' | 'wireframe'
  const [activeNode, setActiveNode] = useState(null);
  const [audioBoost, setAudioBoost] = useState(0);

  // Subscribe to Web Audio API activity
  useEffect(() => {
    const unsubscribe = subscribeAudioActivity((intensity) => {
      setAudioBoost(intensity);
      setTimeout(() => setAudioBoost(0), 400);
    });
    return () => unsubscribe();
  }, []);

  const nodeDetails = {
    mern: {
      title: "MERN ARCHITECTURE & FULL STACK KERNEL",
      tagline: "High-throughput web engineering with React 19, Node.js & Express.",
      metrics: [
        { label: "Production Apps", val: "03+" },
        { label: "REST APIs Designed", val: "40+ Endpoints" },
        { label: "Database Engine", val: "MongoDB Atlas + Mongoose" },
      ],
    },
    socket: {
      title: "SOCKET.IO REAL-TIME TELEMETRY ENGINE",
      tagline: "Low-latency bidirectional WebSocket communication stream.",
      metrics: [
        { label: "Packet Latency", val: "<50ms Delivery" },
        { label: "Connection Engine", val: "Socket.IO WebSockets" },
        { label: "Flagship Integration", val: "JobSphere Recruitment" },
      ],
    },
    dsa: {
      title: "200+ JAVA DATA STRUCTURES & ALGORITHMS",
      tagline: "Verified algorithmic problem solving on LeetCode & GeeksforGeeks.",
      metrics: [
        { label: "Problems Mastered", val: "200+ Java Solved" },
        { label: "Core Paradigms", val: "DP, Two-Pointers, Graphs" },
        { label: "Certification", val: "Apna College Java Alpha" },
      ],
    },
    galgotias: {
      title: "GALGOTIAS UNIVERSITY · B.TECH CSE (2023-2027)",
      tagline: "Bachelor of Technology in Computer Science & Engineering.",
      metrics: [
        { label: "Academic CGPA", val: "7.3 / 10" },
        { label: "Current Semester", val: "4th Semester (Expected 2027)" },
        { label: "Campus Track", val: "Greater Noida, NCR" },
      ],
    },
  };

  return (
    <div className="telemetry-monocoque-wrapper">
      {/* 3D CANVAS STAGE */}
      <Canvas
        camera={{ position: [0, 1.2, 5.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 4]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-4, -2, 3]} intensity={3.0} color="#d2ff00" distance={12} />
        <pointLight position={[3, -4, -3]} intensity={2.0} color="#10b981" distance={10} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!activeNode}
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 3}
        />

        <MonocoqueChassis
          mode={mode}
          audioBoost={audioBoost}
          activeNode={activeNode}
          onSelectNode={(id) => setActiveNode(activeNode === id ? null : id)}
        />
        <AeroStreamlines mode={mode} audioBoost={audioBoost} />
      </Canvas>

      {/* COCKPIT 3D MODE SWITCHER HUD */}
      <div className="telemetry-hud-controls">
        <div className="hud-badge">
          <Activity size={12} className="text-lime" />
          <span>F1 3D TELEMETRY LAB</span>
        </div>

        <div className="hud-mode-pills">
          <button
            className={`hud-mode-btn ${mode === "aero" ? "is-active" : ""}`}
            onClick={() => {
              playClickSound();
              setMode("aero");
            }}
          >
            <Wind size={13} />
            <span>AERO STREAMLINES</span>
          </button>

          <button
            className={`hud-mode-btn ${mode === "chassis" ? "is-active" : ""}`}
            onClick={() => {
              playClickSound();
              setMode("chassis");
            }}
          >
            <Cpu size={13} />
            <span>CARBON CHASSIS</span>
          </button>

          <button
            className={`hud-mode-btn ${mode === "wireframe" ? "is-active" : ""}`}
            onClick={() => {
              playClickSound();
              setMode("wireframe");
            }}
          >
            <Layers size={13} />
            <span>X-RAY WIREFRAME</span>
          </button>
        </div>
      </div>

      {/* ACTIVE NODE INSPECTION CALLOUT CARD */}
      {activeNode && nodeDetails[activeNode] && (
        <div className="telemetry-inspect-card">
          <div className="inspect-header">
            <div className="inspect-title-wrap">
              <span className="inspect-tag">INSPECTION TELEMETRY NODE</span>
              <h4 className="inspect-title">{nodeDetails[activeNode].title}</h4>
            </div>
            <button
              className="inspect-close-btn"
              onClick={() => {
                playClickSound();
                setActiveNode(null);
              }}
            >
              ✕
            </button>
          </div>

          <p className="inspect-tagline">{nodeDetails[activeNode].tagline}</p>

          <div className="inspect-metrics-grid">
            {nodeDetails[activeNode].metrics.map((m, idx) => (
              <div key={idx} className="inspect-metric-box">
                <span className="m-label">{m.label}</span>
                <span className="m-val text-lime">{m.val}</span>
              </div>
            ))}
          </div>

          <div className="inspect-footer">
            <CheckCircle2 size={13} className="text-lime" />
            <span>100% VERIFIED AUTHENTIC SPECIFICATION</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelemetryMonocoque3D;
