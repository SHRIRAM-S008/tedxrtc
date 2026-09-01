"use client";
import { useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { GlitchText } from "@/components/motion/GlitchText";
import type { SpeakerSlot } from "@/lib/data/speaker-slots";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface SpeakerCardProps {
  slot: SpeakerSlot;
  onReveal: () => void;
}

/**
 * One mystery slot. Real <button> (not a styled <div>), since it's genuinely
 * clickable — ACCESSIBILITY.md §2. No name/bio/company ever renders here
 * (TEDX_RULES.md §4) — the silhouette and the "incomplete ring" (reserved by
 * UNFINISHED_THEME.md §4 for exactly this kind of roster placeholder, never
 * built until now) carry the mystery instead of fabricated content.
 *
 * Three nested layers, each owning its own transform, so none fight each
 * other (same discipline as TEDxArrival's background: "three responsibilities,
 * three layers"): outer div = scroll-triggered entrance (whileInView), the
 * <button> = hover/focus/tap gestures (native whileHover/whileFocus/whileTap,
 * not manual `animate`, which would otherwise override whileInView on mount),
 * inner div = pointer-tracked "magnetic" offset (style-bound spring values).
 */
export function SpeakerCard({ slot, onReveal }: SpeakerCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Magnetic cursor — a few px of pointer-tracked offset, clamped, never a
  // full drag/tilt (the brief's rejected "aggressive tilt").
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 200, damping: 20 });
  const springY = useSpring(my, { stiffness: 200, damping: 20 });

  function handlePointerMove(e: PointerEvent<HTMLButtonElement>) {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(relX * 10);
    my.set(relY * 10);
  }

  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
    setIsHovered(false);
  }

  function handleClick() {
    setIsClicked(true);
    window.setTimeout(() => setIsClicked(false), 320);
    onReveal();
  }

  const label = `Speaker ${slot.number}, identity not yet revealed`;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : slot.revealOrder * 0.09, ease: EASE_OUT_EXPO }}
      className="w-full"
    >
      <motion.button
        type="button"
        aria-label={label}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onFocus={() => setIsHovered(true)}
        onBlur={handlePointerLeave}
        onClick={handleClick}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -6 }}
        whileFocus={shouldReduceMotion ? undefined : { scale: 1.05, y: -6 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        className="group relative flex aspect-[3/4] w-full flex-col items-center justify-between overflow-hidden rounded-[8px] border border-white/15 bg-black/40 px-4 py-5 text-center backdrop-blur-md focus-visible"
      >
        {/* Red edge-glow — expands on hover/focus, contained cost (box-shadow only) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[8px]"
          animate={{
            boxShadow: isHovered
              ? "0 0 0 1px var(--color-red), 0 0 32px 4px rgba(230,43,30,0.35)"
              : "0 0 0 1px transparent, 0 0 0px 0px rgba(230,43,30,0)",
          }}
          transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
        />

        {/* One-shot top-to-bottom scan line on hover */}
        {isHovered && !shouldReduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-[var(--color-red)]/40 to-transparent"
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 0.7, ease: "linear" }}
          />
        )}

        {/* Click glitch flash */}
        {isClicked && !shouldReduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[var(--color-red)] mix-blend-screen"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Magnetic-cursor layer — the only element controlling x/y via a
            style-bound spring, isolated from the button's own hover/tap
            transforms above. */}
        <motion.div
          style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
          className="flex h-full w-full flex-col items-center justify-between"
        >
          <p className="text-eyebrow text-[var(--color-gray-300)]">Speaker #{slot.number}</p>

          <div className="relative flex flex-1 items-center justify-center">
            {/* Incomplete ring — reserved by UNFINISHED_THEME.md §4, never
                built until this roster placeholder; closes further on hover,
                never fully (the reveal isn't here yet). */}
            <svg viewBox="0 0 100 100" className="absolute h-24 w-24" aria-hidden="true">
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="var(--color-red)"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0.62, opacity: 0.5 }}
                animate={shouldReduceMotion ? undefined : { pathLength: isHovered ? 0.82 : 0.62 }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              />
            </svg>

            {/* Silhouette — never static; breathes slowly */}
            <motion.svg
              viewBox="0 0 64 80"
              className="relative h-16 w-16"
              aria-hidden="true"
              animate={shouldReduceMotion ? undefined : { scale: [1, 1.035, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M32 6c7 0 12 6 12 13s-5 12-12 12-12-5-12-12S25 6 32 6Z M12 78c1-16 9-28 20-28s19 12 20 28Z"
                fill="var(--color-black)"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.75"
              />
            </motion.svg>
          </div>

          {/* Mystery line — swaps via a fresh GlitchText mount, remounted by
              key so its one-shot decode replays cleanly each time the phrase
              changes. */}
          <p className="text-small text-[var(--color-gray-300)]">
            <GlitchText
              key={isHovered ? "revealed" : "hidden"}
              text={isHovered ? "COMING SOON" : "YET TO REVEAL"}
              duration={500}
            />
          </p>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
