# TEDX_RULES.md — Program, Content & Compliance Rules

This file governs **content and program compliance** for a licensed TEDx event site — required disclaimer text, how TED Talk video is embedded, trademark usage in copy, curation/application content, and privacy/ticketing basics. `BRANDING.md` governs the *visual* identity marks (logo, wordmark) — this file governs *words, video, and process*. Where these rules conflict with a design or copy preference elsewhere, **these rules win**; they exist because the event operates under a license, not because of house style.

## 1. Required disclaimer text

Every TEDx site must carry the standard independence disclaimer, in the footer at minimum (and optionally repeated on an About/FAQ page). Do not paraphrase it creatively to fit the editorial voice — this is fixed language from TED's own guidelines for licensed events:

> *"This independent TEDx event is operated under license from TED."*

Place it in the footer per `UI_GUIDELINES.md` §3 (Footer), set in `--text-small`, always legible (don't set it in low-contrast gray-on-gray in the name of minimalism — it must clear the same contrast rules as any other body text per `ACCESSIBILITY.md`).

## 2. Trademark usage in copy

- "TED," "TEDx," and "TEDx[EventName]" are used correctly and consistently — capitalization matters ("TEDx," never "Tedx" or "TEDX"). Establish the full licensed event name once prominently (e.g., in the hero or About section) and it may be shortened consistently after that within a page.
- "TED Talk" refers specifically to talks from the main TED conference; talks given *at this event* are correctly called "TEDx talks" or "talks from TEDx[EventName]," not "TED Talks," in all copy (nav labels, section headers, meta descriptions) — this is a real, common mislabeling error to avoid.
- Do not use "TED" or "TEDx" as a verb, a possessive modifier of unrelated products, or in a way that implies TED itself endorses claims made elsewhere on the site (sponsor claims, speaker credentials, ticket guarantees).

## 3. Talk video embedding

- Past TED Talks referenced or embedded on the site (e.g., a "in the spirit of" trailer reel, or a previous year's talks from this same TEDx event) must be embedded via the **official TED.com or official TEDx YouTube embed**, not re-uploaded, re-hosted, re-encoded, or re-cut. This applies regardless of how much better a custom-cropped, re-graded version would fit the cinematic hero aesthetic in `DESIGN.md`.
- Custom hero video (crowd shots, stage lighting, this event's own b-roll) is not affected by this rule — that's original footage this event owns or has rights to, and is treated per `DESIGN.md` §6 / `PERFORMANCE.md` §3.
- If this year's talks will be published on the TEDx YouTube channel post-event, the site should link out to or embed from that official channel once available, rather than hosting talk video directly, to stay within standard TEDx content distribution practice.

## 4. Speaker & curation content

- Speaker bios and talk descriptions must be presented as this event's own curated content, factually accurate, and not implied to be TED-vetted beyond the standard TEDx curation process. Avoid copy like "hand-picked by TED" — the organizing team curates the roster, TED licenses the format.
- If an "Apply to speak" or "Nominate a speaker" flow exists, the copy should set honest expectations about the process and timeline (review period, selection criteria, response policy) — treat this the same way `docx`/copy-writing guidance elsewhere in this system treats interface copy: plain, specific, no overpromising ("guaranteed slot," "certain to be selected").

## 5. Code of conduct

- A code of conduct (or a link to one) should be present and reachable from the footer — standard practice for TEDx events and increasingly expected by attendees. If the organizing team has an existing one, link it; if not, flag this as a content gap rather than inventing legal-sounding policy text unprompted.

## 6. Privacy & ticketing

- Any form that collects personal data (ticket purchase, speaker application, newsletter signup) needs a visible link to a privacy policy at the point of collection, and should collect the minimum data needed for that specific action — don't add "nice to have" fields (phone number, company, job title) to a simple ticket form without a stated reason.
- If ticketing is handled by a third-party platform (embedded widget or external redirect), be explicit in the UI about the handoff ("You'll complete checkout on [Platform]") rather than presenting it as if this site processes payment directly, per `UI_GUIDELINES.md` §5's honesty-in-forms principle.
- Consent for any marketing communication (e.g., "email me updates about next year's event") is opt-in via an unchecked checkbox, never pre-checked.

## 7. Sponsor content

- Sponsor logos/acknowledgements are factual and placed per `BRANDING.md` §3 (subordinate to the TEDx mark). Sponsor copy describes the relationship plainly ("This event is supported by...") rather than implying sponsors curate or influence the talk content.

## Do / Don't

**Do**
- Keep the independence disclaimer in the footer on every page, at full legible contrast.
- Embed past TED/TEDx talks via official channels only.
- Use "TEDx talk," not "TED Talk," for talks given at this event.

**Don't**
- Don't re-host or re-cut official TED Talk video.
- Don't imply TED directly curates, endorses, or guarantees anything about this specific event beyond the license relationship.
- Don't collect more personal data in forms than the action requires, and never pre-check marketing consent.
