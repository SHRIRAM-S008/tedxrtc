"use client";
import { motion, useReducedMotion } from "framer-motion";

/**
 * CSS/SVG background for the Speakers section on devices that don't get the 3D
 * hologram (mobile, low-end, no WebGL, reduced-motion — see useCanRender3D).
 * Not a degraded stand-in: this was the section's original, fully-designed
 * background before the hologram existed, so "the fallback" is a first-class
 * treatment, not an afterthought.
 */
export function SpeakersFallbackBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140vw] max-h-[900px] w-[140vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
      >
        <motion.circle
          cx="100"
          cy="100"
          r="96"
          stroke="var(--color-red)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0.75 }}
          whileInView={shouldReduceMotion ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </svg>

      <div className="pointer-events-none absolute -left-16 top-1/4 h-px w-72 -rotate-[30deg] bg-gradient-to-r from-transparent via-[var(--color-red)]/20 to-transparent" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-px w-72 -rotate-[30deg] bg-gradient-to-r from-transparent via-[var(--color-red)]/20 to-transparent" />
    </>
  );
}
