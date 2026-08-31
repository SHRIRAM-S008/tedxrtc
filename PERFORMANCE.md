# PERFORMANCE.md — Performance Budgets & Loading Strategy

A cinematic site full of imagery, video, and motion is exactly the kind of build that quietly becomes slow. This file sets hard budgets so visual ambition (`DESIGN.md`, `ANIMATIONS.md`) doesn't come at the cost of a site that feels sluggish — which undermines the "premium" goal as much as a bad layout would.

## 1. Core Web Vitals targets

| Metric | Target | Notes |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.0s (mobile, throttled 4G) | The hero headline or hero image is almost certainly the LCP element — treat it accordingly (§3). |
| CLS (Cumulative Layout Shift) | ≤ 0.05 | Near-zero. Reserve space for every image, video, and web font swap before it loads. |
| INP (Interaction to Next Paint) | ≤ 200ms | Keep animated interactions off the main thread where possible (transform/opacity only, per `ANIMATIONS.md` §7). |
| TTFB | ≤ 600ms | Favor Server Components and static generation over client-side data fetching for content that doesn't need to be dynamic per-request. |

Lighthouse (mobile, throttled) target: **≥ 90** on Performance, **≥ 95** on Accessibility/Best Practices/SEO. Run Lighthouse (or equivalent) before merging any section that adds meaningful new imagery, video, or a new client-side dependency.

## 2. Images

- **Always `next/image`**, never a raw `<img>` — this is not optional, it's how the responsive sizing, lazy loading, and format negotiation (AVIF/WebP) happen.
- Serve responsive `sizes` matching the actual rendered width at each breakpoint from `DESIGN.md`'s grid — don't ship a 2400px-wide speaker portrait to a 360px mobile card.
- Speaker/venue photography: target ≤150KB per image at the served resolution after compression. Hero background image (if not video): ≤300KB.
- Above-the-fold hero image gets `priority` (disables lazy loading for it specifically); every other image lazy-loads by default.
- Reserve aspect ratio via explicit `width`/`height` (or a CSS `aspect-ratio`) on every image to prevent layout shift as it loads — this is the single most common CLS cause on content-heavy sites.

## 3. Video (hero background)

Cinematic hero video is one of the highest-risk performance items in this project — budget it deliberately:

- Total hero video weight ≤ **2.5MB** for a ~10–15s muted loop, H.264/MP4 + WebM/AV1 fallback, encoded at the actual display resolution (don't ship 4K source to a viewport that renders at 1920px max).
- Video is **not** the LCP-blocking element — the headline text (or a poster-frame `<img>` shown instantly while video loads) must paint immediately; video fades in once ready, per the load sequence in `ANIMATIONS.md` §3.
- Below `md` breakpoint (`DESIGN.md` §5), consider swapping video for a static, optimized poster image entirely — mobile network conditions and battery cost rarely justify autoplay video at that size, and the cinematic effect can be preserved through the static frame + type motion instead.
- `preload="auto"` only on desktop/fast-connection contexts; respect `navigator.connection.saveData`/`effectiveType` where feasible to skip video entirely on slow connections.
- Always `muted`, `playsInline`, `loop` — never rely on unmuted autoplay (browsers block it anyway, and it would be a poor experience regardless).

## 4. Fonts

- Self-host Fraunces, Inter, and IBM Plex Mono (via `next/font/local` or `next/font/google`) rather than a runtime `<link>` to an external CDN — removes a render-blocking round trip and avoids third-party layout shift.
- Load only the weights/styles actually used per `DESIGN.md` §3 (Fraunces: the display weights used; Inter: regular + 600 + maybe 500; Plex Mono: regular, letter-spaced via CSS not a separate wide-tracking font file).
- `font-display: swap` with a matched fallback font stack (`size-adjust`/fallback metrics via `next/font`'s built-in adjustment) so the fallback-to-webfont swap doesn't cause a visible reflow — this directly protects the CLS budget in §1.
- Variable fonts (Fraunces and Inter are both used as variable) — load the variable file once rather than multiple static weight files, reducing total font payload.

## 5. Code splitting & bundle budget

- Route-level code splitting is automatic via the App Router — keep it that way by not importing heavy, page-specific logic into shared layout files.
- Framer Motion: import only what's used (`motion`, specific hooks) rather than any barrel import that pulls in the full library surface unnecessarily.
- Any third-party script (analytics, a map embed for the venue section, a ticketing widget/iframe) loads via `next/script` with an appropriate `strategy` (`lazyOnload`/`worker` for non-critical, `afterInteractive` for things needed soon after load) — never a blocking synchronous `<script>` in `<head>`.
- JS budget target: ≤170KB gzipped of route-specific JS for the homepage (excluding the Next.js/React framework baseline). If a single feature (e.g., an interactive venue map) would blow this budget, lazy-load it behind an interaction (`dynamic(() => import(...), { ssr: false })`) rather than shipping it in the initial bundle.
- CSS: Tailwind's production build already purges unused classes — don't undermine this with large blocks of inline `style` objects that bypass the design token system anyway (also a `CODE_STYLE.md` violation).

## 6. Animation performance

(Cross-references `ANIMATIONS.md` §7 — repeated here as a budget, not a re-explanation.)

- Scroll-linked and `whileInView` animations must animate only `transform`/`opacity`.
- Cap the number of simultaneously-mounted, actively-animating elements — a 12-speaker grid animating all at once on scroll should be virtualized/staggered so only what's entering the viewport is actively transitioning.
- Verify 60fps (or consistent frame pacing) during the hero load sequence and any scroll-linked signature element on a mid-tier mobile device profile, not just on a development machine.

## 7. Monitoring

- Wire up Core Web Vitals reporting (e.g., via Vercel Analytics/Speed Insights or `web-vitals` reporting to your analytics endpoint) so regressions are caught after ship, not just at build time.
- Treat a Lighthouse or field-data regression on LCP/CLS as a blocking bug, same severity as a visual bug — performance is part of "premium," not a separate concern from it.

## Do / Don't

**Do**
- Budget hero video/image weight before building the section, not after it feels slow.
- Use `next/image` and `next/font` for everything, always.
- Lazy-load anything below the fold or behind an interaction.

**Don't**
- Don't ship unmuted autoplay video or full-resolution source assets to the browser.
- Don't animate layout-triggering CSS properties on scroll.
- Don't add a third-party embed (maps, ticketing) with a blocking synchronous script tag.
