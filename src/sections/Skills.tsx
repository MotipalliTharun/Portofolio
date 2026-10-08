import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { delivery, languages, practices, skillFlow, type FlowStageId, type Skill } from '@/data/resume';
import { practiceArt, stageArt } from '@/data/stickers';
import { Section } from '@/components/layout/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { traceSkill, type LineageSource } from '@/lib/lineage';
import { useUI } from '@/providers/UIProvider';
import { useScrollTo } from '@/providers/SmoothScroll';
import { ease, spring, stagger } from '@/lib/motion';
import { cn } from '@/lib/cn';
import {
  faBrain,
  faDatabase,
  faDiagramProject,
  faFileImport,
  faGears,
  faRocket,
  faServer,
  faShieldHalved,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Skills.module.css';

const TOUR_MS = 3600;

// Stage icons: Font Awesome Free (CC BY 4.0)
const ICONS: Record<FlowStageId, IconDefinition> = {
  ingest: faFileImport,
  process: faGears,
  store: faDatabase,
  orchestrate: faDiagramProject,
  validate: faShieldHalved,
  serve: faServer,
  learn: faBrain,
  ship: faRocket,
};

/** Flaticon object for the stage where one fits; Font Awesome otherwise. */
function StageArt({ id }: { id: FlowStageId }) {
  const art = stageArt[id];
  if (art) return <img src={art} alt="" width="40" height="40" draggable={false} />;
  return <StageIcon icon={ICONS[id]} />;
}

function StageIcon({ icon }: { icon: IconDefinition }) {
  const [w, h, , , d] = icon.icon;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="22" height="22" aria-hidden="true">
      {(Array.isArray(d) ? d : [d]).map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

const allSkills: Skill[] = [...skillFlow.flatMap((s) => s.skills), ...languages];

export function Skills() {
  const { openProject } = useUI();
  const scrollTo = useScrollTo();
  const reduce = useReducedMotion();
  const diagramRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const inView = useInView(diagramRef, { amount: 0.35 });

  const lineage = useMemo(() => new Map(allSkills.map((s) => [s.name, traceSkill(s)])), []);

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const stage = skillFlow[active];
  const [skillName, setSkillName] = useState(stage.skills[0].name);
  const touring = autoplay && inView && !hovering && !reduce;

  const activeRef = useRef(0);
  const select = useCallback((i: number, manual = false) => {
    setDirection(i >= activeRef.current ? 1 : -1);
    activeRef.current = i;
    setActive(i);
    setSkillName(skillFlow[i].skills[0].name);
    if (manual) setAutoplay(false);
  }, []);

  // Auto tour through the stages while the diagram is visible
  useEffect(() => {
    if (!touring) return;
    const t = setTimeout(() => select((active + 1) % skillFlow.length), TOUR_MS);
    return () => clearTimeout(t);
  }, [touring, active, select]);

  // Keep the active node visible inside the horizontally scrolling rail
  useEffect(() => {
    const rail = railRef.current;
    const node = rail?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!rail || !node) return;
    const target = node.offsetLeft - rail.clientWidth / 2 + node.clientWidth / 2;
    rail.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' });
  }, [active, reduce]);

  const onRailKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + skillFlow.length) % skillFlow.length;
    select(next, true);
    railRef.current?.querySelector<HTMLElement>(`[data-index="${next}"] button`)?.focus();
  };

  const openSource = (src: LineageSource) => {
    if (src.kind === 'project') openProject(src.id);
    else scrollTo('#experience');
  };

  const sources = lineage.get(skillName) ?? [];

  return (
    <Section
      id="skills"
      title="Skills in action, not in a list."
      accent={['action,']}
      intro="Every tool here has a job in the pipeline. Watch data move through the stack, or pick a stage to see how and where I use it."
    >
      <div
        ref={diagramRef}
        className={styles.diagram}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <div className={styles.toolbar}>
          <span className={styles.source}>
            <span className={styles.sourceDot} aria-hidden="true" />
            sources: claims · eligibility · smart meters · QC labs
          </span>
          <button
            type="button"
            id="skills-autoplay"
            className={styles.play}
            onClick={() => setAutoplay((a) => !a)}
            aria-pressed={autoplay}
          >
            {autoplay ? '❚❚ Pause tour' : '▶ Play tour'}
          </button>
        </div>

        {/* pipeline rail */}
        <ol ref={railRef} className={styles.rail} role="tablist" aria-label="Pipeline stages" onKeyDown={onRailKey}>
          {skillFlow.map((s, i) => {
            const state = i < active ? 'done' : i === active ? 'active' : 'idle';
            return (
              <li key={s.id} className={styles.step} data-index={i} role="presentation">
                <motion.button
                  type="button"
                  role="tab"
                  id={`flow-tab-${s.id}`}
                  aria-selected={i === active}
                  aria-controls="flow-panel"
                  tabIndex={i === active ? 0 : -1}
                  className={cn(styles.node, styles[state])}
                  onClick={() => select(i, true)}
                  initial={reduce ? false : { opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.bouncy, delay: i * 0.07 }}
                >
                  <span className={cn(styles.icon, styles[`icon_${s.id}`])} aria-hidden="true">
                    <StageArt id={s.id} />
                    {i === active && touring && (
                      <svg key={`ring-${active}`} className={styles.ring} viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="22" style={{ animationDuration: `${TOUR_MS}ms` }} />
                      </svg>
                    )}
                  </span>
                  <span className={styles.nodeLabel}>{s.label}</span>
                  <span className={styles.nodeCount}>{s.skills.length} tools</span>
                </motion.button>
                {i < skillFlow.length - 1 && (
                  <span className={cn(styles.pipe, i < active && styles.pipeLit)} aria-hidden="true">
                    {i < active && !reduce && (
                      <>
                        <i style={{ animationDelay: '0s' }} />
                        <i style={{ animationDelay: '0.6s' }} />
                      </>
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* languages run underneath every stage */}
        <div className={styles.band}>
          <span className={styles.bandLabel}>runs on</span>
          <ul className={styles.bandList}>
            {languages.map((l) => (
              <li key={l.name}>
                <button
                  type="button"
                  className={cn(styles.lang, skillName === l.name && styles.langOn)}
                  onClick={() => {
                    setSkillName(l.name);
                    setAutoplay(false);
                  }}
                >
                  {l.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* detail panel */}
        <div id="flow-panel" role="tabpanel" aria-labelledby={`flow-tab-${stage.id}`} className={styles.panel}>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={stage.id}
              custom={direction}
              className={styles.panelGrid}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: 40 * d }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: -40 * d }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease }}
            >
              <div className={styles.about}>
                <p className={styles.stageNo}>
                  stage {String(active + 1).padStart(2, '0')} / {String(skillFlow.length).padStart(2, '0')}
                </p>
                <h3 className={styles.stageTitle}>{stage.label}</h3>
                <p className={styles.how}>{stage.how}</p>
                <p className={styles.where}>
                  <span>where</span> {stage.where}
                </p>
                <motion.ul
                  className={styles.tools}
                  initial="hidden"
                  animate="shown"
                  variants={{ shown: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
                >
                  {stage.skills.map((sk) => {
                    const count = lineage.get(sk.name)?.length ?? 0;
                    return (
                      <motion.li key={sk.name} variants={{ hidden: { opacity: 0, y: 10, scale: 0.9 }, shown: { opacity: 1, y: 0, scale: 1 } }}>
                        <button
                          type="button"
                          className={cn(styles.tool, skillName === sk.name && styles.toolOn)}
                          onClick={() => {
                            setSkillName(sk.name);
                            setAutoplay(false);
                          }}
                          onPointerEnter={(e) => e.pointerType === 'mouse' && setSkillName(sk.name)}
                          aria-pressed={skillName === sk.name}
                        >
                          {skillName === sk.name && <motion.span layoutId="tool-on" className={styles.toolBg} transition={spring.snappy} />}
                          <span className={styles.toolName}>{sk.name}</span>
                          <span className={styles.dots} aria-label={`used in ${count} places`}>
                            {Array.from({ length: count }, (_, k) => (
                              <i key={k} />
                            ))}
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>
            </motion.div>
          </AnimatePresence>

          <aside className={styles.lineage} aria-live="polite">
            <p className={styles.lineageKicker}>lineage</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={skillName} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                <h4 className={styles.lineageTitle}>{skillName}</h4>
                {sources.length === 0 ? (
                  <p className={styles.empty}>Part of my everyday toolkit rather than tied to one role or project listed here.</p>
                ) : (
                  <ol className={styles.sources}>
                    {sources.map((src, k) => (
                      <motion.li key={src.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * k, ease }}>
                        <button type="button" className={styles.src} onClick={() => openSource(src)}>
                          <span className={cn(styles.kind, src.kind === 'project' && styles.kindProject)}>{src.kind}</span>
                          <span className={styles.srcLabel}>
                            {src.label}
                            <small>{src.sub}</small>
                          </span>
                          <span className={styles.go} aria-hidden="true">→</span>
                        </button>
                      </motion.li>
                    ))}
                  </ol>
                )}
                <p className={styles.lineageFoot}>
                  {sources.length} upstream source{sources.length === 1 ? '' : 's'}
                </p>
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </div>

      {/* How I work with people: the only place people stickers appear */}
      <div className={styles.practices}>
        <h3 className={styles.practicesTitle}>How I work with people around the pipeline</h3>
        <Reveal as="ul" className={styles.practiceList} stagger={stagger.base}>
          {practices.map((p) => (
            <RevealItem as="li" key={p.id} variant="scale" className={styles.practice}>
              <img src={practiceArt[p.id]} alt="" width="112" height="112" loading="lazy" decoding="async" className={styles.practiceArt} />
              <div>
                <h4>{p.title}</h4>
                <p>{p.body}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
        <ul className={styles.bandList}>
          {delivery.map((d) => (
            <li key={d} className={styles.deliveryItem}>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
