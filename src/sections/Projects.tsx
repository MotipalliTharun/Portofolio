import { AnimatePresence, motion } from 'motion/react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { projects, projectTags } from '@/data/resume';
import { Section } from '@/components/layout/Section';
import { Chip, ChipList } from '@/components/ui/Chip';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { FlowDiagram } from '@/components/ui/FlowDiagram';
import { Reveal } from '@/components/ui/Reveal';
import { useUI, type ProjectFilter } from '@/providers/UIProvider';
import { projectArt } from '@/data/stickers';
import { projectPhotos } from '@/data/photos';
import styles from './Projects.module.css';

const ProjectDrawer = lazy(() => import('./ProjectDrawer'));
const filters: ProjectFilter[] = ['all', ...projectTags];

export function Projects() {
  const { filter, setFilter, openProject, openProjectId } = useUI();
  // Keep the drawer mounted after first open so its exit animation can play
  const [drawerLoaded, setDrawerLoaded] = useState(false);
  useEffect(() => {
    if (openProjectId) setDrawerLoaded(true);
  }, [openProjectId]);
  const shown = projects.filter((p) => filter === 'all' || p.tags.includes(filter));

  return (
    <Section
      id="projects"
      title="Builds that go deeper on the same problems."
      accent={['deeper']}
      intro="Each project takes a problem from my day job and explores it end to end. Open one to see the problem, the architecture and the stack."
    >
      <Reveal className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter projects by technology">
          {filters.map((f) => (
            <Chip key={f} id={`filter-${f}`} size="md" pressed={filter === f} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f}
            </Chip>
          ))}
        </div>
        <p className={styles.count} aria-live="polite">
          <span>{String(shown.length).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')} projects
        </p>
      </Reveal>

      <motion.ul layout className={styles.grid}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              <Reveal className={styles.cell} variant="drop" delay={(i % 2) * 0.12 + Math.floor(i / 2) * 0.08}>
                <SpotlightCard interactive className={styles.card}>
                  <div className={styles.cover}>
                    <img src={projectPhotos[p.id]} alt="" width="1100" height="619" loading="lazy" decoding="async" className={styles.photo} />
                    <img src={projectArt[p.id]} alt="" width="64" height="64" loading="lazy" decoding="async" className={styles.badge} />
                  </div>
                  <div className={styles.heading}>
                    <span className={styles.kind}>{p.kind}</span>
                    <h3 className={styles.title}>
                      <button type="button" className={styles.stretch} onClick={() => openProject(p.id)} aria-haspopup="dialog">
                        {p.title}
                      </button>
                    </h3>
                  </div>
                  <p className={styles.summary}>{p.summary}</p>
                  <FlowDiagram steps={p.flow} label={`${p.title} data flow`} />
                  <div className={styles.foot}>
                    <ChipList items={p.stack} highlight={(s) => filter !== 'all' && s.toLowerCase().includes(filter.toLowerCase().split(' ')[0])} />
                    <span className={styles.more} aria-hidden="true">
                      Case study <span>→</span>
                    </span>
                  </div>
                </SpotlightCard>
              </Reveal>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Suspense fallback={null}>
        {drawerLoaded && <ProjectDrawer />}
      </Suspense>
    </Section>
  );
}
