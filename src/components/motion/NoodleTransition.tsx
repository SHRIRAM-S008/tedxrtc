"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Generates a single wavy "noodle" path that spans diagonally across the
 * viewport. Each noodle has a slightly different vertical offset, amplitude,
 * and wavelength so they read as organic strands, not parallel lines.
 */
function generateNoodlePath(
  index: number,
  total: number,
  width: number,
  height: number
): string {
  const startY = (height / (total + 1)) * (index + 1);
  const amplitude = 30 + Math.random() * 50;
  const wavelength = 200 + Math.random() * 150;
  const segments = Math.ceil(width / wavelength) + 2;

  let path = `M -100 ${startY}`;
  for (let i = 0; i <= segments; i++) {
    const x = -100 + i * wavelength;
    const cp1x = x + wavelength * 0.25;
    const cp1y = startY + amplitude * (i % 2 === 0 ? 1 : -1);
    const cp2x = x + wavelength * 0.75;
    const cp2y = startY + amplitude * (i % 2 === 0 ? -1 : 1);
    const endX = x + wavelength;
    const endY = startY;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  }
  return path;
}

interface Noodle {
  path: string;
  strokeWidth: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface NoodleTransitionProps {
  /** Number of noodle strands (default 7) */
  count?: number;
  /** Stroke color — defaults to TED red */
  color?: string;
  /** Stroke width range */
  minStroke?: number;
  maxStroke?: number;
  /** Angle of the sweep in degrees (default 8) */
  angle?: number;
}

/**
 * A scroll-triggered "noodle" transition: wavy SVG strokes sweep across the
 * viewport at a slight angle, covering the screen briefly before peeling away.
 * Used between sections as a cinematic wipe. One-shot, gated on in-view, and
 * fully disabled under reduced-motion (renders nothing).
 *
 * Noodles are generated in a client-only useEffect to avoid hydration
 * mismatches — Math.random() produces different values on server vs client.
 */
export function NoodleTransition({
  count = 7,
  color = "var(--color-red)",
  minStroke = 3,
  maxStroke = 8,
  angle = 8,
}: NoodleTransitionProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [mounted, setMounted] = useState(false);
  const [noodles, setNoodles] = useState<Noodle[]>([]);

  const width = 1920;
  const height = 400;

  useEffect(() => {
    setMounted(true);
    setNoodles(
      Array.from({ length: count }, (_, i) => ({
        path: generateNoodlePath(i, count, width, height),
        strokeWidth: minStroke + Math.random() * (maxStroke - minStroke),
        delay: i * 0.08,
        duration: 0.8 + Math.random() * 0.4,
        opacity: 0.3 + Math.random() * 0.5,
      }))
    );
  }, [count, minStroke, maxStroke]);

  if (shouldReduceMotion || !mounted || noodles.length === 0) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative w-full overflow-hidden"
      style={{ height: "1px" }}
    >
      <motion.div
        className="absolute left-0 right-0"
        style={{
          top: "-200px",
          height: `${height}px`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "center",
        }}
        initial={{ x: "-110%" }}
        animate={isInView ? { x: ["-110%", "0%", "110%"] } : undefined}
        transition={{
          duration: 2.5,
          ease: EASE_OUT_EXPO,
          times: [0, 0.45, 1],
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          className="absolute left-0 top-0"
        >
          {noodles.map((noodle, i) => (
            <motion.path
              key={i}
              d={noodle.path}
              stroke={color}
              strokeWidth={noodle.strokeWidth}
              strokeLinecap="round"
              fill="none"
              style={{ opacity: noodle.opacity }}
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={
                isInView
                  ? { pathLength: 1, pathOffset: 0 }
                  : undefined
              }
              transition={{
                duration: noodle.duration,
                delay: noodle.delay,
                ease: EASE_OUT_EXPO,
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
