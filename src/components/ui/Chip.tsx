import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Chip.module.css';

interface ChipProps {
  children: ReactNode;
  /** Renders a toggle button when provided. */
  onClick?: () => void;
  pressed?: boolean;
  highlighted?: boolean;
  size?: 'sm' | 'md';
  id?: string;
}

export function Chip({ children, onClick, pressed, highlighted, size = 'sm', id }: ChipProps) {
  const className = cn(styles.chip, styles[size], pressed && styles.pressed, highlighted && styles.hit, onClick && styles.button);
  if (onClick) {
    return (
      <button type="button" id={id} className={className} aria-pressed={pressed} onClick={onClick}>
        {children}
      </button>
    );
  }
  return <span className={className}>{children}</span>;
}

export function ChipList({ items, highlight }: { items: string[]; highlight?: (s: string) => boolean }) {
  return (
    <ul className={styles.list}>
      {items.map((s) => (
        <li key={s}>
          <Chip highlighted={highlight?.(s)}>{s}</Chip>
        </li>
      ))}
    </ul>
  );
}
