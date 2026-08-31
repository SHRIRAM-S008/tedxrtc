import Image from "next/image";
import { cn } from "@/lib/utils";
import { EVENT } from "@/lib/event";

interface LogoProps {
  className?: string;
}

const LOCKUP_SRC = "/images/brand/tedx-rtc-lockup-white.png";
const LOCKUP_WIDTH = 2425;
const LOCKUP_HEIGHT = 962;

/**
 * The official TEDxRathinam Technical Campus lockup — the site's one and
 * only logo asset (BRANDING.md §6). Real intrinsic dimensions + `h-auto
 * w-auto` mean callers only ever set a height class; width follows the
 * source aspect ratio automatically, so it can never be stretched or
 * distorted at any breakpoint. Motion is applied by wrapping call sites in
 * `motion` elements (TEDxArrival, Navbar, Finale) per BRANDING.md §6's
 * scoped exception — this component itself stays a plain, reusable image.
 */
export function Logo({ className }: LogoProps) {
  return (
    <Image
      src={LOCKUP_SRC}
      alt={EVENT.name}
      width={LOCKUP_WIDTH}
      height={LOCKUP_HEIGHT}
      className={cn("h-auto w-auto", className)}
    />
  );
}
