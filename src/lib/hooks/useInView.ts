"use client";
import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * True while `ref`'s element intersects the viewport (plus `rootMargin`
 * lookahead). Used to gate expensive always-on work — e.g. a WebGL canvas's
 * render loop — so it only runs for elements actually on screen, instead of
 * every mounted instance regardless of position (the cost of the Speakers
 * marquee's off-screen duplicate cards each running their own <Canvas>).
 */
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = "200px",
): boolean {
  const [inView, setInView] = useState(false);
  const rootMarginRef = useRef(rootMargin);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: rootMarginRef.current },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}
