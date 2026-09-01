"use client";
import { useRef, type PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { AmbientParticles } from "@/components/motion/AmbientParticles";
import { Logo } from "@/components/layout/Logo";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// The logo's own cinematic reveal runs first; the container's delayChildren
// starts the headline/paragraph only once it has settled (~1.75s), matching
// "the logo leads the story, the headline follows it."
const LOGO_T = {
  sweep: 0.5,
  reveal: 0.7,
  revealDuration: 1.05,
};
const CONTENT_DELAY = 1.95;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: CONTENT_DELAY } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

const lineWrap = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
// Focus-pull reveal — the headline resolves from soft/enlarged to sharp, like
// a camera racking focus, rather than the mask-wipe slide TEDxArrival already
// owns (a deliberate, section-specific variation, not a repeated pattern).
// filter/scale are fine here since this is a one-shot load animation, not a
// scroll-linked or frequently-retriggered one (ANIMATIONS.md §7's guardrail
// targets the latter).
const line = {
  hidden: { opacity: 0, scale: 1.06, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE_OUT_EXPO },
  },
};

/**
 * Chapter 1 — establishes the campus, now introduced by the official logo as
 * an editorial brand mark (a later, explicit decision that supersedes this
 * section's original TEDx-free design — see BRANDING.md §6's note on
 * `RathinamHero`).
 */
export function RathinamHero() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 160]);
  const bgOpacity = useTransform(scrollY, [0, 500], [1, shouldReduceMotion ? 1 : 0.4]);
  // Depth cue tied to the same scroll value as bgY — the vignette deepens as
  // you scroll rather than moving independently, so this reads as one
  // scroll-linked device with two effects, not a second parallax layer
  // (ANIMATIONS.md §4 explicitly flags stacked independent parallax layers).
  const vignetteOpacity = useTransform(scrollY, [0, 600], [0.35, shouldReduceMotion ? 0.35 : 0.85]);

  // Hero logo → navbar logo handoff (BRANDING.md §6): this logo fades/shrinks
  // out over the same scroll range Navbar's logo fades in over (see
  // Navbar.tsx's matching [150, 450] range) — two independent elements
  // cross-dissolving on a coordinated schedule, approximating one continuous
  // handoff rather than an abrupt swap.
  const heroLogoOpacity = useTransform(scrollY, [0, 300], [1, shouldReduceMotion ? 1 : 0]);
  const heroLogoScale = useTransform(scrollY, [0, 300], [1, shouldReduceMotion ? 1 : 0.85]);

  // Ambient cursor-light + logo parallax — desktop only, removed entirely
  // under reduced motion rather than left static (ANIMATIONS.md §6).
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(35);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(640px circle at ${springX}% ${springY}%, rgba(250,250,250,0.06), transparent 60%)`;
  // Deliberately tiny amplitude ("almost invisible") — position/depth only,
  // never rotation or tilt (BRANDING.md §6).
  const logoParallaxX = useTransform(springX, [0, 100], [-6, 6]);
  const logoParallaxY = useTransform(springY, [0, 100], [-4, 4]);

  function handlePointerMove(e: PointerEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={shouldReduceMotion ? undefined : handlePointerMove}
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[var(--color-black)]"
    >
      <motion.div style={{ y: bgY, opacity: bgOpacity }} className="absolute inset-0">
        <ImagePlaceholder
          src="/images/hero/rathinam-hero-bg.jpg"
          alt=""
          caption="Campus footage"
          aspectRatio="auto"
          sizes="100vw"
          priority
          className="h-full w-full rounded-none border-0"
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        style={{
          opacity: vignetteOpacity,
          background:
            "radial-gradient(120% 90% at 50% 35%, transparent 35%, rgba(10,10,10,0.95) 100%)",
        }}
        className="pointer-events-none absolute inset-0 z-10"
      />

      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          style={{ background: glow }}
          className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
        />
      )}

      {/* Scrim for text legibility (DESIGN.md §6) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--color-black)] via-[var(--color-black)]/70 to-[var(--color-black)]/20" />

      <motion.div
        variants={container}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        className="relative z-20 flex h-full w-full flex-col justify-end"
      >
        <div className="container mx-auto flex w-full flex-col gap-10 px-6 pb-16 md:gap-12 md:pb-24 lg:px-16">
          {/* Logo — the hero's primary brand mark, not a nav-scale afterthought.
              Generous space below it before the headline begins (luxury
              masthead, not a compressed header). */}
          <div className="relative mb-2 flex w-[220px] items-center justify-center overflow-hidden sm:w-[260px] lg:w-[320px] md:mb-4">
            {/* Thin red light sweep — one-shot, not the reserved dot/line motif */}
            {!shouldReduceMotion && (
              <motion.div
                aria-hidden="true"
                initial={{ x: "-120%", opacity: 0 }}
                animate={{ x: "220%", opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: LOGO_T.sweep }}
                style={{
                  background:
                    "linear-gradient(100deg, transparent 42%, rgba(230,43,30,0.55) 50%, transparent 58%)",
                }}
                className="pointer-events-none absolute -inset-y-10 left-0 w-1/3"
              />
            )}
            <AmbientParticles />

            {/* Scroll-tied fade/shrink toward the navbar handoff */}
            <motion.div style={{ opacity: heroLogoOpacity, scale: heroLogoScale }} className="relative w-full">
              {/* Horizontal mask-reveal + blur-to-sharp + gentle scale (BRANDING.md §6) */}
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, scale: 0.97, filter: "blur(14px)", clipPath: "inset(0 100% 0 0)" }
                }
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: LOGO_T.revealDuration, ease: EASE_OUT_EXPO, delay: LOGO_T.reveal }}
              >
                {/* Cursor parallax — position only, never rotation/tilt */}
                <motion.div style={!shouldReduceMotion ? { x: logoParallaxX, y: logoParallaxY } : undefined}>
                  <Logo className="h-auto w-full" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <div className="max-w-4xl">
            <motion.div
              variants={shouldReduceMotion ? undefined : lineWrap}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
            >
              {["Where Ideas", "Become Reality"].map((text) => (
                <motion.h1
                  key={text}
                  variants={shouldReduceMotion ? undefined : line}
                  className="text-display-xl text-white"
                >
                  {text}
                </motion.h1>
              ))}
            </motion.div>
          </div>

          <motion.p variants={item} className="max-w-md text-body-l text-[var(--color-gray-100)]">
            A campus built for creators, innovators, and future leaders.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        variants={item}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="text-eyebrow text-[var(--color-gray-300)]">Scroll</span>
        <div className="relative h-10 w-px overflow-hidden bg-[var(--color-gray-700)]">
          {shouldReduceMotion ? (
            <div className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-gray-300)]" />
          ) : (
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-gray-300)]"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
