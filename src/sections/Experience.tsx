import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { experience, type Experience as Role } from '@/data/resume';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { StatusPill } from '@/components/ui/StatusPill';
import { ChipList } from '@/components/ui/Chip';
import { formatDuration, formatMonth, monthsBetween } from '@/lib/duration';
import { cn } from '@/lib/cn';
import { rolePhotos } from '@/data/photos';
import styles from './Experience.module.css';

const PREVIEW = 3;

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <Section
      id="experience"
      title="Where I’ve shipped production systems."
      accent={['production']}
      intro="Three teams, three industries. The common thread is owning data from the source system to the dashboard or API that uses it."
    >
      <div className={styles.timeline}>
        <div className={styles.rail} aria-hidden="true">
          <motion.div className={styles.railFill} style={{ scaleY: line }} />
        </div>
        <ol ref={listRef} className={styles.list}>
          {experience.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </ol>
      </div>
    </Section>
  );
}

function RoleCard({ role }: { role: Role }) {
  const [expanded, setExpanded] = useState(false);
  const running = !role.end;
  const months = monthsBetween(role.start, role.end);
  const visible = expanded ? role.highlights : role.highlights.slice(0, PREVIEW);
  const hiddenCount = role.highlights.length - PREVIEW;

  return (
    <li className={styles.item}>
      <motion.span
        className={cn(styles.node, running && styles.nodeRun)}
        aria-hidden="true"
        initial={{ scale: 0 }}
        whileInView={{ scale: [0, 1.6, 1] }}
        viewport={{ once: true, margin: '0px 0px -20% 0px' }}
        transition={{ duration: 0.6, delay: 0.35 }}
      />
      <Reveal className={styles.card} variant="join">
        <div className={styles.when}>
          <span className={styles.dates}>
            {formatMonth(role.start)} – {formatMonth(role.end)}
          </span>
          <span className={styles.duration}>{formatDuration(months)}</span>
          <StatusPill status={running ? 'running' : 'success'} />
        </div>

        <div className={styles.body}>
          <div className={styles.banner}>
            <img
              src={rolePhotos[role.id].src}
              alt=""
              width="1100"
              height="619"
              loading="lazy"
              decoding="async"
              style={{ objectPosition: rolePhotos[role.id].focus }}
            />
            <span className={styles.industry}>{rolePhotos[role.id].industry}</span>
          </div>
          <header>
            <h3 className={styles.role}>{role.role}</h3>
            <p className={styles.company}>
              {role.company}
              {role.client && <span className={styles.client}> · Client: {role.client}</span>}
              <span className={styles.loc}>{role.location}</span>
            </p>
          </header>

          {role.project && (
            <p className={styles.project}>
              <span className={styles.projectTag}>project</span>
              <strong>{role.project.name}</strong>. {role.project.description}
            </p>
          )}

          <ul className={styles.highlights}>
            <AnimatePresence initial={false}>
              {visible.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className={styles.hlInner}>
                    {h.label && <strong>{h.label}. </strong>}
                    {h.text}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {hiddenCount > 0 && (
            <button type="button" className={styles.more} onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
              {expanded ? 'Show less' : `Show ${hiddenCount} more`}
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} aria-hidden="true">↓</motion.span>
            </button>
          )}

          <ChipList items={role.stack} />
        </div>
      </Reveal>
    </li>
  );
}
