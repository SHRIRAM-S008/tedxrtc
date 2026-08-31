@AGENTS.md

# CLAUDE.md — Project Instructions

These are **permanent, standing instructions** for this codebase, not onboarding docs. Read this file first on every session. It tells you what this project is, what "good" looks like, and which file governs which decision. Do not restate rules from other files here — this file routes you to them.

## What this project is

A cinematic, editorial, Awwwards-tier website for a **TEDx event** — TEDxRathinam Technical Campus (TEDxRTC), a student-led event in Coimbatore. Not a template WordPress-style conference site. The bar is: someone lands on the hero, and within two seconds feels this is a premium, curated, emotionally serious event worth their evening — closer to a film's landing page or a Stripe/Linear product launch than a typical "conference site."

**Style:** cinematic, immersive, editorial.
**Mood:** premium, minimal, bold, emotionally engaging.
**Palette:** black, white, TED red — nothing else, ever, without a documented reason (see `DESIGN.md`).
**Posture:** desktop-first (this is where the cinematic details land hardest), fully responsive down to 360px.

## Tech stack (non-negotiable)

- **Next.js** (App Router) — Server Components by default, Client Components only where interactivity requires it
- **React** (latest stable) — function components, hooks, no class components
- **TypeScript** — strict mode, no implicit `any`
- **Tailwind CSS** (v4, CSS-first `@theme` in `globals.css`) — token-driven, no arbitrary magic numbers (see `CODE_STYLE.md`)
- **Framer Motion** — all animation and gesture work (see `ANIMATIONS.md`)

Do not introduce a competing library for something the above four already do (no jQuery, no GSAP alongside Framer Motion, no CSS-in-JS runtime, no Bootstrap/MUI/Chakra). If a real gap exists, propose it explicitly and explain the gap before adding it.

**Scoped exception — Three.js / React Three Fiber.** `three`, `@react-three/fiber`, `@react-three/drei`, and `@react-three/postprocessing` are approved for **exactly one signature 3D moment: the Speakers section's hologram reveal** (`components/sections/SpeakerHologram.tsx`). This is a real gap Framer Motion can't fill (WebGL scenes, particles, bloom) — not a second animation engine competing with it; Framer Motion still owns every 2D transition on the site. Requirements for this exception to stay valid:
- **Lazy-loaded and code-split** (`next/dynamic`, `ssr: false`) so the R3F bundle never ships to routes/sections that don't use it.
- **A real fallback** — no WebGL support, `prefers-reduced-motion`, or a low-end-device heuristic all render the CSS/Framer Motion version instead, never a broken or blank scene.
- **Do not extend this to other sections** without updating this note first (same discipline as `WORKFLOW.md §3` for any new architectural pattern) — the "one 3D moment" budget is deliberate, mirroring `ANIMATIONS.md §1`'s "one orchestrated moment beats ten scattered effects."
- Still governed by `PERFORMANCE.md`'s budgets — a 3D scene that blows LCP/bundle-size targets on the actual target audience (mobile-heavy, Coimbatore college students on mixed network quality) has failed regardless of how it looks.

**Scoped exception — GSAP (`ScrollTrigger`, `SplitText`).** `gsap` is approved for **exactly two uses**: (1) the Event Information section's pinned/sticky chapter timeline (`components/sections/EventInformation.tsx`), where pinning a fixed background against scroll-scrubbed foreground content swaps is outside what Framer Motion's `useScroll`/`useTransform` cleanly expresses; (2) the shared chapter-heading reveal (`components/motion/SplitTitle.tsx`) used once at the top of each scroll-triggered homepage section, where `SplitText`'s per-line splitting has no Framer Motion equivalent (the page's very first hero headline uses Framer Motion's on-load mask reveal instead, matching the rest of `ANIMATIONS.md §3`'s load sequence — `SplitTitle` is for in-view scroll reveals, not the initial paint). Framer Motion still owns every other transition, parallax, and reveal on the site — this is not a second general-purpose animation engine, the same discipline as the Three.js exception above. Requirements for this exception to stay valid:
- **Lazy-loaded and code-split** (`next/dynamic`, `ssr: false`), mounted only once its section is actually about to scroll into view — GSAP never ships in the initial bundle.
- **`ScrollTrigger` instances are `.kill()`d on unmount** — no leaked pins/scrubs across navigation or re-render.
- **Entirely skipped under `prefers-reduced-motion`** — no pin, no split, the final static state renders immediately, not a slowed-down version.
- **Do not extend this to a third use** without updating this note first (`WORKFLOW.md §3`) — same fixed budget discipline as the Three.js exception.
- Still governed by `PERFORMANCE.md`'s JS bundle budget.

## How this instruction system works

