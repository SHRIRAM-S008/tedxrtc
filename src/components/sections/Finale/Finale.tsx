"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import styles from "./Finale.module.css";

/**
 * Chapter 5 — Minimal Ending. Mostly empty space, typography dominates, one
 * CTA. The closing logo gets a slow breathing opacity loop and a soft glow
 * behind it — the "final frame of a documentary" treatment, authorized as a
 * scoped, documented exception to the general "never animate the mark" rule
 * (BRANDING.md §6). Both effects stop entirely under reduced motion; the
 * logo simply renders at full, static opacity.
 */
export function Finale() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={styles.section}>
      <RevealOnScroll>
        <h2 className={cn("text-display-l", styles.heading)}>
          The next great idea
          <br />
          might begin
          <br />
          at Rathinam.
        </h2>
      </RevealOnScroll>

      <RevealOnScroll delay={0.15}>
        <Button asChild>
          <Link href="#tickets">Reserve Your Seat</Link>
        </Button>
      </RevealOnScroll>

      <RevealOnScroll delay={0.3}>
        <div className={styles.logoWrap}>
          {!shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              className={styles.logoGlow}
              style={{
                background: "radial-gradient(circle, rgba(255,68,56,0.16), transparent 70%)",
                filter: "blur(24px)",
              }}
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <motion.div
            animate={shouldReduceMotion ? undefined : { opacity: [0.92, 1, 0.92] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Logo className={styles.logo} />
          </motion.div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
