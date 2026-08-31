# PHOTO_ALIGNMENT.md — Image Prep & Placement Guide

This file lists **every image slot currently a placeholder** in the site, the exact
crop/aspect/format each one needs, where the file goes, and how the motion around
it behaves — so a photo you drop in looks intentional instead of stretched, cropped
wrong, or fighting the animation.

Folders are already scaffolded:

```
public/images/hero/
public/images/event/
public/images/speakers/
public/images/venue/
```

Drop files with the exact names below — filenames are referenced directly in the
guidance so swaps stay a one-line change in code.

---

## 1. Hero background — `src/components/sections/Hero.tsx`

**Slot:** full-bleed background behind the headline, currently a gray gradient div.

| Spec | Value |
|---|---|
| File | `public/images/hero/hero-bg.jpg` (or `.mp4` if using video) |
| Aspect ratio | 16:9 minimum, wider is safer (site crops to viewport, `100svh` tall) |
| Min resolution | 2400×1350px (must hold up full-bleed on large desktop) |
| Format | `.jpg` (photo) or `.mp4` (silent, looping, <8s) — see ANIMATIONS.md §3 step 1 |
| Focal point | **Keep the subject in the right half or center.** Text sits in the left ~55% of the frame (`pl-8 lg:pl-24`, `max-w-5xl`) with a black-to-transparent scrim over it. A left-heavy subject will be swallowed by the scrim. |
| Safe zone | Bottom-left corner (`bottom-8 left-6 md:left-[120px]`) is reserved for the city/date/tag line — avoid busy detail there. |
| Motion behavior | Parallax on scroll (`y1` translates 0→200px over first 1000px scrolled) + fades out by `scrollY: 500`. **Frame the photo with ~15–20% extra headroom top and bottom** so the parallax drift never reveals a hard edge. |
| Reduced motion | Parallax/fade disables automatically — image must also read well fully static. |

If no hero photo is ready yet, leave this slot as-is; the gradient placeholder is a
deliberate fallback, not a bug.

---

## 2. About section — "Event Photo" torn-edge panel — `src/components/sections/About.tsx`

**Slot:** the jagged/torn-edge photo under the "WRITTEN, REWRITTEN, DELIVERED" copy.

| Spec | Value |
|---|---|
| File | `public/images/event/about-photo.jpg` |
| Aspect ratio | **16:9 exactly** (container is `aspect-[16/9]`, `max-w-2xl`) |
| Min resolution | 1600×900px |
| Format | `.jpg` or `.webp` |
| Focal point | **Center-weighted, no important detail in the bottom 8%.** The torn edge is a CSS `clip-path` that eats a jagged strip along the bottom of the frame (down to ~94–99% height in a sawtooth pattern) — anything critical near the very bottom will get clipped unevenly. |
| Motion behavior | Enters via `RevealOnScroll` (opacity 0→1, translateY 32→0, `--dur-moderate`, triggers once at 30% in view) — no crop concerns here, just a straight fade-up, so a normal centered crop is safe. |
| Suggested subject | A candid crowd/stage shot from a past event — this is the section literally illustrating "the event," so avoid portraits here (those belong in speakers). |

---

## 3. Speaker cards — `src/components/sections/SpeakerCard.tsx` (4 cards, `speakers.ts`)

**Slot:** full-bleed portrait behind each speaker's name/teaser, currently a "PHOTO"/"TBA" watermark.

| Spec | Value |
|---|---|
| Files | `public/images/speakers/s1.jpg`, `s2.jpg`, `s3.jpg`, `s4.jpg` (matches `id` in `speakers.ts`) |
| Aspect ratio | **4:5 exactly** (`aspect-[4/5]` card) |
| Min resolution | 1200×1500px |
| Format | `.jpg` or `.webp`, consistent color grade across all 4 (they sit in a shared grid) |
| Focal point | **Face/head in the top-to-middle third.** A black gradient scrim (`from-black via-black/40 to-transparent`) rises from the bottom ~60% of the card to hold the name/domain tag text — a chest-up portrait with the face above that scrim line reads best. Avoid a subject looking down-and-out-of-frame near the bottom edge. |
| Crop discipline | **Same eye-line height across all 4 photos** if possible — the grid reads as one cast lineup, so mismatted head positions between cards is the most common flaw here. |
| Motion behavior | On scroll-in, an incomplete red ring around the "SPEAKER 0N" number animates closed (`pathLength` 0.8→1, 1.5s). On hover, content shifts up 16px (`-translate-y-4`) and the teaser slides in from below — the **bottom ~15% of the image will be increasingly covered on hover**, so don't put a subject's hands/key detail right at the bottom edge if it needs to stay visible on hover. |
| Wiring it up | `speaker.imageUrl` already exists on the `Speaker` type but isn't rendered yet — once photos are in place, `SpeakerCard.tsx` needs a `<Image src={speaker.imageUrl} fill className="object-cover" />` swapped in for the placeholder `<span>PHOTO</span>` block, and `speakers.ts` needs `imageUrl: "/images/speakers/s1.jpg"` set per speaker alongside flipping `announced: true`. |

---

## 4. Venue map panel — `src/components/sections/Venue.tsx`

**Slot:** the framed map placeholder linking out to Google Maps.

| Spec | Value |
|---|---|
| File | `public/images/venue/map-still.jpg` (optional — a static, restyled map screenshot) |
| Aspect ratio | **4:3 exactly** (`aspect-[4/3]`) |
| Format | `.jpg` or `.png` |
| Note | This section is white-background / high-contrast per DESIGN.md §2 — a raw default-styled Google Maps screenshot will look off-brand. If you don't have a restyled/high-contrast static map, **leave this placeholder as-is** rather than dropping in a stock map screenshot. |
| Motion behavior | Simple `RevealOnScroll` fade-up, delay 0.2s — no crop-sensitive animation. |

---

## Ordering checklist (do this order to avoid rework)

1. **Speaker photos first** (`s1`–`s4`, 4:5) — highest visual impact, most visible section, and the only place where a mismatched crop across a set is obvious at a glance.
2. **About event photo** (16:9) — one photo, straightforward fade, low risk.
3. **Hero background** — highest quality bar (it's full-bleed and parallaxes), do this once you have a hero-worthy shot; don't rush a placeholder photo into this slot just to fill it.
4. **Venue map still** — optional, skip unless you have a properly restyled static map.

## General rules across every slot

- **No stretching.** Every container above uses `object-cover`-style full-bleed framing — crop to the exact aspect ratio listed before exporting, don't rely on CSS to "fit" a mismatched ratio.
- **Consistent color grade** across speaker photos and the About/Hero photos if they're from the same shoot — the site is high-contrast black/white/red (`DESIGN.md`), so avoid warm/orange-cast photos that clash with the red accent (`--color-red`).
- **Compress before committing** — target under ~300KB per speaker photo and under ~500KB for the hero/about images (`PERFORMANCE.md`). Use `.webp` if you need the extra headroom.
