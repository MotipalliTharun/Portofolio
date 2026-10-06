import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ProjectTag, StageId } from '@/data/resume';
import { stages } from '@/data/resume';
import { useActiveSection } from '@/hooks/useActiveSection';
import styles from './Toast.module.css';

export type ProjectFilter = ProjectTag | 'all';

interface UIState {
  stage: StageId;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  filter: ProjectFilter;
  setFilter: (f: ProjectFilter) => void;
  openProjectId: string | null;
  openProject: (id: string | null) => void;
  toast: (message: string) => void;
}

const UIContext = createContext<UIState | null>(null);
const stageIds = stages.map((s) => s.id);

export function UIProvider({ children }: { children: ReactNode }) {
  const stage = useActiveSection(stageIds) as StageId;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [openProjectId, openProject] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const nextId = useRef(0);

  // The root hue follows the active section; fixed UI (nav, rail, Bit) shifts with it.
  useEffect(() => {
    const hue = stages.find((s) => s.id === stage)?.hue;
    if (hue !== undefined) document.documentElement.style.setProperty('--hue', String(hue));
  }, [stage]);

  const toast = useCallback((message: string) => {
    const id = ++nextId.current;
    setToasts((t) => [...t.slice(-2), { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const value = useMemo(
    () => ({ stage, paletteOpen, setPaletteOpen, filter, setFilter, openProjectId, openProject, toast }),
    [stage, paletteOpen, filter, openProjectId, toast],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={styles.toast}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            >
              <span className={styles.dot} aria-hidden="true" />
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </UIContext.Provider>
  );
}

export function useUI(): UIState {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
