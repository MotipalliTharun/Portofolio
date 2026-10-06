import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Stagger direct <RevealItem> children instead of animating as one block. */
  stagger?: number;
  as?: 'div' | 'ul' | 'ol' | 'section' | 'article';
}

/** Fades and lifts content into place the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className, stagger, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) return <Comp className={className}>{children}</Comp>;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={
        stagger
          ? { hidden: {}, shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }
          : { hidden: revealVariants.hidden, shown: { ...(revealVariants.shown as object), transition: { duration: 0.7, ease: EASE, delay } } }
      }
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'article' }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={revealVariants}>
      {children}
    </Comp>
  );
}
