"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { GlitchText } from "@/components/motion/GlitchText";
import { Button } from "@/components/ui/Button";
import { EVENT } from "@/lib/event";

const HEADLINE = "Coming Soon.";

interface SpeakersTextProps {
  /** Notifies the section shell when this text has scrolled into view, so the
   *  3D hologram (a sibling layer) can switch on in sync rather than running
   *  its render loop the whole time it's off-screen. */
  onInViewChange?: (inView: boolean) => void;
}

/**
 * The Speakers section's text layer — identical whether the layer behind it is
 * the 3D hologram or the CSS fallback background. That guarantee is structural:
 * Speakers.tsx renders this exact component either way, never a fork of it
 * (matches the brief's own "the reveal animation should remain identical").
 * Reuses the hero's decode-glitch + chromatic-ghost technique (ANIMATIONS.md §1)
 * rather than inventing a new effect.
 */
export function SpeakersText({ onInViewChange }: SpeakersTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    onInViewChange?.(isInView);
  }, [isInView, onInViewChange]);

  return (
    <div
      ref={ref}
      className="container relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center lg:px-16"
    >
      <RevealOnScroll>
        <p className="text-eyebrow text-[var(--color-gray-500)]">Speakers Lineup</p>
      </RevealOnScroll>

      <h2 className="text-display-l relative text-[var(--color-red)]">
        {!shouldReduceMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 select-none text-white"
            initial={{ opacity: 0, x: 0 }}
            animate={
              isInView
                ? { opacity: [0, 0.7, 0, 0.5, 0, 0.35, 0], x: [0, -3, 3, -2, 2, -1, 0] }
                : {}
            }
            transition={{ duration: 0.9, delay: 0.15, ease: "linear", times: [0, 0.12, 0.28, 0.45, 0.62, 0.8, 1] }}
          >
            {HEADLINE}
          </motion.span>
        )}
        <GlitchText text={HEADLINE} start={isInView} delay={150} duration={700} />
      </h2>

      <RevealOnScroll delay={0.15}>
        <p className="max-w-xl text-body-l text-[var(--color-gray-300)]">
          Each voice on this stage carries a story that didn’t start with them — and won’t end with them either. The lineup is still being written.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.25}>
        <Button asChild variant="secondary">
          <a href={EVENT.social.instagram} target="_blank" rel="noopener noreferrer">
            Follow for Updates
          </a>
        </Button>
      </RevealOnScroll>
    </div>
  );
}
