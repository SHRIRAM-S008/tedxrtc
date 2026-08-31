import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Runs the track top-to-bottom instead of left-to-right. */
  vertical?: boolean;
  /** Pauses the animation on hover/focus. */
  pauseOnHover?: boolean;
  /** Reverses scroll direction. */
  reverse?: boolean;
  /** Number of track copies rendered side-by-side for a seamless loop. */
  repeat?: number;
}

/**
 * Infinite scrolling track — content-agnostic, no color/typography opinions of
 * its own (belongs in ui/ per COMPONENTS.md §1). Duration/gap are consumed via
 * the `--duration`/`--gap` CSS custom properties (set with a className like
 * `[--duration:30s]` or `[--gap:1.5rem]` at the call site) and drive the
 * `marquee`/`marquee-vertical` keyframes defined in globals.css.
 */
export function Marquee({
  className,
  vertical = false,
  pauseOnHover = false,
  reverse = false,
  repeat = 4,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [gap:var(--gap,1rem)]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn("flex shrink-0 justify-around [gap:var(--gap,1rem)]", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
