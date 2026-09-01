"use client";
import dynamic from "next/dynamic";
import { Suspense, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useCanRender3D } from "@/lib/hooks/useCanRender3D";
import { SpeakersFallbackBackground } from "./SpeakersFallbackBackground";
import { SpeakersText } from "./SpeakersText";
import { SpeakerCardGrid } from "./SpeakerCardGrid";
import { Toast } from "@/components/ui/Toast";

// R3F/Three.js never ship to the initial bundle — only fetched if useCanRender3D
// says yes, and only once the section is actually rendered (CLAUDE.md's scoped
// 3D exception: lazy-loaded, code-split, with a real fallback).
const SpeakerHologram = dynamic(
  () => import("@/components/three/SpeakerHologram").then((m) => m.SpeakerHologram),
  { ssr: false, loading: () => null },
);

/**
 * "The Unwritten Voices" — nine mystery slots around the site's one signature
 * 3D moment. The lineup isn't announced yet, so no name/bio/company ever
 * renders here (TEDX_RULES.md §4, WORKFLOW.md §5); the silhouette cards and
 * the figure carry the mystery instead of fabricated placeholder people.
 * Background layer is either the 3D hologram (desktop, capable devices) or
 * the original CSS treatment (everyone else) — the text and card layers on
 * top are the exact same components either way (SpeakerCard is plain HTML,
 * not WebGL, so it never depends on canRender3D).
 */
export function Speakers() {
  const canRender3D = useCanRender3D();
  const [sectionInView, setSectionInView] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const handleTextInView = useCallback((v: boolean) => setSectionInView(v), []);

  function handleReveal() {
    setToastMessage("Speaker reveal coming soon.");
    window.setTimeout(() => setToastMessage(null), 2500);
  }

  return (
    <section
      id="speakers"
      className="relative overflow-hidden border-t border-[var(--color-gray-700)] bg-[var(--color-black)] pb-32 md:pb-44"
    >
      {/* Constrained to one viewport height — same sizing convention as
          RathinamHero/TEDxArrival. Without this, the canvas would stretch to
          the whole (much taller, now that the card grid is below) section,
          and the camera's fixed framing would render the model tiny against
          a huge canvas instead of as a proper centerpiece. */}
      <div className="relative flex h-[100svh] min-h-[600px] w-full items-center justify-center">
        {canRender3D ? (
          // Only mounted once the section has actually scrolled into view —
          // no WebGL render loop spinning for an off-screen canvas.
          sectionInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <SpeakerHologram />
              </Suspense>
            </motion.div>
          )
        ) : (
          <SpeakersFallbackBackground />
        )}

        {/* Scrim behind the text — the hologram's wireframe/beam can run bright
            right where the headline sits; same "always pair imagery with a scrim
            for text legibility" rule the Hero's video already follows (DESIGN.md §6). */}
        {canRender3D && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_45%,rgba(10,10,10,0.82),transparent_75%)]" />
        )}

        <SpeakersText onInViewChange={handleTextInView} />
      </div>

      <SpeakerCardGrid onReveal={handleReveal} />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </section>
  );
}
