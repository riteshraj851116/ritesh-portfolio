
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

const Orb = () => {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x =
      state.clock.elapsedTime * 0.15;

    meshRef.current.rotation.y =
      state.clock.elapsedTime * 0.2;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={1.2}
    >
      <mesh ref={meshRef} scale={1.35}>
        <icosahedronGeometry args={[1, 4]} />

        <MeshDistortMaterial
          color="#b8b8b0"
          roughness={0.25}
          metalness={0.7}
          distort={0.25}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
};

const HeroScene = () => {
  return (
    <div className="hero-three">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 35,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[3, 3, 4]}
          intensity={3}
        />

        <pointLight
          position={[-3, -2, 3]}
          intensity={2}
        />

        <Orb />
      </Canvas>
    </div>
  );
};

export default HeroScene;
