import type { CSSProperties, MouseEvent } from 'react';
import { experience, profile, stages } from '@/data/resume';
import { stickerCredit } from '@/data/stickers';
import { useScrollTo } from '@/providers/SmoothScroll';
import { useSlashTo } from '@/providers/SlashTransition';
import type { StageId } from '@/data/resume';
import { useNow } from '@/hooks/useNow';
import { usePdfAvailable } from '@/hooks/usePdfAvailable';
import styles from './Footer.module.css';

const current = experience.find((e) => !e.end)!;
const explore = stages.filter((s) => s.id !== 'hero');

/**
 * Site footer: a dark sign-off band with the brand, three link columns and a
 * legal bar. The Contact section above is the call to action, so the footer
 * stays quiet.
 */
export function Footer() {
  const scrollTo = useScrollTo();
  const slashTo = useSlashTo();
  const now = useNow(30_000);
  const hasResume = usePdfAvailable(profile.resume);
  const time = now.toLocaleTimeString('en-US', { timeZone: profile.timezone, hour: 'numeric', minute: '2-digit' });

  const go = (e: MouseEvent, id: StageId) => {
    e.preventDefault();
    slashTo(id);
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
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="#hero" className={styles.mark} onClick={(e) => go(e, 'hero')} aria-label={`${profile.name}, back to top`}>
              <span className={styles.monogram} aria-hidden="true">
                TM
              </span>
              <span>
                <span className={styles.name}>{profile.name}</span>
                <span className={styles.role}>{profile.title}</span>
              </span>
            </a>
            <p className={styles.tagline}>Building data pipelines that healthcare, pharma and energy teams can trust.</p>
            <p className={styles.status}>
              <span className={styles.dot} aria-hidden="true" />
              {profile.availability}
            </p>
          </div>

          <nav className={styles.col} aria-label="Footer">
            <h3>Explore</h3>
            <ul>
              {explore.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={(e) => go(e, s.id)}>
                    {s.nav}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h3>Connect</h3>
            <ul>
              <li>
                <a href={`mailto:${profile.email}`}>Email</a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </li>
              {hasResume && (
                <li>
                  <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                    Résumé <span aria-hidden="true">↓</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className={styles.col}>
            <h3>Now</h3>
            <dl className={styles.now}>
              <div>
                <dt>Role</dt>
                <dd>{current.company}</dd>
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
        </div>

        <div className={styles.bottom}>
          <p>
            © {now.getFullYear()} {profile.name}
          </p>
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
          <button type="button" className={styles.backTop} onClick={() => scrollTo('#hero')}>
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
