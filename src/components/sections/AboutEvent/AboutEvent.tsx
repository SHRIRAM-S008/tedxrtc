import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { HighlightPhrase } from "@/components/motion/HighlightPhrase";
import { Button } from "@/components/ui/Button";
import { about, EVENT } from "@/lib/event";
import { venue } from "@/lib/data/venue";
import { cn } from "@/lib/utils";
import styles from "./AboutEvent.module.css";

interface InfoCard {
  eyebrow: string;
  code: string;
  note: string;
}

const infoCards: InfoCard[] = [
  { eyebrow: "Date", code: about.dateCode, note: `${about.dateYear} · ${about.dateNote}` },
  { eyebrow: "Venue", code: about.venueCode, note: about.venueNote },
  { eyebrow: "Seats", code: about.seatsCode, note: about.seatsNote },
];

/**
 * Chapter 2 — "About the event". A two-column editorial layout: left side
 * carries the narrative headline, two paragraphs and the Date / Venue / Seats
 * info cards; right side carries Vision and Mission blocks with a red left
 * border, an embedded dark map with a red marker overlay, the full address,
 * and a primary CTA.
 *
 * Replaces the former `TEDxIntro`. `EventInformation` lower down still carries
 * the detailed pinned-timeline logistics.
 *
 * Visual effects used here:
 *  - Scroll-triggered phrase highlights (`HighlightPhrase`) for key lines.
 *  - Hover: Vision/Mission cards grow their left red line; stat cards turn
 *    their big number red (AboutEvent.module.css).
 *  - Dark Google Maps embed via `.mapFrame` filter class + a red SVG marker.
 *  - A single primary CTA at the section close.
 *
 * The "X" watermark was intentionally not added: the instruction system
 * forbids resizing or recoloring the TED "x" mark for decorative effect
 * (CLAUDE.md / BRANDING.md). If you want a non-TEDx, abstract geometric
 * background element, that is a separate decision and should be proposed
 * explicitly.
 */
export function AboutEvent() {
  const body1Start =
    "TEDx is ";
  const body1End =
    ". Organised independently under licence from TED, a TEDx event gathers a community around talks and performances built on one simple belief: an idea, said well, can change what people do next. The x marks it as self-organised — our own people, our own stage, the same spirit as TED.";
  const body2Start =
    "On 18 September 2026, ";
  const body2Middle =
    " hands its stage to ideas that refuse to sit still. TEDxRathinamTechnicalCampus brings students, faculty, founders and curious minds into a single room to hear from people working on problems that are not yet solved. One day. Up to 100 seats. Nine talks that pick up ";
  const body2End = ".";

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        {/* Chapter opener — "THE UNFINISHED" as a stacked, display-sized title,
            echoing the hero's own headline register (EVENT.theme). */}
        <RevealOnScroll>
          <h2 className={cn("text-display-l", styles.title)}>
            <span className={cn("block", styles.eyebrowLine)}>The</span>
            <span className={cn("block", styles.titleLine)}>Unfinished</span>
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.12}>
          <p className={cn("text-h2", styles.subtitle)}>{about.heading}</p>
        </RevealOnScroll>

        <div className={styles.grid}>
          {/* Left column — narrative + stat cards. */}
          <div className={styles.leftColumn}>
            <div className={styles.narrative}>
              <RevealOnScroll delay={0.1}>
                <p className={cn("text-body-l", styles.bodyText)}>
                  {body1Start}
                  <HighlightPhrase underlined delay={0.2}>
                    where ideas worth spreading find a room
                  </HighlightPhrase>
                  {body1End}
                </p>
              </RevealOnScroll>
              <RevealOnScroll delay={0.18}>
                <p className={cn("text-body-l", styles.bodyText)}>
                  {body2Start}
                  <HighlightPhrase delay={0.2}>
                    Rathinam Technical Campus in Coimbatore
                  </HighlightPhrase>
                  {body2Middle}
                  <HighlightPhrase underlined delay={0.2}>
                    work still in progress
                  </HighlightPhrase>
                  {body2End}
                </p>
              </RevealOnScroll>
            </div>

            {/* Stat cards — hover-to-red driven by AboutEvent.module.css's
                `.statCard` parent-hover selectors. */}
            <div className={styles.statGrid}>
              {infoCards.map((card, i) => (
                <RevealOnScroll key={card.eyebrow} delay={0.15 + i * 0.08}>
                  <div className={styles.statCard}>
                    <p className={cn("text-eyebrow", styles.statCardEyebrow)}>{card.eyebrow}</p>
                    <p className={cn("text-display-m", styles.statCardValue)}>{card.code}</p>
                    <p className={cn("text-body", styles.statCardNote)}>{card.note}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Right column — Vision / Mission boxes, dark map, address, CTA. */}
          <div className={styles.rightColumn}>
            <RevealOnScroll delay={0.1}>
              <div className={styles.lineCard}>
                <p className={cn("text-eyebrow", styles.lineCardLabel)}>VISION</p>
                <p className={cn("text-body-l", styles.lineCardBody)}>{about.vision}</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.18}>
              <div className={styles.lineCard}>
                <p className={cn("text-eyebrow", styles.lineCardLabel)}>MISSION</p>
                <p className={cn("text-body-l", styles.lineCardBody)}>{about.mission}</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.26}>
              <div className={styles.mapFrame}>
                <iframe
                  title="Rathinam Technical Campus on Google Maps"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${venue.name} ${venue.area} ${venue.city}`
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className={styles.mapIframe}
                  allowFullScreen
                  loading="lazy"
                />
                {/* Red marker overlay — the only bright red element on the map. */}
                <div className={styles.mapMarker}>
                  <svg width="24" height="32" viewBox="0 0 24 32" fill="none" aria-hidden="true">
                    <path
                      d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z"
                      fill="var(--color-red)"
                    />
                    <circle cx="12" cy="12" r="5" fill="var(--color-black)" />
                  </svg>
                </div>
                <div className={styles.addressBlock}>
                  <p className={cn("text-body", styles.addressText)}>
                    {venue.name}, {venue.area}, {venue.city}, {venue.region}
                  </p>
                  <a
                    href={EVENT.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("text-body", styles.mapLink, "focus-visible")}
                  >
                    Open in Maps →
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Bottom CTA — one primary action for the section, not a persistent
            floating button (the existing nav already carries "Get Tickets" on
            every screen; a second sticky CTA would compete for the same intent
            and break the one-primary-CTA-per-viewport rule). */}
        <RevealOnScroll delay={0.1}>
          <div className={styles.ctaRow}>
            <p className={cn("text-body-l", styles.ctaText)}>
              One day. Up to 100 seats. Don&rsquo;t watch from the outside.
            </p>
            <Button asChild>
              <Link href="#tickets">Register Now</Link>
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
