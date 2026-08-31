# COMPOUND_COMPONENTS.md — Finding & Building the Right Compound Component

`COMPONENTS.md` §3 mentions compound components in passing ("`ProgramTimeline` + `ProgramTimeline.Row`"). This file owns the **full pattern**: how to decide a component should be compound at all, how to structure it in this codebase, and reference implementations for the TEDx-specific components most likely to need it. It does not redefine visual style (`UI_GUIDELINES.md`) or motion (`ANIMATIONS.md`) — it's purely about component API shape.

## 1. What "compound component" means here

A compound component is a parent that provides shared implicit state/context, plus a set of child components (attached via dot notation, e.g., `Accordion.Item`) that consume that context and can be composed, reordered, or partially omitted by whoever's using the component — instead of the parent taking a large flat prop API that tries to describe every internal permutation up front.

The payoff on this project specifically: an editorial site has a lot of components with *varied internal structure per instance* — not every program entry has the same shape, not every ticket tier has the same features, not every FAQ item needs the same layout. Compound components let each usage compose exactly what it needs without the parent component's prop interface growing a new boolean every time content varies slightly.

## 2. Deciding if a component should be compound

Run through this checklist before defaulting to compound — it is a real pattern with real cost (more files, more API surface to learn), not the default choice for every component. This is "finding the best" structure, not "always build the fanciest one."

**Build it compound if:**
- [ ] It has 2+ visually or behaviorally distinct child parts a consumer might reasonably want to reorder, omit, or restyle independently
- [ ] The children need to coordinate on shared state (which item is open, which tab is active, which row is "live now") — context solves this more cleanly than prop-drilling or callback juggling
- [ ] You can already picture the prop API needing 6+ boolean/variant props just to express structural variations ("showIcon," "iconPosition," "hasSubtitle," "layout") — that's usually a sign the real answer is "let the consumer compose it"

