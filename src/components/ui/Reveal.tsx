import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { reveal, type RevealVariant } from '@/lib/motion';

type Tag = 'div' | 'ul' | 'ol' | 'section' | 'article' | 'li' | 'form';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Stagger direct <RevealItem> children instead of animating as one block. */
  stagger?: number;
  variant?: RevealVariant;
  as?: Tag;
}

/** Animates content into place the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className, stagger, variant = 'rise', as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) return <Comp className={className}>{children}</Comp>;

  const v = reveal[variant];
  const variants = stagger
    ? { hidden: {}, shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }
    : {
        hidden: v.hidden,
        shown: {
          ...(v.shown as object),
          transition: { ...((v.shown as { transition?: object }).transition ?? {}), delay },
        },
      };

  return (
    <Comp className={className} initial="hidden" whileInView="shown" viewport={{ once: true, margin: '0px 0px -12% 0px' }} variants={variants}>
      {children}
    </Comp>
  );
}

/** Child of a staggered <Reveal>. Uses the given variant (defaults to rise). */
export function RevealItem({
  children,
  className,
  as = 'div',
  variant = 'rise',
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  variant?: RevealVariant;
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={reveal[variant]}>
      {children}
    </Comp>
  );
}
