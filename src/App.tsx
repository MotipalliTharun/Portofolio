import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { SmoothScroll } from '@/providers/SmoothScroll';
import { UIProvider, useUI } from '@/providers/UIProvider';
import { Nav } from '@/components/layout/Nav';
import { PipelineRail } from '@/components/layout/PipelineRail';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Experience } from '@/sections/Experience';
import { Projects } from '@/sections/Projects';
import { Skills } from '@/sections/Skills';
import { Education } from '@/sections/Education';
import { Contact } from '@/sections/Contact';
import { TimeLapse } from '@/sections/TimeLapse';
import { useModHotkey } from '@/hooks/useHotkey';

const CommandPalette = lazy(() => import('@/components/layout/CommandPalette'));

function Shell() {
  const { paletteOpen, setPaletteOpen } = useUI();
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  const togglePalette = useCallback(() => setPaletteOpen(!paletteOpen), [paletteOpen, setPaletteOpen]);
  useModHotkey('k', togglePalette);

  useEffect(() => {
    if (paletteOpen) setPaletteLoaded(true);
  }, [paletteOpen]);

  // Preload the palette once the page is idle so the first ⌘K opens instantly
  useEffect(() => {
    const load = () => setPaletteLoaded(true);
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(load, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(load, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <a className="skip-link" href="#about">Skip to content</a>
      <div className="backdrop" aria-hidden="true" />
      <Nav />
      <PipelineRail />
      <main>
        <Hero />
        <About />
        <Experience />
        <TimeLapse />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Suspense fallback={null}>{paletteLoaded && <CommandPalette />}</Suspense>
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <UIProvider>
          <Shell />
        </UIProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
