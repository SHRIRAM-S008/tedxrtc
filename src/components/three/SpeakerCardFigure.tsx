"use client";
import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const RED = "#E62B1E";
const MODEL_SRC = "/models/speaker-figure.glb";

/**
 * One card's mystery figure — deliberately lit from behind/the side only
 * (rim light), never from the front, so it reads as a dark silhouette with a
 * red edge glow rather than a fully lit portrait. `useGLTF` caches the parsed
 * geometry by URL, so loading it in all 9 cards costs one parse, not nine —
 * each card's own <Canvas> still uploads its own small GPU copy, but at
 * ~30K triangles (post gltf-transform optimization) that's cheap even x9,
 * and this is desktop-only regardless (useCanRender3D never allows 3D below
 * `lg`/4 cores/WebGL).
 *
 * `scene.clone()` is required, not optional: `useGLTF` returns the SAME
 * cached Object3D across all 9 cards (same URL), and a Three.js object can
 * only have one parent at a time — without cloning, each card's own
 * <primitive> reparents that single shared object away from every other
 * card's scene graph, so only the last one mounted actually renders it. The
 * clone shares geometry/material buffers by reference (cheap), just gives
 * each card its own transform-hierarchy node.
 */
function Figure({ isHovered }: { isHovered: boolean }) {
  const { scene } = useGLTF(MODEL_SRC);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const group = useRef<THREE.Group>(null);
  const [phase] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + phase;
    const idle = Math.sin(t * 0.5) * 0.12;
    const hoverTarget = isHovered ? 0.35 : 0;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, idle + hoverTarget, 0.06);
    group.current.position.y = -0.55 + Math.sin(t * 0.8) * 0.03;
  });

  return (
    <group ref={group} position={[0, -0.55, 0]} scale={1.35}>
      <primitive object={clonedScene} />
    </group>
  );
}

/** A handful of drifting points per card — cheap, ambient, brightens slightly on hover. */
function CardDust({ isHovered }: { isHovered: boolean }) {
  const [positions] = useState(() => {
    const out = new Float32Array(14 * 3);
    for (let i = 0; i < 14; i++) {
      out[i * 3] = (Math.random() - 0.5) * 1.6;
      out[i * 3 + 1] = Math.random() * 1.4 - 0.2;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return out;
  });
  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={RED}
        size={0.02}
        transparent
        opacity={isHovered ? 0.5 : 0.25}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface SpeakerCardFigureProps {
  isHovered: boolean;
}

export function SpeakerCardFigure({ isHovered }: SpeakerCardFigureProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 3], fov: 32 }}
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      className="!absolute inset-0"
    >
      {/* Near-zero ambient — the figure should be almost unlit from the front. */}
      <ambientLight intensity={0.05} />
      {/* Two rim lights, both positioned behind the subject relative to the
          camera (negative z), so only the edges catch light — never the
          front-facing surfaces (BRANDING-adjacent restraint: mysterious, not
          fully revealed). Brightens on hover, lerped for smoothness. */}
      <RimLights isHovered={isHovered} />
      <Figure isHovered={isHovered} />
      <CardDust isHovered={isHovered} />
    </Canvas>
  );
}

function RimLights({ isHovered }: { isHovered: boolean }) {
  const left = useRef<THREE.PointLight>(null);
  const right = useRef<THREE.PointLight>(null);
  // Three.js's physically-correct light units need much higher numeric
  // intensity than the old arbitrary scale to read as visible at a couple of
  // units' distance (same lesson learned tuning the hero figure's spotlight:
  // 8 was invisible, 60 worked) — 7-14 here was silently too dim to see at all.
  useFrame(() => {
    const target = isHovered ? 90 : 45;
    if (left.current) left.current.intensity = THREE.MathUtils.lerp(left.current.intensity, target, 0.08);
    if (right.current) right.current.intensity = THREE.MathUtils.lerp(right.current.intensity, target * 0.7, 0.08);
  });
  return (
    <>
      <pointLight ref={left} position={[-1.2, 0.6, -1.4]} color={RED} decay={1} />
      <pointLight ref={right} position={[1.3, 0.2, -1.2]} color={RED} decay={1} />
    </>
  );
}

useGLTF.preload(MODEL_SRC);
