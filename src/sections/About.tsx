import { profile } from '@/data/resume';
import { Section } from '@/components/layout/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { ScrambleText } from '@/components/ui/ScrambleText';
import { scenes } from '@/data/scenes';
import { SceneBanner } from '@/components/scene/SceneBanner';
import { stagger } from '@/lib/motion';
import styles from './About.module.css';

const fn = ['own()', 'validate()', 'ship()'];

export function About() {
  return (
    <Section id="about" title="Ownership from requirements to daily operations." accent={['operations.']}>
      <Reveal>
        <SceneBanner
          scene={scenes.cafe}
          eyebrow="Off the clock"
          line="Usually at a café, thinking about why a pipeline did what it did."
          focus="60% 30%"
          focusMobile="66% 25%"
        />
      </Reveal>

      <div className={styles.grid}>
        <div className={styles.summary}>
          <ScrambleText text={profile.summary[0]} className={styles.lead} />
          <Reveal delay={0.4}>
            <p>{profile.summary[1]}</p>
          </Reveal>
        </div>

        <Reveal className={styles.glance} stagger={stagger.tight}>
          <p className={styles.glanceTitle}>At a glance</p>
          <dl className={styles.facts}>
            {profile.glance.map((f) => (
              <RevealItem key={f.label} className={styles.fact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </RevealItem>
            ))}
          </dl>
        </Reveal>
      </div>

      <Reveal className={styles.principles} stagger={stagger.base}>
        {profile.principles.map((p, i) => (
          <RevealItem key={p.title} variant="scale">
            <SpotlightCard className={styles.principle}>
              <code className={styles.fn}>{fn[i]}</code>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </SpotlightCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
