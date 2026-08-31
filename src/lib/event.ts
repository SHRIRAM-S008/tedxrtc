/**
 * Single source of truth for this event's identity and factual details.
 * Copy/labels that describe *who and where* the event is live here so a name,
 * date, or venue change is a one-file edit — not a hunt through JSX
 * (see COMPONENTS.md §4, CODE_STYLE.md §4 constants).
 *
 * `date` confirmed by the organizing team (TEDxRTC_Committee_Details.pdf).
 */
export const EVENT = {
  /** Full licensed event name — establish once, prominently (TEDX_RULES.md §2). */
  name: "TEDxRathinam Technical Campus",
  /** Consistent short form, safe to reuse after the full name is established. */
  shortName: "TEDxRTC",
  /** The lockup splits here: "TEDx" stays standard, this carries our voice. */
  markSuffix: "Rathinam Technical Campus",
  city: "Coimbatore",
  region: "Tamil Nadu, India",
  /** TED's own tagline — used per TED guidelines, never remixed (BRANDING.md §4). */
  tedTagline: "Ideas worth spreading",
  /** This event's editorial theme (UNFINISHED_THEME.md). */
  theme: "The Unfinished",
  /** ISO date once confirmed, e.g. "2026-11-07"; null until then. */
  date: "2026-09-18" as string | null,
  /** Human-facing date string shown while `date` is unconfirmed. */
  dateLabel: "September 18, 2026",
  email: "tedx@rathinam.in",
  mapsUrl: "https://maps.google.com/?q=Rathinam+Technical+Campus+Coimbatore",
  social: {
    instagram: "https://instagram.com/tedxrtc",
    handle: "@TEDxRTC",
  },
} as const;

/** Standard TEDx independence disclaimer — fixed language (TEDX_RULES.md §1). */
export const TEDX_DISCLAIMER =
  "This independent TEDx event is operated under license from TED.";

/** Public site origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tedxrtc.example").replace(/\/+$/, "");
