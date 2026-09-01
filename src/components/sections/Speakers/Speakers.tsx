"use client";
import { useState } from "react";
import { useCanRender3D } from "@/lib/hooks/useCanRender3D";
import { SpeakersFallbackBackground } from "../SpeakersFallbackBackground";
import { SpeakerCardGrid } from "../SpeakerCardGrid";
import { Toast } from "@/components/ui/Toast";
import styles from "./Speakers.module.css";

/**
 * "The Unwritten Voices" — nine mystery slots, no hero copy and no single
 * centerpiece model above them (both removed per explicit direction; this
 * used to open with a hero headline + a large hologram/figure, see git
 * history). The section now transitions straight into the grid — each card
 * carries its own instance of the figure (SpeakerCardFigure.tsx, rim-lit and
 * silhouetted, not fully lit) instead. No name/bio/company ever renders here
 * (TEDX_RULES.md §4, WORKFLOW.md §5) — the lineup isn't announced yet.
 */
export function Speakers() {
  const canRender3D = useCanRender3D();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function handleReveal() {
    setToastMessage("Speaker reveal coming soon.");
    window.setTimeout(() => setToastMessage(null), 2500);
  }

  return (
    <section
      id="speakers"
      className={styles.section}
    >
      {/* Ambient backdrop kept for atmosphere regardless of 3D capability —
          previously the non-3D fallback only; there's no 3D hero layer to
          fall back from anymore, so this now always renders. */}
      <SpeakersFallbackBackground />

      {/* Visually hidden — "no large typography" per the brief, but the
          section still needs a heading for screen-reader navigation
          (ACCESSIBILITY.md §4: real semantic structure, not decorative-only). */}
      <h2 className={styles.srOnly}>Speakers — lineup yet to be revealed</h2>

      <SpeakerCardGrid onReveal={handleReveal} canRender3D={canRender3D} />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </section>
  );
}
