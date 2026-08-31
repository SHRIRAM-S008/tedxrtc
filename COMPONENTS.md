# COMPONENTS.md — Component Architecture

This file governs **file structure, component anatomy, and composition patterns**. Visual appearance is defined in `DESIGN.md`/`UI_GUIDELINES.md`, motion in `ANIMATIONS.md`, code conventions in `CODE_STYLE.md` — this file is about how components are organized and composed, not how they look.

## 1. Folder structure

```
src/
  app/                        # Next.js App Router routes
    layout.tsx
    page.tsx                  # Home
    speakers/page.tsx
    program/page.tsx
    venue/page.tsx
    tickets/page.tsx
  components/
    ui/                       # Primitive, reusable, content-agnostic
      Button.tsx
      Input.tsx
      Card.tsx
      EyebrowLabel.tsx
      HairlineDivider.tsx
    layout/                   # Structural, page-shell pieces
      Navbar.tsx
      MobileNavOverlay.tsx
      Footer.tsx
    sections/                 # Page-specific, content-aware composites
      Hero.tsx
      SpeakerGrid.tsx
      SpeakerCard.tsx
      ProgramTimeline.tsx
      VenueDetails.tsx
      TicketTiers.tsx
      CountdownTimer.tsx
    motion/                   # Shared motion primitives/wrappers
      RevealOnScroll.tsx
      StaggerGroup.tsx
      MarqueeText.tsx
  lib/
    data/                     # Speaker, schedule, ticket content (see §4)
    utils/
    hooks/
      useCountdown.ts
      useScrollProgress.ts
  styles/
    globals.css                # Tailwind entry + CSS custom properties from DESIGN.md
  types/
    speaker.ts
    schedule.ts
    ticket.ts
```

**Rule of thumb:** `ui/` knows nothing about TEDx (it would work in any project); `sections/` is where TEDx-specific composition happens; `layout/` is shared page chrome. If you're about to put event-specific copy or data inside `ui/`, it belongs in `sections/` instead.

## 2. Component anatomy

Every component follows this shape, in this order:

```tsx
// 1. Imports — external, then internal (absolute paths via `@/`)
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { Speaker } from "@/types/speaker";

// 2. Types — explicit prop interface, no inline object types for anything reused
interface SpeakerCardProps {
  speaker: Speaker;
  featured?: boolean;
  index: number; // used for stagger/eyebrow numbering, not just React key
}

// 3. Component — function declaration, not const arrow, for named-export clarity
export function SpeakerCard({ speaker, featured = false, index }: SpeakerCardProps) {
  // 4. Hooks first
  // 5. Derived values
  // 6. Render — early return for loading/empty states before the main JSX
  return (/* ... */);
}
```

- **Named exports**, not default exports, for everything in `components/` — improves refactor safety and import consistency. Default exports are reserved for `app/**/page.tsx` and `layout.tsx` (Next.js requirement).
- **Server Components by default.** Add `"use client"` only when a component uses state, effects, browser APIs, or Framer Motion's interactive hooks (`useScroll`, `useInView` with certain configs, event handlers). Keep the client boundary as low in the tree as possible — e.g., `SpeakerGrid` can be a Server Component that fetches/maps data, while only `SpeakerCard`'s hover-reveal interaction needs to be client.
- Props are explicit and typed — no `any`, no untyped spreads of unknown shape. Optional props get sensible defaults, not `undefined` checks scattered through the render.

## 3. Composition patterns

- **Sections compose primitives, they don't reimplement them.** `TicketTiers` uses `Card` and `Button` from `ui/`; it doesn't hand-roll its own button styling.
- **Motion is wrapped, not inlined repeatedly.** Common reveal patterns live in `components/motion/RevealOnScroll.tsx` and `StaggerGroup.tsx` (thin wrappers around the variants defined in `ANIMATIONS.md`) so every section uses the same entrance behavior by construction, not by copy-paste discipline.

```tsx
// components/motion/RevealOnScroll.tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function RevealOnScroll({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

- **Compound components** for anything with tightly coupled internal parts (e.g., `ProgramTimeline` + `ProgramTimeline.Row`) rather than one component taking a dozen boolean props to control internal structure.
- **No prop-drilling past two levels.** If a value needs to reach three+ levels deep (e.g., the current countdown target date), lift it to a small context or a hook in `lib/hooks/`, not threaded through every intermediate component's props.

## 4. Content & data

- Speaker, schedule, and ticket content lives in typed data files under `lib/data/` (or a CMS/JSON fetch at build time) — **never hardcoded inline in a section component's JSX.** This keeps content edits (a very real, frequent need for an event site — speakers change, times shift) from requiring a code-literate edit to a component file.

```ts
// types/speaker.ts
export interface Speaker {
  id: string;
  name: string;
  talkTitle: string;
  bio: string;
  imageUrl: string;
  featured?: boolean;
}
```

- Anything that will realistically change close to the event (schedule times, ticket availability) should be structured so it *could* move to a CMS/API without a rewrite — don't tightly couple presentation components to a specific static data shape if a fetch would do.

## 5. Key TEDx-specific components (spec summary)

| Component | Responsibility | Notes |
|---|---|---|
| `Hero` | Load sequence, event date/venue, primary CTA, signature element anchor | Client component (motion), Server-fetches static copy where possible |
| `CountdownTimer` | Live countdown to event date | Client component, uses `useCountdown` hook, must handle event-has-passed state gracefully (don't show negative numbers) |
| `SpeakerGrid` / `SpeakerCard` | Roster display | Grid is Server Component mapping data; Card's hover-reveal is client-only, isolated |
| `ProgramTimeline` | Schedule/agenda | Compound component, Server-renderable (no interactivity required unless filtering is added) |
| `VenueDetails` | Address, transit, map | Server Component; map embed isolated as its own client component if interactive |
| `TicketTiers` | Pricing/CTA | Server-rendered tiers, client-only for any interactive selection state |
| `Navbar` / `MobileNavOverlay` | Site chrome, scroll-aware styling | Client (uses scroll position); overlay is a separate component, not a conditional render buried in `Navbar` |
| `Footer` | Sitemap, disclaimer text (`TEDX_RULES.md`), credits | Server Component, static |

## Do / Don't

**Do**
- Keep the Server/Client boundary as low as possible in the tree.
- Put reusable motion patterns in `components/motion/` once, reuse everywhere.
- Type all data shapes in `types/` and keep content out of JSX.

**Don't**
- Don't default-export components inside `components/`.
- Don't build a new one-off button/card style inside a section component — extend `ui/` instead, and update `UI_GUIDELINES.md` if it's a genuinely new pattern.
- Don't mark a whole page `"use client"` because one small widget on it needs interactivity — isolate the client boundary.
