import type { Status } from '@/data/resume';
import { cn } from '@/lib/cn';
import styles from './StatusPill.module.css';

export function StatusPill({ status, label }: { status: Status | 'idle'; label?: string }) {
  return (
    <span className={cn(styles.pill, styles[status])}>
      <span className={styles.dot} aria-hidden="true" />
      {label ?? status}
    </span>
  );
}
