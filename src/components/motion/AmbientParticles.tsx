"use client";
import { motion, useReducedMotion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// Fixed, hand-placed positions — not Math.random() in render, which would
// differ between server and client render and trip a hydration mismatch.
const PARTICLES: Particle[] = [
  { x: 12, y: 22, size: 2, duration: 9, delay: 0 },
  { x: 28, y: 68, size: 1.5, duration: 11, delay: 1.2 },
  { x: 46, y: 14, size: 2.5, duration: 8, delay: 0.6 },
  { x: 61, y: 52, size: 1.5, duration: 12, delay: 2 },
  { x: 74, y: 30, size: 2, duration: 10, delay: 0.4 },
  { x: 85, y: 66, size: 1.5, duration: 9.5, delay: 1.8 },
  { x: 20, y: 80, size: 2, duration: 10.5, delay: 2.4 },
  { x: 55, y: 84, size: 1.5, duration: 11.5, delay: 0.9 },
];

/**
 * Ambient decorative dust for TEDxArrival's reveal — slow drift + fade,
 * transform/opacity only (PERFORMANCE.md §6). Purely atmospheric: removed
 * entirely under reduced motion rather than left static or slowed
 * (ANIMATIONS.md §6), since a field of motionless dots reads as noise, not
 * intent.
 */
export function AmbientParticles() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[var(--color-white)]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.35, 0], y: [-6, -18] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
