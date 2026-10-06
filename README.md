# Tharun Motipalli · Portfolio

A personal portfolio built as a data pipeline. Each section is a pipeline stage
(ingest → cleanse → join → build → index → archive → serve), and **Bit**, a small
data-packet character, rides the pipeline rail with the visitor.

See [DESIGN.md](DESIGN.md) for the concept, wireframes, tokens and component inventory.

## Stack

- React 19 + TypeScript, built with Vite
- Motion (Framer Motion) for animation, Lenis for smooth scrolling
- CSS Modules on a shared token system (`src/styles/tokens.css`)
- Self-hosted fonts via Fontsource (no third-party requests)

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Résumé

Put your PDF at `public/Tharun_Motipalli_Resume.pdf`. The "Résumé" buttons in the hero
and contact sections appear only when that file exists.

## Editing content

All text lives in `src/data/resume.ts`: profile, experience, projects, the skills
pipeline, education and the publication. Each stage there also sets its section
hue and the engineer's scene. Change it there and every section updates.

## Structure

```
src/
  data/resume.ts          single source of truth for content
  styles/                 tokens + global styles
  providers/              smooth scroll, UI state (palette, filter, drawer, toasts)
  hooks/                  active section, theme, hotkeys, media query, clock
  character/Bit.tsx       the data-packet mascot (eye tracking, blink, moods, speech)
  character/Engineer.tsx  the engineer: rigged flat-style SVG + 7 scenes (CSS choreography)
  character/FaProp.tsx    places Font Awesome icons in scenes as inked props
  components/ui/          Button, Chip, StatusPill, Reveal, SplitText, ScrambleText,
                          Counter, SpotlightCard, Marquee, CopyButton, Drawer,
                          FlowDiagram, SceneFrame, Kbd
  components/layout/      Nav, PipelineRail, Section, StageConnector, Footer, CommandPalette
  lib/motion.ts           shared easing, springs and reveal variants
  sections/               Hero, About, Experience, Projects (+ drawer), Skills,
                          Education, Contact
```

## Credits

Icons are Font Awesome Free (CC BY 4.0), credited in the footer. See
[CREDITS.md](CREDITS.md) for all third-party assets and references.

## Deploy

The build output in `dist/` is a static site. Any static host works:

- **Vercel / Netlify:** import the repo; build command `npm run build`, output `dist`.
- **GitHub Pages:** run `npm run build` and publish `dist/`. For a project page
  (`username.github.io/repo`), set `base: '/repo/'` in `vite.config.ts`.
