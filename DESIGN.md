# Portfolio design spec: "The Pipeline"

## 1. Concept

Tharun is a data engineer, so the site is built as a **data pipeline**. A visitor scrolling the
page is a record moving through stages: it is ingested, cleaned, joined, built, indexed and
finally served. The stages give the page its order, its navigation and its personality.

**The character: Bit.** Bit is a small data packet with eyes. It rides a pipeline rail on the
right edge of the screen and changes state at each stage: grey and noisy when raw, then clean,
then curated, and green with a tick when served. Its eyes follow the cursor, it blinks, and it
says what it's doing ("cleaning…", "joining…"). Bit appears in two places (hero and rail) from
one reusable component.

### Research and what was borrowed

| Reference | What they do well | What we take |
|---|---|---|
| Brittany Chiang (brittanychiang.com) | Sticky nav that tracks the active section, dense but scannable experience list | Active-section tracking, a clear reading hierarchy for recruiters |
| Rauno Freiberg / Paco Coursey (cmdk authors) | Keyboard-first UI, ⌘K command menu, small precise interaction details | A ⌘K command palette that can navigate, filter, copy and switch theme |
| Bruno Simon | A character-led, playful world that rewards exploring | A mascot that reacts to the visitor, kept light so the site stays fast |
| Awwwards portfolio winners (2026) | Smooth scroll, staggered type reveals, one strong motion moment per view | Lenis smooth scroll, split-text headings, scroll-linked progress |
| Linear / Vercel product sites | Enterprise polish: spotlight hover cards, crisp tokens, restraint | Spotlight cards, a strict token system, a calm palette |

Our own idea: **lineage.** In a data platform you can trace where any column came from. In the
Skills section, hovering a skill traces every role and project that used it.

## 2. Stages and sections

| # | Stage | Section | Bit says | Job of the section |
|---|---|---|---|---|
| 00 | Ingest | Hero | "ingesting…" | Who, what, now. A live run log of the career |
| 01 | Cleanse | About | "cleaning…" | Summary, working principles, key numbers |
| 02 | Join | Experience | "joining…" | Three roles, scroll-drawn timeline |
| 03 | Build | Projects | "building…" | Filterable cards that open into case studies |
| 04 | Index | Skills | "indexing…" | Skill matrix with lineage tracing |
| 05 | Archive | Education | "archiving…" | Degrees and the CRC Press publication |
| 06 | Serve | Contact | "served ✓" | Email, LinkedIn, message composer |

## 3. Wireframes

### Global shell
```
┌──────────────────────────────────────────────────────────────┬──┐
│ tharun.motipalli   about  experience  projects  skills  [⌘K][◐]│  │ ← Nav: active pill slides
├──────────────────────────────────────────────────────────────┤ ●│   between links (layoutId)
│                                                              │ │ │
│                       section content                        │ ◉│ ← PipelineRail: stage nodes,
│                                                              │ │ │   Bit rides the progress
│                                                              │ ●│
└──────────────────────────────────────────────────────────────┴──┘
Mobile: rail collapses to a 2px progress bar under the nav; links move into ⌘K / menu.
```

### 00 Hero
```
┌────────────────────────────────────────────────────────────────┐
│ ● Open to data engineering roles · Sunnyvale, CA               │
│                                                                │
│ Tharun                           ┌─ dag: career_pipeline ──┐ ◕◕ │ ← Bit perched on the card
│ Motipalli                        │ ■ cigna.data_engineer  ▶ │    │
│                                  │ ■ jnj.analyst_intern   ✓ │    │
│ I build [lakehouse pipelines▾]   │ ■ fit.ms_cs            ✓ │    │ ← rotating word
│ that teams can trust.            │ ■ ngp.swe_intern       ✓ │    │
│                                  │ ■ hits.btech           ✓ │    │
│ [View work →] [LinkedIn ↗]       │ 5 tasks · 0 failed       │    │
│                                  └──────────────────────────┘    │
├────────────────────────────────────────────────────────────────┤
│ ≡ Python · PySpark · Databricks · Delta Lake · Airflow · AWS …  │ ← log ticker (marquee)
└────────────────────────────────────────────────────────────────┘
Motion: name lines rise in with a stagger; the run log rows stream in one by one; the
running task's elapsed timer ticks live.
```

### 01 About
```
┌ 01 / cleanse ─────────────────────────────────────────────────┐
│ Ownership from requirements          ┌───────┬───────┬───────┐│
│ to daily operations.                 │  3    │  4    │  6    ││ ← counters animate up
│                                      │ indus │ builds│ AWS   ││   when in view
│ Summary paragraph…                   └───────┴───────┴───────┘│
│                                                               │
│ [Own it end to end] [Data you can trust] [Ship in sprints]    │ ← principle cards
└───────────────────────────────────────────────────────────────┘
```

