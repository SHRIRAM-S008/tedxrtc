> **ARCHIVED / SUPERSEDED — not an active spec.** This is an early brainstorm.
> Its concrete effects (RGB-split/chromatic glitch, CRT scanlines, cyan/cream/amber
> colors, permanent skeleton loaders) **conflict with the shipped design system**:
> off-palette colors violate `DESIGN.md` §2, and glitch/shake/strobe effects are
> explicitly forbidden by `ANIMATIONS.md` §5–6 and `ACCESSIBILITY.md` §5. The
> sanctioned version of the "unfinished" concept — the restrained revision-mark
> hero plus a small, budgeted set of motifs — lives in `UNFINISHED_THEME.md`.
> Kept here only for idea provenance. Do not implement from this file.

# "The Unfinished" — Glitch/Incomplete Design Ideas

Theme read: TEDxRathinam is about unfinished work being carried forward. The
site should *feel* like it's mid-build — not broken, but deliberately
incomplete, like you caught it while someone was still typing. Below are
concrete effects split into: hero text, the code panel on the right, and
global touches that tie the whole site together. Each has ready-to-use
CSS/JS.

---

## 1. Hero headline — "The Unfinished." glitch

**Idea: RGB split / chromatic aberration glitch on load + hover**
Classic glitch look — text splits into red/cyan ghost layers that snap back.

```css
.glitch-heading {
  position: relative;
  color: #f5f0e8;
}
.glitch-heading::before,
.glitch-heading::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  background: inherit;
}
.glitch-heading::before {
  color: #ff2e4d;
  animation: glitch-1 2.5s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}
.glitch-heading::after {
  color: #2ecbff;
  animation: glitch-2 3s infinite linear alternate-reverse;
  clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
}
@keyframes glitch-1 {
  0%, 90%, 100% { transform: translate(0, 0); }
  92% { transform: translate(-3px, 1px); }
  94% { transform: translate(2px, -1px); }
  96% { transform: translate(-1px, 2px); }
}
@keyframes glitch-2 {
  0%, 90%, 100% { transform: translate(0, 0); }
  91% { transform: translate(3px, -2px); }
  95% { transform: translate(-2px, 1px); }
}
```
```html
<h1 class="glitch-heading" data-text="The Unfinished.">The Unfinished.</h1>
```
Keep it subtle — fire the glitch burst for ~200ms every few seconds, not
constantly. Constant glitch reads as broken, not intentional.

**Idea: literal unfinished typography**
Instead of (or in addition to) the RGB glitch:
- Render the last word with a lower opacity / dashed outline, as if it
  hasn't rendered yet: `<span style="opacity:.35; -webkit-text-stroke:1px #f5f0e8; color:transparent">Unfinished.</span>`
- A blinking text cursor `|` after the period, like it's still being typed.
- Strike through a draft word and show the real one next to it:
  ~~The Beginning~~ **The Unfinished.**

**Idea: typing effect on load**
Headline types itself out character by character, then the cursor keeps
blinking — cheap to build, reads immediately as "in progress."

---

## 2. The code panel (right side)

You already have a code-rain background which is great — lean into it being
*visibly broken code*, not just decorative text.

**Idea: syntax-highlighted TODO/FIXME callouts**
You already have `// TODO`, `// FIXME` in there — good. Push further:
- Make 2–3 of these lines pulse a soft red/amber glow so the eye catches
  them first, like a linter flagging errors.
- Add a couple of intentionally "broken" visual states: a red squiggly
  underline under a token (mimic an IDE error), a `▲ Unexpected token`
  tooltip-style label pinned near one line.

```css
.code-error {
  text-decoration: underline wavy #ff4d4d;
  text-underline-offset: 4px;
}
.code-flag {
  animation: pulse-warn 1.8s ease-in-out infinite;
}
@keyframes pulse-warn {
  0%, 100% { opacity: 1; }
  50% { opacity: .4; }
}
```

**Idea: scanline / CRT overlay on the whole code panel**
Makes it feel like a terminal being watched, reinforces "in-progress build."

```css
.code-panel {
  position: relative;
  overflow: hidden;
}
.code-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.15) 0px,
    rgba(0,0,0,0.15) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
  mix-blend-mode: overlay;
}
```

**Idea: code panel "corrupts" on scroll or hover**
On scroll into view, run a 300–500ms burst where a few characters swap to
glitch symbols (`░▒▓#@%&`) then resolve back to real code. Signals
"this is being actively rewritten," which matches the theme directly.

```js
function glitchBurst(el, duration = 400) {
  const original = el.textContent;
  const glitchChars = "░▒▓#@%&$?";
  let frame = 0;
  const interval = setInterval(() => {
    el.textContent = original
      .split("")
      .map(c => (Math.random() < 0.08 ? glitchChars[Math.floor(Math.random()*glitchChars.length)] : c))
      .join("");
    frame++;
    if (frame > duration / 40) {
      clearInterval(interval);
      el.textContent = original;
    }
  }, 40);
}
```

---

## 3. Site-wide "unfinished" language (beyond the hero)

These are cheap, low-risk touches that reinforce the concept everywhere,
not just on the hero — this is what makes a theme feel intentional instead
of a one-off effect on one section.

- **Torn/rough section edges** instead of clean straight dividers between
  sections — use an SVG `clip-path` with a jagged top edge, like a page
  ripped mid-sentence.
- **Dashed/incomplete borders** on cards (Speakers, Program) instead of
  solid ones — e.g. `border: 2px dashed rgba(245,240,232,.3)` — as if the
  layout grid is still visible, construction-blueprint style.
- **Skeleton-loader look, left permanently visible** on 1–2 minor elements
  (e.g. a speaker card that never resolves past its loading shimmer) — a
  wink that says "some of this is still loading."
- **Redacted/blocked-out text bars** over a sentence or two in the About
  section, like classified-document redaction — implies content still
  being finalized. `background: #f5f0e8; color: transparent;` over a span.
- **Grid overlay toggle**: a small corner element (like a wireframe/ruler
  icon) that, on hover, briefly shows the underlying CSS grid lines across
  the page — literally exposing the "unfinished" scaffolding.
- **Version/commit tag in the footer**: `v0.9.1-beta · work in progress`
  or a fake git hash — small detail, reinforces the metaphor, costs nothing.
- **Cursor blink** somewhere persistent (nav logo, footer) — like a text
  input waiting for the next keystroke.

---

## 4. Restraint notes

- Pick **2–3** of these, not all of them — the effect should feel like a
  motif, not noise. My pick: (1) the RGB-split hero glitch on load/hover,
  (2) the code-panel scanline + corrupt-on-scroll burst, (3) dashed card
  borders + footer version tag sitewide.
- Keep glitch bursts short (150–500ms) and infrequent — a glitch that never
  stops just reads as a rendering bug, not a design choice.
- Respect `prefers-reduced-motion` — disable the animated glitches for
  users who have that set, and fall back to the static (dashed border,
  redacted text) versions only.

```css
@media (prefers-reduced-motion: reduce) {
  .glitch-heading::before,
  .glitch-heading::after { animation: none; }
}
```