This project is governed by fourteen files. Each one **owns its domain exclusively** — if two files seem to disagree, the owning file wins. Don't duplicate a rule from another file; link to it by name instead.

| File | Owns |
|---|---|
| `CLAUDE.md` | This file. Identity, stack, workflow, quality bar. |
| `WORKFLOW.md` | Build order, the per-task development loop, review gates, content-update process. |
| `DESIGN.md` | Color, typography, spacing, grid, imagery, iconography, the site's visual "thesis." |
| `UNFINISHED_THEME.md` | The "looks unfinished, functions finished" creative concept: the signature revision-mark hero, supporting motifs, and strict limits on where it applies. |
| `UI_GUIDELINES.md` | How components look and behave: buttons, nav, forms, cards, section layouts, responsive rules. |
| `ANIMATIONS.md` | Motion tokens (easing/duration), reveal patterns, transitions, micro-interactions, motion performance. |
| `SMOOTH_SCROLL.md` | The scroll mechanism itself: Lenis setup, Framer Motion sync, scroll-linked effects, mobile/a11y handling for scroll. |
| `COMPONENTS.md` | React/file architecture: folder structure, component anatomy, props, composition. |
| `COMPOUND_COMPONENTS.md` | When and how to build compound components: decision checklist, context pattern, reference implementations. |
| `ACCESSIBILITY.md` | WCAG target, contrast, keyboard, focus, ARIA, reduced motion, testing. |
| `PERFORMANCE.md` | Core Web Vitals budgets, image/video/font loading, bundle size, code splitting. |
| `CODE_STYLE.md` | TypeScript/React/Tailwind conventions, naming, formatting, folder rules. |
| `BRANDING.md` | TEDx visual identity: logo, the "x" mark, wordmark, co-branding with TED. |
| `TEDX_RULES.md` | Program/content compliance: required disclaimers, talk video embedding, trademarks, code of conduct. |

`AGENTS.md` (imported at the top of this file) carries the Next.js-version agent rules — it is auto-generated by `next dev`, not part of the design system above.

**Workflow rule:** before building a new section or component, check `DESIGN.md` + `UI_GUIDELINES.md` for the visual pattern, `ANIMATIONS.md` for how it should move, `COMPONENTS.md` for where the file lives, and `ACCESSIBILITY.md` + `PERFORMANCE.md` as a pre-ship checklist. This is not optional ceremony — skipping it is exactly how a project drifts back into generic template output.

## The five non-negotiables

1. **Nothing ships that looks like a Tailwind starter template.** No generic centered-hero-with-gradient-blob, no default shadcn card grid presented as "the design," no stock-photo-of-diverse-people-in-suits hero image. Every screen must contain at least one deliberate, subject-specific choice (see `DESIGN.md` → Signature Element).
2. **Black, white, TED red — no exceptions without a written reason in the PR/commit.** No accidental blues from a default UI library, no pastel success/error states. See `DESIGN.md` for how to express states within this palette.
3. **Motion is directed, not decorative.** Every animation must be traceable to a principle in `ANIMATIONS.md`. If you can't say *why* something animates, cut it.
4. **Accessible by default, not by retrofit.** Contrast, focus states, and reduced-motion support are written at the same time as the visual feature — not added in a cleanup pass. See `ACCESSIBILITY.md`.
5. **This is a licensed TEDx event, not TED itself.** Every page must respect `BRANDING.md` and `TEDX_RULES.md` — this is a legal/trademark constraint, not a style preference, and it overrides visual ambition when the two conflict (e.g., you may not resize or recolor the TED "x" mark for a cool hero moment).

## Definition of done

A section/page is done when it satisfies all of:

- [ ] Matches the token system in `DESIGN.md` (no off-palette colors, no off-scale spacing or type)
- [ ] Follows the component/layout pattern in `UI_GUIDELINES.md` or introduces a new one that's documented there
- [ ] Motion follows `ANIMATIONS.md`, including `prefers-reduced-motion` handling
- [ ] Passes the `ACCESSIBILITY.md` checklist (contrast, keyboard, focus, semantics)
- [ ] Passes the `PERFORMANCE.md` budgets (LCP/CLS targets, image/video weight, no layout thrash)
- [ ] Code follows `CODE_STYLE.md` (types, structure, naming)
- [ ] Brand and legal marks follow `BRANDING.md` and `TEDX_RULES.md`
- [ ] It would not embarrass this project if submitted to Awwwards

## When instructions seem to conflict with a request

If a stakeholder or task asks for something that breaks a rule here (e.g., "make the logo bigger and change it to red," or "add a bouncy confetti animation everywhere"), don't silently comply and don't silently refuse. Say what the instruction system says, propose the on-brief alternative, and implement that unless overridden explicitly and knowingly.
