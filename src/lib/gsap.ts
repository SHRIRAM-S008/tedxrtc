"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { getLenisInstance } from "@/lib/lenis-instance";

/**
 * Single registration point for the site's scoped GSAP exception (CLAUDE.md's
 * ScrollTrigger/SplitText carve-out). Only ever reached through a
 * `next/dynamic({ ssr: false })` boundary from EventInformation or SplitTitle —
 * importing gsap here does not put it in the initial bundle.
 */
let pluginsRegistered = false;
let lenisWired = false;

export function ensureGsapRegistered() {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    pluginsRegistered = true;
  }
  // Without this, ScrollTrigger's trigger-position cache can drift out of
  // sync with Lenis's eased scroll (SMOOTH_SCROLL.md's Lenis setup) — most
  // visible on a pinned/scrubbed section, where a stale cache means content
  // never crosses its trigger point and stays hidden.
  if (!lenisWired) {
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      lenisWired = true;
    }
  }
}

export { gsap, ScrollTrigger, SplitText };
