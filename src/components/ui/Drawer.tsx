import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { useScrollLock } from '@/providers/SmoothScroll';
import { exitOf } from '@/lib/motion';
import styles from './Drawer.module.css';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  /** 'fade' lets a shared element (e.g. a card's cover) morph into the panel instead of sliding with it */
  entrance?: 'slide' | 'fade';
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

/** Accessible side sheet: traps focus, closes on Esc or backdrop click, restores focus on close. */
export function Drawer({ open, onClose, labelledBy, children, entrance = 'slide' }: DrawerProps) {
  const panel = useRef<HTMLDivElement>(null);
  const lock = useScrollLock();
  const reduce = useReducedMotion();
  const fade = reduce || entrance === 'fade';

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    lock(true);
    requestAnimationFrame(() => panel.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lock(false);
      previous?.focus({ preventScroll: true });
    };
  }, [open, onClose, lock]);

  return (
    <AnimatePresence>
      {open && (
        <div className={styles.root}>
          <motion.div
            className={styles.scrim}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: exitOf(0.3) } }}
          />
          <motion.div
            ref={panel}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            data-lenis-prevent
            initial={fade ? { opacity: 0 } : { x: '100%' }}
            animate={fade ? { opacity: 1, transition: { duration: 0.25 } } : { x: 0, transition: { type: 'spring', stiffness: 260, damping: 32 } }}
            exit={fade ? { opacity: 0, transition: { duration: exitOf(0.25) } } : { x: '100%', transition: { duration: exitOf(0.45), ease: [0.4, 0, 1, 1] } }}
          >
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
