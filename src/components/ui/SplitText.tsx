import { motion, useReducedMotion } from 'motion/react';
import { Fragment, type ElementType } from 'react';
import styles from './SplitText.module.css';

interface SplitTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  /** Words (exact match) to render in the accent style. */
  accent?: string[];
}

/** Heading that rises in word by word from behind a mask. Screen readers get the plain text. */
export function SplitText({ text, as: Tag = 'h2', className, id, delay = 0, immediate, accent = [] }: SplitTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const trigger = immediate ? { animate: 'shown' } : { whileInView: 'shown', viewport: { once: true, margin: '0px 0px -10% 0px' } };

  return (
    <Tag className={className} id={id} aria-label={text}>
      <motion.span
        aria-hidden="true"
        className={styles.wrap}
        initial={reduce ? false : 'hidden'}
        {...trigger}
        variants={{ shown: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className={styles.mask}>
              <motion.span
                className={accent.includes(w) ? styles.accent : styles.word}
                variants={{
                  hidden: { y: '110%', rotate: 4 },
                  shown: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
