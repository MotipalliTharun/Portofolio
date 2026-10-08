# Prompt: enhance the portfolio with framer-motion + UI UX Pro Max

Paste everything below the line into Claude Code, from the repo root.

---

You are a senior product designer and front-end engineer improving my personal portfolio
(React 19 + Vite + TypeScript, CSS Modules). Use the **UI UX Pro Max** skill for every design
decision and **framer-motion** for every animation. Enhance; do not redesign.

## What exists (keep it)

- **Identity:** warm golden-hour palette (cream/espresso neutrals, OKLCH section hues in
  `src/styles/tokens.css`), Bricolage Grotesque display + IBM Plex body/mono, light and dark themes.
- **Story:** scroll-scrubbed hero video (`src/sections/Hero.tsx`, `FrameSequence`) where I type at
  night then wave; About café depth scene; Experience; a pinned day-to-night time-lapse
  (`TimeLapse.tsx`); Projects with a case-study drawer; Skills pipeline; Education; Contact.
- **Navigation:** a mechanical-keyboard nav (`Nav.tsx`) with backlit keycaps and 1-5 shortcuts,
  plus a diagonal "cut" section transition (`providers/SlashTransition.tsx`).

## Step 1 - Audit with UI UX Pro Max (before writing code)

Run the skill's search tool and keep only verified, on-topic results:

1. `--design-system "developer portfolio data engineer immersive" --motion 7 --variance 6 --density 4`
   - adopt its **pattern and UX rules** (scroll storytelling, reduced-motion handling, CTA rhythm);
   - ignore its generic colour/typography/style picks: my identity above wins.
2. `--domain ux` for: `"reduced motion"`, `"interrupt animation"`, `"touch target size"`,
   `"focus visible keyboard"`.
3. Read `references/quick-reference.md` section 7 (Animation) and treat it as the motion spec:
   transform/opacity only, springs over cubic-bezier for interaction, exit = 60-70% of enter,
   stagger 30-50 ms, 1-2 animated elements per view, every animation must mean something,
   everything interruptible, nothing blocks input.

Write down which findings apply to this codebase and which you are deliberately skipping, and why.

## Step 2 - Enhance with framer-motion

1. **One library:** import everything from `framer-motion` (it is the original name of `motion`);
   remove the duplicate `motion` package.
2. **Motion tokens:** extend `src/lib/motion.ts` with shared springs, an exit-duration helper and a
   stagger token; replace ad-hoc numbers with them.
3. **Shared-element continuity:** a project card's cover should morph into the case-study drawer's
   cover (`layoutId`), and back on close.
4. **Physical feedback:** springy hover lift and press scale (0.97-0.98) on project cards.
5. **Reduced motion means a readable story, not a frozen one:** with `prefers-reduced-motion`, the
   hero and time-lapse stop pinning/scrubbing and show their final state with all copy visible.
6. **Calm the loops:** no infinite decorative animation; let one-off gestures (the wave) play a
   few times and stop.

## Constraints

- No layout shift (CLS < 0.1); animate transform/opacity, never width/height/top/left.
- Keep the bundle within +5 KB gzip of today; no new dependencies.
- Keyboard and screen-reader behaviour must stay intact (focus rings, focus trap in the drawer,
  `aria-*` labels, 1-5 shortcuts).
- Match the surrounding code style: CSS Modules, small comments only where intent is non-obvious.

## Step 3 - Verify and report

- `npm run build` passes (typecheck included).
- In the browser at 375, 768, 1024 and 1440 px, in light and dark, with and without reduced
  motion: hero clip, card-to-drawer morph, nav shortcuts and the cut transition all work, and
  there is no horizontal scroll.
- Report: what changed and why (citing the UI UX Pro Max rule behind each change), what you
  skipped, bundle size before/after, and anything that still needs my input.
