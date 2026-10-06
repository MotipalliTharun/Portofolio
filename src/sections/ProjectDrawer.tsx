import { projects } from '@/data/resume';
import { Drawer } from '@/components/ui/Drawer';
import { FlowDiagram } from '@/components/ui/FlowDiagram';
import { ChipList } from '@/components/ui/Chip';
import { useUI } from '@/providers/UIProvider';
import { useCallback, useRef } from 'react';
import { projectArt } from '@/data/stickers';
import { projectPhotos } from '@/data/photos';
import styles from './ProjectDrawer.module.css';

/** Case-study drawer. Lazy-loaded the first time a project is opened. */
export default function ProjectDrawer() {
  const { openProjectId, openProject } = useUI();
  // Remember the last project so content stays visible during the close animation
  const last = useRef(projects[0]);
  const found = projects.find((p) => p.id === openProjectId);
  if (found) last.current = found;
  const project = last.current;
  const index = projects.indexOf(project);
  const close = useCallback(() => openProject(null), [openProject]);
  const next = projects[(index + 1) % projects.length];

  return (
    <Drawer open={!!found} onClose={close} labelledBy="case-title">
      {(
        <article key={project.id} className={styles.article}>
          <div className={styles.cover}>
            <img src={projectPhotos[project.id]} alt="" width="1100" height="619" className={styles.photo} />
            <img src={projectArt[project.id]} alt="" width="72" height="72" className={styles.art} />
          </div>
          <p className={styles.kind}>case study · {project.kind}</p>
          <h2 id="case-title" className={styles.title}>{project.title}</h2>
          <p className={styles.summary}>{project.summary}</p>

          <section className={styles.block}>
            <h3>Problem</h3>
            <p>{project.problem}</p>
          </section>

          <section className={styles.block}>
            <h3>Architecture</h3>
            <FlowDiagram steps={project.flow} variant="full" label={`${project.title} architecture`} />
          </section>

          <section className={styles.block}>
            <h3>How it works</h3>
            <ol className={styles.steps}>
              {project.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </section>

          <section className={styles.block}>
            <h3>Stack</h3>
            <ChipList items={project.stack} />
          </section>

          <button type="button" className={styles.next} onClick={() => openProject(next.id)}>
            <span className={styles.nextLabel}>Next project</span>
            <span className={styles.nextTitle}>{next.title} →</span>
          </button>
        </article>
      )}
    </Drawer>
  );
}
