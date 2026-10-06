import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useEffect, useState, type MouseEvent } from 'react';
import { profile, stages } from '@/data/resume';
import { useScrollLock, useScrollTo } from '@/providers/SmoothScroll';
import { useUI } from '@/providers/UIProvider';
import { useTheme } from '@/hooks/useTheme';
import { Kbd, modKey } from '@/components/ui/Kbd';
import { cn } from '@/lib/cn';
import styles from './Nav.module.css';

const links = stages.filter((s) => s.id !== 'hero' && s.id !== 'education');

export function Nav() {
  const { stage, setPaletteOpen } = useUI();
  const scrollTo = useScrollTo();
  const { theme, toggle } = useTheme();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mod, setMod] = useState('⌘');

  const lock = useScrollLock();

  useEffect(() => setMod(modKey()), []);
  useEffect(() => {
    if (!menuOpen) return;
    lock(true);
    return () => lock(false);
  }, [menuOpen, lock]);

  // Hide while scrolling down, reveal on scroll up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !menuOpen);
  });

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <>
      <motion.header
        className={cn(styles.nav, scrolled && styles.scrolled)}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={cn('container', styles.inner)}>
          <a href="#hero" className={styles.mark} onClick={(e) => go(e, 'hero')} aria-label={`${profile.name}, back to top`}>
            <span className={styles.monogram} aria-hidden="true">TM</span>
            <span className={styles.wordmark}>
              tharun<span className={styles.dot}>.</span>motipalli
            </span>
          </a>

          <nav aria-label="Primary" className={styles.links}>
            <ul>
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    className={cn(styles.link, stage === l.id && styles.active)}
                    aria-current={stage === l.id ? 'true' : undefined}
                  >
                    {stage === l.id && <motion.span layoutId="nav-pill" className={styles.pill} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span className={styles.linkText}>{l.nav}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <button type="button" className={styles.cmd} onClick={() => setPaletteOpen(true)} aria-label="Open command menu">
              <span className={styles.cmdText}>Search</span>
              <Kbd>{mod}</Kbd>
              <Kbd>K</Kbd>
            </button>
            <button
              type="button"
              className={styles.icon}
              onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <ThemeIcon dark={theme === 'dark'} />
            </button>
            <button
              type="button"
              className={cn(styles.icon, styles.menuBtn)}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className={cn(styles.burger, menuOpen && styles.burgerOpen)} aria-hidden="true" />
            </button>
          </div>
        </div>
        <motion.div className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className={styles.sheet}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.ul initial="hidden" animate="shown" variants={{ shown: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}>
              {stages.map((s) => (
                <motion.li key={s.id} variants={{ hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0 } }}>
                  <a href={`#${s.id}`} onClick={(e) => go(e, s.id)} className={cn(stage === s.id && styles.sheetActive)}>
                    <span className={styles.sheetIndex}>{s.index}</span>
                    {s.nav}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function ThemeIcon({ dark }: { dark: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <mask id="moon-mask">
        <rect width="24" height="24" fill="#fff" />
        <motion.circle r="9" fill="#000" initial={false} animate={{ cx: dark ? 17 : 30, cy: dark ? 7 : 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      </mask>
      <motion.circle cx="12" cy="12" fill="currentColor" stroke="none" mask="url(#moon-mask)" initial={false} animate={{ r: dark ? 9 : 5 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      <motion.g initial={false} animate={{ opacity: dark ? 0 : 1, rotate: dark ? -45 : 0, scale: dark ? 0.6 : 1 }} style={{ transformOrigin: '12px 12px' }} transition={{ duration: 0.4 }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line key={a} x1="12" y1="1.5" x2="12" y2="3.5" transform={`rotate(${a} 12 12)`} />
        ))}
      </motion.g>
    </svg>
  );
}
