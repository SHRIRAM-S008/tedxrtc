import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /** Omit until real photography/video is dropped into public/images. */
  src?: string;
  alt: string;
  /** Shown only in the placeholder state, set in Fraunces (DESIGN.md §6). */
  caption: string;
  aspectRatio?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** CSS object-position to reframe the image within its crop. */
  objectPosition?: string;
}

/**
 * DESIGN.md §6's placeholder rule as a reusable primitive: a solid frame with
 * the subject named in Fraunces, never a stock photo or gray silhouette icon.
 * Swapping in the real asset later is a one-line `src` edit at the data-file
 * call site (WORKFLOW.md §4), not a component change.
 */
export function ImagePlaceholder({
  src,
  alt,
  caption,
  aspectRatio = "4 / 3",
  sizes = "(max-width: 768px) 90vw, 45vw",
  className,
  priority,
  objectPosition,
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-[2px]", className)}
        style={{ aspectRatio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden rounded-[2px] border border-[var(--color-gray-700)] bg-[var(--color-gray-950)] p-6",
        className,
      )}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt}
    >
      <span
        aria-hidden="true"
        className="absolute left-6 top-6 h-1.5 w-1.5 rounded-full bg-[var(--color-red)]"
      />
      <p className="text-h3 font-heading text-[var(--color-gray-500)]">{caption}</p>
    </div>
  );
}
