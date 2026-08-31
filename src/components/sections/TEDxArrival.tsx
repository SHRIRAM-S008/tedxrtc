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
 * Chapter 3's arrival — this used to be the page's very first paint (`Hero`);
 * it's now a mid-page chapter reached by scrolling past the Rathinam
 * chapters, so it no longer carries the page's LCP (RathinamHero does), and
 * the whole revision-mark sequence is gated on `isInView` rather than mount.
 * Background is the official TEDx collage artwork (a still image, not the
 * former looping b-roll video) — this is the first place TEDx branding
 * appears on the page, by design (see RathinamHero/RathinamExperience's
 * red-free comments). The sequence itself (timings, beats) is otherwise
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
      className="relative w-full h-[100svh] min-h-[600px] flex items-center bg-[var(--color-black)] overflow-hidden"
    >
      {/* Background: black-to-environment mount reveal (outer), scroll-linked
          parallax/fade (middle), slow ambient drift — a static-camera stand-in for
          "camera movement" (inner). Three responsibilities, three layers, so none
          of the transforms fight each other. */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={armed ? { opacity: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: T.videoReveal }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ y: y1, opacity: scrollOpacity }}
          className="absolute inset-0 bg-[var(--color-gray-950)] -top-[20%] -bottom-[20%]"
        >
          {/* One-shot "camera push" lead-in, then the existing slow ambient
              drift loop takes over — two responsibilities, nested so neither
              transform fights the other. */}
          <motion.div
            className="absolute inset-0"
            initial={shouldReduceMotion ? false : { scale: 1.12 }}
            animate={armed ? { scale: 1 } : undefined}
            transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: T.cameraPush }}
          >
            <motion.div
              className="absolute inset-0"
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
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scrim for text legibility (DESIGN.md §6) — a flat wash plus the
          directional gradient, since the collage background is busier/higher
          contrast than the prior smooth b-roll video and needs more base
          darkening for the copy to clear ACCESSIBILITY.md §1's contrast bar. */}
      <div className="absolute inset-0 bg-[var(--color-black)]/45 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-[var(--color-black)]/70 to-transparent z-10" />

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
        className="pointer-events-none absolute inset-0 z-[15]"
      />
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={armed ? { opacity: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: T.redGlow }}
        style={{ background: "radial-gradient(45% 40% at 50% 55%, rgba(255,68,56,0.14), transparent 70%)" }}
        className="pointer-events-none absolute inset-0 z-[15]"
      />
      {armed && (
        <div className="absolute inset-0 z-[15]">
          <AmbientParticles />
        </div>
      )}

      <div className="container mx-auto px-6 lg:px-16 relative z-20 w-full">
        {/* Single red dot, then the line draws itself from it — the vertical red
            line's origin story, not a separate effect (DESIGN.md §7 secondary motif). */}
        <motion.div
          aria-hidden="true"
          className="absolute left-6 lg:left-16 top-0 z-20 h-[6px] w-[6px] -translate-x-[2px] rounded-full bg-[var(--color-red)]"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0 }}
          animate={armed ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: T.dot }}
        />
        <motion.div
          className="absolute left-6 lg:left-16 top-0 bottom-0 w-[2px] bg-[var(--color-red)] z-20 origin-top"
          initial={shouldReduceMotion ? false : { scaleY: 0 }}
          animate={armed ? { scaleY: 1 } : undefined}
          transition={{ duration: T.lineDuration, ease: EASE_OUT_EXPO, delay: T.lineDelay }}
        />

        <div className="pl-8 lg:pl-24 flex flex-col items-start gap-8 mt-16 md:mt-24">
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
            <Logo className="h-16 md:h-20" />
          </motion.div>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={armed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: T.eyebrow }}
            className="text-eyebrow text-[var(--color-gray-300)]"
          >
            {EVENT.name}
          </motion.p>

          <div className="relative overflow-hidden min-h-[4rem]">
            {/* Signature revision mark: the draft phrase is struck through, then resolves to
                the real headline (UNFINISHED_THEME.md §3). Skipped under reduced motion so the
                final headline shows immediately — never a half-struck frame (§6). */}
            {!shouldReduceMotion && (
              <motion.div
                aria-hidden="true"
                className="absolute top-2 md:top-4 left-0 z-0"
                initial={{ opacity: 0 }}
                animate={armed ? { opacity: [0, 1, 1, 0] } : undefined}
                transition={{ duration: 1.8, times: [0, 0.22, 0.77, 1], delay: T.draftPhrase }}
              >
                <span className="text-eyebrow text-[var(--color-red)] relative inline-block">
                  A TALK ABOUT PROGRESS
                  <motion.span
                    className="absolute top-1/2 -left-2 -right-2 h-[1px] bg-[var(--color-red)] origin-left"
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
              className="hero-glitch text-display-xl text-white max-w-5xl -ml-1 md:-ml-2 relative z-10"
            >
              {/* Recurring slice-tear layer — the headline "glitches out" in a short
                  burst every few seconds, clean in between (see .hero-glitch-ghost). */}
              {!shouldReduceMotion && (
                <span
                  aria-hidden="true"
                  className="hero-glitch-ghost absolute inset-0 text-[var(--color-red)] pointer-events-none select-none"
                >
                  {HEADLINE}
                </span>
              )}

              {/* Red chromatic ghost — decorative, aria-hidden; only the ghost jitters,
                  never the real headline (keeps the no-shake rule, ANIMATIONS.md §5). */}
              {!shouldReduceMotion && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 text-[var(--color-red)] pointer-events-none select-none"
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
                duration={1100}
                start={armed}
              />
            </motion.h1>
          </div>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={armed ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: shouldReduceMotion ? 0 : T.subtitle }}
            className="text-body-l text-[var(--color-gray-100)] max-w-xl"
          >
            The work you inherited is not complete. Are you the one to carry it forward?
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={armed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : T.cta }}
            className="flex flex-wrap items-center gap-4 mt-4"
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
        className="absolute bottom-8 left-6 z-20 hidden sm:block md:left-[120px]"
      >
        <p className="text-eyebrow text-[var(--color-gray-300)]">
          {EVENT.city} · {EVENT.dateLabel} · {EVENT.tedTagline}
        </p>
      </motion.div>

      {/* Scroll indicator — deliberately not a bouncing chevron/mouse icon
          (UI_GUIDELINES.md's Don't list calls that out as a template cliché).
          A thin vertical line with a red segment traveling down it: the same
          line-as-signature-thread language as the rest of the hero, not a new
          motif. Static (no travel) under reduced motion, per ANIMATIONS.md §6.
          Desktop-only — same posture as the other desktop-tier flourishes on
          this site (FloatingGallery's side photos, the Speakers hologram): on
          mobile the CTA-dense hero already implies there's more below, and this
          purely-decorative hint would otherwise sit right on top of the CTAs. */}
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={armed ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: shouldReduceMotion ? 0 : T.scrollHint }}
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="text-eyebrow text-[var(--color-gray-300)]">Scroll</span>
        <div className="relative h-10 w-px overflow-hidden bg-[var(--color-gray-700)]">
          {shouldReduceMotion ? (
            <div className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-red)]" />
          ) : (
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-red)]"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: T.scrollHint }}
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
