"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SplitTitle } from "@/components/motion/SplitTitle";
import { RegisterForm } from "./RegisterForm";
import { EVENT } from "@/lib/event";
import { venue } from "@/lib/data/venue";
import { schedule } from "@/lib/data/schedule";
import { partners } from "@/lib/data/partners";
import { cn } from "@/lib/utils";

interface Chapter {
  id: string;
  number: string;
  eyebrow: string;
  heading: string;
  body: React.ReactNode;
}

const chapters: Chapter[] = [
  {
    id: "venue",
    number: "01",
    eyebrow: "Venue",
    heading: venue.name,
    body: (
      <>
        <p className="text-body-l text-[var(--color-gray-100)]">
          {venue.area}, {venue.city}
          <br />
          {venue.region}
        </p>
        <p className="mt-4 text-body text-[var(--color-gray-300)]">{venue.gettingThere}</p>
        <p className="mt-4 text-eyebrow text-[var(--color-gray-500)]">{venue.doorsLabel}</p>
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-body text-white underline decoration-[var(--color-gray-700)] underline-offset-4 transition-colors hover:text-[var(--color-red)] hover:decoration-[var(--color-red)] focus-visible"
        >
          Open in Maps →
        </a>
      </>
    ),
  },
  {
    id: "schedule",
    number: "02",
    eyebrow: "Schedule",
    heading: schedule.length > 0 ? "The running order" : "Full schedule to be announced",
    body:
      schedule.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {schedule.map((entry) => (
            <li key={entry.id} className="flex gap-6 border-b border-[var(--color-gray-700)] pb-4">
              <span className="text-eyebrow w-20 shrink-0 text-[var(--color-red)]">{entry.time}</span>
              <span className="text-body text-[var(--color-gray-100)]">{entry.title}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body-l text-[var(--color-gray-300)]">
          The full running order is being finalized. {venue.doorsLabel}.
        </p>
      ),
  },
  {
    id: "date",
    number: "03",
    eyebrow: "Date",
    heading: EVENT.dateLabel,
    body: (
      <p className="text-body-l text-[var(--color-gray-300)]">
        {EVENT.city}, {EVENT.region} — one night, up to 100 attendees. Seats are genuinely
        limited, not a marketing line.
      </p>
    ),
  },
  {
    id: "theme",
    number: "04",
    eyebrow: "Theme",
    heading: EVENT.theme,
    body: (
      <p className="text-body-l text-[var(--color-gray-300)]">
        Every generation inherits something left incomplete by those before them. This year,
        we ask: what did you inherit, and what will you do with it?
      </p>
    ),
  },
  {
    id: "partners",
    number: "05",
    eyebrow: "Partners",
    heading: partners.length > 0 ? "Supported by" : "Partners to be announced",
    body:
      partners.length > 0 ? (
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {partners.map((partner) => (
            <li key={partner.id} className="text-body text-[var(--color-gray-100)]">
              {partner.url ? (
                <a href={partner.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-red)]">
                  {partner.name}
                </a>
              ) : (
                partner.name
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body-l text-[var(--color-gray-300)]">
          This event is entirely student-run — sponsor and partner details go here once confirmed.
        </p>
      ),
  },
];

/**
 * Chapter 4 — Sticky Timeline. A fixed pane pins while the visitor scrolls
 * through 5 informational chapters (Venue/Schedule/Date/Theme/Partners),
 * crossfading between them (the section's one scoped GSAP use, CLAUDE.md).
 *
 * Deliberate deviation from UI_GUIDELINES.md §3's "Venue/Tickets read better
 * lights-up" guidance: a single pinned background needs one consistent visual
 * bed across all 5 chapters, so this section stays dark throughout.
 *
 * Accessibility: all 5 chapters render in the DOM at all times (crossfaded via
 * opacity, never unmounted or aria-hidden), so keyboard/screen-reader users
 * reach every chapter in source order without depending on the scrub. Known
 * limitation: a direct #venue/#schedule/etc. anchor jump lands at the pinned
 * pane's scroll position but doesn't force that specific chapter to the front
 * visually — a real rough edge of the crossfade pattern, not fixed here to
 * avoid a second, more invasive scroll-position-sync mechanism.
 *
 * Tickets is intentionally NOT inside the pinned mechanism — the pin releases
 * after Partners, and RegisterForm renders as a normal, always-interactive
 * section immediately after (ACCESSIBILITY.md §2: scroll-gated mechanics must
 * never be the only way to reach interactive content).
 */
export function EventInformation() {
  const shouldReduceMotion = useReducedMotion();
  const paneRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const pane = paneRef.current;
    if (!pane) return;

    let cancelled = false;
    let trigger: ReturnType<typeof import("gsap/ScrollTrigger").ScrollTrigger.create> | undefined;

    import("@/lib/gsap").then(({ gsap, ScrollTrigger, ensureGsapRegistered }) => {
      if (cancelled) return;
      ensureGsapRegistered();

      const panels = panelRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (panels.length === 0) return;

      gsap.set(panels, { opacity: 0 });
      gsap.set(panels[0], { opacity: 1 });

      trigger = ScrollTrigger.create({
        trigger: pane,
        start: "top top",
        end: () => `+=${panels.length * window.innerHeight * 0.9}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const idx = Math.min(panels.length - 1, Math.floor(self.progress * panels.length));
          panels.forEach((panel, i) => {
            gsap.to(panel, { opacity: i === idx ? 1 : 0, duration: 0.3, overwrite: true });
          });
        },
      });
    });

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [shouldReduceMotion]);

  return (
    <section className="relative bg-[var(--color-black)]">
      {/* Ambient hairlines — same vocabulary as the section this absorbs
          (former Register.tsx), so the visual bed still reads as this site's
          system rather than a bare informational panel. */}
      <div className="pointer-events-none absolute left-6 top-0 bottom-0 w-[2px] bg-[var(--color-red)]/20 lg:left-16" />

      <div
        ref={paneRef}
        className={cn(
          "relative w-full",
          shouldReduceMotion ? "flex flex-col gap-16 py-16 lg:py-24" : "h-screen overflow-hidden",
        )}
      >
        {chapters.map((chapter, i) => (
          <div
            key={chapter.id}
            id={chapter.id}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={cn(
              "container mx-auto flex flex-col justify-center px-6 lg:px-16",
              shouldReduceMotion ? "scroll-mt-24" : cn("absolute inset-0", i === 0 ? "opacity-100" : "opacity-0"),
            )}
          >
            <div className="pl-8 lg:pl-24 max-w-2xl">
              <p className="text-eyebrow text-[var(--color-gray-500)]">
                {chapter.number} — {chapter.eyebrow}
              </p>
              <h2 className="mt-3 text-display-l font-heading text-white">{chapter.heading}</h2>
              <div className="mt-6">{chapter.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="container relative mx-auto px-6 py-20 lg:px-16 lg:py-24">
        <div className="pl-8 lg:pl-24 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <RevealOnScroll>
              <SplitTitle as="h2" text="Claim Your Seat" className="text-display-l text-white" />
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <p className="text-h3 font-heading text-[var(--color-red)]">
                Don&rsquo;t just watch history.
                <br />
                Be in the room.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <p className="text-body-l text-[var(--color-gray-300)]">
                Seats are limited. If the theme spoke to you, this event is for you — student,
                faculty, or curious mind.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.3}>
              <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-gray-700)] pt-6">
                <p className="text-eyebrow text-[var(--color-gray-500)]">Other enquiries</p>
                <p className="text-small text-[var(--color-gray-300)]">
                  Want to speak, sponsor, or volunteer? Email{" "}
                  <a href={`mailto:${EVENT.email}`} className="text-[var(--color-red)] underline hover:text-[var(--color-red-dark)]">
                    {EVENT.email}
                  </a>{" "}
                  or reach us on{" "}
                  <a href={EVENT.social.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--color-red)] underline hover:text-[var(--color-red-dark)]">
                    Instagram
                  </a>
                  .
                </p>
              </div>
            </RevealOnScroll>
          </div>

          <div id="tickets" className="scroll-mt-24 lg:col-span-7">
            <RevealOnScroll delay={0.3}>
              <RegisterForm />
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
