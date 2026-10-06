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

## 7. The engineer: a character for every scene

Version 2 adds a second character: **the engineer**. He's drawn in the same flat sticker
style as the Flaticon stickers by kerismaker that decorate the scene frames: no outlines,
soft flat fills, small dot eyes with a highlight, rosy cheeks and a simple smile, about 4.3
heads tall. He wears a swept black fringe, a black long-sleeve top with an orange lanyard
badge, slate trousers and sneakers with orange soles, so he reads as one of the sticker
cast. Bit is the data; the engineer is the person who moves it through the pipeline. Every
section opens with a framed scene, like a comic panel, where he does that stage's job,
usually to Bit.

### Storyboard

| Scene | Section | What he does | Loop |
|---|---|---|---|
| 00 ingest | Hero | Sits at a desk typing; code streams onto the laptop and Bit pops out of the screen | Typing hands, head nod, steaming mug |
| 01 cleanse | About | Scrubs noise off a big raw Bit with a sponge until it shines | Scrub, specks fade, block turns clean, sparkles |
| 02 join | Experience | Tightens a pipe junction where two data streams merge into one | Wrench turns, packets flow in from top and bottom, out to the right |
| 03 build | Projects | Hammers together a stack of API / ETL / DQ blocks | Overhead swing, impact sparks, block jolts |
| 04 index | Skills | Files skill cards into a cabinet | Reach, drawer slides open, card drops in |
| 05 archive | Education | Reads in a graduation cap | Page flips, tassel swings, idea bulb lights |
| 06 serve | Contact | Waves and serves a finished Bit on a tray | Wave, Bit bounces, speech bubble |

### Scene frame
```
┌ ● ● ●  scene 03 · build ─────────── ● hammering ┐
│                         ▒▒ DQ                    │
│        ╭─╮  🔨          ▒▒▒ ETL                  │
│        ╰─╯╱             ▒▒▒▒ API                 │
│ ───────────────────────────────────────────────── │  ← dashed ground line
└───────────────────────────────────────────────────┘
```
Entry: the frame wipes open left to right, then the engineer steps in from the left. Each
loop runs only while its frame is on screen, so off-screen scenes cost nothing.

### Expressions and effects

| Scene | Expression | Effect |
|---|---|---|
| ingest | focused smile, eyes on screen | floating `</>`, steaming mug |
| cleanse | ^ ^ happy eyes, open smile | soap suds, sparkles |
| join | determined brows, tight mouth | sweat drop |
| build | determined brows, hard hat | smear arc on the downswing, impact sparks |
| index | calm, eyes on drawer | drawer slide, card drop |
| archive | reading, small "o" mouth | idea bulb, page flip, tassel swing |
| serve | ^ ^ happy eyes, open smile, stronger blush | sparkles, speech bubble |

Entrance: he hops in from the left, lands with a squash, and settles.

### Props (Font Awesome Free, CC BY 4.0)

Font Awesome icons are placed inside the scenes as inked props through `FaProp`, which
adds the same line art and fills them with theme tokens so they match the character:

| Scene | Props |
|---|---|
| ingest | mug, database poster, floating `</>` |
| cleanse | broom, bucket, spray can |
| join | toolbox, code-merge sign |
| build | hard hat (on his head), wrench |
| index | open folder on the cabinet, bobbing magnifying glass |
| archive | lightbulb, diploma scroll |
| serve | paper plane, envelope, heart |

The Skills diagram's stage icons are Font Awesome as well. Attribution is in the footer and
CREDITS.md.

### Rig
One SVG character built from rigged parts: legs (standing or seated), torso, head (neck
pivot), and two-segment arms (shoulder and elbow pivots). Each scene is a CSS class that poses
the rig and runs its own keyframes, and each tool (sponge, wrench, hammer, card) is attached to
the forearm so it moves with the hand. Every resting pose is also each loop's start and end
frame, so with reduced motion the scene settles into a clean still.

## 8. Section transitions

- **Stage connector:** between every pair of sections, a pipe draws across the page as you
  scroll, and a packet travels along it from the previous stage to the next
  (`01 cleanse ──■──▶ 02 join`). It's scroll-linked, so it moves with the visitor.
- **Motion presets** (`src/lib/motion.ts`): one easing curve, three durations and two springs,
  plus shared reveal variants (`rise`, `clip`, `scale`) that every component uses.
- **Section entry:** the kicker rule draws in, the heading rises word by word, the scene frame
  wipes open and the content reveals with the section's variant.

## 9. Props: every sticker means something

Flaticon stickers (kerismaker) are placed only where they carry information:

| Where | Sticker | Meaning |
|---|---|---|
| Skills pipeline stages | folder, gears, database, magnifier, server, chip, upload | the object that does that stage's job; greyed out until data reaches the stage, full colour once it has |
| Project cards and case-study drawer | chip, database, magnifier, bug | what the project is: ML, lakehouse, data quality, failure triage |
| "How I work with people" cards | presenter, mentor, translator | sprint demos to stakeholders, code reviews and mentoring, bridging Chennai and UK teams; each card is backed by a resume line |

In-scene props are limited to ones the story needs (laptop and mug; broom and bucket;
toolbox; hard hat; cabinet and folder; lightbulb and diploma; paper plane). Nothing is
placed only to fill space.
