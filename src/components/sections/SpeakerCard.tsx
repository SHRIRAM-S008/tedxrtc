"use client";
import dynamic from "next/dynamic";
import { Suspense, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SpeakerSlot } from "@/lib/data/speaker-slots";
import { useInView } from "@/lib/hooks/useInView";
import { Swirling } from "@/components/ui/swirling";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// R3F/Three.js never ship to the initial bundle — only fetched on capable
// desktop devices (CLAUDE.md's scoped 3D exception: lazy-loaded, code-split,
// with a real fallback).
const SpeakerCardFigure = dynamic(
  () => import("@/components/three/SpeakerCardFigure").then((m) => m.SpeakerCardFigure),
  { ssr: false, loading: () => null },
);

interface SpeakerCardProps {
  slot: SpeakerSlot;
  index: number;
  onReveal: () => void;
  /** Lifted from Speakers.tsx — useCanRender3D() creates a test WebGL
   *  context to check capability; calling it once per card (x9) would
   *  redundantly create 9 throwaway contexts instead of one. */
  canRender3D: boolean | null;
  /** True for the 3 cards closest to viewport center (SpeakerCardGrid's
   *  focus system). Only focused cards mount the 3D canvas — max 3 WebGL
   *  contexts at a time instead of 18. */
  isFocused?: boolean;
}

/**
 * One mystery slot. Real <button> (not a styled <div>), since it's genuinely
 * clickable — ACCESSIBILITY.md §2. No name/bio/company ever renders here
 * (TEDX_RULES.md §4) — only the number, the figure, and "YET TO REVEAL".
 * Content is deliberately minimal: no hover text-swap, no description, no
 * links — the mystery is the figure itself, silhouetted and rim-lit, not
 * copy.
 */
export function SpeakerCard({ slot, index, onReveal, canRender3D, isFocused = false }: SpeakerCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // The marquee duplicates all 9 slots to 18 mounted cards for its seamless
  // loop; without this, every one of them would run its own <Canvas> render
  // loop simultaneously (up to and past the browser's ~16 WebGL-context cap)
  // regardless of whether it's ever been scrolled into view.
  const isInView = useInView(cardRef, "300px");

  function handleClick() {
    setIsClicked(true);
    window.setTimeout(() => setIsClicked(false), 320);
    onReveal();
  }

  const label = `Speaker ${slot.number}, identity not yet revealed`;

  // 3D only for focused + in-view + capable devices — max 3 WebGL contexts.
  const show3D = canRender3D && isInView && isFocused;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.1, ease: EASE_OUT_EXPO }}
      className="w-full"
    >
      {/* Floating idle animation on its own layer — never dramatic, per the
          brief — kept separate from the button's own whileHover/whileFocus
          lift below so the two don't fight over the same `y` value (a
          continuous `animate` loop otherwise wins over whileHover on the
          same element, the same conflict already fixed once in this file's
          history — see git log). */}
      <motion.div
        ref={cardRef}
        animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }
        }
      >
        <motion.button
          type="button"
          aria-label={label}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onClick={handleClick}
          whileHover={shouldReduceMotion ? undefined : { y: -6 }}
          whileFocus={shouldReduceMotion ? undefined : { y: -6 }}
          className="group relative flex aspect-[3/4] w-full flex-col items-center justify-between overflow-hidden rounded-[8px] border border-white/15 bg-black/40 px-4 py-5 text-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md focus-visible"
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

          {/* Click flash */}
          {isClicked && !shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[var(--color-red)] mix-blend-screen"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          <p className="text-eyebrow text-[var(--color-gray-300)]">Speaker #{slot.number}</p>

          <div className="relative w-full flex-1">
            {show3D ? (
              <Suspense
                fallback={<SpeakerCardLoader />}
              >
                <SpeakerCardFigure isHovered={isHovered && !shouldReduceMotion} />
              </Suspense>
            ) : (
              <SpeakerCardLoader />
            )}
          </div>

          <p className="text-small text-[var(--color-gray-300)]">YET TO REVEAL</p>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/**
 * Loader state for speaker cards — a swirling SVG ring with a red rim glow.
 * Used both as the Suspense fallback while the 3D figure loads and as the
 * permanent state for non-focused/mobile cards that never mount a WebGL canvas.
 */
function SpeakerCardLoader() {
  return (
    <div className="flex h-full items-center justify-center" aria-hidden="true">
      <Swirling
        className="size-20 text-[var(--color-red)]"
        style={{ filter: "drop-shadow(0 0 12px rgba(230,43,30,0.3))" }}
      />
    </div>
  );
}
