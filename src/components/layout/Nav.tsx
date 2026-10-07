import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { profile, stages, stageById, type StageId } from '@/data/resume';
import { useScrollLock } from '@/providers/SmoothScroll';
import { useSlashTo } from '@/providers/SlashTransition';
import { useUI } from '@/providers/UIProvider';
import { useTheme } from '@/hooks/useTheme';
import { modKey } from '@/components/ui/Kbd';
import { cn } from '@/lib/cn';
import styles from './Nav.module.css';

const links = stages.filter((s) => s.id !== 'hero' && s.id !== 'education');

/** A mechanical keycap: legend top-left, label in the middle, presses down on click. */
function Key({
  legend,
  children,
  active,
  pressed,
  wide,
  accent,
  className,
  delay = 0,
  ...rest
}: {
  legend?: string;
  children: ReactNode;
  active?: boolean;
  pressed?: boolean;
  wide?: boolean;
  accent?: boolean;
  className?: string;
  delay?: number;
} & ({ href: string; onClick: (e: MouseEvent<HTMLAnchorElement>) => void; 'aria-label'?: string; 'aria-current'?: 'true' } | { href?: undefined; onClick: (e: MouseEvent<HTMLButtonElement>) => void; 'aria-label'?: string; 'aria-expanded'?: boolean; 'aria-controls'?: string })) {
  const reduce = useReducedMotion();
  const cls = cn(styles.key, active && styles.lit, pressed && styles.pressed, wide && styles.wide, accent && styles.accentKey, className);
  const inner = (
    <span className={styles.cap}>
      {legend && <span className={styles.legend}>{legend}</span>}
      <span className={styles.label}>{children}</span>
    </span>
  );
  // keys pop in one after another, as if being typed
  const pop = reduce ? {} : { initial: { y: -14, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { type: 'spring' as const, stiffness: 520, damping: 22, delay: 0.15 + delay * 0.06 } };
  return rest.href !== undefined ? (
    <motion.a {...pop} {...(rest as object)} className={cls}>
      {inner}
    </motion.a>
  ) : (
    <motion.button {...pop} type="button" {...(rest as object)} className={cls}>
      {inner}
    </motion.button>
  );
}

export function Nav() {
  const { stage, setPaletteOpen, paletteOpen } = useUI();
  const slashTo = useSlashTo();
  const { theme, toggle } = useTheme();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pressed, setPressed] = useState<StageId | null>(null);
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

  const jump = (id: StageId) => {
    setMenuOpen(false);
    setPressed(id);
    window.setTimeout(() => setPressed(null), 160);
    slashTo(id);
  };
  const go = (e: MouseEvent, id: StageId) => {
    e.preventDefault();
    jump(id);
  };

  // the number keys on a real keyboard press the matching keycap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || paletteOpen) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > links.length) return;
      e.preventDefault();
      jump(links[n - 1].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // jump only touches state setters and the stable slash context
  }, [paletteOpen]);

  const here = stageById(stage);

  return (
    <>
      <motion.header
        className={cn(styles.nav, scrolled && styles.scrolled)}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* the nav is a compact mechanical keyboard */}
        <div className={cn(styles.board, scrolled && styles.boardScrolled)}>
          <Key href="#hero" onClick={(e) => go(e, 'hero')} legend="esc" accent aria-label={`${profile.name}, back to top`} className={styles.esc}>
            TM
            <span className={styles.liveDot} aria-hidden="true" />
          </Key>

          <nav aria-label="Primary" className={styles.links}>
            <ul>
              {links.map((l, i) => (
                <li key={l.id}>
                  <Key
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    legend={String(i + 1)}
                    active={stage === l.id}
                    pressed={pressed === l.id}
                    aria-current={stage === l.id ? 'true' : undefined}
                    delay={i + 1}
                  >
                    {l.nav}
                  </Key>
                </li>
              ))}
            </ul>
          </nav>

          {/* phones: one key names where you are and opens the menu */}
          <Key onClick={() => setMenuOpen((o) => !o)} legend={here.index} className={styles.hereKey} aria-expanded={menuOpen} aria-controls="mobile-menu">
            {here.nav}
          </Key>

          <div className={styles.actions}>
            <Key onClick={() => setPaletteOpen(true)} legend={`${mod} K`} aria-label="Open command menu" className={styles.searchKey} delay={6}>
              Search
            </Key>
            <Key
              onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
              legend="fn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              delay={7}
            >
              <ThemeIcon dark={theme === 'dark'} />
            </Key>
            <Key href="#contact" onClick={(e) => go(e, 'contact')} legend="↵" wide accent className={styles.enter} delay={8}>
              Let’s talk
            </Key>
            <Key
              onClick={() => setMenuOpen((o) => !o)}
              legend="menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={styles.menuKey}
            >
              <span className={cn(styles.burger, menuOpen && styles.burgerOpen)} aria-hidden="true" />
            </Key>
          </div>

          {/* status LEDs along the case: scroll progress */}
          <span className={styles.ledTrack} aria-hidden="true">
            <motion.span className={styles.led} style={{ scaleX: progress }} />
          </span>
        </div>
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
