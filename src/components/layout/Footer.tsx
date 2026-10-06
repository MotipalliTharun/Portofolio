import { profile } from '@/data/resume';
import { useScrollTo } from '@/providers/SmoothScroll';
import { useUI } from '@/providers/UIProvider';
import { Kbd } from '@/components/ui/Kbd';
import styles from './Footer.module.css';

export function Footer() {
  const scrollTo = useScrollTo();
  const { setPaletteOpen } = useUI();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className={styles.meta}>
          Built with React, TypeScript, Motion &amp; Lenis ·{' '}
          <button type="button" className={styles.link} onClick={() => setPaletteOpen(true)}>
            press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
          </button>
        </p>
        <button type="button" className={styles.link} onClick={() => scrollTo('#hero')}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
