import { motion, useReducedMotion } from 'framer-motion';
import { Fragment } from 'react';
import { cn } from '@/lib/cn';
import styles from './FlowDiagram.module.css';

interface FlowDiagramProps {
  steps: string[];
  variant?: 'inline' | 'full';
  label: string;
}

/**
 * Pipeline flow. `inline` is a compact one-liner for cards; `full` draws
 * connected nodes with data packets travelling between them.
 */
export function FlowDiagram({ steps, variant = 'inline', label }: FlowDiagramProps) {
  const reduce = useReducedMotion();

  if (variant === 'inline') {
    return (
      <p className={styles.inline} aria-label={`${label}: ${steps.join(' to ')}`}>
        {steps.map((s, i) => (
          <Fragment key={s}>
            <span className={styles.inlineStep}>{s}</span>
            {i < steps.length - 1 && <span className={styles.arrow} aria-hidden="true">→</span>}
          </Fragment>
        ))}
      </p>
    );
  }

  return (
    <ol className={styles.full} aria-label={label}>
      {steps.map((s, i) => (
        <motion.li
          key={s}
          className={styles.step}
          initial={reduce ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 + i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={cn(styles.node, i === 0 && styles.source, i === steps.length - 1 && styles.sink)}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className={styles.edge} aria-hidden="true">
              <span className={styles.packet} style={{ animationDelay: `${i * 0.35}s` }} />
            </span>
          )}
        </motion.li>
      ))}
    </ol>
  );
}
