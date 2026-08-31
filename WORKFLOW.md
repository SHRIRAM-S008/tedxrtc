# WORKFLOW.md — Development Workflow

This file owns **process**: the order the site gets built in, the loop to run for every task, and how to keep the other eleven files and the actual code in sync as the project evolves. It doesn't redefine what "good" looks like (`CLAUDE.md`'s Definition of Done already does that) — it defines the sequence and discipline for getting there.

## 1. Build order for the site

Build foundation-first, then highest-signature-value content first — don't build every page's skeleton before any page is actually good.

**Phase 0 — Foundation**
- Next.js App Router scaffold, TypeScript strict config, ESLint/Prettier per `CODE_STYLE.md`
- `tailwind.config.ts` built directly from `DESIGN.md`'s color/type/spacing/breakpoint tables — this is the first real implementation task, everything else depends on it existing correctly
- Font loading (`next/font`) for Fraunces, Inter, IBM Plex Mono per `PERFORMANCE.md` §4
- `SmoothScrollProvider` wired into root layout per `SMOOTH_SCROLL.md` §3

**Phase 1 — Primitives**
- `ui/` components: `Button`, `Card`, `Input`, `EyebrowLabel`, `HairlineDivider` per `UI_GUIDELINES.md` + `CODE_STYLE.md` §3
- Shared motion wrappers: `RevealOnScroll`, `StaggerGroup` per `COMPONENTS.md` §3 / `ANIMATIONS.md`

**Phase 2 — Shell**
- `Navbar` (scroll-aware) + `MobileNavOverlay` + `Footer` (including the required disclaimer text, `TEDX_RULES.md` §1, and the TEDx logo lockup, `BRANDING.md` §2) per `UI_GUIDELINES.md` §2

**Phase 3 — Hero**
- Built as its own dedicated effort, not squeezed in alongside other sections — it carries the most design/motion/performance risk (video weight, load sequence, the signature element from `DESIGN.md` §7) and sets the bar every later section is judged against
- Ship it, review it against the Definition of Done in `CLAUDE.md` before moving on, even if other sections are still placeholders below it

**Phase 4 — Core content sections**, in this priority order (highest visitor intent first):
1. Speaker roster (`SpeakerGrid`/`SpeakerCard`)
2. Ticket tiers / CTA
3. Program / schedule (`ProgramTimeline`)
4. Venue / logistics

**Phase 5 — Secondary pages**
- FAQ (using the `Accordion` compound component, `COMPOUND_COMPONENTS.md` §4), About/theme page, Code of Conduct (`TEDX_RULES.md` §5), speaker application page if applicable

**Phase 6 — Polish pass**
- Full motion pass against `ANIMATIONS.md`/`SMOOTH_SCROLL.md` (this is when the signature scroll-linked element gets refined, not invented from scratch)
- Full accessibility pass against `ACCESSIBILITY.md` §6's checklist, site-wide, not just per-component
- Full performance pass against `PERFORMANCE.md` budgets, site-wide

**Phase 7 — Pre-launch** — see §5.

## 2. The per-task loop

Run this loop for every component or section, regardless of which phase it falls in. This is the mechanical version of the "workflow rule" already stated in `CLAUDE.md`.

1. **Locate the owning files.** Use `CLAUDE.md`'s routing table — which files govern this task's visuals, motion, architecture, accessibility, and compliance needs.
2. **Read before writing.** Pull the relevant tokens/patterns from those files. Don't start from a blank Tailwind className and "figure it out as you go" — that's how drift back into generic-template output happens.
3. **Build.** Follow `COMPONENTS.md`/`COMPOUND_COMPONENTS.md` for structure, `CODE_STYLE.md` for conventions.
4. **Self-review against the Definition of Done** (`CLAUDE.md`): design tokens, component pattern, motion + reduced-motion, accessibility, performance, code style, brand/legal marks.
5. **If the task doesn't fit an existing pattern** — see §3 before improvising in the component file.
6. **Commit** using the Conventional Commits format from `CODE_STYLE.md` §6, referencing the instruction file the work follows.

## 3. When no existing pattern fits

This is the moment projects most often drift off-brief — a one-off need shows up, and it's faster to just write custom CSS inline than to update a doc. Don't do that. Instead:

1. Identify which file *should* own this pattern (a new color = `DESIGN.md`; a new section layout = `UI_GUIDELINES.md`; a new interaction = `ANIMATIONS.md`; a new architectural pattern = `COMPONENTS.md`/`COMPOUND_COMPONENTS.md`).
2. Add the pattern to that file first — token, rule, or example — so it's documented as a decision, not buried in a component's className string.
3. Then implement it in code, referencing the newly-documented pattern.
4. If it's genuinely a one-off that will never recur (rare), it's fine to implement locally without a doc update — but say so explicitly in the commit message so it's not mistaken for an approved reusable pattern later.

This keeps the instruction system and the codebase from diverging — six months in, the files should still describe what the site actually does, not what it did on day one.

## 4. Content updates (non-code)

Speaker rosters, schedules, and ticket details change frequently and shouldn't require a full dev cycle. Because content lives in typed data files or a fetch layer (`COMPONENTS.md` §4), routine updates are:

1. Edit the data source (`lib/data/*` or the connected CMS/API) — never hand-edit values inside a section component's JSX.
2. Confirm the shape still matches the type in `types/` — a new field on one speaker doesn't get to silently become an untyped bag of extra props.
3. No design/motion/accessibility review needed for pure content edits that use existing fields. A new *kind* of content (e.g., adding video bios where there were only photos before) goes back through the per-task loop in §2, since that's a structural change, not a content edit.

## 5. Pre-launch checklist

Beyond the per-section Definition of Done, run these once, site-wide, before the event site goes live:

- [ ] Lighthouse (mobile, throttled) run on every major page — meets `PERFORMANCE.md` §1 targets
- [ ] Full keyboard-only pass and one screen-reader pass across the entire site, not just the sections tested during build (`ACCESSIBILITY.md` §6)
- [ ] `prefers-reduced-motion` verified site-wide, including `SMOOTH_SCROLL.md`'s scroll behavior
- [ ] No placeholder/lorem ipsum content, no placeholder speaker images left in production data
- [ ] TEDx disclaimer text and logo lockup present and correctly rendered on every page (`TEDX_RULES.md` §1, `BRANDING.md` §2)
- [ ] Ticketing/privacy links live and correct (`TEDX_RULES.md` §6)
- [ ] Cross-browser check (Safari, Chrome, Firefox) and real-device check (at minimum one iOS and one Android device) — smooth scroll and video hero are the highest-risk areas for cross-browser inconsistency
- [ ] 404 page and any error states exist and match the site's visual language, not framework defaults

## Do / Don't

**Do**
- Build the hero to full quality before spreading effort thin across every section.
- Update the owning instruction file before (or alongside) implementing a genuinely new pattern.
- Treat content edits and structural edits as different processes — don't run a full design review for a schedule time change.

**Don't**
- Don't build all pages to 80% before any page is at 100% — this project's value is in the details, and diluted effort reads as diluted effort.
- Don't hand-edit event content inside component JSX.
- Don't skip the pre-launch checklist because individual sections already passed their own review — site-wide issues (motion consistency, cross-browser quirks) only show up when checked holistically.