### 02 Experience
```
┌ 02 / join ────────────────────────────────────────────────────┐
│ │ ◉ Data Engineer · The Cigna Group        [running] 1y 3m    │
│ │   Healthcare Claims & Member Data Platform                  │
│ │   • highlight  • highlight  • highlight                     │
│ │   [PySpark][Databricks][Airflow]…                           │
│ ┃ ● Data Analyst Intern · Johnson & Johnson [success] 8m       │ ← line draws as you scroll
│ ┃ ● Software Engineer Intern · NGP Websmart [success] 11m      │
└───────────────────────────────────────────────────────────────┘
```

### 03 Projects
```
┌ 03 / build ───────────────────────────────────────────────────┐
│ (All)(Spark)(Databricks)(Airflow)(Python)(ML / AI)            │ ← filter, cards re-flow
│ ┌──────────────────────┐ ┌──────────────────────┐             │   with layout animation
│ │ STREAMING · ML       │ │ LAKEHOUSE            │             │
│ │ Energy Anomaly …     │ │ Claims Lakehouse     │             │ ← spotlight follows cursor
│ │ Kafka → Spark → API  │ │ S3 → bronze → gold   │             │
│ │ [chips]   Open case →│ │ [chips]   Open case →│             │
│ └──────────────────────┘ └──────────────────────┘             │
└───────────────────────────────────────────────────────────────┘
Click opens a side drawer case study: problem, approach, an animated flow diagram with
packets moving between nodes, and the stack.
```

### 04 Skills
```
┌ 04 / index ───────────────────────────────────────────────────┐
│ Languages        Python ●●●●● PySpark ●●● SQL ●●●●  …        │ ← dots = how many roles/
│ Data engineering Spark ●●● Databricks ●●●● …                  │   projects used it
│ Cloud (AWS)      S3 ●● Glue ● …                               │
│                                       ┌ lineage: Databricks ┐ │
│                                       │ ← Cigna             │ │ ← hover/focus a skill
│                                       │ ← Johnson & Johnson │ │
│                                       │ ← Claims Lakehouse  │ │
│                                       └─────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### 05 Education and 06 Contact
```
┌ 05 / archive ─────────────────┐  ┌ 06 / serve ──────────────────────────────┐
│ M.S. CS · Florida Tech        │  │ Let's build something                    │
│ B.Tech CS · HITS Chennai      │  │ reliable.                                │
│ ┌ Publication · CRC Press ──┐ │  │ [email ⧉ copy] [LinkedIn ↗] [local time] │
│ │ Handheld AR 3D objects…   │ │  │ ┌ compose ─────────────┐                 │
│ └───────────────────────────┘ │  │ │ name / message  [Send via email] │      │
└───────────────────────────────┘  └──────────────────────────────────────────┘
```

## 4. Design tokens

- **Color:** a cool paper ground with deep ink, one teal accent (the "pipeline" colour), amber for
  running and green for success. Status colours are only used for state. Full light and dark
  palettes; the theme switch uses a circular View Transition reveal.
- **Type:** Bricolage Grotesque (display, tight tracking), IBM Plex Sans (body), IBM Plex Mono
  (labels, data, logs). All self-hosted with Fontsource, so there are no third-party font
  requests.
- **Motion:** one easing curve (`cubic-bezier(.22,1,.36,1)`), durations of 200ms, 450ms and
  800ms. Every animation is turned off by `prefers-reduced-motion`.

## 5. Component inventory

| Layer | Component | Used by |
|---|---|---|
| ui | `Button` (primary / ghost / link, magnetic option) | Hero, Contact, Drawer |
| ui | `Chip` (static or toggle, highlight state) | Experience, Projects, Skills, filter |
| ui | `StatusPill` (running / success / idle) | Hero run log, Experience, Contact |
| ui | `Reveal` (in-view fade and rise, stagger children) | every section |
| ui | `SplitText` (word-by-word heading reveal) | section headings, Hero, Contact |
| ui | `Counter` (animated number on view) | About |
| ui | `SpotlightCard` (cursor-tracked glow) | Projects, About principles |
| ui | `CopyButton` (clipboard with toast fallback) | Contact, ⌘K |
| ui | `Drawer` (focus-trapped side sheet, Esc to close) | Project case studies |
| ui | `Kbd` | Nav, ⌘K, footer |
| ui | `Marquee` | Hero ticker |
| layout | `Nav`, `PipelineRail`, `Footer`, `CommandPalette` | App shell |
| layout | `Section` (registers a stage, header, ids) | every section |
| character | `Bit` (mood, eye tracking, blink, speech) | Hero, PipelineRail |
| providers | `SmoothScroll` (Lenis), `UIProvider` (palette, filter, toasts), theme | App |

All content comes from one typed file, `src/data/resume.ts`, so updating the resume updates
the site.

## 6. Performance and accessibility budget

- Static build, no server. The command palette and project drawer load only when opened.
- Animations use transforms and opacity only. Scroll-linked values run on Motion values, so
  React does not re-render on scroll.
- Semantic landmarks, a skip link, visible focus rings, full keyboard support (⌘K, arrows,
  Esc), `aria-live` toasts, and a 4.5:1 minimum text contrast in both themes.
