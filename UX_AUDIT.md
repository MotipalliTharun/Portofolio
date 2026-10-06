# UX audit: tharun.motipalli portfolio

**Method:** heuristic review (Nielsen's 10, plus recruiter-task analysis) of the live dev build at
phone (375 px) and tablet (~690 px) widths, with measured section heights. The primary user
is a **recruiter or hiring manager** who spends about 30–90 seconds deciding whether to reach
out. The core tasks are: *who is this → what have they shipped → can I see proof → how do I
contact them / get the résumé*.

Severity: **P1** blocks or slows the core task · **P2** noticeable friction · **P3** polish.

---

## Findings

### P1. The page is too long to scan on a phone
Measured at 375 × 812: **16,400 px total, about 20 screens.**

| Section | Height | Screens |
|---|---|---|
| Hero | 1,532 | 1.9 |
| About | 2,213 | 2.7 |
| Experience | 2,997 | 3.7 |
| Projects | 2,732 | 3.4 |
| Skills | 2,529 | 3.1 |
| Education | 1,264 | 1.6 |
| Contact | 1,517 | 1.9 |
| Footer | 1,584 | **2.0** |

Causes:
- Every section opens with a full-width scene frame (~480 px of header before any content).
- The footer repeats the Contact section's call to action (same email, same copy button,
  the same waving character) directly below it.
- About stacks low-value stats and three tall principle cards.
- The hero shows both the scene and a run-log card that repeats the Experience timeline.

### P1. No résumé download
Recruiters expect a one-click PDF. There's no résumé link anywhere: not in the hero, the
nav or contact. This is the most common follow-up action after a portfolio visit.

### P1. About's numbers don't persuade
"3 industries · 4 build projects · 6 AWS services" animate up from zero, but the
numbers are small and say little. Counting animations draw attention to weak data. A
recruiter wants *current role, domains, core stack, education* at a glance.

### P2. Each stage is labelled twice
Every section shows the stage in the connector (`00 ingest ──■── 01 cleanse`) and
again in the kicker directly below (`01 ─── cleanse`). The same information stacked twice
reads as noise.

### P2. The hero headline jumps while the role rotates
The rotating phrase ("lakehouse pipelines", "REST APIs" …) leaves an **empty line** during
each swap and makes the paragraph below it jump, because the rotator has no reserved width
and is followed by a hard line break. Moving text next to the main value proposition hurts
reading.

### P2. The outlined surname is hard to read
"Motipalli" is a 1.5 px outline with no fill. At a glance it reads as a ghost or disabled
state, and its contrast against the background is effectively the stroke alone.

### P2. Scene frames dominate on mobile
The illustrations are a strength on desktop, where they sit beside the heading. On a phone
they stack above the content at full width, so each section's actual information starts
one screen down.

### P3. The footer is busy
The footer has seven navigation links, three link columns, a stack list, two credits, a
copyright line, back-to-top, the giant wordmark *and* the CTA card. Once the CTA moves out,
it should be a calm sign-off.

### P3. Missing proof links (content, not design)
- There's no GitHub link and no repo or demo links on the projects. The "Case study" drawers
  help, but they end in a dead end.
- **Action for Tharun:** add the GitHub URL and any repo links in `src/data/resume.ts`.

### Working well (keep)
- One clear concept (data pipeline stages) carried through nav, colour and motion.
- ⌘K command menu, keyboard support, reduced-motion support, visible focus.
- Project case-study drawer with architecture flow.
- Skills as a pipeline with lineage tracing: memorable and true to the job.
- Per-section colour that orients the visitor.

---

## Redesign plan (implemented)

| # | Change | Fixes |
|---|---|---|
| 1 | **Footer:** remove the duplicate CTA card; keep a compact sign-off (links, now, credits, wordmark) | P1 length, P3 busy footer |
| 2 | **Section header:** drop the duplicate kicker; the stage connector *is* the kicker | P2 double labelling |
| 3 | **Scene frames on mobile:** compact (no title bar, max 300 px, centred) | P1 length, P2 frames dominate |
| 4 | **About:** replace counters with an "At a glance" fact grid (role, domains, stack, education); principles become a swipeable row on mobile | P1 weak stats, P1 length |
| 5 | **Hero:** stable rotating phrase (reserved width, no blank line); solid accent surname; hide the run log on phones (it repeats Experience) | P2 jump, P2 legibility, P1 length |
| 6 | **Résumé button** in the hero and contact, shown automatically once `public/Tharun_Motipalli_Resume.pdf` exists | P1 no résumé |

### Measured result (375 × 812)

| Section | Before | After | Change |
|---|---|---|---|
| Hero | 1,532 | 1,170 | −24% |
| About | 2,213 | 1,682 | −24% |
| Experience | 2,997 | 2,882 | −4% |
| Projects | 2,732 | 2,617 | −4% |
| Skills | 2,529 | 2,414 | −5% |
| Education | 1,264 | 1,150 | −9% |
| Contact | 1,517 | 1,402 | −8% |
| Footer | 1,584 | 645 | **−59%** |
| **Page** | **16,407** | **14,003** | **−15%** (about 3 screens shorter) |

No horizontal overflow at 375 px.

## Next steps (not done yet)

- **Experience, Projects and Skills are still about 3 screens each on a phone.** Options: show
  2 highlights per role by default, hide the inline flow line on project cards (it's in the
  case study), and collapse the Skills lineage panel behind a "Where I used it" toggle.
- **Add the résumé PDF** at `public/Tharun_Motipalli_Resume.pdf`; the hero and contact buttons
  appear automatically. Your current PDF includes your phone number, so decide whether you
  want that public.
- **Add a GitHub link and project repo/demo links** so the case studies don't dead-end.
- **Desktop pass:** review the wide layout (1280–1440 px) with the pipeline rail and full
  header in a full-size browser window.
