"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const RED = "#E62B1E";
const MODEL_SRC = "/models/speaker-figure.glb";

/**
 * The Speakers section's one signature 3D moment (CLAUDE.md's scoped Three.js
 * exception). No lineup exists yet to render honestly (WORKFLOW.md §5), so
 * this stays a single unnamed figure — never nine, never a stand-in for any
 * specific person — floating, breathing, never fully resolving into a named
 * identity. The model itself (public/models/speaker-figure.glb) was supplied
 * by the organizing team and optimized from a 51MB/500K-triangle raw export
 * down to ~365KB/~30K triangles (obj2gltf + gltf-transform simplify/meshopt)
 * — still the heaviest asset on the site, which is why it renders exactly
 * once here and the 9 card slots (SpeakerCard.tsx) use a CSS silhouette
 * instead of a second instance of this mesh.
 */

function useDustPositions(count: number, radius: number) {
  // A lazy useState initializer (not useMemo) — React documents this form as
  // an intentional, run-once escape hatch for non-deterministic setup work
  // like this, exempt from the render-purity rule useMemo factories are held to.
  const [positions] = useState(() => {
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55 + 0.6;
      out[i * 3 + 2] = r * Math.cos(phi) * 0.7;
    }
    return out;
  });
  return positions;
}

function DustField() {
  const positions = useDustPositions(420, 3.4);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={RED}
        size={0.014}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** The supplied figure — idle rotation, a slow breathing scale pulse, and a
 *  small pointer-reactive tilt (reads the same pointer source CameraRig
 *  already tracks, so the figure and camera feel like one coherent scene). */
function SpeakerFigure() {
  const { scene } = useGLTF(MODEL_SRC);
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const idleSpin = Math.sin(t * 0.15) * 0.25;
    const pointerTilt = pointer.x * 0.12;
    group.current.rotation.y = idleSpin + pointerTilt;
    const breathe = 1 + Math.sin(t * 0.6) * 0.015;
    group.current.scale.setScalar(1.7 * breathe);
  });

  return (
    <group ref={group} position={[0, -0.55, 0]}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
}

/** Near-invisible ground plane, just so the spotlight's shadow has somewhere
 *  to land — not a literal floor, kept subtle enough to read as ambient dark. */
function ShadowCatcher() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
      <planeGeometry args={[6, 6]} />
      <shadowMaterial opacity={0.35} />
    </mesh>
  );
}

/** A soft additive cone suggesting a projector source above the figure —
 *  the volumetric-light substitute (no true godray shader, same honest-
 *  approximation posture as the rest of this scene). */
function ProjectionBeam() {
  return (
    <mesh position={[0, 2.3, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[1.5, 3.2, 32, 1, true]} />
      <meshBasicMaterial
        color={RED}
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Ambient auto-drift + subtle pointer parallax — no user-draggable orbit. */
function CameraRig() {
  const { camera, pointer } = useThree();

  // R3F's canonical pattern: useFrame runs on Three's own rAF render loop, not
  // React's — mutating `camera` (a Three.js Object3D, not React state) every
  // frame is how every R3F scene drives a camera. Not a purity/immutability
  // violation despite the generic lint rule's heuristic.
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const driftX = Math.sin(t * 0.08) * 0.3;
    const driftY = Math.cos(t * 0.06) * 0.15;
    const targetX = driftX + pointer.x * 0.25;
    const targetY = 0.6 + driftY + pointer.y * 0.15;
    // eslint-disable-next-line react-hooks/immutability -- imperative Three.js mutation, see comment above
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
    camera.lookAt(0, 0.15, 0);
  });

  return null;
}

export function SpeakerHologram() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 6], fov: 42 }}
      dpr={[1, 1.4]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      className="absolute inset-0"
    >
      <fog attach="fog" args={["#0A0A0A", 4, 9]} />
      <ambientLight intensity={0.7} />
      {/* Soft white key light — the figure needs to actually read (basecolor
          texture legible) before the red spotlight adds mood on top of it. */}
      <pointLight position={[1.5, 2, 3]} intensity={25} decay={1} color="#FAFAFA" />
      <spotLight
        position={[0, 4, 1.5]}
        angle={0.6}
        penumbra={0.6}
        intensity={60}
        decay={1}
        color={RED}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <CameraRig />
      <DustField />
      <SpeakerFigure />
      <ShadowCatcher />
      <ProjectionBeam />
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload(MODEL_SRC);
