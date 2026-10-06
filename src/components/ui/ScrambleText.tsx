import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ElementType } from 'react';
import styles from './ScrambleText.module.css';

const NOISE = '░▒▓#%&@$*+=?/\\<>01';

interface ScrambleTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** ms per character of resolve front */
  speed?: number;
}

/**
 * "Cleanse" effect: text starts as noisy raw data and resolves left to right
 * into the real copy. Screen readers always get the final text.
 */
export function ScrambleText({ text, as: Tag = 'p', className, speed = 14 }: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();
  // [resolved, noise, pending]: pending text keeps its real glyphs (faded) so nothing reflows
  const [parts, setParts] = useState<[string, string, string]>([text, '', '']);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tail = 10; // characters of noise ahead of the resolved front
    const tick = (now: number) => {
      const front = Math.floor((now - start) / speed);
      const end = Math.min(text.length, front + tail);
      let noise = '';
      for (let i = front; i < end; i++) noise += text[i] === ' ' ? ' ' : NOISE[(Math.random() * NOISE.length) | 0];
      setParts([text.slice(0, front), noise, text.slice(end)]);
      if (front < text.length) raf = requestAnimationFrame(tick);
      else setParts([text, '', '']);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text, speed]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {parts[0]}
        <span className={styles.noise}>{parts[1]}</span>
        <span className={styles.pending}>{parts[2]}</span>
      </span>
    </Tag>
  );
}
