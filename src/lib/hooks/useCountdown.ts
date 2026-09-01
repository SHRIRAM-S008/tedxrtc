"use client";
import { useEffect, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountdownState extends CountdownParts {
  /** True once the target is in the past — callers must not render negatives. */
  ended: boolean;
  /** False during SSR / before the first client tick, to avoid a flash of the
   *  server-rendered (now-based) value differing from the client's clock. */
  ready: boolean;
}

function diff(target: number, now: number): CountdownParts {
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

/**
 * Live countdown to an ISO target. Ticks once per second on the client only;
 * returns `ready: false` until mounted so callers can avoid a hydration
 * mismatch from the server having no wall-clock value (CODE_STYLE.md §2 —
 * no `useEffect` for derivable state; this is a genuine subscription to a
 * non-React system, the timer).
 *
 * Per COMPONENTS.md the event target date is read from `EVENT.countdownTarget`
 * at the call site and passed in, keeping this hook reusable and testable.
 */
export function useCountdown(targetIso: string): CountdownState {
  const target = new Date(targetIso).getTime();
  // Initial state is intentionally zeroed with `ready: false` — the real
  // values are computed in the effect on mount. This avoids calling `Date.now`
  // during render (an impure read) and prevents a server/client hydration
  // mismatch, since the server has no meaningful wall-clock value to show.
  const [state, setState] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
    ready: false,
  });

  useEffect(() => {
    function tick(): void {
      const now = Date.now();
      const parts = diff(target, now);
      setState({ ...parts, ended: now >= target, ready: true });
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return state;
}
