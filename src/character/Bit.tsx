import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import styles from './Bit.module.css';

export type BitMood = 'raw' | 'clean' | 'curated' | 'served';

interface BitProps {
  mood?: BitMood;
  size?: number;
  /** Speech bubble text. Changing it animates a new bubble in. */
  say?: string;
  bubbleSide?: 'left' | 'top';
  className?: string;
}

const NOISE = [
  [20, 24], [58, 28], [24, 60], [56, 62], [16, 44], [64, 48], [40, 66],
];

/**
 * Bit: a data packet that moves through the pipeline with the visitor.
 * Eyes follow the pointer, it blinks on a random cadence, and its body
 * changes from noisy raw data to a served, curated record.
 */
export function Bit({ mood = 'raw', size = 72, say, bubbleSide = 'left', className }: BitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const [blink, setBlink] = useState(false);

  // Eyes track the pointer
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 300);
      px.set((dx / d) * 3.2 * k);
      py.set((dy / d) * 3.2 * k);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [px, py, reduce]);

  // Blink at a natural, irregular cadence
  useEffect(() => {
    if (reduce) return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        schedule();
      }, 2400 + Math.random() * 3200);
    };
    schedule();
    return () => clearTimeout(t);
  }, [reduce]);

  const mouth =
    mood === 'served' ? 'M31 54 Q40 63 49 54' : mood === 'raw' ? 'M34 56 Q40 53 46 56' : 'M33 55 Q40 59 47 55';

  return (
    <div ref={ref} className={cn(styles.bit, styles[mood], className)} style={{ width: size, height: size }}>
      <motion.svg
        viewBox="0 0 80 80"
        width={size}
        height={size}
        aria-hidden="true"
        animate={reduce ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse className={styles.shadow} cx="40" cy="76" rx="20" ry="3" />
        {/* antenna */}
        <line x1="40" y1="14" x2="40" y2="6" className={styles.stroke} strokeWidth="2.5" strokeLinecap="round" />
        <motion.circle
          cx="40"
          cy="5"
          r="3.5"
          className={styles.led}
          animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        {/* body */}
        <rect x="9" y="14" width="62" height="58" rx="19" className={styles.body} />
        <rect x="9" y="14" width="62" height="58" rx="19" className={styles.outline} fill="none" strokeWidth="2" />
        {/* raw-data noise specks fade out once cleaned */}
        <g className={styles.noise}>
          {NOISE.map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="3" height="3" rx="1" />
          ))}
        </g>
        {/* eyes */}
        <motion.g
          animate={{ scaleY: blink ? 0.1 : 1 }}
          transition={{ duration: 0.08 }}
          style={{ transformOrigin: '40px 40px', transformBox: 'view-box' }}
        >
          <ellipse cx="30" cy="40" rx="7.5" ry="8.5" className={styles.eye} />
          <ellipse cx="50" cy="40" rx="7.5" ry="8.5" className={styles.eye} />
          <motion.circle cx="30" cy="40" r="3.6" className={styles.pupil} style={{ x: px, y: py }} />
          <motion.circle cx="50" cy="40" r="3.6" className={styles.pupil} style={{ x: px, y: py }} />
        </motion.g>
        <path d={mouth} className={styles.stroke} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {mood === 'served' && (
          <g className={styles.badge}>
            <circle cx="66" cy="18" r="8" />
            <path d="M62.5 18 l2.5 2.5 l4.5 -5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </motion.svg>

      <AnimatePresence mode="wait">
        {say && (
          <motion.span
            key={say}
            className={cn(styles.bubble, styles[bubbleSide])}
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          >
            {say}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
