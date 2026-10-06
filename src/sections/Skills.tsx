import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { experience, projects, skillGroups } from '@/data/resume';
import { Section } from '@/components/layout/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { traceSkill, type LineageSource } from '@/lib/lineage';
import { useUI } from '@/providers/UIProvider';
import { useScrollTo } from '@/providers/SmoothScroll';
import { cn } from '@/lib/cn';
import styles from './Skills.module.css';

const MAX = experience.length + projects.length;

export function Skills() {
  const { openProject } = useUI();
  const scrollTo = useScrollTo();
  const lineage = useMemo(() => {
    const map = new Map<string, LineageSource[]>();
    skillGroups.forEach((g) => g.skills.forEach((s) => map.set(s.name, traceSkill(s))));
    return map;
  }, []);
  const [selected, setSelected] = useState('Databricks');
  const sources = lineage.get(selected) ?? [];

  const openSource = (src: LineageSource) => {
    if (src.kind === 'project') {
      // The case study opens over the page, so the visitor stays in Skills
      openProject(src.id);
    } else {
      scrollTo('#experience');
    }
  };

  return (
    <Section
      id="skills"
      title="A stack with traceable lineage."
      accent={['lineage.']}
      intro="Pick any skill to trace where I’ve used it, the same way you’d trace a column back to its source table. Dots show how many roles and projects use it."
    >
      <div className={styles.layout}>
        <Reveal className={styles.groups} stagger={0.06}>
          {skillGroups.map((g) => (
            <RevealItem key={g.name} className={styles.group}>
              <h3 className={styles.groupName}>{g.name}</h3>
              <ul className={styles.skills}>
                {g.skills.map((s) => {
                  const count = lineage.get(s.name)?.length ?? 0;
                  const active = selected === s.name;
                  return (
                    <li key={s.name}>
                      <button
                        type="button"
                        className={cn(styles.skill, active && styles.active)}
                        onClick={() => setSelected(s.name)}
                        onPointerEnter={(e) => e.pointerType === 'mouse' && setSelected(s.name)}
                        aria-pressed={active}
                        aria-controls="lineage-panel"
                      >
                        {active && <motion.span layoutId="skill-active" className={styles.activeBg} transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                        <span className={styles.skillName}>{s.name}</span>
                        <span className={styles.dots} aria-label={`used in ${count} places`}>
                          {Array.from({ length: Math.min(count, MAX) }, (_, i) => (
                            <i key={i} />
                          ))}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </RevealItem>
          ))}
        </Reveal>

        <aside id="lineage-panel" className={styles.panel} aria-live="polite">
          <div className={styles.panelInner}>
            <p className={styles.panelKicker}>lineage</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className={styles.panelTitle}>{selected}</h3>
                {sources.length === 0 ? (
                  <p className={styles.empty}>Part of my toolkit, not tied to a single role or project listed here.</p>
                ) : (
                  <ol className={styles.sources}>
                    {sources.map((src, i) => (
                      <motion.li
                        key={src.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                      >
                        <button type="button" className={styles.source} onClick={() => openSource(src)}>
                          <span className={cn(styles.kind, src.kind === 'project' && styles.kindProject)}>{src.kind}</span>
                          <span className={styles.sourceLabel}>
                            {src.label}
                            <small>{src.sub}</small>
                          </span>
                          <span aria-hidden="true" className={styles.go}>→</span>
                        </button>
                      </motion.li>
                    ))}
                  </ol>
                )}
                <p className={styles.panelFoot}>
                  {sources.length} upstream source{sources.length === 1 ? '' : 's'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </Section>
  );
}
