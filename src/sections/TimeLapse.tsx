import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { experience } from '@/data/resume';
import { scenes } from '@/data/scenes';
import styles from './TimeLapse.module.css';

const current = experience.find((e) => !e.end)!;

const beats = [
  { time: 'Day job', title: `Shipping data at ${current.company}.`, body: 'Pipelines, data quality checks and APIs that healthcare teams rely on every morning.' },
  { time: 'After hours', title: 'Then the side projects start.', body: 'The same problems, explored end to end on my own time. Here’s what came out of it.' },
];

/** minutes since midnight → "9:00 AM" */
function clock(min: number) {
  const h = Math.floor(min / 60) % 24;
  const m = Math.floor(min % 60);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/**
 * A pinned, scroll-driven transition between Experience and Projects: the same
 * desk dissolves from afternoon into night while a clock runs, bridging the day
 * job and the side projects. Night is the hero video's opening frame, so the
 * story comes full circle.
 */
export function TimeLapse() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const night = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const time = useTransform(scrollYProgress, [0.05, 0.95], [9 * 60, 23 * 60 + 30], { clamp: true });
  const clockText = useTransform(time, clock);
  const sun = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const first = useTransform(scrollYProgress, [0, 0.08, 0.32, 0.42], [0, 1, 1, 0]);
  const second = useTransform(scrollYProgress, [0.6, 0.72, 1], [0, 1, 1]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} className={styles.timelapse} aria-label="From the day job to side projects">
      <div className={styles.sticky}>
        <motion.div className={styles.frame} style={{ scale: zoom }}>
          <img className={styles.img} src={scenes.day.src} alt={scenes.day.alt} loading="lazy" decoding="async" />
          <motion.img className={styles.img} src={scenes.night.src} alt={scenes.night.alt} style={{ opacity: night }} loading="lazy" decoding="async" />
        </motion.div>
        <div className={styles.shade} aria-hidden="true" />

        <div className={`container ${styles.overlay}`}>
          <div className={styles.clock} aria-hidden="true">
            <motion.span className={styles.dial} style={{ rotate: sun }} />
            <motion.span className={styles.time}>{clockText}</motion.span>
          </div>

          {beats.map((b, i) => (
            <motion.div key={b.time} className={styles.beat} style={{ opacity: i === 0 ? first : second }}>
              <span className={styles.eyebrow}>{b.time}</span>
              <h2 className={styles.title}>{b.title}</h2>
              <p className={styles.body}>{b.body}</p>
            </motion.div>
          ))}

          <div className={styles.track} aria-hidden="true">
            <motion.span className={styles.fill} style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}
