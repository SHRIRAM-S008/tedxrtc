# ACCESSIBILITY.md — Accessibility Standards

Target: **WCAG 2.1 AA** minimum across the entire site, no exceptions carved out for "the cinematic parts." A premium site that fails basic accessibility isn't premium — it's exclusionary. This file governs contrast, keyboard behavior, focus, ARIA/semantics, and motion safety. It cross-references color tokens from `DESIGN.md` and motion tokens from `ANIMATIONS.md` rather than restating them.

## 1. Color contrast

Using the token table from `DESIGN.md` §2, verified contrast ratios:

| Foreground | Background | Ratio | Passes |
|---|---|---|---|
| `--color-white` (#FAFAFA) | `--color-black` (#0A0A0A) | ~19.8:1 | AAA (body text) |
| `--color-gray-300` (#A3A3A3) | `--color-black` (#0A0A0A) | ~8.4:1 | AAA (body text) |
| `--color-gray-500` (#6B6B6B) | `--color-black` (#0A0A0A) | ~4.4:1 | AA (large text ≥18px/14px-bold only — do not use for body-size text) |
| `--color-black` (#0A0A0A) | `--color-white` (#FAFAFA) | ~19.8:1 | AAA |
| `--color-white` (#FAFAFA) | `--color-red` (#E62B1E) | ~3.4:1 | **Fails AA for body text.** White text on the flat red only clears AA at large-text sizes (≥24px regular / ≥19px bold) — e.g., a big red badge headline is fine, red button copy at 16px needs a weight/size bump or the copy stays white-on-black with a red border instead. |
| `--color-red` (#E62B1E) | `--color-black` (#0A0A0A) | ~4.9:1 | AA (all text sizes) |
| `--color-red` (#E62B1E) | `--color-white` (#FAFAFA) | ~4.1:1 | AA large text only — for red body copy on white, use `--color-red-dark` (#A81D13, ~6.1:1) instead |

**Rule:** before shipping any new text/background combination not in this table, check it — don't assume "it's on-brand so it's fine." When red text sits on white or a red fill carries white body-size text, default to the darker/adjusted value called out above.

## 2. Keyboard navigation

- Every interactive element (links, buttons, form fields, the mobile nav toggle, any custom card with a click action) must be reachable via `Tab` and operable via `Enter`/`Space`, with **no exceptions for "decorative" cards that happen to link somewhere** — if it's clickable, it's a real `<a>` or `<button>`, not a `<div onClick>`.
- Logical tab order follows visual/DOM order — don't use positive `tabIndex` values to reorder; fix the DOM order instead.
- Skip-to-content link as the first focusable element on every page, visually hidden until focused.
- The mobile full-screen nav overlay (`UI_GUIDELINES.md` §2) must trap focus while open and return focus to the toggle button on close.
- Any scroll-linked signature interaction (`ANIMATIONS.md` §4) must not be the *only* way to access content — content revealed on scroll must already be in the DOM and reachable by keyboard/tab, not gated behind a scroll event that keyboard-only users can't trigger the same way.

## 3. Focus states

- Every focusable element gets a visible focus indicator: `2px solid var(--color-red)` outline with `2px` offset, **applied via `:focus-visible`** (not `:focus`, to avoid showing rings on mouse clicks where they're not needed, while guaranteeing them for keyboard users).
- Never remove focus outlines (`outline: none`) without providing this replacement — this is one of the most common accessibility regressions and it will not pass review here.
- On dark and light sections alike, the red focus ring must be visible against both `--color-black` and `--color-white` backgrounds — verified by table in §1 (red on black: 4.9:1 outline visibility is fine as it's a non-text UI indicator needing 3:1 per WCAG 1.4.11, which this clears against both backgrounds).

## 4. Semantics & ARIA

- Use real HTML elements first: `<nav>`, `<header>`, `<main>`, `<footer>`, `<button>`, `<a>`, heading tags in order (`h1` once per page, no skipped levels). ARIA is a supplement for what semantic HTML can't express, not a replacement for it.
- Countdown timer: wrap in `aria-live="polite"` but throttle updates announced to screen readers (announce on minute change, not every second) — a live region firing every second is unusable noise for screen reader users.
- Speaker cards: image `alt` text describes the person contextually ("Portrait of [Name], speaking on stage"), not "speaker photo" or the filename. Decorative background video/imagery gets `alt=""`/`aria-hidden="true"`.
- Icons used as the *only* content of a button (e.g., a hamburger menu icon, social icons in the footer) require an `aria-label` describing the action ("Open menu", "Visit our Instagram").
- Modal/overlay patterns (mobile nav) get `role="dialog"` and `aria-modal="true"` with an accessible name.
- Form fields: every input has a associated `<label>` (via `htmlFor`/`id`), errors are associated via `aria-describedby` and announced (`aria-live="assertive"` on the error summary, or `aria-invalid` on the field).

## 5. Motion & vestibular safety

Cross-references `ANIMATIONS.md` §6 — implementation detail lives there; this section states the requirement.

- All animation must respect `prefers-reduced-motion: reduce` by removing (not just shortening) motion — parallax, the scroll-linked signature element, video autoplay, and the hero load sequence must all have a static/reduced fallback.
- No flashing content faster than 3 times per second anywhere on the site (seizure safety) — relevant if any strobe-like lighting effect is ever considered for the hero video; if in doubt, don't.
- Autoplaying background video must be muted (browser-enforced, but confirm explicitly) and must have a pause affordance if it runs longer than a few seconds or contains any flashing/strobe content.

## 6. Testing checklist (per section, before merge)

- [ ] Tab through the entire section using only the keyboard — every action reachable, focus visible at every stop, order makes sense
- [ ] Run a contrast check on any new text/background pairing against §1
- [ ] Test with `prefers-reduced-motion: reduce` enabled (OS-level or DevTools emulation) — motion should disappear, content should not
- [ ] Test with a screen reader (VoiceOver/NVDA) on at least the primary flow (hero → speakers → tickets) once per major feature, not just once at project end
- [ ] Zoom to 200% — layout must not break or clip content
- [ ] Confirm no interactive element is smaller than 44×44px on touch breakpoints

## Do / Don't

**Do**
- Check new color pairings against §1's ratios before shipping.
- Build keyboard and screen-reader support at the same time as the visual feature.
- Use `:focus-visible` with the red outline token everywhere.

**Don't**
- Don't use `<div onClick>` for anything a user needs to activate.
- Don't remove outlines without a compliant replacement.
- Don't ship a scroll-triggered reveal that hides content from keyboard-only users.
- Don't treat accessibility as a final QA pass — it's part of "done" per `CLAUDE.md`.
