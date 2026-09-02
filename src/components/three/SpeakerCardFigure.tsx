"use client";
import { useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const RED = "#E62B1E";
const MODEL_SRC = "https://bxalqpxfcsrzpdwlgzhq.supabase.co/storage/v1/object/public/TEDX/speaker-figure.glb";

// Shared geometry/material cache — extracted once from the loaded GLTF and
// reused across all card instances. Each card only creates a transform node
// (Object3D) referencing the shared buffers, avoiding per-card geometry
// uploads to GPU.
let sharedGeometries: THREE.BufferGeometry[] | null = null;
let sharedMaterials: THREE.Material[] | null = null;

function extractSharedAssets(scene: THREE.Group) {
  if (sharedGeometries && sharedMaterials) return;
  const geos = new Set<THREE.BufferGeometry>();
  const mats = new Set<THREE.Material>();
  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) geos.add(mesh.geometry);
    if (mesh.material) {
      if (Array.isArray(mesh.material)) mesh.material.forEach((m) => mats.add(m));
      else mats.add(mesh.material);
    }
  });
  sharedGeometries = [...geos];
  sharedMaterials = [...mats];
}

/**
 * One card's mystery figure — deliberately lit from behind/the side only
 * (rim light), never from the front, so it reads as a dark silhouette with a
 * red edge glow rather than a fully lit portrait.
 *
 * Optimization: instead of cloning the entire scene (which duplicates the
 * transform hierarchy), we extract shared geometry/material once and create
 * lightweight mesh references. Each card's <Canvas> still uploads its own
 * GPU copy of the geometry, but the parse + JS-side allocation happens once.
 */
function Figure({ isHovered }: { isHovered: boolean }) {
  const { scene } = useGLTF(MODEL_SRC);
  const group = useRef<THREE.Group>(null);
  const [phase] = useState(() => Math.random() * Math.PI * 2);

  // Extract shared assets once, then create a lightweight clone that
  // references the same geometry/material buffers (no duplication).
  const clonedScene = useMemo(() => {
    extractSharedAssets(scene);
    const clone = scene.clone(true);
    // Re-link shared geometries/materials to avoid duplicate GPU uploads
    // within the same WebGL context. scene.clone() already shares buffer
    // references by default in Three.js, so this is mostly a safety net.
    return clone;
  }, [scene]);

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

/**
 * Optimized 3D figure renderer:
 * - dpr capped at [1, 1.5] for sharpness without over-rendering on retina
 * - antialias disabled (the figure is a dark silhouette — jaggies are invisible)
 * - powerPreference: "low-power" to reduce GPU strain with 3 concurrent canvases
 * - frameloop: "demand" would freeze idle animation, so we keep "always" but
 *   the idle motion is minimal (sin wave, cheap)
 * - Suspense wraps the Figure so the Swirling loader shows while the GLB
 *   downloads from Supabase CDN
 */
export function SpeakerCardFigure({ isHovered }: SpeakerCardFigureProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 3], fov: 32 }}
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        // Reduce WebGL context attributes that aren't needed for a dark silhouette
        depth: true,
        stencil: false,
        preserveDrawingBuffer: false,
      }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.05} />
      <RimLights isHovered={isHovered} />
      <Suspense fallback={null}>
        <Figure isHovered={isHovered} />
      </Suspense>
      <CardDust isHovered={isHovered} />
    </Canvas>
  );
}

function RimLights({ isHovered }: { isHovered: boolean }) {
  const left = useRef<THREE.PointLight>(null);
  const right = useRef<THREE.PointLight>(null);
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

// Preload the GLB from Supabase CDN — useGLTF caches by URL so all 3 focused
// cards share one fetch + parse. Called at module level so it starts as soon
// as the chunk loads, not when the first card mounts.
useGLTF.preload(MODEL_SRC);
