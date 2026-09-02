"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlitchText } from "@/components/motion/GlitchText";
import { AmbientParticles } from "@/components/motion/AmbientParticles";
import { Logo } from "@/components/layout/Logo";
import { EVENT } from "@/lib/event";
import { cn } from "@/lib/utils";
import styles from "./TEDxArrival.module.css";

const HEADLINE = `${EVENT.theme}.`;

// Token easing (ANIMATIONS.md §2 --ease-out-expo). Kept as a const, not an inline magic array.
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Orchestrated as one timeline, not independent per-element timers (ANIMATIONS.md
 * §3): ambient light → red glow → particles → camera push → dot → line draws
 * from it → logo (mask-reveal + blur resolve) → typography. INTRO_PUSH shifts
 * the already-tuned typography sequence (eyebrow/draft-phrase/headline/
 * subtitle/CTA) back as a block, so their relative pacing to each other stays
 * exactly as designed — only their start time moves to make room for the new
 * beats. The whole reveal, black screen through logo+eyebrow settling, plays
 * out over roughly 2.5s; headline/subtitle/CTA are a deliberate follow-on
 * beat after that, not part of the "reveal" itself.
 *
 * All delays below are now relative to `isInView` becoming true, not to
 * component mount — this section is no longer the page's first paint, so the
 * sequence must fire when the visitor scrolls to it, not silently finish
 * off-screen while they're still reading the Rathinam chapters above it.
 */
const INTRO_PUSH = 1.9;
const T = {
  ambientLight: 0,
  redGlow: 0.3,
  particles: 0.5,
  cameraPush: 1.6,
  dot: 0.3,
  lineDelay: 0.5,
  lineDuration: 1.0,
  logoDelay: 1.3,
  logoDuration: 0.7,
  videoReveal: 1.6,
  eyebrow: 0.2 + INTRO_PUSH,
  draftPhrase: 0.4 + INTRO_PUSH,
  headline: 1.6 + INTRO_PUSH,
  subtitle: 2.2 + INTRO_PUSH,
  cta: 2.4 + INTRO_PUSH,
  meta: 1.2 + INTRO_PUSH,
  scrollHint: 3.0 + INTRO_PUSH,
};

/**
 * Chapter 2's arrival — this used to be the page's very first paint (`Hero`);
 * it's now a mid-page chapter reached by scrolling past `RathinamHero`, so it
 * no longer carries the page's LCP (`RathinamHero` does), and the whole
 * revision-mark sequence is gated on `isInView` rather than mount. Background
 * is the official TEDx collage artwork (a still image, not the former
 * looping b-roll video). The sequence itself (timings, beats) is otherwise
 * unchanged — still the site's one signature element (UNFINISHED_THEME.md).
 */
