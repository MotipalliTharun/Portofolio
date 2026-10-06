import { useState, type FormEvent } from 'react';
import { profile } from '@/data/resume';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { StatusPill } from '@/components/ui/StatusPill';
import { useNow } from '@/hooks/useNow';
import { useUI } from '@/providers/UIProvider';
import styles from './Contact.module.css';

export function Contact() {
  const { toast } = useUI();
  const now = useNow(30_000);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const time = now.toLocaleTimeString('en-US', { timeZone: profile.timezone, hour: 'numeric', minute: '2-digit' });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || message.trim().length < 10) {
      setError('Add your name and a message of at least 10 characters.');
      return;
    }
    setError('');
    const subject = encodeURIComponent(`Hello from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    toast('Opening your email app');
  };

  return (
    <Section
      id="contact"
      title="Let’s build something reliable."
      accent={['reliable.']}
      intro="I’m open to data engineering roles and happy to talk pipelines, lakehouses or data quality. The fastest way to reach me is email."
    >
      <div className={styles.grid}>
        <Reveal className={styles.channels} variant="slide">
          <StatusPill status="running" label={profile.availability} />

          <div className={styles.row}>
            <div>
              <span className={styles.label}>Email</span>
              <a className={styles.value} href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
            <CopyButton value={profile.email} what="Email" />
          </div>

          <div className={styles.row}>
            <div>
              <span className={styles.label}>LinkedIn</span>
              <a className={styles.value} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                {profile.linkedinLabel}
              </a>
            </div>
            <span className={styles.ext} aria-hidden="true">↗</span>
          </div>

          <div className={styles.row}>
            <div>
              <span className={styles.label}>Location</span>
              <span className={styles.value}>{profile.location}</span>
            </div>
            <span className={styles.time}>{time} PT</span>
          </div>

        </Reveal>

        <Reveal delay={0.15} variant="slide">
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <p className={styles.formHead}>Write a message</p>
            <label className={styles.field}>
              <span>Your name</span>
              <input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Jordan from Acme Data" />
            </label>
            <label className={styles.field}>
              <span>Message</span>
              <textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We’re hiring a data engineer for our lakehouse team…"
              />
            </label>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <div className={styles.submit}>
              <Button type="submit" variant="primary" magnetic icon="→">
                Send via email
              </Button>
              <span className={styles.hint}>Opens your email app with this message filled in.</span>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
