# UI_GUIDELINES.md — Interface Patterns & Behavior

This file governs **how components look and behave in context**: buttons, navigation, forms, cards, section layouts, and responsive translation. It consumes tokens from `DESIGN.md` (colors, type, spacing, grid) and motion tokens from `ANIMATIONS.md` — it does not redefine either. Component *file architecture* (props, folder structure) lives in `COMPONENTS.md`.

## 1. Buttons

Two variants only. Do not add a third "ghost" or "link" button variant without updating this file first.

**Primary (red):**
- Background `--color-red`, text `--color-white`, `--text-body` weight 600.
- Padding: `space-3` vertical, `space-6` horizontal. No rounded corners beyond `4px` — sharp, editorial, not app-like pill shapes.
- Hover: background shifts to `--color-red-dark`, no scale transform (scale-on-hover reads as generic SaaS; use a subtle underline-reveal or icon-shift instead — see `ANIMATIONS.md`).
- Used for exactly one action per screen: "Get Tickets," "Apply to Speak." Never two primary buttons visible at once.

**Secondary (outline):**
- Transparent background, `1px` border in current text color (white on black, black on white), text matches.
- Hover: border and text shift to `--color-red`, background stays transparent — the red appears as an accent, not a fill.
- Used for lower-priority actions: "Watch Trailer," "View Program."

**Rules:**
- Never use a filled white or filled black button as a third "variant" — if it's not the primary action, it's secondary/outline.
- Button copy is a verb phrase from the user's point of view ("Get Tickets," not "Submit" or "Ticket Purchase Portal").
- Minimum tap target `44×44px` regardless of visual padding, per `ACCESSIBILITY.md`.

## 2. Navigation

- Fixed/sticky top bar, transparent over the hero, resolving to a solid `--color-black` (95% opacity + backdrop blur) once the user scrolls past the hero — this is a common cinematic-site pattern precisely because it works; execute it cleanly rather than reinventing it.
- Logo/wordmark per `BRANDING.md` sits left. Nav links (Program, Speakers, Venue, Tickets) sit right, in `--text-eyebrow` mono style — this reinforces the "programme" editorial feel rather than a standard sans nav.
- The single primary CTA ("Get Tickets") is the only nav item styled as a button; everything else is plain text links with a red underline on hover/active (see `ANIMATIONS.md` for the underline-draw interaction).
- Mobile nav: full-screen overlay on open (not a small dropdown) — black background, large Fraunces links stacked, staggered reveal on open. This matches the cinematic tone; a cramped mobile dropdown menu breaks it.

## 3. Section layout patterns

Define these once, reuse consistently — don't let each section invent its own grid logic.

**Hero:**
- Full-bleed (`100vh` desktop, `100svh` mobile to avoid mobile browser chrome jump), video or high-contrast image background with scrim.
- Headline in `--text-display-xl`, left-aligned at `120px` margin desktop, not centered — centering the hero headline is the template default; asymmetric placement reads as authored.
- Event date/location in `--text-eyebrow` mono above or below the headline. Primary CTA below.
- The signature element (per `DESIGN.md` §7) lives here or immediately below the fold.

**Speaker roster:**
- Desktop: asymmetric grid, not a uniform 3×N card grid — vary card sizes to imply hierarchy (a featured speaker gets a larger card) rather than treating every speaker as visually identical, unless the curation intentionally treats all speakers as equals (state that decision explicitly if so).
- Each card: image, name (`--text-h3`, Fraunces), talk title (`--text-small`, gray), a mono eyebrow number ("SPEAKER 04") — numbering is appropriate here because the roster genuinely is a sequence in the programme.
- Hover state reveals a one-line talk description via a mask/reveal (see `ANIMATIONS.md`), not a tooltip.

**Program / schedule:**
- Editorial timeline layout: time in mono on the left rail, event/talk title in Fraunces to the right, hairline divider (`--color-gray-700` on black, `--color-gray-100` on white) between rows.
- Do not render this as a generic table with borders on all sides — one hairline per row, generous vertical padding, is the correct register.

**Venue / logistics:**
- This is a natural "lights up" (white background) section — practical information (address, transit, doors time) reads better on white with black text than reversed on black.
- Map/location imagery treated with the same high-contrast grading as speaker photography, not a raw embedded Google Maps iframe with default styling — restyle or frame it.

