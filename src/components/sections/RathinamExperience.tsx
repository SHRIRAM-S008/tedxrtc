"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SplitTitle } from "@/components/motion/SplitTitle";
import { campusBeats } from "@/lib/data/campus";
import type { CampusBeat } from "@/types/campus-beat";

function Beat({ beat, index }: { beat: CampusBeat; index: number }) {
  const reversed = index % 2 === 1;
  return (
    <div
      className={`flex flex-col items-center gap-10 lg:gap-16 ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
    >
      <RevealOnScroll>
        <div className="w-full lg:w-[52%]">
          <ImagePlaceholder
            src={beat.imageUrl}
            alt={beat.alt}
            caption={beat.caption}
            aspectRatio="4 / 3"
          />
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1}>
        <div className="flex w-full flex-col gap-4 lg:w-[42%]">
          <div className="flex items-center gap-3">
            <span className="text-eyebrow text-[var(--color-gray-500)]">{beat.number}</span>
            <span className="text-eyebrow text-[var(--color-gray-500)]">{beat.caption}</span>
          </div>
          <p className="text-eyebrow text-[var(--color-gray-500)]">{beat.question}</p>
          <h3 className="text-display-m font-heading text-white">{beat.heading}</h3>
        </div>
      </RevealOnScroll>
    </div>
  );
}

/**
 * Chapter 2 — the campus's own story, on its own terms. "Fullscreen Story"
 * layout: alternating photo/type beats, one section-scoped scroll progress
 * rail (this section's one signature scroll device, distinct from the
 * vertical dot/line reserved for the TEDx chapter). Stays TEDx-free/red-free
 * on its own — unlike RathinamHero, which now opens with the official logo
 * (BRANDING.md §6's note on that section's later, explicit change).
 */
export function RathinamExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.8", "end 0.3"] });
  const progress = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0, 1]);

  return (
    <section
      id="campus"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-black)] py-24 lg:py-40"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--color-gray-700)]">
        <motion.div
          aria-hidden="true"
          className="h-full origin-left bg-[var(--color-gray-300)]"
          style={{ scaleX: progress }}
        />
      </div>

      <div className="container mx-auto flex flex-col gap-20 px-6 lg:gap-32 lg:px-16">
        <div className="max-w-2xl">
          <p className="mb-4 text-eyebrow text-[var(--color-gray-500)]">The Rathinam Experience</p>
          <SplitTitle
            as="h2"
            text="A place that builds people before it builds anything else."
            className="text-display-l text-white"
          />
        </div>

        <div className="flex flex-col gap-24 lg:gap-36">
          {campusBeats.map((beat, i) => (
            <Beat key={beat.id} beat={beat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
