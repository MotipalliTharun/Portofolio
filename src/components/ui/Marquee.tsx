import type { ReactNode } from 'react';
import styles from './Marquee.module.css';

/** Infinite horizontal ticker. Content is duplicated once for a seamless loop; pauses on hover. */
export function Marquee({ items, separator = '·', label }: { items: ReactNode[]; separator?: ReactNode; label: string }) {
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className={styles.item}>
          {item}
          <span className={styles.sep} aria-hidden="true">{separator}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={styles.marquee} aria-label={label}>
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
