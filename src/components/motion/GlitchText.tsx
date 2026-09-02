"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Monochrome glyph pool — the scramble reads as "digital/decoding", never as
// off-palette RGB noise (DESIGN.md §2). Characters only; color stays in the token system.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$?/*<>{}";

interface GlitchTextProps {
  text: string;
  className?: string;
  /** ms after start before the decode begins (sync this with the headline reveal). */
  delay?: number;
  /** total ms for the text to resolve left-to-right. */
  duration?: number;
  /** Gate for below-the-fold usage: pass an in-view boolean so the decode doesn't
   *  burn its one shot off-screen. Defaults to true (starts on mount, as in the hero). */
  start?: boolean;
}

/**
 * One-shot "decode" reveal: the text starts scrambled and resolves to its final
 * form, left to right. Directed load motion (ANIMATIONS.md §3), not ambient —
 * it runs once. Screen readers get the final string only (aria-label); the
 * scramble is aria-hidden. Under reduced motion it renders final text instantly
 * (ANIMATIONS.md §6). Length is preserved every frame, so there is no layout shift.
 */
export function InViewGlitchText({ text, className, delay = 0, duration = 400 }: Omit<GlitchTextProps, "start">) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <span ref={ref} className={className}>
      <GlitchText text={text} delay={delay} duration={duration} start={isInView} />
    </span>
  );
}

export function GlitchText({ text, className, delay = 0, duration = 400, start = true }: GlitchTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number>(0);
  const timeoutRef = useRef<number>(0);

  useEffect(() => {
    // No "already ran" ref guard here: React StrictMode mounts effects twice in
    // dev, and a ref set on the first pass would make the second pass bail out —
    // silently killing the scramble. The dependency array is what prevents
    // spurious re-runs; `start` only ever flips false → true.
    if (shouldReduceMotion || !start) return;

    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const resolved = Math.floor(progress * text.length);
      const out = text
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < resolved) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setDisplay(out);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    timeoutRef.current = window.setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [text, delay, duration, shouldReduceMotion, start]);

  // Always resolve to final text when motion is reduced, even if a scramble was mid-flight.
  const shown = shouldReduceMotion ? text : display;

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
