import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

// Simple animated sphere that drifts slowly
function DriftingSphere({ position, color, scale, speed = 0.01 }) {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.7;
    }
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} transparent opacity={0.6} roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

export default function ThreeBackground() {
  return (
    <Canvas
      className="absolute inset-0 pointer-events-none"
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      {/* Ambient light for soft glow */}
      <ambientLight intensity={0.7} />
      {/* Directional light for subtle shading */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      {/* Three drifting spheres using brand palette */}
      <DriftingSphere position={[-2, 1, 0]} color="#FAF6F0" scale={2.5} speed={0.008} />
      <DriftingSphere position={[2, -1, -1]} color="#F3E9D7" scale={1.8} speed={0.006} />
      <DriftingSphere position={[0, 0, -2]} color="#C9A96E" scale={3} speed={0.004} />
    </Canvas>
  );
}
