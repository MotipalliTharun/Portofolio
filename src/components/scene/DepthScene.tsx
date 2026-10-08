import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './DepthScene.module.css';

interface DepthSceneProps {
  /** background plate (the scene with the figure painted out) */
  bg: string;
  /** the figure cut out on a transparent background, same size as `bg` */
  fg?: string;
  alt: string;
  /** object-position shared by every layer so they stay aligned, e.g. "62% 40%" */
  focus?: string;
  /** object-position on phones */
  focusMobile?: string;
  /** overlay content above everything */
  children?: ReactNode;
  /** max parallax travel in px */
  depth?: number;
  className?: string;
}

/**
 * A 2.5D scene built from one render: a background plate with the figure painted
 * out, and the figure cut out on top. Each layer drifts by a different amount with
 * the cursor and with scroll, so the still image reads as a space you look into.
 */
export function DepthScene({ bg, fg, alt, focus = '50% 50%', focusMobile, children, depth = 18, className }: DepthSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduce || !inView) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, inView, px, py]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const m = reduce ? 0 : 1;
  const bgX = useTransform(sx, (v) => v * -depth * 0.45 * m);
  const bgY = useTransform(() => (sy.get() * -depth * 0.3 + (scrollYProgress.get() - 0.5) * 70) * m);
  const fgX = useTransform(sx, (v) => v * depth * m);
  const fgY = useTransform(() => (sy.get() * depth * 0.5 + (scrollYProgress.get() - 0.5) * -20) * m);

  return (
    <div
      ref={ref}
      className={cn(styles.scene, className)}
      style={{ '--focus': focus, '--focus-mobile': focusMobile ?? focus } as CSSProperties}
    >
      <motion.img className={cn(styles.layer, styles.bg)} src={bg} alt={fg ? '' : alt} style={{ x: bgX, y: bgY }} loading="lazy" decoding="async" />
      <div className={styles.shade} aria-hidden="true" />
      {fg && <motion.img className={cn(styles.layer, styles.fg)} src={fg} alt={alt} style={{ x: fgX, y: fgY }} loading="lazy" decoding="async" />}
      <div className={styles.fade} aria-hidden="true" />
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
