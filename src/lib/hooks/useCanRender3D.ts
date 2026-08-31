"use client";
import { useEffect, useState } from "react";

/**
 * Gate for the site's one scoped 3D moment (CLAUDE.md's Three.js exception).
 * Returns `null` until checked (render the CSS fallback while unknown — never
 * guess 3D first and yank it away), then a boolean.
 *
 * Deliberately conservative: below the `lg` breakpoint this is always `false`.
 * The 3D hologram is a desktop-tier flourish, same posture as the floating
 * photo gallery in About — mobile gets the guaranteed-fast, always-correct
 * fallback, no exceptions (PERFORMANCE.md's mobile budgets are non-negotiable
 * for TEDxRTC's actual audience).
 */
export function useCanRender3D(): boolean | null {
  const [can, setCan] = useState<boolean | null>(null);

  useEffect(() => {
    function detect(): boolean {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      if (window.innerWidth < 1024) return false;
      const cores = navigator.hardwareConcurrency ?? 8;
      if (cores < 4) return false;
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        return !!gl;
      } catch {
        return false;
      }
    }
    // A one-time client-only capability check (window/navigator/WebGL aren't
    // available during SSR), not a subscription — the standard, sanctioned
    // shape for "detect on mount, then render conditionally."
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCan(detect());
  }, []);

  return can;
}
