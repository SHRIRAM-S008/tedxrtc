"use client";
import type { CSSProperties } from "react";
import { SpeakerCard } from "./SpeakerCard";
import { speakerSlots } from "@/lib/data/speaker-slots";

interface SpeakerCardGridProps {
  onReveal: () => void;
}

// Named grid areas leave the center cell empty so the 3D model/fallback
// ambience behind this layer shows through — matches the brief's diagram
// exactly (8 cards ringing the center, a 9th centered below).
const GRID_AREAS = ["t1", "t2", "t3", "m1", "m2", "b1", "b2", "b3"] as const;
const gridStyle: CSSProperties = {
  gridTemplateAreas: `"t1 t2 t3" "m1 . m2" "b1 b2 b3"`,
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gridTemplateRows: "repeat(3, minmax(0, 1fr))",
};

/**
 * Desktop/tablet: 3x3 grid, center cell empty. Mobile: single-column
 * swipeable strip, reusing the exact pattern already built for
 * FloatingGallery's mobile fallback rather than a new scroller
 * (COMPONENTS.md's "compose primitives" rule).
 */
export function SpeakerCardGrid({ onReveal }: SpeakerCardGridProps) {
  const ringCards = speakerSlots.slice(0, 8);
  const finalCard = speakerSlots[8];

  return (
    <div className="relative z-10 mx-auto mt-16 w-full max-w-3xl px-6 lg:px-0">
      {/* Desktop/tablet grid */}
      <div className="hidden gap-6 md:grid" style={gridStyle}>
        {ringCards.map((slot, i) => (
          <div key={slot.id} style={{ gridArea: GRID_AREAS[i] }}>
            <SpeakerCard slot={slot} onReveal={onReveal} />
          </div>
        ))}
      </div>
      {finalCard && (
        <div className="mx-auto mt-6 hidden w-full max-w-[calc((100%-3rem)/3)] md:block">
          <SpeakerCard slot={finalCard} onReveal={onReveal} />
        </div>
      )}

      {/* Mobile: swipeable strip (same technique as FloatingGallery.tsx) */}
      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {speakerSlots.map((slot) => (
          <div key={slot.id} className="w-[62%] shrink-0 snap-center">
            <SpeakerCard slot={slot} onReveal={onReveal} />
          </div>
        ))}
      </div>
    </div>
  );
}
