# BRANDING.md — TEDx Visual Identity

This file governs the **visual brand identity marks** of a licensed TEDx event: the logo, the "x," the wordmark, and how this site relates visually to TED itself. Program/legal/content compliance rules (disclaimers, trademark text, talk-video usage) live in `TEDX_RULES.md` — this file is strictly about how the marks look and are used. Where this file and creative ambition in `DESIGN.md` conflict, **this file wins** — brand mark usage is a licensing constraint, not a style choice.

## 1. The core identity rule

TEDx events are **independently organized under license from TED**, not TED-owned events. Every use of the TED name and mark on this site must make that relationship clear and must not imply the event is produced, endorsed, or officially curated by TED itself beyond the license it operates under. This shapes both the logo treatment (§2) and required text (see `TEDX_RULES.md` §1 for the exact disclaimer copy).

## 2. The logo & the "x"

- The standard construction is the **TED wordmark followed by a lowercase "x," with the event name below it** (e.g., "TEDx" over "EventName"), per TED's own brand guidelines for licensed events. Do not invent a new logo lockup, redraw the "TED" wordmark in Fraunces, or merge it into a custom cinematic wordmark — the TED portion of the mark is not this project's to restyle.
- The lowercase "x" is where this event's own identity attaches (e.g., "TEDx**Coimbatore**" or the specific licensed event name) — that portion may carry this site's typographic voice (Fraunces or a treatment consistent with `DESIGN.md`), but the "TED" portion itself stays in its standard form.
- **Never recolor the TED logo itself to pure red as a "hero moment."** The logo is reproduced in its standard black/white/red per TED's own guidelines (red circle behind "TED," black or white wordmark depending on background) — it is not a canvas for this site's art direction. Its size, proportion, and clear space follow TED's licensing guidelines, not this site's grid experiments.
- Maintain clear space around the logo equal to the height of the "T" in "TED" on all sides, minimum, at every placement (nav, footer, hero if used there).
- Do not stretch, skew, rotate, add drop shadows/glows/gradients to, or otherwise "cinematic-ify" the logo mark. It should look identical whether it's on this site or any other licensed TEDx site — consistency across TEDx events is the point of the license.

## 3. Co-branding & hierarchy

- On every page, it must be visually unambiguous that this is **a TEDx event**, not TED itself. The logo lockup (§2) in the nav/footer, plus the required text in `TEDX_RULES.md`, together satisfy this — don't rely on the logo alone if the required text is missing.
- This site's own visual system (`DESIGN.md`'s black/white/red editorial language, Fraunces/Inter/Plex Mono type system) is the **event's** brand voice, layered around the TED mark — not a replacement for it. Think of it as: TED provides the trusted mark, this site provides the specific event's cinematic presentation of it.
- Sponsor/partner logos (if present) are visually subordinate to the TEDx mark — smaller, grouped in the footer or a dedicated sponsors section, never positioned to imply co-equal or superior billing to the TEDx identity itself.

## 4. Voice & tone

- **Confident, curatorial, a little literary — never salesy.** This is closer to a film festival's or a serious publication's voice than a typical event-marketing voice. Avoid exclamation points, avoid "Don't miss out!"-style urgency copy, avoid emoji.
- Talk titles and speaker bios are presented with editorial respect — accurate, specific, third-person, no marketing adjectives stacked in front of every name ("visionary," "world-renowned," "trailblazing" used once across the whole roster, if at all, is plenty).
- The event's own tagline/theme (whatever this specific TEDx event's chosen theme is) should be treated as a real editorial thesis running through the copy — referenced meaningfully in section intros, not just printed once on the hero and forgotten.
- "Ideas worth spreading" (TED's own tagline) may be used per TED's brand guidelines for licensed events, but is not this event's tagline to modify or parody — if used, use it as TED specifies, don't remix the wording.

## 5. Don't-do list specific to brand marks

- Don't create a "dark mode red x" glitch-art version of the logo for the hero, however well it might fit `ANIMATIONS.md`'s cinematic direction — animate *around* the static logo (motion on typography, imagery, layout), not the logo itself, unless TED's guidelines for the specific license explicitly permit motion treatment of the mark.
- Don't use the red circle from the TED logo as a decorative shape elsewhere on the site (e.g., as a bullet point, a background blob, a loading spinner) — it's a protected mark element, not a generic dot graphic.
- Don't pair the TEDx logo with any other event/company logo in a way that implies a joint identity (a merged lockup) — sponsors get their own clearly separated space per §3.

## 6. Project-specific motion exception (supersedes §5's "never animate the mark")

The organizing team explicitly authorized, for this site only, direct cinematic motion treatment on the official lockup itself (`public/images/brand/tedx-rtc-lockup-white.png`) — not just its entrance. This is a deliberate, tracked override of §5's general rule, scoped to exactly these contexts:

- **`TEDxArrival`'s hero reveal** — the logo may resolve via a mask reveal and a blur-to-sharp focus pull, as part of the chapter's one signature moment.
- **`RathinamHero`'s logo reveal** — a masked wipe, blur-to-sharp resolve, and gentle scale (97%→100%) as the section's opening brand moment, plus subtle cursor-reactive parallax on the mark (position/depth only — never rotation or tilt, and never distortion).
- **`Finale`'s closing logo** — a slow, subtle breathing opacity loop and a soft glow layer behind the mark.
- **`Navbar` / `Footer` / `MobileNavOverlay`'s responsive and scroll-adaptive sizing** — the logo may scale smoothly with scroll position or viewport, provided it always scales uniformly (never stretched on one axis) and the source aspect ratio is preserved exactly. This includes `RathinamHero`'s and `Navbar`'s coordinated scroll-tied fade (the hero logo fades out as the navbar logo fades in over roughly the same scroll range), approximating a handoff between the two independent elements rather than a literal single shared element.

**What the override does NOT permit, even in these contexts:** skewing, stretching, or otherwise distorting the mark's proportions; recoloring it; cropping it in a way that separates "TED" from "x" or drops the event name inconsistently; or using it as a decorative shape (background blob, bullet, loading spinner) anywhere else on the site. If a new placement or effect beyond the contexts above is considered later, extend this section first (`WORKFLOW.md §3`) rather than assuming the override applies site-wide.

**Note on `RathinamHero`:** this section was originally built deliberately TEDx-free, to keep the "Rathinam first, TEDx as the next chapter" narrative intact (see the section's own code comments/history). Placing the logo here was a later, explicit decision by the organizing team that supersedes that original choice.

## Do / Don't

**Do**
- Use the standard TEDx lockup (TED wordmark + lowercase x + event name) in nav and footer, unmodified.
- Let this event's own type/color system carry the surrounding site while the mark itself stays standard.
- Keep the relationship to TED unambiguous via mark + required text (`TEDX_RULES.md`).

**Don't**
- Don't redraw, recolor, or restyle the TED wordmark or the red circle. Don't animate it outside the three scoped contexts in §6.
- Don't let sponsor branding visually compete with the TEDx mark.
- Don't drop the disclaimer text because "the logo already makes it obvious" — both are required (see `TEDX_RULES.md` §1).
