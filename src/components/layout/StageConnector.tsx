import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { stages, type StageId } from '@/data/resume';
import styles from './StageConnector.module.css';

/**
 * Scroll-linked transition between two sections: a pipe draws across the page and
 * a packet travels from the previous stage into this one, changing hue on the way.
 */
export function StageConnector({ to }: { to: StageId }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const i = stages.findIndex((s) => s.id === to);
  const from = stages[i - 1];
  const next = stages[i];
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'start 35%'] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const scaleX = useTransform(p, [0, 1], [reduce ? 1 : 0, 1]);
  const left = useTransform(p, [0, 1], ['0%', '100%']);
  const hue = useTransform(p, [0, 1], [from.hue, next.hue]);
  const color = useTransform(hue, (h) => `oklch(var(--acc-l) var(--acc-c) ${h})`);
  const rotate = useTransform(p, [0, 1], [0, 360]);

  return (
    <div ref={ref} className={styles.connector} aria-hidden="true">
      <span className={styles.label} style={{ ['--hue' as string]: from.hue }} data-hue>
        <b>{from.index}</b> {from.stage}
      </span>
      <div className={styles.track}>
        <motion.span className={styles.fill} style={{ scaleX, background: color }} />
        {!reduce && (
          <motion.span className={styles.packet} style={{ left, background: color, rotate }}>
            <i />
            <i />
          </motion.span>
        )}
      </div>
      <span className={styles.label} style={{ ['--hue' as string]: next.hue }} data-hue>
        <b>{next.index}</b> {next.stage}
      </span>
    </div>
  );
}
