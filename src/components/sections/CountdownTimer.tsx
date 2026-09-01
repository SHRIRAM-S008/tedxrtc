"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { EVENT } from "@/lib/event";

const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

const UNITS: ReadonlyArray<{ key: keyof ReturnType<typeof useCountdown>; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/**
 * Live countdown to `EVENT.countdownTarget` (doors time). Per DESIGN.md the
 * timer is set in IBM Plex Mono, uppercase, letter-spaced; the single accent
 * is TED red on the seconds digit / colons. Motion follows ANIMATIONS.md §86:
 * a precise, mechanical digit flip on change — `--ease-in-out-quart`,
 * `--dur-base` — not bouncy. Fully static under reduced motion.
 *
 * Renders nothing during SSR / until the client clock is known (`ready`) to
 * avoid a hydration mismatch, and shows a terminal "Live now" state once the
 * target has passed (UNFINISHED_THEME.md §5: dates must always read as
 * accurate and current — never negative numbers).
 */
export function CountdownTimer() {
  const { days, hours, minutes, seconds, ended, ready } = useCountdown(EVENT.countdownTarget);
  const shouldReduceMotion = useReducedMotion();

  if (!ready) {
    // Reserve layout space so the hero doesn't shift when the timer mounts.
    return <div className="h-[4.5rem] sm:h-24" aria-hidden="true" />;
  }

  if (ended) {
    return (
      <div
        className="flex items-center gap-3 font-mono text-eyebrow uppercase tracking-[0.25em] text-[var(--color-red)]"
        aria-label="The event is live now"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-red)] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-red)]" />
        </span>
        Live now
      </div>
    );
  }

  const values: Record<string, number> = { days, hours, minutes, seconds };

  return (
    <div
      className="flex items-end gap-4 font-mono sm:gap-6"
      role="timer"
      aria-live="polite"
      aria-label={`Time until ${EVENT.name}: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
    >
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex items-end gap-4 sm:gap-6">
          <div className="flex flex-col items-center">
            <div className="relative flex h-12 items-center overflow-hidden text-display-m text-white tabular-nums sm:h-16">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={values[unit.key]}
                  initial={shouldReduceMotion ? false : { y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_IN_OUT_QUART }}
                  className="leading-none"
                >
                  {pad(values[unit.key])}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="mt-2 text-eyebrow uppercase tracking-[0.25em] text-[var(--color-gray-500)]">
              {unit.label}
            </span>
          </div>
          {i < UNITS.length - 1 && (
            <span
              aria-hidden="true"
              className="pb-5 text-display-m text-[var(--color-red)] sm:pb-7"
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
