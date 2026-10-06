import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { experience, education, profile, ticker } from '@/data/resume';
import { Bit } from '@/character/Bit';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { Marquee } from '@/components/ui/Marquee';
import { useScrollTo } from '@/providers/SmoothScroll';
import { useNow } from '@/hooks/useNow';
import { formatMonth } from '@/lib/duration';
import styles from './Hero.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

interface RunRow {
  taskId: string;
  sub: string;
  target: string;
  running?: boolean;
  start: string;
}

const rows: RunRow[] = [
  ...experience.map((e) => ({
    taskId: e.taskId,
    sub: `${formatMonth(e.start)} → ${e.end ? formatMonth(e.end) : 'now'}`,
    target: '#experience',
    running: !e.end,
    start: e.start,
  })),
  ...education.map((ed, i) => ({
    taskId: i === 0 ? 'fit.ms_computer_science' : 'hits.btech_computer_science',
    sub: ed.years.replace(' – ', ' → '),
    target: '#education',
    start: ed.years.slice(0, 4) + '-08',
  })),
].sort((a, b) => b.start.localeCompare(a.start));

const current = experience.find((e) => !e.end)!;

function elapsedSince(ym: string, now: Date) {
  const [y, m] = ym.split('-').map(Number);
  const ms = now.getTime() - new Date(y, m - 1, 1).getTime();
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms / 3_600_000) % 24);
  const min = Math.floor((ms / 60_000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d}d ${pad(h)}:${pad(min)}:${pad(s)}`;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scrollTo = useScrollTo();
  const now = useNow();
  const [roleIndex, setRoleIndex] = useState(0);
  const [bitSays, setBitSays] = useState('ingesting…');

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % profile.rotatingRoles.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  const localTime = now.toLocaleTimeString('en-US', { timeZone: profile.timezone, hour: 'numeric', minute: '2-digit' });

  return (
    <section id="hero" ref={ref} className={styles.hero} aria-labelledby="hero-title" tabIndex={-1}>
      <div className={`container ${styles.grid}`}>
        <motion.div className={styles.copy} style={{ y: copyY, opacity: copyOpacity }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <StatusPill status="running" label={profile.availability} />
          </motion.div>

          <h1 id="hero-title" className={styles.name} aria-label={`${profile.name}, ${profile.title}`}>
            {[profile.firstName, profile.lastName].map((part, i) => (
              <span key={part} className={styles.line} aria-hidden="true">
                <motion.span
                  className={i === 1 ? styles.outline : undefined}
                  initial={reduce ? false : { y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.12 }}
                >
                  {part}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className={styles.lede}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          >
            {profile.title} who builds{' '}
            <span className={styles.rotator}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={profile.rotatingRoles[roleIndex]}
                  className={styles.role}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {profile.rotatingRoles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            that healthcare, pharma and energy teams can trust.
          </motion.p>

          <motion.div
            className={styles.ctas}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          >
            <Button variant="primary" size="lg" magnetic onClick={() => scrollTo('#projects')} icon="→">
              View my work
            </Button>
            <Button size="lg" href={profile.linkedin} external magnetic icon="↗">
              LinkedIn
            </Button>
          </motion.div>

          <motion.dl
            className={styles.meta}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div><dt>Based in</dt><dd>{profile.location}</dd></div>
            <div><dt>Local time</dt><dd>{localTime}</dd></div>
            <div><dt>Now</dt><dd>{current.company}</dd></div>
          </motion.dl>
        </motion.div>

        <motion.div className={styles.cardWrap} style={{ y: cardY }}>
          <motion.div
            className={styles.bit}
            initial={reduce ? false : { opacity: 0, y: -30, rotate: -12 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1.2 }}
            onPointerEnter={() => setBitSays('hi, I’m Bit')}
            onPointerLeave={() => setBitSays('ingesting…')}
          >
            <Bit size={76} mood="raw" say={bitSays} bubbleSide="left" />
          </motion.div>

          <motion.div
            className={styles.runlog}
            initial={reduce ? false : { opacity: 0, y: 40, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          >
            <header className={styles.runHead}>
              <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
              <span>dag: <b>career_pipeline</b></span>
              <span className={styles.sched}>@daily</span>
            </header>
            <motion.ol
              className={styles.tasks}
              initial="hidden"
              animate="shown"
              variants={{ shown: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } } }}
            >
              {rows.map((r) => (
                <motion.li
                  key={r.taskId}
                  variants={{ hidden: { opacity: 0, x: -12 }, shown: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
                >
                  <button type="button" className={styles.task} onClick={() => scrollTo(r.target)}>
                    <span className={r.running ? styles.sqRun : styles.sq} aria-hidden="true" />
                    <span className={styles.taskId}>
                      {r.taskId}
                      <small>{r.sub}</small>
                    </span>
                    <span className={r.running ? styles.stRun : styles.st}>{r.running ? 'running' : 'success'}</span>
                  </button>
                </motion.li>
              ))}
            </motion.ol>
            <footer className={styles.runFoot}>
              <span>{rows.length} tasks · 0 failed</span>
              <span className={styles.elapsed} aria-label="Time in current role">
                ⏱ {elapsedSince(current.start, now)}
              </span>
            </footer>
          </motion.div>
        </motion.div>
      </div>

      <div className={styles.bottom}>
        <Marquee items={ticker} label="Technologies I work with" separator="◆" />
        <button type="button" className={styles.cue} onClick={() => scrollTo('#about')}>
          <span className={styles.cueLine} aria-hidden="true" />
          scroll to run the pipeline
        </button>
      </div>
    </section>
  );
}
