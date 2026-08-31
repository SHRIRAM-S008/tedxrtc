# SMOOTH_SCROLL.md — Smooth Scrolling & Scroll-Linked Motion

This file owns the **scroll mechanism itself**: the smooth-scroll library, how it's wired into the page, and how scroll position drives motion. `ANIMATIONS.md` still owns *what* animates and *when* (easing tokens, duration tokens, `whileInView` reveal patterns, micro-interactions) — this file is the layer underneath: the thing that makes scrolling itself feel directed rather than default-browser. Read `ANIMATIONS.md` first; this file assumes its tokens and philosophy.

## 1. Why this exists as its own file

Smooth scroll is one of the fastest ways to make a site feel cinematic — and one of the fastest ways to make it feel like a generic Awwwards-template knockoff if it's sluggish, laggy, or fights the user's input. It also touches performance and accessibility in ways that are easy to get wrong (scroll-jacking, broken keyboard navigation, janky mobile scroll). It gets its own file because it deserves deliberate, isolated decisions rather than being one bullet buried in a longer motion doc.

## 2. Library

Use **Lenis** (`@studio-freight/lenis` / current package `lenis`) as the smooth-scroll engine. It's RAF-driven, framework-agnostic, actively maintained, and is what GSAP itself now recommends pairing with `ScrollTrigger`-style effects — it plays well with Framer Motion's scroll hooks too. Don't reach for Locomotive Scroll (effectively unmaintained) or a hand-rolled `requestAnimationFrame` lerp — Lenis already solves the edge cases (touch, wheel normalization, resize) that a custom implementation tends to get wrong.

> Library APIs shift between versions — treat the config shape below as the pattern to implement, and confirm exact option names against Lenis's current docs at implementation time.

## 3. Setup (Next.js App Router)

Smooth scroll is inherently a client concern — isolate it to a single client provider near the root, not scattered `useEffect` calls per page.

```tsx
// components/motion/SmoothScrollProvider.tsx
"use client";
import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return; // native scroll only — see §7

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out-cubic, close to --ease-out-expo in feel
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // pause the RAF loop when the tab isn't visible — see PERFORMANCE.md
    function handleVisibility() {
      document.hidden ? lenis.stop() : lenis.start();
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}
```

Mount once in `app/layout.tsx`, wrapping `children`, alongside (not inside) any Server Component tree.

## 4. Syncing with Framer Motion

Lenis dispatches through the normal scroll pipeline, so Framer Motion's `useScroll()` generally keeps working against `window` unmodified. For scroll-linked effects that need to read Lenis's own smoothed value directly (e.g., the signature red-beam element from `DESIGN.md` §7), subscribe explicitly rather than assuming — this avoids one frame of lag between "what Lenis has smoothed to" and "what Framer Motion thinks the scroll position is":

```tsx
// lib/hooks/useLenisScrollProgress.ts
"use client";
import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { useLenis } from "lenis/react"; // or read from a shared context if not using the react wrapper

export function useLenisScrollProgress(): MotionValue<number> {
  const progress = useMotionValue(0);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ progress: p }: { progress: number }) => progress.set(p);
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, progress]);

  return progress;
}
```

Feed this `MotionValue` into `useTransform` exactly as you would `useScroll()`'s output — the rest of the pattern matches `ANIMATIONS.md` §4.

## 5. Scroll-linked effect patterns

- **The signature beam/thread (`DESIGN.md` §7):** map the Lenis progress value to the beam's `scaleY`/`pathLength` via `useTransform`. This is the one sanctioned continuous scroll-linked effect — don't add a second competing one elsewhere on the same page (same rule as `ANIMATIONS.md` §4).
- **Parallax:** at most one layer per section (e.g., a hero background image moving slightly slower than foreground text). Never stack parallax on three+ layers in the same viewport — it's the clearest "generated template" tell in scroll motion right now.
- **Section snapping:** not used by default. If a specific section (e.g., a full-bleed speaker "marquee" moment) calls for snap-to-section behavior, implement it as an isolated, explicitly opted-in behavior for that one section only — never as a global site-wide scroll-snap, which frustrates users trying to scroll past it normally and is a common accessibility complaint.
- **Anchor navigation:** nav links that jump to a section (`#speakers`, `#program`) call `lenis.scrollTo(target, { offset: -80, duration: 1.2 })` (offset accounts for the fixed nav height) instead of relying on default browser anchor jump, so the motion stays consistent with the rest of the page's feel.

## 6. Mobile & touch devices

Native momentum scroll on iOS/Android already feels good and is what users expect — a JS-driven smooth-scroll layer on top of it often *adds* perceived lag and battery cost rather than improving feel. Default posture:

- Detect coarse pointer (`window.matchMedia("(pointer: coarse)").matches`) and either **disable Lenis entirely on touch** (simplest, safest) or set a much lighter `touchMultiplier`/shorter `duration` if some smoothing is genuinely wanted.
- This is consistent with `DESIGN.md`'s desktop-first posture: the elaborate scroll-linked motion is a desktop-tier detail; mobile gets a lighter, native-feeling translation, same as type scale and layout do.

```tsx
const isCoarsePointer = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
if (isCoarsePointer) return; // skip Lenis init, fall through to native scroll
```

## 7. Accessibility

- **`prefers-reduced-motion: reduce` disables Lenis entirely** — fall through to native browser scroll, no smoothing, no scroll-linked effects (per the `shouldReduceMotion` guard in §3). This is not a "reduce the duration" case — it's fully off, matching `ANIMATIONS.md` §6 and `ACCESSIBILITY.md` §5.
- **Never scroll-jack.** Lenis smooths scroll, it does not (and must not be configured to) trap the wheel/touch input to force one-section-at-a-time advancement, hold the user in place, or prevent scrolling past a section. If a genuinely pinned/step-through moment is proposed as the signature element, treat it as an accessibility-review-required exception, not a default pattern — it needs full keyboard equivalents (arrow keys/Page Down still work, `Esc`-equivalent to exit) before it ships.
- **Keyboard scrolling must keep working.** Space, Page Up/Down, Home/End, and arrow-key scrolling must still move the page under Lenis — test this explicitly after wiring it up, not just mouse-wheel behavior.
- **Focus-driven scroll must still work.** Tabbing to an off-screen focusable element must scroll it into view correctly under the smoothed scroll — verify this doesn't break with Lenis active, since it's a common regression when a library intercepts native scroll behavior.

## 8. Performance

(Cross-references `PERFORMANCE.md` and `ANIMATIONS.md` §7 — repeated here as it applies specifically to the scroll loop.)

- Pause the Lenis RAF loop on `visibilitychange` (§3) so a backgrounded tab isn't burning cycles.
- Any element read on every scroll tick (for `useTransform` mappings) should only touch `transform`/`opacity` — same GPU-compositing rule as the rest of `ANIMATIONS.md`.
- Destroy the Lenis instance and cancel the RAF loop on unmount — a leaked RAF loop across route changes is a real, easy-to-miss perf bug in this pattern.

## Do / Don't

**Do**
- Isolate Lenis setup to a single client provider mounted once near the root.
- Disable Lenis fully under `prefers-reduced-motion` and on coarse-pointer/touch devices by default.
- Route anchor-link navigation through `lenis.scrollTo` for consistent feel.

**Don't**
- Don't scroll-jack — no wheel-trapping, no forced one-section-per-scroll without a full accessible fallback.
- Don't stack parallax on more than one layer per section.
- Don't leave the RAF loop running when the tab is hidden or the component has unmounted.
