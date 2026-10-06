import type { Transition, Variants } from 'motion/react';

/** One easing curve for the whole site: fast out, long settle. */
export const ease = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const dur = { fast: 0.2, base: 0.45, slow: 0.8, xslow: 1.1 } as const;

export const spring = {
  snappy: { type: 'spring', stiffness: 420, damping: 32 } as Transition,
  soft: { type: 'spring', stiffness: 120, damping: 20 } as Transition,
  bouncy: { type: 'spring', stiffness: 260, damping: 14 } as Transition,
};

/**
 * Reveal variants. Each section picks the one that matches its stage so entrances
 * say something about the content instead of all fading up the same way.
 */
export type RevealVariant = 'rise' | 'clip' | 'scale' | 'drop' | 'file' | 'slide' | 'join';

export const reveal: Record<RevealVariant, Variants> = {
  /** Default: lift into place. */
  rise: {
    hidden: { opacity: 0, y: 28 },
    shown: { opacity: 1, y: 0, transition: { duration: dur.slow, ease } },
  },
  /** Wipe open from the bottom edge. */
  clip: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)', y: 24 },
    shown: { clipPath: 'inset(0% 0% 0% 0%)', y: 0, transition: { duration: dur.xslow, ease } },
  },
  /** Grow from slightly small, like a card picked up. */
  scale: {
    hidden: { opacity: 0, scale: 0.92, y: 16 },
    shown: { opacity: 1, scale: 1, y: 0, transition: spring.soft },
  },
  /** Build: blocks drop in and land with a bounce. */
  drop: {
    hidden: { opacity: 0, y: -60, rotate: -3 },
    shown: { opacity: 1, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 240, damping: 16 } },
  },
  /** Archive: index cards flip down into the drawer. */
  file: {
    hidden: { opacity: 0, rotateX: -80, y: -10, transformPerspective: 900 },
    shown: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 900, transition: { duration: dur.xslow, ease } },
  },
  /** Serve: slide across like a tray. */
  slide: {
    hidden: { opacity: 0, x: 60 },
    shown: { opacity: 1, x: 0, transition: { duration: dur.slow, ease } },
  },
  /** Join: come in from the side and lock onto the timeline. */
  join: {
    hidden: { opacity: 0, x: 48, filter: 'blur(6px)' },
    shown: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: dur.slow, ease } },
  },
};
