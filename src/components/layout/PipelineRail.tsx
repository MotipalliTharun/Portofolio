import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { stages } from '@/data/resume';
import { Bit } from '@/character/Bit';
import { moodForStage } from '@/character/mood';
import { useUI } from '@/providers/UIProvider';
import { useScrollTo } from '@/providers/SmoothScroll';
import { cn } from '@/lib/cn';
import styles from './PipelineRail.module.css';

const SPRING = { type: 'spring', stiffness: 120, damping: 20 } as const;

/**
 * Fixed vertical pipeline on the right edge. Each node is a stage; Bit rides
 * to the active stage, and the line fills behind it as stages complete.
 */
export function PipelineRail() {
  const { stage } = useUI();
  const scrollTo = useScrollTo();
  const index = Math.max(0, stages.findIndex((s) => s.id === stage));
  const pct = (index / (stages.length - 1)) * 100;
  const [talking, setTalking] = useState(false);
  const [hover, setHover] = useState(false);

  // Bit announces each new stage briefly
  useEffect(() => {
    if (stage === 'hero') return;
    setTalking(true);
    const t = setTimeout(() => setTalking(false), 2400);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <aside className={styles.rail} aria-label="Page progress">
      <div className={styles.track} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
        <motion.div className={styles.fill} initial={false} animate={{ height: `${pct}%` }} transition={SPRING} />
        <ol className={styles.nodes}>
          {stages.map((s, i) => {
            const state = i < index ? 'done' : i === index ? 'current' : 'pending';
            return (
              <li key={s.id} className={styles.nodeItem} style={{ top: `${(i / (stages.length - 1)) * 100}%` }}>
                <button
                  type="button"
                  className={cn(styles.node, styles[state])}
                  onClick={() => scrollTo(`#${s.id}`)}
                  aria-label={`Go to ${s.nav} (${s.index} ${s.stage})`}
                  aria-current={state === 'current' ? 'step' : undefined}
                >
                  <span className={styles.label}>
                    <span className={styles.labelIndex}>{s.index}</span> {s.stage}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <AnimatePresence>
          {stage !== 'hero' && (
            <motion.div
              className={styles.rider}
              initial={{ opacity: 0, scale: 0.4, x: 30 }}
              animate={{ opacity: hover ? 0 : 1, scale: 1, x: 0, top: `${pct}%` }}
              exit={{ opacity: 0, scale: 0.4, x: 30 }}
              transition={SPRING}
            >
              <Bit size={40} mood={moodForStage[stage]} say={talking && !hover ? stages[index].bitSays : undefined} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
