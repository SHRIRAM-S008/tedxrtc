"use client";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SpeakerSlot } from "@/lib/data/speaker-slots";

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
}

/**
 * One mystery slot. Real <button> (not a styled <div>), since it's genuinely
 * clickable — ACCESSIBILITY.md §2. No name/bio/company ever renders here
 * (TEDX_RULES.md §4) — only the number, the figure, and "YET TO REVEAL".
 * Content is deliberately minimal: no hover text-swap, no description, no
 * links — the mystery is the figure itself, silhouetted and rim-lit, not
 * copy.
 */
export function SpeakerCard({ slot, index, onReveal, canRender3D }: SpeakerCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  function handleClick() {
    setIsClicked(true);
    window.setTimeout(() => setIsClicked(false), 320);
    onReveal();
  }

  const label = `Speaker ${slot.number}, identity not yet revealed`;

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
            {canRender3D ? (
              <Suspense fallback={null}>
                <SpeakerCardFigure isHovered={isHovered && !shouldReduceMotion} />
              </Suspense>
            ) : (
              // CSS silhouette fallback — mobile, low-end, no WebGL, reduced
              // motion (useCanRender3D). Already dark/solid, so "silhouetted"
              // holds true here too.
              <div className="flex h-full items-center justify-center">
                <svg viewBox="0 0 64 80" className="h-16 w-16" aria-hidden="true">
                  <path
                    d="M32 6c7 0 12 6 12 13s-5 12-12 12-12-5-12-12S25 6 32 6Z M12 78c1-16 9-28 20-28s19 12 20 28Z"
                    fill="var(--color-black)"
                    stroke="rgba(230,43,30,0.4)"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>
            )}
          </div>

          <p className="text-small text-[var(--color-gray-300)]">YET TO REVEAL</p>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
