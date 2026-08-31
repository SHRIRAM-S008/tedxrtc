# DESIGN.md — Visual Language & Design Tokens

This file is the **single source of truth** for color, typography, spacing, grid, and imagery direction. `UI_GUIDELINES.md` and `COMPONENTS.md` consume these tokens — they do not redefine them. If a value isn't listed here, it doesn't exist in this project; add it here first.

## 1. Design thesis

The event is a single night where ideas get a stage as dramatic as the ones they deserve. The site should feel like **the moment before the lights go down in a theatre** — high contrast, quiet until it isn't, one red mark on an otherwise black-and-white world. Think film premiere microsite crossed with a Stripe product launch: restrained typography, generous negative space, one bold color used like a spotlight, not a decoration.

**Reference points (principles, not templates to copy):** Apple's confidence in whitespace and product-as-hero; Stripe's typographic discipline and grid precision; Vercel/Linear's dark-mode restraint and technical polish; Framer's motion-as-storytelling; Figma's clarity of hierarchy. Study *why* these work — do not reproduce their layouts, palettes, or components. If a section could be mistaken for any of their marketing sites, redo it.

**Anti-goal:** do not default to the current AI-generated-site clichés — no warm cream background with a terracotta accent, no near-black-with-acid-green tech-startup look, no dense hairline-ruled broadsheet layout unless it's earned by this specific content. This project's palette is specified (black/white/TED red) — spend creative energy on type, rhythm, motion, and the signature element, not on reinventing the palette.

## 2. Color system

Only these colors exist in this project. Every hex value below is final — do not introduce new colors, tints from a design tool, or a UI library's default palette.

| Token | Hex | Role |
|---|---|---|
| `--color-black` | `#0A0A0A` | Primary background ("Obsidian"). Not pure `#000` — pure black reads flat on screens; this has a hair of warmth for depth on OLED and print exports. |
| `--color-white` | `#FAFAFA` | Primary light surface / primary text-on-black ("Paper"). Not pure `#FFF`, for the same reason. |
| `--color-red` | `#E62B1E` | The single accent. CTAs, the "x" mark, active states, key underlines, the countdown, one deliberate hero moment. |
| `--color-red-dark` | `#A81D13` | Hover/pressed state of red. Never used as a standalone brand color. |
| `--color-red-glow` | `#FF4438` | Used only in gradients/glows behind video or dark hero imagery, at low opacity (≤25%). Never used as flat fill or text color. |
| `--color-gray-950` | `#141414` | Elevated surface on black (cards, panels) — one step lighter than background. |
| `--color-gray-700` | `#333333` | Secondary borders/dividers on black backgrounds. |
| `--color-gray-500` | `#6B6B6B` | Tertiary/disabled text, meta labels, on either background. |
| `--color-gray-300` | `#A3A3A3` | Secondary body text on black. |
| `--color-gray-100` | `#E5E5E5` | Elevated surface on white, hairline dividers on white. |

### Usage rules

- **60/30/10 rule:** black (or white, on light sections) ≈ 60%, the opposite neutral ≈ 30%, red ≈ 10% or less. Red is a spotlight, not a wash. If more than ~10% of a viewport is red, you've overused it.
- **One red element per viewport, as a rule of thumb.** A red CTA button *and* a red headline underline *and* a red badge in the same screen is noise, not emphasis. Pick the single most important thing on screen and give it the red.
- **Never tint red for "success/warning/info" states.** This is not a product dashboard. Use type weight, motion, and copy to communicate state (see `UI_GUIDELINES.md` → States). If a functional status color is truly unavoidable (e.g., a form error), use `--color-red` for errors only (it already reads as "alert" in this palette) and communicate success/neutral states via white/gray + a checkmark glyph, not a new hue.
- **Dark sections are the default.** Treat white/light sections as the exception used for contrast breaks (e.g., a speaker bio section, the ticket form) — a "house lights up" moment between "house lights down" cinematic sections.
- **Gradients** are permitted only as black→transparent scrims over imagery/video for text legibility, or the red-glow radial behind a hero focal point. No decorative rainbow or duotone gradients.

## 3. Typography

Two typefaces plus one utility face. Never introduce a third display or body face.

| Role | Typeface | Notes |
|---|---|---|
| Display | **Fraunces** (variable, optical size axis) | Editorial serif with real character — used large, used rarely. Carries the emotional weight of the page: hero headline, talk titles, section openers. |
| Body / UI | **Inter** (variable) | All body copy, navigation, buttons, form labels. Neutral and precise so the serif can do the talking. |
| Utility / Mono | **IBM Plex Mono** | Eyebrows, timestamps, speaker numbers, the countdown timer, schedule times, metadata. Always uppercase, always letter-spaced when used as a label. |

### Type scale (desktop-first, fluid)

Use `clamp()` so desktop sizes are the ceiling and mobile scales down proportionally — never a fixed px value that then gets awkwardly overridden per breakpoint.

| Token | Size | Line-height | Tracking | Use |
|---|---|---|---|---|
| `--text-display-xl` | `clamp(3.5rem, 7vw + 1rem, 9rem)` | 0.95 | -0.02em | The hero line. One per site. |
| `--text-display-l` | `clamp(2.75rem, 4.5vw + 1rem, 5.5rem)` | 1.0 | -0.02em | Section openers ("The Speakers", "The Program"). |
| `--text-display-m` | `clamp(2rem, 2.5vw + 1rem, 3.25rem)` | 1.05 | -0.01em | Talk titles, large pull quotes. |
| `--text-h1` | `2.5rem` | 1.1 | -0.01em | Page-level heading (non-hero pages). |
| `--text-h2` | `1.75rem` | 1.15 | 0 | Sub-section heading. |
| `--text-h3` | `1.25rem` | 1.25 | 0 | Card titles, speaker names. |
| `--text-body-l` | `1.25rem` | 1.6 | 0 | Intro paragraphs, event description. |
| `--text-body` | `1rem` | 1.65 | 0 | Default body copy. |
| `--text-small` | `0.875rem` | 1.5 | 0 | Secondary text, bios. |
| `--text-eyebrow` | `0.8125rem` | 1.4 | 0.12em | Mono, uppercase. Labels like "SPEAKER 04", "17:00 — DOORS OPEN". |

