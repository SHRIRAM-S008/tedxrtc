# ANIMATIONS.md — Motion System

This file is the **single source of truth for all motion**: easing curves, durations, scroll behavior, transitions, and micro-interactions. All animation is implemented with **Framer Motion**. No other animation library, no raw CSS `@keyframes` for anything beyond trivial, non-orchestrated effects (e.g., a simple opacity fade defined once as a utility).

## 1. Motion philosophy

Motion here should feel like **directed lighting and stage cues**, not "UI juice." Every animation must answer: *what is this revealing, connecting, or emphasizing?* If the honest answer is "nothing, it just makes the element enter," cut it or replace it with a plain, instant state change.

Reference behavior: Apple product pages (motion reveals structure and hierarchy), Linear/Vercel (fast, precise, no bounce), Framer's own marketing site (scroll as storytelling device). Avoid: bouncy spring-everything, confetti/particle effects, parallax applied to every layer indiscriminately, cursor-follow blobs — these read as generic "AI demo" motion rather than authored direction.

**One orchestrated moment beats ten scattered effects.** Prefer a single, well-timed hero sequence on load over sprinkling a hover-scale on every card, every icon, and every image on the page.

## 2. Motion tokens

| Token | Value | Use |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | **Default reveal easing.** Elements entering the viewport, hero sequence. |
| `--ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | Symmetric transitions — page transitions, modal/overlay open+close. |
| `--ease-linear` | `linear` | Continuous/looping motion only (marquee scroll, countdown ticking, video scrim pulse). Never for discrete enter/exit. |

| Duration token | Value | Use |
|---|---|---|
| `--dur-micro` | 150ms | Hover/focus state changes, underline draws |
| `--dur-base` | 300ms | Standard component transitions (button state, card hover) |
| `--dur-moderate` | 500ms | Section reveals, image mask reveals |
| `--dur-slow` | 800ms | Hero headline entrance, large layout shifts |
| `--dur-cinematic` | 1200–1600ms | Full hero load sequence only — used once per page load, not per scroll trigger |

**Stagger:** child elements in a revealing group (e.g., nav links, speaker cards) stagger at `60–100ms` per item, capped at a total group delay of ~`600ms` — beyond that, users perceive lag, not drama.

**Springs (Framer Motion `type: "spring"`)** are reserved for elements that respond to direct user input (drag, cursor-adjacent hover) — e.g., a magnetic button nudge. Config: `{ stiffness: 300, damping: 30 }` for snappy UI response, `{ stiffness: 120, damping: 20 }` for slower, heavier elements (large images). Do not use springs for scroll-triggered reveals — those use the expo/quart eases above for predictable, directed timing.

## 3. Page load sequence

The hero gets one orchestrated entrance, run once on initial load (not re-triggered on route change back to home):

1. Scrim/background settles first (video starts playing or image fades in), `--dur-slow`.
2. Eyebrow (event date/location, mono) fades up, `--dur-base`, `--ease-out-expo`.
3. Headline reveals — preferred technique: a mask-wipe or line-by-line clip-path reveal (not a generic fade+translateY on the whole block), `--dur-cinematic`, staggered per line at `~100ms`.
4. CTA and secondary elements fade up last, `--dur-base`.

Implement with a single parent `motion` component using `variants` and `staggerChildren`, not independent timers per element — this keeps the sequence resilient to layout changes.

```tsx
const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

<motion.div variants={heroContainer} initial="hidden" animate="visible">
  <motion.p variants={heroItem} className="text-eyebrow">TEDxRATHINAM TECHNICAL CAMPUS — COIMBATORE</motion.p>
  <motion.h1 variants={heroItem} className="text-display-xl">...</motion.h1>
  <motion.div variants={heroItem}><Button>Get Tickets</Button></motion.div>
