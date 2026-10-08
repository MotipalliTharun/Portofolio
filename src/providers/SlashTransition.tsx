import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { stages, type StageId } from '@/data/resume';
import { useScrollTo } from './SmoothScroll';
import styles from './SlashTransition.module.css';

type SlashTo = (id: StageId) => void;
const SlashContext = createContext<SlashTo>(() => {});

// Four-point diagonal band: [left-top, right-top, right-bottom, left-bottom], each
// edge leaning 20%. It grows in from the right, covers the screen, then slices off left.
const band = (lt: number, rt: number) => `polygon(${lt}% 0%, ${rt}% 0%, ${rt - 20}% 100%, ${lt - 20}% 100%)`;
const START = band(125, 125);
const COVER = band(-5, 125);
const END = band(-5, -5);

const IN = { duration: 0.42, ease: [0.7, 0, 0.84, 0] as const };
const OUT = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

/**
 * Section-to-section "sword cut": a blade-edged band sweeps across the screen,
 * the page jumps to the target behind it, and the band slices away to reveal it.
 * Reduced motion skips the cut and scrolls normally.
 */
export function SlashTransition({ children }: { children: ReactNode }) {
  const scrollTo = useScrollTo();
  const reduce = useReducedMotion();
  const [run, setRun] = useState<{ id: StageId; key: number } | null>(null);
  const [phase, setPhase] = useState<'cover' | 'reveal'>('cover');
  const busy = useRef(false);

  const slashTo = useCallback<SlashTo>(
    (id) => {
      if (reduce) return scrollTo(`#${id}`);
      if (busy.current) return;
      busy.current = true;
      setPhase('cover');
      setRun({ id, key: Date.now() });
    },
    [reduce, scrollTo],
  );

  const onDone = () => {
    if (!run) return;
    if (phase === 'cover') {
      scrollTo(`#${run.id}`, { immediate: true });
      window.setTimeout(() => setPhase('reveal'), 140);
    } else {
      setRun(null);
      busy.current = false;
    }
  };

  const stage = run ? stages.find((s) => s.id === run.id) : null;
  const clip = phase === 'cover' ? COVER : END;

  return (
    <SlashContext.Provider value={slashTo}>
      {children}
      <AnimatePresence>
        {run && stage && (
          <div key={run.key} className={styles.layer} aria-hidden="true">
            {/* the bright edge leads on the way in and trails on the way out */}
            <motion.div
              className={styles.edge}
              initial={{ clipPath: START }}
              animate={{ clipPath: clip }}
              transition={phase === 'cover' ? IN : { ...OUT, delay: 0.06 }}
            />
            <motion.div
              className={styles.panel}
              initial={{ clipPath: START }}
              animate={{ clipPath: clip }}
              transition={phase === 'cover' ? { ...IN, delay: 0.05 } : OUT}
              onAnimationComplete={onDone}
            >
              <motion.p
                className={styles.card}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: phase === 'cover' ? 1 : 0, x: phase === 'cover' ? 0 : -40 }}
                transition={{ duration: 0.35, delay: phase === 'cover' ? 0.22 : 0 }}
              >
                <span className={styles.index}>{stage.index}</span>
                {stage.nav}
              </motion.p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SlashContext.Provider>
  );
}

export const useSlashTo = () => useContext(SlashContext);
