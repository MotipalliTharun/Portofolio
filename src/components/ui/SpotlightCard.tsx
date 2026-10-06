import type { HTMLAttributes, PointerEvent, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './SpotlightCard.module.css';

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

/** Card with a soft glow that follows the cursor. Pure CSS variables, no re-renders. */
export function SpotlightCard({ children, className, interactive, ...rest }: SpotlightCardProps) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div className={cn(styles.card, interactive && styles.interactive, className)} onPointerMove={onMove} {...rest}>
      {children}
    </div>
  );
}
