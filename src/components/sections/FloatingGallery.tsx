"use client";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

/**
 * TEDxGateway-style intro: event photos float along both side margins and drift
 * with scroll parallax, framing centered copy. Photos are colour-graded to hold
 * red and mute the rest (DESIGN.md §6). Parallax is disabled under reduced motion
 * (ANIMATIONS.md §6); the side floats are decorative and hidden on small screens,
 * where the photos fall back to a simple strip.
 *
 * Where a photo currently overlaps the text, that patch of text renders in red —
 * a masked red duplicate of the copy, clipped live to the intersection of each
 * photo's on-screen rect with the text block. Recomputed on scroll (geometry
 * changes as the photos parallax past the text) and on resize.
 */
interface FloatItem {
  src: string;
  alt: string;
  pos: string; // absolute placement classes
  width: string; // width class
  rot: string; // rotation class
  speed: "a" | "b" | "c";
}

const leftPhotos: FloatItem[] = [
  { src: "/images/gallery/g1.jpg", alt: "A TEDxRTC speaker during an interview", pos: "top-[3%] left-[6%]", width: "w-[80%]", rot: "-rotate-3", speed: "a" },
  { src: "/images/gallery/g2.jpg", alt: "A TEDxRTC participant sharing her idea", pos: "top-[40%] left-[0%]", width: "w-[92%]", rot: "rotate-2", speed: "b" },
  { src: "/images/gallery/g3.jpg", alt: "A TEDxRTC participant on the interview set", pos: "top-[73%] left-[12%]", width: "w-[72%]", rot: "-rotate-1", speed: "c" },
];

const rightPhotos: FloatItem[] = [
  { src: "/images/gallery/g4.jpg", alt: "A TEDxRTC speaker mid-conversation", pos: "top-[9%] right-[6%]", width: "w-[84%]", rot: "rotate-3", speed: "b" },
  { src: "/images/gallery/g5.jpg", alt: "A TEDxRTC participant during filming", pos: "top-[44%] right-[13%]", width: "w-[70%]", rot: "-rotate-2", speed: "c" },
  { src: "/images/gallery/g6.jpg", alt: "A TEDxRTC participant under studio lighting", pos: "top-[75%] right-[2%]", width: "w-[88%]", rot: "rotate-1", speed: "a" },
];

const allPhotos = [...leftPhotos, ...rightPhotos];