**Keep it a plain component if:**
- It has one fixed visual shape used identically everywhere (`Button`, `EyebrowLabel`, `HairlineDivider` from `COMPONENTS.md` §1's `ui/` folder) — compound-ifying a `Button` is pure overengineering
- The "variation" is really just content changing, not structure — a `SpeakerCard` with different names/photos is not a compound-components problem, it's just props
- Only one instance of the component will ever exist on the site (e.g., the `Hero`) — there's no composition flexibility to design for

## 3. Anatomy in this codebase

- Parent component creates a context and a `Root` (or the top-level export itself acts as root), holding shared state.
- Subcomponents are attached to the parent export via dot notation for discoverability at the call site, **and** also individually named-exported from the same file for cases where a direct import reads better — both should resolve to the same component.
- Context is scoped to the compound component's own file/folder — never a global app-wide context for something like "which accordion item is open."

```tsx
// components/sections/ProgramTimeline.tsx
"use client";
import { createContext, useContext, type ReactNode } from "react";

interface ProgramTimelineContext {
  liveSessionId: string | null;
}
const TimelineContext = createContext<ProgramTimelineContext>({ liveSessionId: null });

interface ProgramTimelineProps {
  liveSessionId?: string | null;
  children: ReactNode;
}
function ProgramTimelineRoot({ liveSessionId = null, children }: ProgramTimelineProps) {
  return (
    <TimelineContext.Provider value={{ liveSessionId }}>
      <div role="list" className="divide-y divide-gray-700">{children}</div>
    </TimelineContext.Provider>
  );
}

interface RowProps {
  id: string;
  time: string;
  title: string;
  speakerName?: string;
}
function Row({ id, time, title, speakerName }: RowProps) {
  const { liveSessionId } = useContext(TimelineContext);
  const isLive = id === liveSessionId;

  return (
    <div role="listitem" className="flex gap-6 py-6" aria-current={isLive ? "true" : undefined}>
      <span className="font-mono text-eyebrow text-gray-300">{time}</span>
      <div>
        <p className="text-h3">{title}</p>
        {speakerName && <p className="text-small text-gray-300">{speakerName}</p>}
      </div>
    </div>
  );
}

export const ProgramTimeline = Object.assign(ProgramTimelineRoot, { Row });
// also available directly if preferred: export { ProgramTimelineRoot, Row as ProgramTimelineRow };
```

Usage — this is the payoff: the consumer composes exactly the entries it has, in whatever order, without the parent needing to know the full schedule shape in advance:

```tsx
<ProgramTimeline liveSessionId={currentLiveId}>
  <ProgramTimeline.Row id="doors" time="17:00" title="Doors Open" />
  <ProgramTimeline.Row id="talk-1" time="18:00" title="The Weight of Small Ideas" speakerName="A. Rao" />
  <ProgramTimeline.Row id="break" time="18:45" title="Intermission" />
</ProgramTimeline>
```

## 4. Reference pattern: Accordion (FAQ / expandable speaker bio)

Accordion-style disclosure is the pattern most likely to be reused across the FAQ page and expandable speaker bios — build it once as a compound component rather than twice as two bespoke implementations.

- `Accordion` (root, holds `openId` state)
- `Accordion.Item` (holds an `id`, provides its own sub-context for `Trigger`/`Panel` to know if *this* item is open)
- `Accordion.Trigger` (the clickable header — must be a real `<button>` per `ACCESSIBILITY.md` §2, `aria-expanded` bound to open state)
- `Accordion.Panel` (the collapsible content — `aria-hidden` when closed, animated height/opacity per `ANIMATIONS.md`, not a raw `display: none` toggle with no transition)

Accessibility contract for this specific pattern (full detail in `ACCESSIBILITY.md`, called out here because it's easy to lose in a compound refactor): `Trigger` is keyboard-operable (`Enter`/`Space`, native `<button>` gives this for free), `aria-controls` on the trigger points to the panel's `id`, and only one open item at a time is a *design* choice, not an accessibility requirement — decide and document which behavior this instance uses.

## 5. Reference pattern: TicketTiers

- `TicketTiers` (root, holds `selectedTierId` if selection is interactive)
- `TicketTiers.Tier` (price, name, the red-accent-border treatment for the recommended tier per `UI_GUIDELINES.md` §3)
- `TicketTiers.Feature` (a single line-item within a tier — lets each tier list a different number of features without the parent needing a `features: string[]` prop array that can't express per-feature emphasis or links)

This avoids the common anti-pattern of a `tiers` prop containing a deeply nested array of objects trying to describe every visual permutation — composing JSX children reads more like the editorial content it represents.

## 6. Naming & export conventions

- Dot-notation on the parent (`Accordion.Item`) for call-site discoverability — an editor's autocomplete on `Accordion.` shows every valid child.
- Also export subcomponents individually from the same file (`export { AccordionItem }`) for the rare case a consumer needs to reference the type or wrap it.
- File lives in `components/sections/` (or `components/ui/` if it's truly content-agnostic, like `Accordion`) per the folder split in `COMPONENTS.md` §1 — `Accordion` itself is generic enough to belong in `ui/`; `ProgramTimeline`/`TicketTiers` are TEDx-specific and belong in `sections/`.
- Don't split a compound component's parent and children across multiple files unless the file genuinely grows too large to navigate — co-location keeps the context/state relationship obvious.

## Do / Don't

**Do**
- Run the §2 checklist before building compound — it's a deliberate choice, not a default.
- Scope context to the component's own file, never globally.
- Give every interactive subcomponent (`Trigger`, `Row` if clickable) the same real-element and keyboard requirements as any other interactive UI per `ACCESSIBILITY.md`.

**Don't**
- Don't compound-ify a component that only ever has one fixed shape (`Button`, `EyebrowLabel`).
- Don't let a compound parent's context leak state that unrelated components read — if two different compound components need to share state, that's a sign the state belongs one level higher, not in either component's internal context.
- Don't build two bespoke disclosure/accordion implementations (FAQ vs. speaker bio) when one compound `Accordion` serves both.
