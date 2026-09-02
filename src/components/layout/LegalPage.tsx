import type { ReactNode } from "react";
import { InViewGlitchText } from "@/components/motion/GlitchText";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}

/** Shared editorial shell for text pages (Privacy, Code of Conduct). */
export function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-black)] pt-40 pb-32">
      {/* Ambient background elements — the same connecting-thread vertical line
          used on the dark sections, so legal pages read as part of the same
          authored system instead of a bare, undecorated afterthought. Restrained
          on purpose: legal content stays the visual priority. */}
      <div className="pointer-events-none absolute left-6 top-0 bottom-0 w-[2px] bg-[var(--color-red)] opacity-20 lg:left-16" />
      <div className="pointer-events-none absolute -right-20 top-1/4 h-px w-80 rotate-[25deg] bg-gradient-to-r from-transparent via-[var(--color-red)]/15 to-transparent" />

      <div className="container mx-auto px-6 lg:px-16 relative">
        <div className="flex max-w-3xl flex-col gap-4 pl-8 lg:pl-24">
          <p className="text-eyebrow text-[var(--color-red)]">{eyebrow}</p>
          <h1 className="text-display-l text-white">
            <InViewGlitchText text={title} />
          </h1>
          <p className="text-small text-[var(--color-gray-500)]">Last updated {updated}</p>
        </div>
        <div className="mt-16 flex max-w-3xl flex-col gap-12 pl-8 lg:pl-24">{children}</div>
      </div>
    </section>
  );
}

/** A titled block within a legal page. */
export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-h2 font-heading text-white">{heading}</h2>
      <div className="flex flex-col gap-4 text-body-l text-[var(--color-gray-300)]">{children}</div>
    </div>
  );
}
