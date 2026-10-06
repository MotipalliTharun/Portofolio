import { education, publication } from '@/data/resume';
import { Section } from '@/components/layout/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import styles from './Education.module.css';

export function Education() {
  return (
    <Section id="education" title="Education and research." accent={['research.']}>
      <Reveal className={styles.grid} stagger={0.12}>
        {education.map((e) => (
          <RevealItem key={e.degree} className={styles.degree}>
            <span className={styles.years}>{e.years}</span>
            <h3>{e.short}</h3>
            <p className={styles.school}>{e.school}</p>
            <p className={styles.loc}>{e.location}</p>
          </RevealItem>
        ))}
      </Reveal>

      <Reveal delay={0.1}>
        <SpotlightCard className={styles.pub}>
          <div className={styles.pubMeta}>
            <span className={styles.pubTag}>publication</span>
            <span>{publication.publisher} · {publication.year}</span>
          </div>
          <h3 className={styles.pubTitle}>{publication.title}</h3>
          <p className={styles.pubBy}>
            {publication.authors} In <em>{publication.venue}</em>.
          </p>
        </SpotlightCard>
      </Reveal>
    </Section>
  );
}
