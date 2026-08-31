# CODE_STYLE.md — Code Conventions

This file governs **how code is written**: TypeScript, React/Next.js patterns, and Tailwind usage. File/folder architecture and component composition live in `COMPONENTS.md` — this file is about conventions within a file.

## 1. TypeScript

- **Strict mode on**, always. No `any` — use `unknown` with narrowing, or define the real type. If a type is genuinely unknown (e.g., raw third-party API response), model it explicitly and narrow at the boundary, don't let `any` leak into application code.
- Prefer `interface` for object shapes/props (extendable, better error messages), `type` for unions, intersections, and utility-type compositions.
- No non-null assertions (`!`) as a habit — if a value can be null/undefined, handle it (early return, default, or a narrowed guard). Reserve `!` for the rare case where you have information TypeScript can't, and comment why.
- Export types from `types/` and import them where needed — don't redefine the same shape locally in multiple components.
- Enable and respect `noUncheckedIndexedAccess` — array/object index access returns `T | undefined`; handle it rather than assuming presence.

## 2. React / Next.js (App Router)

- **Server Components by default.** Add `"use client"` at the narrowest possible boundary — see `COMPONENTS.md` §2 for the reasoning; this section is about the mechanics.
- Data fetching happens in Server Components (`async` component functions, direct `fetch`/data-layer calls) — not `useEffect` + `useState` loading patterns for data that could be fetched server-side.
- Use React Server Actions for form submissions (ticket signup, speaker application) where feasible, rather than hand-rolled client-side `fetch` + API route boilerplate, unless the interaction genuinely needs client-side optimistic UI.
- Hooks: only call at the top level, only in Client Components or other hooks. Custom hooks (`useCountdown`, `useScrollProgress`) live in `lib/hooks/`, prefixed `use`, and return a typed object/tuple, not a loosely-shaped object built ad hoc at each call site.
- Avoid `useEffect` for anything that isn't a genuine side effect (syncing with a non-React system, subscriptions, imperative DOM/animation library calls). Deriving state from props/state belongs in render, not an effect that copies one into the other.
- Keys in lists: use a stable, meaningful id (`speaker.id`), never array index — index keys break Framer Motion's exit animations and React's reconciliation for reorderable content like a schedule that might get resequenced.

## 3. Tailwind CSS

- **All values come from the token system in `DESIGN.md`.** Configure `tailwind.config.ts` theme (`colors`, `fontSize`, `spacing`, `screens`) from that file's tables — don't use Tailwind's default palette/scale alongside the custom one; extend/replace, don't stack two systems.
- No arbitrary values (`text-[17px]`, `bg-[#e62b1e]`, `mt-[13px]`) except for genuinely one-off, non-reusable cases (a specific `clamp()` fluid value that doesn't fit the scale, or a precise pixel needed to match an external asset) — and even then, prefer adding it to the theme config if it'll be reused more than once.
- Class order: use a consistent automatic sorter (e.g., `prettier-plugin-tailwindcss`) rather than manual ordering discipline — don't spend review time on class order.
- Long className strings on complex components: extract to a `cva` (class-variance-authority) variant definition when a component has real variants (e.g., `Button`'s primary/secondary), rather than chained ternaries inline in the JSX `className`.

```tsx
// components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-colors duration-base",
  {
    variants: {
      variant: {
        primary: "bg-red text-white hover:bg-red-dark",
        secondary: "border border-current bg-transparent hover:text-red hover:border-red",
      },
      size: {
        default: "px-6 py-3 text-body",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonVariants({ variant, size, className })} {...props} />;
}
```

- Avoid `@apply` for anything beyond a couple of truly global, single-purpose utilities (e.g., a `.text-eyebrow` mono-label utility used identically everywhere) — overuse of `@apply` just reinvents a second, shadow CSS system on top of Tailwind and defeats the purpose of co-located utility classes.
- Responsive variants follow the breakpoint tokens from `DESIGN.md` §5 (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`, custom `cinema:` if configured) — author mobile-up in the utility classes themselves (Tailwind's convention) even though the *design* process is desktop-first; these are not contradictory; see `DESIGN.md` §5 for the distinction.

## 4. Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase, matches export | `SpeakerCard.tsx` |
| Hook files | camelCase, `use` prefix | `useCountdown.ts` |
| Utility files | camelCase | `formatEventDate.ts` |
| Type files | camelCase, singular | `speaker.ts` |
| CSS custom properties | kebab-case, matches `DESIGN.md` tokens | `--color-red-dark` |
| Constants | SCREAMING_SNAKE_CASE for true constants | `EVENT_DATE`, `MAX_TICKET_QTY` |
| Boolean props/vars | `is`/`has`/`should` prefix | `isFeatured`, `shouldReduceMotion` |

## 5. Formatting & linting

- Prettier + `prettier-plugin-tailwindcss` enforced via a pre-commit hook — no manual formatting debates.
- ESLint with `next/core-web-vitals` + `typescript-eslint` recommended-type-checked as the baseline; treat warnings as blocking in CI, not advisory.
- No commented-out code committed — delete it (version control remembers it) rather than leaving dead code as a comment.
- JSDoc/comments explain **why**, not what — the code should be readable enough that "what" is self-evident from names and structure; reserve comments for non-obvious decisions (e.g., "using scaleX not width here to avoid layout reflow, see ANIMATIONS.md §5").

## 6. Commits

- Conventional Commits style (`feat:`, `fix:`, `refactor:`, `perf:`, `a11y:`, `docs:`) — `a11y:` and `perf:` are called out as their own types deliberately, so accessibility and performance work is visible in history, not buried under generic `fix:`.
- A commit that changes visual design should reference which instruction file's pattern it follows or updates (e.g., "feat: speaker grid asymmetric layout per UI_GUIDELINES.md §3").

## Do / Don't

**Do**
- Configure Tailwind's theme directly from `DESIGN.md`'s tables.
- Keep Server Components as the default; justify every `"use client"`.
- Use stable ids as list keys, always.

**Don't**
- Don't use `any` or unchecked array index access.
- Don't use arbitrary Tailwind values for anything that should be a theme token.
- Don't fetch data client-side in `useEffect` when a Server Component could do it.
