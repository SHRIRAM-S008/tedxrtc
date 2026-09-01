"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface HighlightPhraseProps {
  children: ReactNode;
  underlined?: boolean;
  delay?: number;
  className?: string;
}

/**
 * Scroll-triggered phrase highlight. The text starts in `--color-gray-300`
 * and resolves to white as it enters the viewport; an optional red underline
 * draws from left to right for the most specific key phrases. Skipped under
 * `prefers-reduced-motion` via the `motion.span` fallbacks.
 *
 * Use sparingly — too many highlighted phrases read as noise (DESIGN.md §2's
 * one-red-element guideline). One or two per section is the intended maximum.
 */
export function HighlightPhrase({
  children,
  underlined = false,
  delay = 0,
  className = "",
}: HighlightPhraseProps) {
  return (
    <span className={`relative inline ${className}`}>
      <motion.span
        initial={{ color: "var(--color-gray-300)" }}
        whileInView={{ color: "var(--color-white)" }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
      {underlined && (
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--color-red)] origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: delay + 0.3 }}
        />
      )}
    </span>
  );
}