export function TEDxArrival() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });
  const armed = isInView || shouldReduceMotion === true;

  const { scrollY } = useScroll();
  // Scroll-linked parallax is disabled entirely under reduced motion (ANIMATIONS.md §6).
  const y1 = useTransform(scrollY, [0, 1000], [0, shouldReduceMotion ? 0 : 200]);
  const scrollOpacity = useTransform(scrollY, [0, 500], [1, shouldReduceMotion ? 1 : 0]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
    >
      {/* Background: black-to-environment mount reveal (outer), scroll-linked
          parallax/fade (middle), slow ambient drift — a static-camera stand-in for
          "camera movement" (inner). Three responsibilities, three layers, so none
          of the transforms fight each other. */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={armed ? { opacity: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: T.videoReveal }}
        className={styles.bgWrap}
      >
        <motion.div
          style={{ y: y1, opacity: scrollOpacity }}
          className={styles.bgParallax}
        >
          {/* One-shot "camera push" lead-in, then the existing slow ambient
              drift loop takes over — two responsibilities, nested so neither
              transform fights the other. */}
          <motion.div
            className={styles.bgPush}
            initial={shouldReduceMotion ? false : { scale: 1.12 }}
            animate={armed ? { scale: 1 } : undefined}
            transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: T.cameraPush }}
          >
            <motion.div
              className={styles.bgDrift}
              animate={shouldReduceMotion ? undefined : { scale: [1, 1.06, 1] }}
              transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/hero/tedx-collage-bg.jpg"
                alt=""
                aria-hidden="true"
                fill
                sizes="100vw"
                priority={false}
                className={styles.bgImage}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scrim for text legibility (DESIGN.md §6) — a flat wash plus the
          directional gradient, since the collage background is busier/higher
          contrast than the prior smooth b-roll video and needs more base
          darkening for the copy to clear ACCESSIBILITY.md §1's contrast bar. */}
      <div className={styles.scrimFlat} />
      <div className={styles.scrimGradient} />

      {/* Ambient light + red glow — the reveal's atmosphere, sitting above the
          scrim so they read clearly rather than being muted by it. Neither is
          the vertical dot/line signature motif; both fold into this one
          orchestrated sequence rather than competing with it. */}
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={armed ? { opacity: 1 } : undefined}
        transition={{ duration: 1.3, ease: EASE_OUT_EXPO, delay: T.ambientLight }}
        style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(250,250,250,0.05), transparent 70%)" }}
        className={styles.glowLayer}
      />
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={armed ? { opacity: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: T.redGlow }}
        style={{ background: "radial-gradient(45% 40% at 50% 55%, rgba(255,68,56,0.14), transparent 70%)" }}
        className={styles.glowLayer}
      />
      {armed && (
        <div className={styles.particlesLayer}>
          <AmbientParticles />
        </div>
      )}

      <div className={styles.container}>
        {/* Single red dot, then the line draws itself from it — the vertical red
            line's origin story, not a separate effect (DESIGN.md §7 secondary motif). */}
        <motion.div
          aria-hidden="true"
          className={styles.dot}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0 }}
          animate={armed ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: T.dot }}
        />
        <motion.div
          className={styles.line}
          initial={shouldReduceMotion ? false : { scaleY: 0 }}
          animate={armed ? { scaleY: 1 } : undefined}
          transition={{ duration: T.lineDuration, ease: EASE_OUT_EXPO, delay: T.lineDelay }}
        />

        <div className={styles.contentInner}>
          {/* Logo mask-reveal + blur-to-sharp resolve — the mark itself is
              animated here under BRANDING.md §6's scoped, documented
              exception (a project-specific override of §5's general rule),
              not a default pattern to reuse elsewhere. */}
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, scale: 0.98, filter: "blur(10px)", clipPath: "inset(0 0 100% 0)" }
            }
            animate={
              armed
                ? { opacity: 1, scale: 1, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }
                : undefined
            }
            transition={{ duration: T.logoDuration + 0.5, ease: EASE_OUT_EXPO, delay: T.logoDelay }}
          >
            <Logo className={styles.logo} />
          </motion.div>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={armed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: T.eyebrow }}
            className={cn("text-eyebrow", styles.eyebrow)}
          >
            {EVENT.name}
          </motion.p>

          {/* Signature revision mark: the draft phrase is struck through, then resolves to
              the real headline (UNFINISHED_THEME.md §3). Skipped under reduced motion so the
              final headline shows immediately — never a half-struck frame (§6). */}
          {!shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={armed ? { opacity: [0, 1, 1, 0] } : undefined}
              transition={{ duration: 1.8, times: [0, 0.22, 0.77, 1], delay: T.draftPhrase }}
            >
              <span className={cn("text-eyebrow", styles.draftPhrase)}>
                A TALK ABOUT PROGRESS
                <motion.span
                  className={styles.draftPhraseStrike}
                  initial={{ scaleX: 0 }}
                  animate={armed ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: T.draftPhrase + 0.8 }}
                />
              </span>
            </motion.div>
          )}

          {/* Real headline — slides up, then decodes from scrambled glyphs to final,
              with a brief in-palette red chromatic ghost as it resolves. One-shot,
              reduced-motion → plain final text (see GlitchText + §6). */}
          <motion.h1
            initial={shouldReduceMotion ? false : { y: "100%" }}
            animate={armed ? { y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: shouldReduceMotion ? 0 : T.headline }}
            className={cn("text-display-xl", styles.headline, styles.heroGlitch)}
          >
            {/* Recurring slice-tear layer — the headline "glitches out" in a short
                burst every few seconds, clean in between (see .heroGlitchGhost). */}
            {!shouldReduceMotion && (
              <span
                aria-hidden="true"
                className={cn(styles.headlineGhost, styles.heroGlitchGhost)}
              >
                {HEADLINE}
              </span>
            )}

            {/* Red chromatic ghost — decorative, aria-hidden; only the ghost jitters,
                never the real headline (keeps the no-shake rule, ANIMATIONS.md §5). */}
            {!shouldReduceMotion && (
              <motion.span
                aria-hidden="true"
                className={styles.headlineChromatic}
                initial={{ opacity: 0, x: 0 }}
                animate={
                  armed
                    ? {
                        opacity: [0, 0.7, 0, 0.5, 0, 0.35, 0],
                        x: [0, -3, 3, -2, 2, -1, 0],
                      }
                    : undefined
                }
                transition={{
                  duration: 0.9,
                  delay: T.headline + 0.1,
                  ease: "linear",
                  times: [0, 0.12, 0.28, 0.45, 0.62, 0.8, 1],
                }}
              >
                {HEADLINE}
              </motion.span>
            )}
            <GlitchText
              text={HEADLINE}
              delay={shouldReduceMotion ? 0 : T.headline * 1000}
              duration={600}
              start={armed}
            />
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={armed ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: shouldReduceMotion ? 0 : T.subtitle }}
            className={cn("text-body-l", styles.subtitle)}
          >
            The work you inherited is not complete. Are you the one to carry it forward?
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={armed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : T.cta }}
            className={styles.ctaRow}
          >
            <Button asChild>
              <Link href="#tickets">Register Now</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="#tedx">Learn More</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Hidden below `sm`: on a compact mobile viewport the headline+CTA stack
          already reaches close to the bottom edge, and this meta line is
          decorative context (repeated in the footer), not essential — a
          deliberate mobile translation, not a stripped-down desktop layout
          (UI_GUIDELINES.md §7). */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={armed ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: shouldReduceMotion ? 0 : T.meta }}
        className={styles.metaLine}
      >
        <p className={cn("text-eyebrow", styles.metaText)}>
          {EVENT.city} · {EVENT.dateLabel} · {EVENT.tedTagline}
        </p>
      </motion.div>

    </section>
  );
}
