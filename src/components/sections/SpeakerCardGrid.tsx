"use client";
import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, useAnimationFrame } from "framer-motion";
import { SpeakerCard } from "./SpeakerCard";
import { speakerSlots } from "@/lib/data/speaker-slots";

interface SpeakerCardGridProps {
  onReveal: () => void;
  canRender3D: boolean | null;
}

const DURATION = 40; // seconds for one full pass of the duplicated track
const FOCUS_COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3;

/**
 * Infinite horizontal marquee of mystery speaker cards. The 9 slots are
 * duplicated so the track can translate by exactly one set (-50%) and loop
 * seamlessly. The cards are buttons and remain interactive — hover still
 * triggers the lift + spin (SpeakerCard.tsx).
 *
 * Focus system: only the 3 cards closest to the viewport center render the
 * 3D figure. All others show the CSS silhouette with a blur filter. This
 * limits WebGL contexts to 3 max (down from 18), making the section
 * performant while keeping the 3D design for the cards that matter — the
 * ones the visitor is actually looking at.
 *
 * Skipped entirely under `prefers-reduced-motion`; the track is static and
 * the user can still scroll or tab through it.
 */
export function SpeakerCardGrid({ onReveal, canRender3D }: SpeakerCardGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [focusedIndices, setFocusedIndices] = useState<Set<number>>(new Set([0, 1, 2]));

  // Two identical sets are required for a seamless infinite loop.
  const slots = [...speakerSlots, ...speakerSlots];

  // Track which 3 cards are closest to viewport center. Runs on rAF but only
  // updates state when the focused set actually changes — not every frame.
  const checkFocus = useCallback(() => {
    const viewportCenter = window.innerWidth / 2;
    const distances: { index: number; distance: number }[] = [];

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      // Skip cards that are fully off-screen
      if (rect.right < -100 || rect.left > window.innerWidth + 100) return;
      distances.push({ index: i, distance: Math.abs(cardCenter - viewportCenter) });
    });

    distances.sort((a, b) => a.distance - b.distance);
    const newFocused = new Set(distances.slice(0, FOCUS_COUNT).map((d) => d.index));

    // Only update state if the set changed — avoids re-rendering every frame
    setFocusedIndices((prev) => {
      if (prev.size === newFocused.size && [...prev].every((i) => newFocused.has(i))) {
        return prev;
      }
      return newFocused;
    });
  }, []);

  useAnimationFrame(() => {
    if (!shouldReduceMotion) checkFocus();
  });

  return (
    <div ref={containerRef} className="relative z-10 w-full overflow-hidden">
      <motion.div
        role="list"
        aria-label="Speaker lineup — infinitely scrolling nine mystery slots"
        className="inline-flex w-fit gap-6 px-6 lg:px-16"
        animate={
          shouldReduceMotion
            ? { x: 0 }
            : { x: ["0%", "-50%"] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: DURATION, repeat: Infinity, ease: "linear" }
        }
      >
        {slots.map((slot, index) => {
          const isFocused = focusedIndices.has(index);
          return (
            <div
              key={`${slot.id}-${index}`}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="w-64 flex-none transition-[filter,opacity,transform] duration-500 lg:w-80"
              role="listitem"
              style={{
                filter: isFocused ? "blur(0px)" : "blur(4px)",
                opacity: isFocused ? 1 : 0.5,
                transform: isFocused ? "scale(1)" : "scale(0.92)",
              }}
            >
              <SpeakerCard
                slot={slot}
                index={index % speakerSlots.length}
                onReveal={onReveal}
                canRender3D={canRender3D}
                isFocused={isFocused}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
