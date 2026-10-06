import type { ReactNode } from 'react';
import { stages, type StageId } from '@/data/resume';
import { SplitText } from '@/components/ui/SplitText';
import { cn } from '@/lib/cn';
import styles from './Section.module.css';

interface SectionProps {
  id: StageId;
  title: string;
  accent?: string[];
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Standard section shell: registers the pipeline stage, renders the stage label and heading. */
export function Section({ id, title, accent, intro, children, className }: SectionProps) {
  const stage = stages.find((s) => s.id === id)!;
  return (
    <section id={id} className={cn(styles.section, className)} aria-labelledby={`${id}-title`} tabIndex={-1}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.kicker}>
            <span className={styles.index}>{stage.index}</span>
            <span className={styles.rule} aria-hidden="true" />
            <span>{stage.stage}</span>
          </p>
          <SplitText text={title} id={`${id}-title`} className={styles.title} accent={accent} />
          {intro && <div className={styles.intro}>{intro}</div>}
        </header>
        {children}
      </div>
    </section>
  );
}
