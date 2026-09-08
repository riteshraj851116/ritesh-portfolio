import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { playClickSound, playHoverSound } from "../utils/audio";

// 1. Interactive 3D Particle Cloud
const ParticleConstellation = ({ count = 380, mouse }) => {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.2 + Math.random() * 2.8;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.08;
    pointsRef.current.rotation.y = t;
    pointsRef.current.rotation.x = t * 0.5;

    // Smooth tilt responding to mouse
    pointsRef.current.rotation.y += (mouse.current.x * 0.4 - pointsRef.current.rotation.y) * 0.03;
    pointsRef.current.rotation.x += (-mouse.current.y * 0.4 - pointsRef.current.rotation.x) * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ffffff"
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 2. Outer Gyroscope Rings
const GyroRings = ({ mouse }) => {
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.35 + mouse.current.y * 0.3;
      ring1Ref.current.rotation.y = t * 0.25 + mouse.current.x * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.3 - mouse.current.x * 0.2;
      ring2Ref.current.rotation.z = t * 0.2 - mouse.current.y * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Ring */}
      <mesh ref={ring1Ref} scale={1.85}>
        <torusGeometry args={[1.2, 0.012, 16, 100]} />
        <meshStandardMaterial
          color="#f5f5f0"
          roughness={0.2}
          metalness={0.9}
          wireframe={false}
          emissive="#ffffff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Counter Ring */}
      <mesh ref={ring2Ref} scale={1.55}>
        <torusGeometry args={[1.2, 0.01, 16, 80]} />
        <meshStandardMaterial
          color="#10b981"
          roughness={0.3}
          metalness={0.95}
          emissive="#10b981"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
};

// 3. Central Morphing Nucleus
const CoreNucleus = ({ mouse, isHovered }) => {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    meshRef.current.rotation.x = t * 0.2 + mouse.current.y * 0.4;
    meshRef.current.rotation.y = t * 0.25 + mouse.current.x * 0.4;

    const targetScale = isHovered ? 1.45 : 1.25;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 5]} />
        <MeshDistortMaterial
          color={isHovered ? "#ffffff" : "#c5c5be"}
          roughness={0.18}
          metalness={0.88}
          distort={isHovered ? 0.45 : 0.28}
          speed={isHovered ? 3.5 : 2}
          reflectivity={0.9}
          clearcoat={0.3}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};

// Main Scene Controller
const SceneController = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  return (
    <group
      onPointerOver={() => {
        setIsHovered(true);
        playHoverSound();
      }}
      onPointerOut={() => setIsHovered(false)}
      onPointerDown={() => playClickSound()}
      onPointerMove={handlePointerMove}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 5, 4]} intensity={3} color="#ffffff" />
      <pointLight position={[-4, -3, 3]} intensity={3.5} color="#10b981" distance={10} />
      <pointLight position={[3, -4, -2]} intensity={2.5} color="#3b82f6" distance={10} />

      <CoreNucleus mouse={mouse} isHovered={isHovered} />
      <GyroRings mouse={mouse} />
      <ParticleConstellation mouse={mouse} />
    </group>
  );
};

const HeroScene = () => {
  return (
    <div className="hero-three">
      <Canvas
        camera={{
          position: [0, 0, 5.2],
          fov: 38,
        }}
        dpr={[1, 2]}
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
