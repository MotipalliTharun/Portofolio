import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { profile, projects, projectTags, stages } from '@/data/resume';
import { useUI } from '@/providers/UIProvider';
import { useScrollLock, useScrollTo } from '@/providers/SmoothScroll';
import { useTheme } from '@/hooks/useTheme';
import { copyText } from '@/components/ui/CopyButton';
import { Kbd } from '@/components/ui/Kbd';
import { cn } from '@/lib/cn';
import styles from './CommandPalette.module.css';

interface Command {
  id: string;
  group: 'Navigate' | 'Projects' | 'Filter projects' | 'Actions';
  label: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

/** ⌘K command menu: navigate, open case studies, filter projects, copy email, switch theme. */
export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, openProject, setFilter, toast } = useUI();
  const scrollTo = useScrollTo();
  const lock = useScrollLock();
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = () => setPaletteOpen(false);

  const commands = useMemo<Command[]>(
    () => [
      ...stages.map((s) => ({
        id: `go-${s.id}`,
        group: 'Navigate' as const,
        label: s.nav,
        hint: `${s.index} ${s.stage}`,
        run: () => scrollTo(`#${s.id}`),
      })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        group: 'Projects' as const,
        label: p.title,
        hint: p.kind,
        keywords: p.stack.join(' '),
        run: () => {
          scrollTo('#projects', { immediate: true });
          openProject(p.id);
        },
      })),
      ...projectTags.map((t) => ({
        id: `filter-${t}`,
        group: 'Filter projects' as const,
        label: `Show ${t} projects`,
        keywords: 'filter tag',
        run: () => {
          setFilter(t);
          scrollTo('#projects');
        },
      })),
      {
        id: 'copy-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: profile.email,
        keywords: 'contact mail',
        run: async () => toast((await copyText(profile.email)) ? 'Email copied to clipboard' : profile.email),
      },
      {
        id: 'linkedin',
        group: 'Actions',
        label: 'Open LinkedIn',
        hint: '↗',
        keywords: 'social profile',
        run: () => window.open(profile.linkedin, '_blank', 'noopener'),
      },
      {
        id: 'theme',
        group: 'Actions',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
        keywords: 'dark light mode appearance',
        run: () => toggle(),
      },
    ],
    [scrollTo, openProject, setFilter, toast, theme, toggle],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint ?? ''} ${c.keywords ?? ''} ${c.group}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!paletteOpen) return;
    setQuery('');
    lock(true);
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => lock(false);
  }, [paletteOpen, lock]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const run = (c: Command) => {
    close();
    // let the palette close before scrolling
    setTimeout(c.run, 120);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  let lastGroup = '';

  return (
    <AnimatePresence>
      {paletteOpen && (
        <div className={styles.root}>
          <motion.div className={styles.scrim} onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <div className={styles.search}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                id="command-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a section, project or action…"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-list"
                aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              <Kbd>esc</Kbd>
            </div>

            <ul ref={listRef} id="command-list" role="listbox" className={styles.list} data-lenis-prevent>
              {results.length === 0 && <li className={styles.empty}>No matches for “{query}”. Try “lakehouse”, “email” or “dark”.</li>}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                return (
                  <li key={c.id} role="presentation">
                    {header && <div className={styles.group}>{header}</div>}
                    <div
                      id={`cmd-${c.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      className={cn(styles.item, i === active && styles.itemActive)}
                      onPointerMove={() => setActive(i)}
                      onClick={() => run(c)}
                    >
                      {i === active && <motion.span layoutId="cmd-active" className={styles.highlight} transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                      <span className={styles.itemLabel}>{c.label}</span>
                      {c.hint && <span className={styles.itemHint}>{c.hint}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className={styles.footer}>
              <span><Kbd>↑</Kbd><Kbd>↓</Kbd> move</span>
              <span><Kbd>↵</Kbd> select</span>
              <span className={styles.count}>{results.length} commands</span>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
