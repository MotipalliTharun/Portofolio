import type { CSSProperties, ReactNode } from 'react';
import { stageById, type StageId } from '@/data/resume';
import { SplitText } from '@/components/ui/SplitText';
import { SceneFrame } from '@/components/ui/SceneFrame';
import { StageConnector } from './StageConnector';
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

/**
 * Standard section shell. Registers the pipeline stage, sets the section's hue,
 * draws the connector from the previous stage (which doubles as the stage label),
 * and pairs the heading with the engineer's scene for this stage.
 */
export function Section({ id, title, accent, intro, children, className }: SectionProps) {
  const stage = stageById(id);

  return (
    <section
      id={id}
      className={cn(styles.section, className)}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
      data-hue
      style={{ '--hue': stage.hue } as CSSProperties}
    >
      <StageConnector to={id} />
      <div className="container">
        <header className={styles.header}>
          <div className={styles.text}>
            <SplitText text={title} id={`${id}-title`} className={styles.title} accent={accent} />
            {intro && <div className={styles.intro}>{intro}</div>}
          </div>
          <SceneFrame stage={id} className={styles.scene} />
        </header>
        {children}
      </div>
    </section>
  );
}
