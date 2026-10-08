import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { experience, profile, stageById, ticker } from '@/data/resume';
import { FrameSequence } from '@/components/scene/FrameSequence';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { Marquee } from '@/components/ui/Marquee';
import { useScrollTo } from '@/providers/SmoothScroll';
import { useNow } from '@/hooks/useNow';
import { usePdfAvailable } from '@/hooks/usePdfAvailable';
import { ease as EASE, spring } from '@/lib/motion';
import { cn } from '@/lib/cn';
import styles from './Hero.module.css';

const current = experience.find((e) => !e.end)!;
const longestRole = profile.rotatingRoles.reduce((a, b) => (b.length > a.length ? b : a));

// The hero video, as frames: Tharun at his desk at night, typing, then he looks up and waves.
const FRAMES = 91; // 0-90: the frames after the wave are never shown
const SCRUB: [number, number] = [0.04, 0.72]; // slice of the pinned scroll that plays the clip
const IDLE_END = 54; // typing frames looped before you scroll
const WAVE_PEAK = 84; // scrub stops here: hand up, smiling
const WAVE: [number, number] = [80, 90]; // then he keeps waving
const frameDir = (mobile: boolean) => `${import.meta.env.BASE_URL}frames/${mobile ? 'mobile' : 'desktop'}`;

// the clip's beats, as scroll progress (frames are eased onto the scrub, so these are measured, not linear)
const STEPS = [
  { at: 0, label: 'Typing' },
  { at: 0.49, label: 'Looks up' },
  { at: 0.61, label: 'Says hi' },
];
const STORY_END = SCRUB[1];

