# UNFINISHED_THEME.md — The "Unfinished" Creative Concept

This file owns one specific creative direction: the site **looks** like a draft-in-progress, while everything about how it actually functions is fully finished, polished, and production-grade. It amends `DESIGN.md` §7 (the site's signature element is now decided, specified here) and layers onto — never replaces — the token system, motion rules, and accessibility standards already set in `DESIGN.md`, `ANIMATIONS.md`, and `ACCESSIBILITY.md`.

## 1. The thesis

An idea worth spreading is never actually finished — a talk is a snapshot of a thought still being worked out, handed to an audience who'll carry it further. That's the honest state of every idea on this stage: draft, not final. The site should say that in its own visual language — but say it **on purpose**, with total control, not by actually being unpolished.

**The one rule that governs everything in this file:** *unfinished is a look, not a state.* Every draft mark, strikethrough, torn edge, or exposed grid line on this site is a deliberate, pixel-precise design decision — the same rigor as any other element in `DESIGN.md`. If it could be mistaken for a bug, a missing asset, or a broken layout, it's wrong and needs to be redone with more intent, not softened.

## 2. Where this comes from

Other licensed TEDx sites already gesture at this — e.g. ticket cards with a dashed perforation line, a scalloped "torn" edge, an imprecise ripple graphic. Small, isolated touches on one component. This concept takes that instinct — *the idea of something handmade, cut, still being worked on* — and makes it the site's actual thesis, expressed through typography and motion rather than any other event's literal ticket-stub graphic (never copy another TEDx event's visual assets — build our own expression of the idea).

## 3. The signature element (specifies `DESIGN.md` §7)

**The revision mark.** The hero headline arrives as a draft — a phrase in red, mono type, struck through — then resolves to the real headline in Fraunces. Concretely, in the hero load sequence (extends `ANIMATIONS.md` §3):

1. The scrim/background settles (as already specified).
2. A draft phrase appears first, in `--text-eyebrow`-scale mono, `--color-red`: e.g. `A TALK ABOUT PROGRESS` — sitting exactly where the real headline will sit.
3. A strikethrough line draws across it left-to-right (`scaleX`, `--dur-base`, `--ease-out-expo` — same technique as the link-underline in `UI_GUIDELINES.md` §6, just applied to a full line through text rather than under it).
4. The draft phrase fades out; the real headline (`--text-display-xl`, Fraunces) fades/settles into the same position, `--dur-slow`.

This is the entire signature-element budget for the site — per `ANIMATIONS.md` §1's "one orchestrated moment beats ten scattered effects," nothing else on the site competes with this for attention. It runs once, in the hero, exactly as `ANIMATIONS.md` §3 already specifies for the load sequence (not re-triggered on return visits to home).

## 4. Supporting motifs (used sparingly — this is a budget, not a toolkit)

Each of these appears **at most once or twice, site-wide** — this is not a decorative kit to sprinkle across every section. Treat this list as a fixed allowance, the same way `DESIGN.md` treats red as ≤10% of a viewport.

- **The incomplete circle.** A thin red circle that doesn't quite close — used once, around the speaker roster's eyebrow numbering (`SPEAKER 04`), and completes itself (the gap closes) as the card scrolls into view. A literal small idea "finishing" as it arrives. Implemented as a scroll-triggered `strokeDashoffset` animation on the SVG circle, `whileInView`/`once: true` per `ANIMATIONS.md` §4 — not a new signature scroll effect, just one more state of the existing eyebrow-numbering pattern from `UI_GUIDELINES.md` §3.
- **The torn edge.** One image on the site — the hero image or a single featured "About the theme" image — has a rough, hand-cut mask edge (SVG `clip-path`) instead of a clean rectangle, evoking a page torn from a notebook. Every other image on the site (speaker portraits, venue photos) stays cleanly rectangular per `DESIGN.md` §6 — this is a one-time flourish, not a new default image treatment.
- **The margin note.** One short, handwritten-feeling annotation in `--color-red`, mono type, small, placed beside a single pull-quote or the "About the theme" statement — like a peer-review comment in a manuscript's margin (e.g., `→ this is the whole point`). Used once. Not a recurring commentary pattern next to every quote on the site.
- **Draft-labeled eyebrows.** Where `UI_GUIDELINES.md`/`DESIGN.md` already call for a mono eyebrow label, occasionally lean the copy itself into the concept — `WORK IN PROGRESS` instead of a section number, `WRITTEN, REWRITTEN, DELIVERED` instead of a generic "About" label. This is a **copy** choice within the existing eyebrow style, not a new visual pattern — no additional design work needed, just sharper writing per `BRANDING.md` §4's voice guidance.

## 5. What this concept never touches

This is the more important half of the file. "Unfinished" is strictly an editorial/content-layer device. It does not enter functional UI, ever:

- **Never on interactive chrome.** Buttons, nav, forms, the ticket-purchase flow, and the countdown timer stay exactly as specified in `UI_GUIDELINES.md` — clean, precise, unambiguously finished. A "draft-looking" button is a usability failure, not a creative choice; a user must never wonder if a control is broken.
- **Never on the TED/TEDx logo or wordmark.** `BRANDING.md` §5 already forbids restyling the mark — this concept doesn't get an exception. The logo stays standard, full stop.
- **Never as an excuse for actual incompleteness.** No placeholder copy, no "coming soon" gaps, no missing speaker photos, no unfinished pages shipped under cover of "it's supposed to look unfinished." The `WORKFLOW.md` §5 pre-launch checklist (no lorem ipsum, no placeholder images) applies with zero exceptions — if anything, this concept raises the bar, since a genuinely unpolished corner is much easier to mistake for "part of the theme" here than on a conventionally tidy site. Review with extra scrutiny for exactly that reason.
- **Never on data or dates.** Ticket prices, schedule times, and the countdown must always read as fully accurate and current — "unfinished" is an aesthetic of ideas, not of information the attendee needs to rely on.

## 6. Accessibility handling

The revision-mark hero (§3) needs specific care beyond the general rules in `ACCESSIBILITY.md`:

- The struck-through draft phrase is marked `aria-hidden="true"` — screen readers should hear only the final headline, not an intermediate draft word followed by a correction, which would read as confusing or like an error.
- The strikethrough animation and circle-completion motif (§4) both fall under `ANIMATIONS.md` §6 / `ACCESSIBILITY.md` §5's reduced-motion handling: under `prefers-reduced-motion`, skip straight to the final state (the resolved headline, the closed circle) rather than showing a static half-finished frame — a paused mid-animation state would look like a rendering failure, which defeats the "intentional, not broken" rule in §1.
- The torn-edge image mask (§4) doesn't change alt-text requirements — same descriptive, contextual `alt` rules as any image per `ACCESSIBILITY.md` §4, regardless of the mask shape applied to it.

## Do / Don't

**Do**
- Treat the revision-mark hero as the site's one signature element, replacing the open menu of options previously listed in `DESIGN.md` §7.
- Keep every "unfinished" motif rare and deliberate — count instances against the §4 budget before adding a new one.
- Hold interactive UI, brand marks, and factual content to full, unambiguous polish at all times.

**Don't**
- Don't let "unfinished" touch a button, a form, the nav, or the TED/TEDx mark.
- Don't ship any actually-incomplete content and justify it by this theme — a missing speaker bio is a bug, not an aesthetic.
- Don't add a third or fourth "unfinished" motif beyond §4's list without updating this file first, per `WORKFLOW.md` §3.
