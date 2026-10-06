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

## Editing content

All text lives in `src/data/resume.ts`: profile, experience, projects, skills,
education and the publication. Change it there and every section updates.

## Structure

```
src/
  data/resume.ts          single source of truth for content
  styles/                 tokens + global styles
  providers/              smooth scroll, UI state (palette, filter, drawer, toasts)
  hooks/                  active section, theme, hotkeys, media query, clock
  character/Bit.tsx       the mascot (eye tracking, blink, moods, speech)
  components/ui/          Button, Chip, StatusPill, Reveal, SplitText, Counter,
                          SpotlightCard, Marquee, CopyButton, Drawer, FlowDiagram, Kbd
  components/layout/      Nav, PipelineRail, Section, Footer, CommandPalette
  sections/               Hero, About, Experience, Projects (+ drawer), Skills,
                          Education, Contact
```

## Deploy

The build output in `dist/` is a static site. Any static host works:

- **Vercel / Netlify:** import the repo; build command `npm run build`, output `dist`.
- **GitHub Pages:** run `npm run build` and publish `dist/`. For a project page
  (`username.github.io/repo`), set `base: '/repo/'` in `vite.config.ts`.
