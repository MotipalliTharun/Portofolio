import { profile } from '@/data/resume';
import { Section } from '@/components/layout/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { ScrambleText } from '@/components/ui/ScrambleText';
import styles from './About.module.css';

const fn = ['own()', 'validate()', 'ship()'];

export function About() {
  return (
    <Section id="about" title="Ownership from requirements to daily operations." accent={['operations.']}>
      <div className={styles.grid}>
        <div className={styles.summary}>
          <ScrambleText text={profile.summary[0]} className={styles.lead} />
          <Reveal delay={0.4}>
            <p>{profile.summary[1]}</p>
          </Reveal>
        </div>

        <Reveal as="ul" className={styles.stats} stagger={0.1}>
          {profile.stats.map((s) => (
            <RevealItem as="li" key={s.label} className={styles.stat}>
              <span className={styles.value}>
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statDetail}>{s.detail}</span>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      <Reveal className={styles.principles} stagger={0.12}>
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
