"use client";
import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { setLenisInstance } from "@/lib/lenis-instance";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Disable Lenis for reduced motion or coarse pointers (touch devices)
    const isCoarsePointer = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (shouldReduceMotion || isCoarsePointer) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out-cubic
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    // Exposed so the GSAP exception's ScrollTrigger can sync to Lenis's eased
    // scroll (see lib/gsap.ts) — ScrollTrigger's own listener alone can drift
    // out of sync with Lenis's rAF-driven position.
    setLenisInstance(lenis);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    function handleVisibility() {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}