function useIsPhone() {
  const query = '(max-width: 760px)';
  const [phone, setPhone] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scrollTo = useScrollTo();
  const now = useNow();
  const phone = useIsPhone();
  const hasResume = usePdfAvailable(profile.resume);
  const [roleIndex, setRoleIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInView = useInView(stageRef);
  // WCAG 2.2.2: anything that moves on its own for more than 5s gets a pause control
  const [paused, setPaused] = useState(false);
  // and the rotating phrase holds still while someone is reading or tabbing through the panel
  const [reading, setReading] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // beat 1: who he is, while he types
  const introOpacity = useTransform(scrollYProgress, [0, 0.22, 0.34], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.34], [0, reduce ? 0 : -60]);
  // beat 2: he looks up and waves
  const hiOpacity = useTransform(scrollYProgress, [0.56, 0.64], [0, 1]);
  const hiScale = useTransform(scrollYProgress, [0.56, 0.66], [reduce ? 1 : 0.6, 1]);
  const outroOpacity = useTransform(scrollYProgress, [0.66, 0.76], [0, 1]);
  const outroY = useTransform(scrollYProgress, [0.66, 0.76], [reduce ? 0 : 24, 0]);
  // story progress: a bar that fills as the clip plays, with its three beats lighting up
  const storyFill = useTransform(scrollYProgress, [0, STORY_END], [0, 1]);
  const storyOpacity = useTransform(scrollYProgress, [STORY_END - 0.06, STORY_END + 0.02], [1, 0]);
  const [step, setStep] = useState(0);
  // reduced motion: no pin, no scrub. One readable frame (him waving) with all copy visible.
  const still = !!reduce;
  // the 👋 waves along with him the first time he waves, then rests
  const [greeted, setGreeted] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p > 0.62 && !greeted) setGreeted(true);
    const s = STEPS.reduce((acc, st, i) => (p >= st.at ? i : acc), 0);
    if (s !== step) setStep(s);
  });

  useEffect(() => {
    if (reduce || paused || reading || !stageInView) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % profile.rotatingRoles.length), 2600);
    return () => clearInterval(id);
  }, [reduce, paused, reading, stageInView]);

  const localTime = now.toLocaleTimeString('en-US', { timeZone: profile.timezone, hour: 'numeric', minute: '2-digit' });

  return (
    <>
      <section
        id="hero"
        ref={ref}
        className={cn(styles.hero, still && styles.still)}
        aria-labelledby="hero-title"
        tabIndex={-1}
        data-hue
        style={{ '--hue': stageById('hero').hue } as CSSProperties}
      >
        <div ref={stageRef} className={styles.stage}>
          {/* the frame box covers the stage like object-fit: cover, so overlays can be
              pinned to spots in the video (his hand) whatever the screen shape */}
          <div className={styles.frameBox}>
            {/* the first frame (preloaded in index.html) shows while the sequence decodes */}
            <img className={styles.poster} src={`${frameDir(phone)}/f${still ? String(WAVE_PEAK).padStart(3, '0') : '000'}.webp`} alt="" aria-hidden="true" />
            <FrameSequence
              className={styles.canvas}
              dir={frameDir(phone)}
              count={FRAMES}
              progress={scrollYProgress}
              range={SCRUB}
              idleEnd={paused ? 0 : IDLE_END}
              end={WAVE_PEAK}
              hold={paused ? undefined : WAVE}
            still={still ? WAVE_PEAK : undefined}
              label="Animated Tharun typing at his desk at night, then looking up and waving."
            />
            <motion.p className={styles.bubble} style={still ? undefined : { opacity: hiOpacity, scale: hiScale }} aria-hidden="true">
              Hi, I’m {profile.firstName} <span className={cn(styles.wave, greeted && !still && styles.waving)}>👋</span>
            </motion.p>
          </div>
          <div className={styles.shade} aria-hidden="true" />

          <motion.div className={`container ${styles.intro}`} style={still ? undefined : { opacity: introOpacity, y: introY }}>
            <h1 id="hero-title" className={styles.name} aria-label={`${profile.name}, ${profile.title}`}>
              {[profile.firstName, profile.lastName].map((part, i) => (
                <span key={part} className={styles.line} aria-hidden="true">
                  <motion.span
                    className={i === 1 ? styles.surname : undefined}
                    initial={reduce ? false : { y: '105%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.12 }}
                  >
                    {part}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              className={styles.panel}
              onPointerEnter={() => setReading(true)}
              onPointerLeave={() => setReading(false)}
              onFocus={() => setReading(true)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setReading(false)}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            >
              <StatusPill status="running" label={profile.availability} />
              <p className={styles.lede}>
                {profile.title} who builds{' '}
                <span className={styles.rotator}>
                  {/* invisible longest phrase reserves the slot so nothing jumps */}
                  <span className={styles.sizer} aria-hidden="true">
                    {longestRole}
                  </span>
                  <AnimatePresence initial={false}>
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
                </span>{' '}
                that healthcare, pharma and energy teams can trust.
              </p>
              <div className={styles.ctas}>
                <Button variant="primary" size="lg" magnetic onClick={() => scrollTo('#projects')} icon="→">
                  View my work
                </Button>
                {hasResume && (
                  <Button size="lg" href={profile.resume} external magnetic icon="↓">
                    Résumé
                  </Button>
                )}
                <Button size="lg" href={profile.linkedin} external magnetic icon="↗">
                  LinkedIn
                </Button>
              </div>
              <dl className={styles.meta}>
                <div><dt>Based in</dt><dd>{profile.location}</dd></div>
                <div><dt>Local time</dt><dd>{localTime}</dd></div>
                <div><dt>Now</dt><dd>{current.company}</dd></div>
              </dl>
            </motion.div>
          </motion.div>

          {!still && (
            <motion.div className={`container ${styles.outro}`} style={{ opacity: outroOpacity, y: outroY }}>
              <p className={styles.outroLine}>
                {current.role} at {current.company}.<br />
                <span>Pull up a chair, I’ll show you around.</span>
              </p>
              <Button variant="primary" onClick={() => scrollTo('#about')} icon="↓">
                Start the tour
              </Button>
            </motion.div>
          )}

          {!still && (
            <div className={`container ${styles.controls}`}>
              {/* how far into the clip you are, and what's coming */}
              <motion.div className={styles.story} style={{ opacity: storyOpacity }} aria-hidden="true">
                <span className={styles.storyHint}>{step === 0 ? 'scroll to play' : 'keep going'}</span>
                <div className={styles.storyTrack}>
                  <motion.span className={styles.storyFill} style={{ scaleX: storyFill }} />
                  {STEPS.map((st, i) => (
                    <span key={st.label} className={styles.storyBeat} style={{ left: `${(st.at / STORY_END) * 100}%` }}>
                      <motion.span
                        className={styles.storyDot}
                        animate={{ scale: step >= i ? 1 : 0.6, opacity: step >= i ? 1 : 0.45 }}
                        transition={spring.touch}
                      />
                      <span className={cn(styles.storyLabel, step >= i && styles.storyLabelOn)}>{st.label}</span>
                    </span>
                  ))}
                </div>
              </motion.div>

              <div className={styles.buttons}>
                <button type="button" className={styles.ghost} onClick={() => scrollTo('#about')}>
                  Skip intro <span aria-hidden="true">↓</span>
                </button>
                <button type="button" className={styles.ghost} onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
                  {paused ? <PlayIcon /> : <PauseIcon />}
                  {paused ? 'Play motion' : 'Pause motion'}
                </button>
              </div>
            </div>
          )}
          <div className={styles.fade} aria-hidden="true" />
        </div>
      </section>
      {/* outside the pinned track, so the stage stays pinned for the whole clip */}
      <div className={styles.bottom}>
        <Marquee items={ticker} label="Technologies I work with" separator="◆" />
      </div>
    </>
  );
}

const PauseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <rect x="2" y="1.5" width="2.6" height="9" rx="1" fill="currentColor" />
    <rect x="7.4" y="1.5" width="2.6" height="9" rx="1" fill="currentColor" />
  </svg>
);
const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 1.8v8.4c0 .5.5.8.9.6l6.6-4.2c.4-.3.4-.9 0-1.2L3.9 1.2c-.4-.2-.9.1-.9.6Z" fill="currentColor" />
  </svg>
);
