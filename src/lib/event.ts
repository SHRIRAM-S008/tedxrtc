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
  /**
   * Countdown target — doors time, IST (venue.doorsLabel), as a
   * timezone-pinned ISO string so the live countdown is unambiguous
   * regardless of the viewer's locale. The hero `CountdownTimer` renders
   * against this; `useCountdown` handles the event-has-passed state.
   */
  countdownTarget: "2026-09-18T16:30:00+05:30",
  email: "tedx@rathinam.in",
  mapsUrl: "https://maps.google.com/?q=Rathinam+Technical+Campus+Coimbatore",
  social: {
    instagram: "https://instagram.com/tedxrtc",
    handle: "@TEDxRTC",
  },
} as const;

/**
 * "About the event" section copy — the narrative summary of what TEDxRTC is
 * and why this specific day matters. Lives here, not inline in JSX, so a copy
 * edit is a one-file change (COMPONENTS.md §4). Factual fields (date, venue,
 * seats) are reused from `EVENT` / `venue` at the call site rather than
 * duplicated here.
 */
export const about = {
  heading: "Big ideas need a local stage. This is ours.",
  body1:
    "TEDx is where ideas worth spreading find a room. Organised independently under licence from TED, a TEDx event gathers a community around talks and performances built on one simple belief: an idea, said well, can change what people do next. The x marks it as self-organised — our own people, our own stage, the same spirit as TED.",
  body2:
    "On 18 September 2026, Rathinam Technical Campus in Coimbatore hands its stage to ideas that refuse to sit still. TEDxRathinamTechnicalCampus brings students, faculty, founders and curious minds into a single room to hear from people working on problems that are not yet solved. One day. Up to 100 seats. Nine talks that pick up work still in progress.",
  /** Short code shown large on the Date info card (Fraunces, display-m). */
  dateCode: "18 Sep",
  /** Year line beneath the date code. */
  dateYear: "2026",
  /** Running note beneath the date year. */
  dateNote: "Friday, full day",
  /** Short code shown large on the Venue info card. */
  venueCode: "RTC",
  /** Sub-line beneath the venue code (full campus + city). */
  venueNote: "Rathinam Technical Campus, Coimbatore",
  /** Short code shown large on the Seats info card. */
  seatsCode: "100",
  /** Sub-line beneath the seats code. */
  seatsNote: "Free for RTC students",
  vision:
    "A campus that treats every solved problem as a starting line, not a finish, and sends people back into the world ready to complete what others began.",
  mission:
    "To surface ideas that are honest about being incomplete, give them a stage and an audience, and turn one day of talks into work that continues long after the lights go down.",
} as const;

/** Standard TEDx independence disclaimer — fixed language (TEDX_RULES.md §1). */
export const TEDX_DISCLAIMER =
  "This independent TEDx event is operated under license from TED.";

/** Public site origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tedxrtc.example").replace(/\/+$/, "");