**Tickets / CTA section:**
- Second and final "lights up" section is acceptable if it aids conversion clarity (forms read better on light backgrounds), but keep the surrounding chrome (nav, footer) in the black system.
- Ticket tiers, if present, are laid out as distinct cards with clear price hierarchy — the recommended tier gets the red accent border, not a "Most Popular" ribbon badge (that pattern is SaaS-pricing-page cliché; use quiet type hierarchy instead).

**Footer:**
- Dense, editorial, mono-forward: sitemap links, social, TEDx required disclaimer text (`TEDX_RULES.md`), organizer credit. Dark, minimal, no decorative newsletter-signup illustration.

## 4. Cards

- Sharp or minimally rounded corners (`4px` max) — never the default `rounded-xl`/`rounded-2xl` soft-SaaS look; it undercuts the editorial tone.
- On black backgrounds, cards elevate via `--color-gray-950` fill + a `1px` `--color-gray-700` border, not via drop shadow (shadows read poorly on dark backgrounds and look like a default Tailwind/shadcn artifact).
- On white backgrounds, a card can use a soft, low-opacity black shadow (`0 8px 24px rgba(10,10,10,0.08)`) sparingly.

## 5. Forms

- Inputs: transparent/`--color-gray-950` background, `1px` bottom border only (not a full box) in the resting state, growing to `2px` `--color-red` on focus — an editorial underline-input feel rather than a boxed Material-style field.
- Labels always visible above the field (never placeholder-as-label — inaccessible and a UX anti-pattern regardless of visual style).
- Validation errors: red text (`--color-red`) below the field with a plain-language message ("Enter a valid email") — no red glow, no shake animation (see `ANIMATIONS.md` for the one approved micro-interaction, a brief border-flash, not a shake).
- Success state (e.g., "You're registered"): communicated via a full state change of the section (confirmation screen/message in white/black type with a checkmark glyph), not a green banner.

## 6. States

Within a black/white/red palette, differentiate interactive states with **type weight, underline/border, and opacity** — not new hues.

| State | Treatment |
|---|---|
| Default | Base color per token table |
| Hover | Red accent introduced (text, border, or underline — pick one per component, not all three at once) |
| Focus (keyboard) | `2px` solid `--color-red` outline, `2px` offset — see `ACCESSIBILITY.md`, this is non-negotiable and must remain visible |
| Active/pressed | `--color-red-dark`, no scale change |
| Disabled | `--color-gray-500` text/border at 50% opacity, `cursor: not-allowed`, no hover response |
| Selected/current (nav) | Red underline persists (not just on hover) |

## 7. Responsive behavior

Desktop-first authoring per `DESIGN.md`, but every pattern above must have a stated mobile translation — "it's desktop-first" is not permission to leave mobile unresolved.

- **Hero:** display type drops to `--text-display-l`-equivalent scale via the fluid `clamp()`, video background may swap to a lighter static image below `md` to protect performance (`PERFORMANCE.md`), CTA and eyebrow stack vertically, left-margin drops to `space-4`.
- **Nav:** collapses to the full-screen overlay pattern (§2) below `lg`.
- **Speaker grid:** asymmetric multi-column grid collapses to a single column below `md`; maintain the numbering/eyebrow treatment — don't strip it out to "save space."
- **Program timeline:** the two-column time-rail/title layout collapses to a stacked block per entry below `sm`, time above title, still separated by the hairline rule.
- **Touch targets:** all interactive elements meet 44×44px minimum on touch breakpoints regardless of desktop visual size.

## Do / Don't

**Do**
- Reuse the section patterns above consistently across pages — the site should feel like one authored system, not a series of independently designed pages.
- Keep exactly one primary (red) CTA per screen.
- Translate every desktop pattern deliberately to mobile; state the translation when introducing a new component.

**Don't**
- Don't use a "Most Popular" ribbon, a bouncing scroll-down chevron, or a default centered hero-with-two-buttons layout — these are the first things that make a site look AI/template-generated.
- Don't introduce rounded pill buttons or soft shadow cards — it contradicts the editorial register set in `DESIGN.md`.
- Don't communicate UI state with a new color; use the state table in §6.
