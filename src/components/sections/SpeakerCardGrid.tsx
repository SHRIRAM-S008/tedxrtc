"use client";
import { SpeakerCard } from "./SpeakerCard";
import { speakerSlots } from "@/lib/data/speaker-slots";

interface SpeakerCardGridProps {
  onReveal: () => void;
  canRender3D: boolean | null;
}

/**
 * A clean, uniform grid — no center cell to leave open now that there's no
 * hero centerpiece. 3 columns desktop, 2 tablet, 1 mobile; array order is
 * both the DOM order and the reveal-stagger order (SpeakerCard.tsx).
 */
export function SpeakerCardGrid({ onReveal, canRender3D }: SpeakerCardGridProps) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
        {speakerSlots.map((slot, index) => (
          <SpeakerCard key={slot.id} slot={slot} index={index} onReveal={onReveal} canRender3D={canRender3D} />
        ))}
      </div>
    </div>
  );
}
