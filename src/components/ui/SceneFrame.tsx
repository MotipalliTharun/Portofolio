import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { stageById, type StageId } from '@/data/resume';
import { SceneArt, sceneMeta } from '@/character/Engineer';
import { ease } from '@/lib/motion';
import styles from './SceneFrame.module.css';

interface SceneFrameProps {
  stage: StageId;
  className?: string;
  /** Hide the title bar for compact placements. */
  bare?: boolean;
}

/**
 * A comic-panel window where the engineer acts out a pipeline stage.
 * The frame wipes open, the engineer steps in, and the loop runs only while visible.
 */
export function SceneFrame({ stage, className, bare }: SceneFrameProps) {
  // Observe an unclipped wrapper: a fully clipped element never reports as intersecting.
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const visible = useInView(ref, { amount: 0.25 });
  const entered = useInView(ref, { amount: 0.35, once: true });
  const s = stageById(stage);
  const meta = sceneMeta[s.scene];

  return (
    <div ref={ref} className={`${styles.wrap} ${className ?? ''}`}>
      <motion.figure
        className={styles.frame}
        initial={reduce ? false : { clipPath: 'inset(0% 100% 0% 0% round 18px)' }}
        animate={entered ? { clipPath: 'inset(0% 0% 0% 0% round 18px)' } : undefined}
        transition={{ duration: 1, ease }}
      >
        {!bare && (
          <figcaption className={styles.bar}>
            <span className={styles.dots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className={styles.title}>
              scene {s.index} · <b>{s.stage}</b>
            </span>
            <span className={styles.activity}>
              <span className={styles.live} aria-hidden="true" />
              {meta.activity}
            </span>
          </figcaption>
        )}
        <div className={styles.stage}>
          <SceneArt scene={s.scene} playing={visible && !reduce} entered={entered || !!reduce} />
        </div>
      </motion.figure>
    </div>
  );
}
