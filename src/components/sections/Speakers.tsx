"use client";
import dynamic from "next/dynamic";
import { Suspense, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useCanRender3D } from "@/lib/hooks/useCanRender3D";
import { SpeakersFallbackBackground } from "./SpeakersFallbackBackground";
import { SpeakersText } from "./SpeakersText";

// R3F/Three.js never ship to the initial bundle — only fetched if useCanRender3D
// says yes, and only once the section is actually rendered (CLAUDE.md's scoped
// 3D exception: lazy-loaded, code-split, with a real fallback).
const SpeakerHologram = dynamic(
  () => import("@/components/three/SpeakerHologram").then((m) => m.SpeakerHologram),
  { ssr: false, loading: () => null },
);

/**
 * "Voices of The Unfinished" interlude. The lineup isn't announced yet, so this
 * says so plainly and dramatically rather than papering over it with placeholder
 * cards (TEDX_RULES.md §4, WORKFLOW.md §5). Background layer is either the 3D
 * hologram (desktop, capable devices) or the original CSS treatment (everyone
 * else) — the text layer on top is the exact same component either way.
 */
export function Speakers() {
  const canRender3D = useCanRender3D();
  const [sectionInView, setSectionInView] = useState(false);
  const handleTextInView = useCallback((v: boolean) => setSectionInView(v), []);

  return (
    <section
      id="speakers"
      className="relative overflow-hidden border-t border-[var(--color-gray-700)] bg-[var(--color-black)] py-32 md:py-44"
    >
      {canRender3D ? (
        // Only mounted once the section has actually scrolled into view — no
        // WebGL render loop spinning for an off-screen canvas.
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
    </section>
  );
}