**Rules:**
- Fraunces is set **large or not at all** — never use the display face below `--text-display-m`. At small sizes it loses its character and just looks like a mistake.
- Never justify text. Left-align by default; center only for short, deliberate hero/CTA moments.
- Line length: body copy wraps at 60–75 characters (`max-width: 65ch` as the working default).
- Headlines get intentional line breaks (manual `<br />` at meaningful phrase boundaries), not just wrapped-whatever-fits — this is an editorial site; typeset the headline like a magazine would.

## 4. Spacing system

8px-derived scale, expressed as a 4px base unit for finer control at small sizes. **Every** margin, padding, and gap must come from this scale — no ad hoc pixel values.

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `space-1` | 4px | | `space-10` | 64px |
| `space-2` | 8px | | `space-12` | 80px |
| `space-3` | 12px | | `space-16` | 96px |
| `space-4` | 16px | | `space-20` | 128px |
| `space-5` | 20px | | `space-24` | 160px |
| `space-6` | 24px | | `space-32` | 200px |
| `space-8` | 32px | | `space-40` | 256px |

**Section rhythm:** vertical padding between major sections is `space-32` to `space-40` on desktop (this is a cinematic site — let sections breathe like scenes, not like a dense SaaS landing page), `space-16` on mobile. Component-internal spacing (card padding, button padding) stays in the `space-3`–`space-8` range.

## 5. Grid & layout

- **Desktop grid:** 12 columns, `24px` gutter, `max-width: 1512px`, side margin `120px` at ≥1440px, scaling down to `64px` at 1024–1439px.
- **Breakpoints:**

| Name | Width | Behavior |
|---|---|---|
| `xs` | 360px | Minimum supported width |
| `sm` | 480px | Large phone |
| `md` | 768px | Tablet — layout starts shifting from single-column to grid |
| `lg` | 1024px | Small laptop — full nav appears, multi-column sections activate |
| `xl` | 1280px | Standard desktop — target design width for most QA |
| `2xl` | 1536px | Large desktop |
| `cinema` | 1920px | Ultra-wide — hero imagery/video should scale, not just center-crop awkwardly |

- **Desktop-first authoring:** design and build the 1280–1536px experience first, then adapt down. This does not mean mobile is an afterthought — it means the cinematic desktop details (large type, generous margins, layered motion) are the intended experience, and mobile is a deliberate, fully-considered translation of it, not a shrunk copy. See `UI_GUIDELINES.md` → Responsive Behavior for the specific down-scaling rules per component.
- Asymmetry is encouraged over centered-everything: offset a headline against a full-bleed image, let a speaker grid break the 12-col grid intentionally at one point per page. A page that is centered top-to-bottom reads as a template.

## 6. Imagery & video direction

- **Photography:** high-contrast black-and-white or near-desaturated color grading with a single warm/red channel pushed slightly — speaker portraits should look like they belong in the same "film" as the rest of the site, not stock headshots. No smiling-at-camera corporate portrait style; candid, mid-gesture, stage-lit imagery.
- **No stock photography of generic "diverse professionals in a boardroom."** If real photography isn't available yet, use a solid `--color-gray-950` or `--color-black` placeholder frame with the speaker's name in Fraunces — never a gray silhouette icon or a Lorem-Picsum-style filler photo in the shipped build.
- **Video:** the hero may use a muted, looping, cinematic video background (stage lighting, crowd silhouettes, a single red spotlight sweep) — see `PERFORMANCE.md` for weight budgets before using this. Always paired with a scrim gradient (`black` at 60–80% opacity at the bottom third) for text legibility.
- **No icon packs used decoratively.** Icons (from a single consistent set, line-weight matched to Inter's stroke weight) are for functional UI only — nav, social links, form affordances. Do not use icons as section decoration ("💡 Ideas Worth Spreading" with a lightbulb emoji-style icon) — that reads as template filler on this kind of site.

## 7. The signature element

**Decided: see `UNFINISHED_THEME.md`.** The site's signature element is "the revision mark" — a hero headline that arrives as a struck-through draft phrase before resolving to its final form, expressing the idea that every talk on this stage is a draft made public. That file owns the full specification, its accessibility handling, and the strict limits on how far the surrounding "unfinished-look, finished-product" concept is allowed to extend.

The candidates originally considered here (a live countdown, a theatrical speaker-roster reveal, a single continuous red scroll-line) remain valid *secondary* motion ideas if needed elsewhere on the site, but none of them carries signature-element status — that status belongs to the revision mark alone, per `ANIMATIONS.md` §1's rule that one orchestrated moment beats several competing ones.

## Do / Don't

**Do**
- Treat every hex, size, and spacing value in this file as final — build the Tailwind config from this table, don't invent new values in components.
- Use Fraunces at real scale for at least one moment per page.
- Let black-background sections dominate; use white sections as intentional contrast breaks.

**Don't**
- Don't add a fourth typeface "just for this one banner."
- Don't introduce blue link colors, green success states, or yellow warnings — solve state communication within black/white/red (see `UI_GUIDELINES.md`).
- Don't center every section — asymmetry is part of the editorial feel.
- Don't use red for large fills (backgrounds, full-bleed panels) — it's a mark, not a wall color.
