import type { CSSProperties, MouseEvent } from 'react';
import { experience, profile, stages } from '@/data/resume';
import { useScrollTo } from '@/providers/SmoothScroll';
import { useUI } from '@/providers/UIProvider';
import { Kbd } from '@/components/ui/Kbd';
import { useNow } from '@/hooks/useNow';
import { stickerCredit } from '@/data/stickers';
import styles from './Footer.module.css';

const stack = ['React', 'TypeScript', 'Motion', 'Lenis', 'Vite'];
const current = experience.find((e) => !e.end)!;

export function Footer() {
  const scrollTo = useScrollTo();
  const { setPaletteOpen } = useUI();
  const now = useNow(30_000);
  const time = now.toLocaleTimeString('en-US', { timeZone: profile.timezone, hour: 'numeric', minute: '2-digit' });

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <footer className={styles.footer}>
      {/* one band per pipeline stage, in each section's hue */}
      <div className={styles.spectrum} aria-hidden="true">
        {stages.map((s) => (
          <span key={s.id} data-hue style={{ '--hue': s.hue } as CSSProperties} />
        ))}
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <nav aria-label="Footer" className={styles.col}>
            <h3>Pipeline</h3>
            <ul>
              {stages.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={(e) => go(e, s.id)} data-hue style={{ '--hue': s.hue } as CSSProperties}>
                    <span className={styles.idx}>{s.index}</span>
                    {s.nav}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h3>Elsewhere</h3>
            <ul>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`}>Email</a>
              </li>
              <li>
                <button type="button" className={styles.linkBtn} onClick={() => setPaletteOpen(true)}>
                  Command menu <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </button>
              </li>
            </ul>
          </div>

          <div className={styles.col}>
            <h3>Now</h3>
            <dl className={styles.now}>
              <div>
                <dt>Role</dt>
                <dd>
                  {current.role}, {current.company}
                </dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Local time</dt>
                <dd>{time} PT</dd>
              </div>
            </dl>
          </div>

          <div className={`${styles.col} ${styles.stackCol}`}>
            <h3>Built with</h3>
            <ul className={styles.chips}>
              {stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.legal}>
            <p>© {now.getFullYear()} {profile.name}. Built like a pipeline: idempotent, tested, on time.</p>
            <p className={styles.credit}>
              Icons by{' '}
              <a href="https://fontawesome.com" target="_blank" rel="noopener noreferrer">
                Font Awesome
              </a>{' '}
              (CC BY 4.0) · Stickers by{' '}
              <a href={stickerCredit.authorUrl} target="_blank" rel="noopener noreferrer">
                {stickerCredit.author}
              </a>{' '}
              from{' '}
              <a href={stickerCredit.siteUrl} target="_blank" rel="noopener noreferrer">
                {stickerCredit.site}
              </a>
            </p>
          </div>
          <button type="button" className={styles.top} onClick={() => scrollTo('#hero')} aria-label="Back to top">
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>

      <p className={styles.giant} aria-hidden="true">
        tharun<span>.</span>motipalli
      </p>
    </footer>
  );
}
