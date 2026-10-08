import { motion } from 'framer-motion';
import { stages, type StageId } from '@/data/resume';
import { useSlashTo } from '@/providers/SlashTransition';
import { spring } from '@/lib/motion';
import styles from './ChapterNext.module.css';

/**
 * The close of a chapter: a quiet pointer to the next one, so the page reads as
 * a story with an obvious way forward. Contact is the final call to action and
 * gets none.
 */
export function ChapterNext({ from }: { from: StageId }) {
  const slashTo = useSlashTo();
  const i = stages.findIndex((s) => s.id === from);
  const next = stages[i + 1];
  if (!next) return null;
  const here = stages[i];

  return (
    <motion.div
      className={styles.next}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={styles.end}>end of chapter {here.index}</span>
      <span className={styles.rule} aria-hidden="true" />
      <motion.a
        href={`#${next.id}`}
        className={styles.link}
        onClick={(e) => {
          e.preventDefault();
          slashTo(next.id);
        }}
        initial="rest"
        whileHover="hover"
        whileFocus="hover"
        whileTap={{ scale: 0.97 }}
      >
        <span className={styles.label}>
          Next <span className={styles.index}>{next.index}</span> {next.nav}
        </span>
        <motion.span className={styles.arrow} variants={{ rest: { x: 0 }, hover: { x: 5 } }} transition={spring.touch} aria-hidden="true">
          →
        </motion.span>
      </motion.a>
    </motion.div>
  );
}
