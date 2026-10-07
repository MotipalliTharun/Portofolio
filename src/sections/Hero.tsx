import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
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
import { ease as EASE } from '@/lib/motion';
import styles from './Hero.module.css';

const current = experience.find((e) => !e.end)!;
const longestRole = profile.rotatingRoles.reduce((a, b) => (b.length > a.length ? b : a));

// The hero video, as frames: Tharun at his desk at night, typing, then he looks up and waves.
const FRAMES = 96;
const SCRUB: [number, number] = [0.04, 0.72]; // slice of the pinned scroll that plays the clip
const IDLE_END = 54; // typing frames looped before you scroll
const WAVE_PEAK = 84; // scrub stops here: hand up, smiling
const WAVE: [number, number] = [80, 90]; // then he keeps waving
const frameDir = (mobile: boolean) => `${import.meta.env.BASE_URL}frames/${mobile ? 'mobile' : 'desktop'}`;

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

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // beat 1: who he is, while he types
  const introOpacity = useTransform(scrollYProgress, [0, 0.22, 0.34], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.34], [0, reduce ? 0 : -60]);
  // beat 2: he looks up and waves
  const hiOpacity = useTransform(scrollYProgress, [0.56, 0.64], [0, 1]);
  const hiScale = useTransform(scrollYProgress, [0.56, 0.66], [reduce ? 1 : 0.6, 1]);
  const outroOpacity = useTransform(scrollYProgress, [0.66, 0.76], [0, 1]);
  const outroY = useTransform(scrollYProgress, [0.66, 0.76], [reduce ? 0 : 24, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const zoom = useTransform(scrollYProgress, [0, 0.72], [1, reduce ? 1 : 1.06]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % profile.rotatingRoles.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  const localTime = now.toLocaleTimeString('en-US', { timeZone: profile.timezone, hour: 'numeric', minute: '2-digit' });

  return (
    <>
      <section
        id="hero"
        ref={ref}
        className={styles.hero}
        aria-labelledby="hero-title"
        tabIndex={-1}
        data-hue
        style={{ '--hue': stageById('hero').hue } as CSSProperties}
      >
        <div className={styles.stage}>
          {/* the frame box covers the stage like object-fit: cover, so overlays can be
              pinned to spots in the video (his hand) whatever the screen shape */}
          <motion.div className={styles.frameBox} style={{ scale: zoom }}>
            <FrameSequence
              className={styles.canvas}
              dir={frameDir(phone)}
              count={FRAMES}
              progress={scrollYProgress}
              range={SCRUB}
              idleEnd={IDLE_END}
              end={WAVE_PEAK}
              hold={WAVE}
              label="Animated Tharun typing at his desk at night, then looking up and waving."
            />
            <motion.p className={styles.bubble} style={{ opacity: hiOpacity, scale: hiScale }} aria-hidden="true">
              Hi, I’m {profile.firstName} <span className={styles.wave}>👋</span>
            </motion.p>
          </motion.div>
          <div className={styles.shade} aria-hidden="true" />

          <motion.div className={`container ${styles.intro}`} style={{ opacity: introOpacity, y: introY }}>
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

          <motion.div className={`container ${styles.outro}`} style={{ opacity: outroOpacity, y: outroY }}>
            <p className={styles.outroLine}>
              {current.role} at {current.company}.<br />
              <span>Pull up a chair, I’ll show you around.</span>
            </p>
            <Button variant="primary" onClick={() => scrollTo('#about')} icon="↓">
              Start the tour
            </Button>
          </motion.div>

          <motion.button type="button" className={styles.cue} style={{ opacity: cueOpacity }} onClick={() => scrollTo('#about')}>
            <span className={styles.cueLine} aria-hidden="true" />
            scroll · he’s about to say hi
          </motion.button>
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