function Frame({ src, alt }: { src: string; alt: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[2px] border border-[var(--color-gray-700)] shadow-[0_18px_40px_rgba(0,0,0,0.6)]">
      <Image src={src} alt={alt} fill sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 22vw" className="object-cover" />

      {/* One-shot glitch on scroll-in: a red chromatic flash + an offset slice-tear of
          the same frame, resolving to clean. In-palette (red only) and skipped under
          reduced motion, matching the hero's glitch language (ANIMATIONS.md §5–6). */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-cover bg-center mix-blend-screen"
            style={{ backgroundImage: `url(${src})` }}
            initial={{ opacity: 0, x: 0 }}
            whileInView={{
              opacity: [0, 0.9, 0, 0.7, 0],
              x: [0, -10, 7, -4, 0],
              clipPath: [
                "inset(0 0 0 0)",
                "inset(14% 0 66% 0)",
                "inset(72% 0 8% 0)",
                "inset(44% 0 40% 0)",
                "inset(0 0 100% 0)",
              ],
            }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, times: [0, 0.2, 0.45, 0.7, 1] }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[var(--color-red)] mix-blend-screen"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0, 0.45, 0, 0.25, 0] }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, times: [0, 0.12, 0.35, 0.6, 1], delay: 0.04 }}
          />
        </>
      )}

      {/* Subtle static scanlines for digital texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.7) 0px, rgba(0,0,0,0.7) 1px, transparent 1px, transparent 3px)" }}
      />
    </div>
  );
}

export function FloatingGallery({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const redContentRef = useRef<HTMLDivElement>(null);
  const photoElsRef = useRef<Map<string, HTMLElement>>(new Map());
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const speedA = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [90, -90]);
  const speedB = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-70, 70]);
  const speedC = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [140, -140]);
  const speeds: Record<FloatItem["speed"], MotionValue<number>> = {
    a: speedA,
    b: speedB,
    c: speedC,
  };

  const registerPhoto = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      if (el) photoElsRef.current.set(key, el);
      else photoElsRef.current.delete(key);
    },
    [],
  );

  // Recomputes which parts of the text each photo currently overlaps and masks
  // the red duplicate layer to exactly those regions (a union of rectangles —
  // one CSS mask layer per overlapping photo, composited via the default "add").
  const recomputeOverlap = useCallback(() => {
    const contentEl = contentRef.current;
    const redEl = redContentRef.current;
    if (!contentEl || !redEl) return;

    const contentRect = contentEl.getBoundingClientRect();
    const layers: { size: string; pos: string }[] = [];

    photoElsRef.current.forEach((photoEl) => {
      const r = photoEl.getBoundingClientRect();
      const left = Math.max(r.left, contentRect.left);
      const right = Math.min(r.right, contentRect.right);
      const top = Math.max(r.top, contentRect.top);
      const bottom = Math.min(r.bottom, contentRect.bottom);
      const w = right - left;
      const h = bottom - top;
      if (w > 0 && h > 0) {
        layers.push({ size: `${w}px ${h}px`, pos: `${left - contentRect.left}px ${top - contentRect.top}px` });
      }
    });

    if (layers.length === 0) {
      redEl.style.opacity = "0";
      return;
    }

    redEl.style.opacity = "1";
    const grad = layers.map(() => "linear-gradient(#000,#000)").join(", ");
    const size = layers.map((l) => l.size).join(", ");
    const pos = layers.map((l) => l.pos).join(", ");
    redEl.style.setProperty("mask-image", grad);
    redEl.style.setProperty("-webkit-mask-image", grad);
    redEl.style.setProperty("mask-size", size);
    redEl.style.setProperty("-webkit-mask-size", size);
    redEl.style.setProperty("mask-position", pos);
    redEl.style.setProperty("-webkit-mask-position", pos);
    redEl.style.setProperty("mask-repeat", "no-repeat");
    redEl.style.setProperty("-webkit-mask-repeat", "no-repeat");
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    recomputeOverlap();
    window.addEventListener("resize", recomputeOverlap);
    return () => window.removeEventListener("resize", recomputeOverlap);
  }, [shouldReduceMotion, recomputeOverlap]);

  useMotionValueEvent(scrollYProgress, "change", () => {
    if (!shouldReduceMotion) recomputeOverlap();
  });

  const renderColumn = (photos: FloatItem[]) =>
    photos.map((p) => (
      <motion.figure
        key={p.src}
        ref={registerPhoto(p.src)}
        style={{ y: speeds[p.speed] }}
        className={`absolute ${p.pos} ${p.width} ${p.rot}`}
      >
        <Frame src={p.src} alt={p.alt} />
      </motion.figure>
    ));

  return (
    <div ref={ref} className="relative">
      {/* Floating side photos (desktop) */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[24%] lg:block xl:w-[26%]">
        {renderColumn(leftPhotos)}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[24%] lg:block xl:w-[26%]">
        {renderColumn(rightPhotos)}
      </div>

      {/* Centered copy */}
      <div className="relative z-10 mx-auto max-w-2xl">
        <div ref={contentRef} className="relative">
          {children}

          {/* Red duplicate, masked to whatever a photo currently overlaps. Decorative
              only — aria-hidden, since the base layer above already carries the
              accessible text. */}
          {!shouldReduceMotion && (
            <div
              ref={redContentRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 [&_*]:!text-[var(--color-red)]"
            >
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: swipeable photo strip (the side floats are desktop-only) */}
      <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {allPhotos.map((p) => (
          <div key={`m-${p.src}`} className="w-[78%] shrink-0 snap-center sm:w-[46%]">
            <Frame src={p.src} alt={p.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}
