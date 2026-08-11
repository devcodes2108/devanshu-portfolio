"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function ReducedMotionAwareScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const scrollDepth = scrollProgress * 1.4;
    const targetX = prefersReducedMotion ? 0.2 : state.pointer.y * 0.9 + 0.38 + scrollDepth * 0.5;
    const targetY = prefersReducedMotion ? 0.15 : state.pointer.x * 1.2 + scrollDepth * 0.75;
    const floatY = prefersReducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.15) * 0.12 + scrollDepth * 0.35;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.05);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -0.2 + scrollProgress * 0.5, 0.04);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.7]} rotation={[0.2, -0.4, 0.15]} castShadow>
        <boxGeometry args={[3.2, 3.8, 0.28]} />
        <meshStandardMaterial color="#f3efe7" metalness={0.42} roughness={0.28} />
      </mesh>

      <mesh position={[0, 0, 0.15]} rotation={[0.12, 0.22, 0.08]}>
        <boxGeometry args={[2.7, 3.22, 0.18]} />
        <meshStandardMaterial color="#121212" metalness={0.7} roughness={0.25} />
      </mesh>

      <mesh position={[1.4, -1.15, 0.9]} rotation={[0.82, 0.5, 0.24]}>
        <torusGeometry args={[1.15, 0.1, 18, 96]} />
        <meshStandardMaterial color="#d3b33f" emissive="#d3b33f" emissiveIntensity={0.35} metalness={0.35} roughness={0.26} />
      </mesh>

      <mesh position={[-1.32, 1.1, 0.9]} rotation={[0.55, 0.95, 0.5]}>
        <torusGeometry args={[0.8, 0.08, 18, 80]} />
        <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.2} />
      </mesh>

      <mesh position={[0.25, 1.7, 0.6]} rotation={[0.1, 0.4, 0.25]}>
        <cylinderGeometry args={[0.5, 0.5, 0.24, 28]} />
        <meshStandardMaterial color="#d3b33f" emissive="#d3b33f" emissiveIntensity={0.2} metalness={0.5} roughness={0.25} />
      </mesh>

      <mesh position={[-0.85, -1.55, 0.7]} rotation={[0.7, 0.2, 0.17]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#d3b33f" emissive="#d3b33f" emissiveIntensity={0.28} metalness={0.5} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function Hero3DScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="hero-3d" aria-label="3D portfolio visual">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.1], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        shadows={false}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={reducedMotion ? 0.8 : 1.1} />
          <directionalLight position={[3, 3, 2]} intensity={reducedMotion ? 0.8 : 1.4} color="#fffdf7" />
          <directionalLight position={[-2, 1, 3]} intensity={reducedMotion ? 0.4 : 0.8} color="#d3b33f" />
          <ReducedMotionAwareScene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
