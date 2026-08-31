import type Lenis from "lenis";

/**
 * Small shared handle to the single Lenis instance SmoothScrollProvider
 * creates. Exists so the GSAP exception's ScrollTrigger (registered lazily,
 * see lib/gsap.ts) can sync to Lenis's eased scroll position without
 * SmoothScrollProvider ever importing gsap itself (that would put it in the
 * initial bundle for every page, defeating the exception's lazy-load rule).
 */
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenisInstance() {
  return instance;
}
