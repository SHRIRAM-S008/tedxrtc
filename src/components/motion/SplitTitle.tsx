"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTitleProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Chapter-heading reveal — the site's scoped GSAP SplitText use (CLAUDE.md's
 * exception). Renders plain text synchronously (SSR-safe, no-JS safe, no LCP
 * risk); only once mounted does GSAP split it into lines and reveal them on
 * scroll. Reduced motion, a slow JS load, or the heading already having
 * scrolled past its trigger point all fall back to the plain text as-is —
 * never a hidden-then-flashed frame.
 */
export function SplitTitle({ text, as = "h2", className }: SplitTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const Tag = as;

  useEffect(() => {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;

    // If the heading is already past its reveal point by the time this runs
    // (slow hydration, scroll restoration), leave the plain text untouched
    // rather than hiding it and risking a stuck or flashed state.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.15) return;

    let cancelled = false;
    let split: InstanceType<typeof import("gsap/SplitText").SplitText> | undefined;
    let trigger: ReturnType<typeof import("gsap/ScrollTrigger").ScrollTrigger.create> | undefined;

    import("@/lib/gsap").then(({ gsap, SplitText, ScrollTrigger, ensureGsapRegistered }) => {
      if (cancelled || !ref.current) return;
      ensureGsapRegistered();

      split = new SplitText(ref.current, { type: "lines", mask: "lines" });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });

      trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(split!.lines, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "expo.out",
          });
        },
      });
    });

    return () => {
      cancelled = true;
      trigger?.kill();
      split?.revert();
    };
  }, [shouldReduceMotion]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {text}
    </Tag>
  );
}