</motion.div>
```

## 4. Scroll-triggered reveals

Use `whileInView` (via `useInView`/`viewport` prop) with `once: true` — content reveals as the user scrolls to it, and does not re-animate on scroll-back, which reads as glitchy rather than cinematic.

- Default section entrance: opacity `0→1` + `translateY: 32px→0`, `--dur-moderate`, `--ease-out-expo`, `viewport={{ once: true, amount: 0.3 }}`.
- Speaker/card grids: stagger children per the stagger rule above; cap simultaneous animating items to avoid jank on mobile (see `PERFORMANCE.md`).
- **The one signature scroll interaction** (per `DESIGN.md` §7, e.g., a red line/beam tracing through the page) is implemented with `useScroll` + `useTransform` mapped to scroll progress, applied to exactly one element on the page. This is the "boldness" budget for scroll effects — do not add a second competing scroll-linked effect elsewhere on the same page.
- Avoid parallax on more than one layer per section. Layered parallax on every image is the clearest "generated" tell in motion design right now.

## 5. Micro-interactions

| Element | Interaction |
|---|---|
| Text link / nav link | Underline draws left-to-right from 0 to full width on hover, `--dur-micro`, `transform-origin: left`, using `scaleX` (not `width`, to avoid layout reflow). Reverses on unhover. |
| Primary button | Background color transition only (`--dur-base`); optionally an arrow glyph nudges `4px` right on hover — pick one, not both plus a scale. |
| Speaker card | Image slightly desaturates→saturates or a caption mask slides up to reveal talk description, `--dur-base`. No 3D tilt/parallax-on-hover — overused, feels like a template effect at this point. |
| Form input focus | Border color/width transition `--dur-micro`, no glow/box-shadow bloom. |
| Form validation error | Border flashes to `--color-red` once (`--dur-base`, then holds) — explicitly **not** a shake animation (shake reads as harsh/gamified and is excluded per `ACCESSIBILITY.md` vestibular guidance). |
| Countdown timer digits | Digit flip/roll transition on change, `--dur-base`, `--ease-in-out-quart` — this is part of the signature element treatment, keep it precise and mechanical, not bouncy. |
| Mobile nav open | Full-screen overlay slides/fades in `--dur-moderate`, links stagger in per §2's stagger rule. |
| Page/route transition | Cross-fade, `--dur-moderate`, `--ease-in-out-quart` — avoid full-screen wipe transitions unless it's the deliberate signature treatment for this project (state explicitly if adopted, and apply consistently everywhere or nowhere). |

## 6. Reduced motion

Every animated component must check `prefers-reduced-motion` and respond by **removing motion, not just shortening it**. Use Framer Motion's `useReducedMotion` hook.

```tsx
const shouldReduceMotion = useReducedMotion();

<motion.div
  initial={shouldReduceMotion ? false : "hidden"}
  animate="visible"
  variants={shouldReduceMotion ? {} : heroItem}
/>
```

- Looping/ambient motion (video backgrounds, marquees) pauses or is replaced with a static frame.
- Scroll-linked effects (the signature beam, parallax) are disabled entirely, not slowed down.
- Essential state changes (focus rings, error states) are never gated behind motion — they must be instantly visible regardless of motion preference.

Full checklist cross-referenced in `ACCESSIBILITY.md` §5.

## 7. Performance guardrails for motion

(Full budgets in `PERFORMANCE.md` — summarized here for motion-specific relevance.)

- Animate only `transform` and `opacity`. Never animate `width`, `height`, `top`/`left`, `box-shadow` size, or `filter: blur()` on scroll-linked or frequently-triggered elements — these are not GPU-composited and will cause jank.
- Cap simultaneous `whileInView` animations to what's actually visible in the viewport — don't wire the entire speaker grid's stagger to fire off-screen.
- Video hero background: use `will-change: transform` sparingly and remove it after the load sequence completes, not permanently.

## Do / Don't

**Do**
- Justify every animation against §1's question before writing it.
- Reuse the token table (§2) for every duration/easing value — no inline magic numbers like `duration: 0.42`.
- Respect `prefers-reduced-motion` in every new motion component, from the start.

**Don't**
- Don't add hover-scale to every card/button/image — pick the one interaction per element type defined in §5.
- Don't use spring physics for scroll-triggered content reveals.
- Don't re-trigger the hero load sequence on every route change back to the homepage.
- Don't use shake, confetti, or bounce effects anywhere on this site — they contradict the restrained, cinematic register.
