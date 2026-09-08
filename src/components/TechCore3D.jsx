import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

const CoreGeometry = () => {
  const meshRef = useRef(null);
  const wireRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * (hovered ? 0.8 : 0.35);
      meshRef.current.rotation.y = t * (hovered ? 1.0 : 0.45);
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.3;
      wireRef.current.rotation.z = t * 0.4;
    }
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer Wireframe Cage */}
      <mesh ref={wireRef} scale={1.35}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={hovered ? 0.85 : 0.35}
        />
      </mesh>

      {/* Inner Glowing Crystal */}
      <mesh ref={meshRef} scale={0.95}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#0d0d0d"
          emissive="#10b981"
          emissiveIntensity={hovered ? 0.8 : 0.35}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
};

const TechCore3D = () => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1} />
        <pointLight position={[3, 3, 3]} intensity={2.5} color="#10b981" />
        <pointLight position={[-3, -3, -3]} intensity={1.5} color="#3b82f6" />
        <CoreGeometry />
      </Canvas>
    </div>
  );
};

export default TechCore3D;
