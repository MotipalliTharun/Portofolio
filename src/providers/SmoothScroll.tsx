import Lenis from 'lenis';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';

type ScrollTo = (target: string | number, opts?: { immediate?: boolean }) => void;

interface ScrollApi {
  scrollTo: ScrollTo;
  /** Pause page scrolling while a modal surface is open. */
  lock: (locked: boolean) => void;
}

const ScrollContext = createContext<ScrollApi>({ scrollTo: () => {}, lock: () => {} });

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: false });
    lenisRef.current = lenis;
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback<ScrollTo>((target, opts) => {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : null;
    if (typeof target === 'string' && !el) return;
    const offset = -56;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el ?? (target as number), { offset, immediate: opts?.immediate });
    } else {
      const top = el ? el.getBoundingClientRect().top + window.scrollY + offset : (target as number);
      window.scrollTo({ top, behavior: opts?.immediate ? 'auto' : 'smooth' });
    }
    if (el) {
      history.replaceState(null, '', `#${el.id}`);
      el.focus({ preventScroll: true });
    }
  }, []);

  const lock = useCallback((locked: boolean) => {
    if (lenisRef.current) {
      if (locked) lenisRef.current.stop();
      else lenisRef.current.start();
    }
    document.documentElement.style.overflow = locked ? 'hidden' : '';
  }, []);

  const api = useMemo(() => ({ scrollTo, lock }), [scrollTo, lock]);
  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export const useScrollTo = () => useContext(ScrollContext).scrollTo;
export const useScrollLock = () => useContext(ScrollContext).lock;
