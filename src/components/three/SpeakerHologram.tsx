"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const RED = "#E62B1E";

/**
 * The Speakers section's one signature 3D moment (CLAUDE.md's scoped Three.js
 * exception). No lineup exists yet to render honestly (WORKFLOW.md §5), so
 * rather than fake a person, this materializes the one object every voice on
 * this stage will share: a mic, itself never fully resolving — a wireframe
 * hologram assembling out of drifting particles, forever mid-projection. The
 * incompleteness isn't a placeholder trick, it's diegetic: this is what "not
 * announced yet" would actually look like as a projection.
 *
 * Deliberately procedural — no external 3D model/asset. A licensed, rigged,
 * photoreal hand model isn't something a prompt can produce responsibly (would
 * need sourcing + rights verification); this stays honest about being a
 * stylized graphic instead of pretending photorealism.
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

/** Procedural wireframe mic — capsule head, ring accent, cylinder body. */
function HologramMic() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.25;
  });

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.45, 0.5, 6, 12]} />
        <meshBasicMaterial color={RED} wireframe transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.47, 0.015, 8, 32]} />
        <meshBasicMaterial color={RED} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 1.6, 16, 1, true]} />
        <meshBasicMaterial color={RED} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/** A soft additive cone suggesting a projector source above the mic. */
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
    const targetY = 1 + driftY + pointer.y * 0.15;
    // eslint-disable-next-line react-hooks/immutability -- imperative Three.js mutation, see comment above
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
    camera.lookAt(0, 0.6, 0);
  });

  return null;
}

export function SpeakerHologram() {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      className="absolute inset-0"
    >
      <fog attach="fog" args={["#0A0A0A", 4, 9]} />
      <ambientLight intensity={0.2} />
      <CameraRig />
      <DustField />
      <HologramMic />
      <ProjectionBeam />
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
