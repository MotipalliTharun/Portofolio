import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { profile } from '@/data/resume';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { StatusPill } from '@/components/ui/StatusPill';
import { useNow } from '@/hooks/useNow';
import { useUI } from '@/providers/UIProvider';
import { usePdfAvailable } from '@/hooks/usePdfAvailable';
import { scenes } from '@/data/scenes';
import { SceneBanner } from '@/components/scene/SceneBanner';
import styles from './Contact.module.css';

export function Contact() {
  const { toast } = useUI();
  const now = useNow(30_000);
  const hasResume = usePdfAvailable(profile.resume);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  // validate live only after the first attempt, so nobody is told off mid-sentence
  const [tried, setTried] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const nameShake = useAnimationControls();
  const messageShake = useAnimationControls();
  const errors = validate(name, message);

  const time = now.toLocaleTimeString('en-US', { timeZone: profile.timezone, hour: 'numeric', minute: '2-digit' });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (errors.name || errors.message) {
      // a small "no" shake on each invalid field, then focus the first one
      if (errors.name) nameShake.start(shake);
      if (errors.message) messageShake.start(shake);
      (errors.name ? nameRef : messageRef).current?.focus();
      return;
    }
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
      <Reveal>
        <SceneBanner scene={scenes.workspace} eyebrow="Coffee’s on me" line="Pull up a chair. Tell me about your data." focus="50% 60%" focusMobile="40% 55%" />
      </Reveal>

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

          {hasResume && (
            <div className={styles.row}>
              <div>
                <span className={styles.label}>Résumé</span>
                <a className={styles.value} href={profile.resume} target="_blank" rel="noopener noreferrer">
                  Tharun_Motipalli_Resume.pdf
                </a>
              </div>
              <span className={styles.ext} aria-hidden="true">↓</span>
            </div>
          )}

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
            <Field
              id="contact-name"
              label="Your name"
              error={tried ? errors.name : undefined}
              controls={nameShake}
            >
              <input
                ref={nameRef}
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Jordan from Acme Data"
                aria-invalid={tried && !!errors.name}
                aria-describedby={tried && errors.name ? 'contact-name-error' : undefined}
              />
            </Field>
            <Field
              id="contact-message"
              label="Message"
              error={tried ? errors.message : undefined}
              hint={`${message.trim().length} / ${MIN_MESSAGE} characters minimum`}
              controls={messageShake}
            >
              <textarea
                ref={messageRef}
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We’re hiring a data engineer for our lakehouse team…"
                aria-invalid={tried && !!errors.message}
                aria-describedby={[tried && errors.message ? 'contact-message-error' : '', 'contact-message-hint'].filter(Boolean).join(' ')}
              />
            </Field>
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

const MIN_MESSAGE = 10;
const shake = { x: [0, -8, 7, -5, 3, 0], transition: { duration: 0.4 } };

function validate(name: string, message: string) {
  return {
    name: name.trim() ? undefined : 'Add your name so I know who to reply to.',
    message:
      message.trim().length >= MIN_MESSAGE
        ? undefined
        : message.trim()
          ? `A little more, please: at least ${MIN_MESSAGE} characters.`
          : 'Write a short message.',
  };
}

/** Label, control, then helper text and an inline error tied to the field. */
function Field({
  id,
  label,
  error,
  hint,
  controls,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  controls: ReturnType<typeof useAnimationControls>;
  children: ReactNode;
}) {
  return (
    <motion.div className={styles.field} animate={controls}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && (
        <span id={`${id}-hint`} className={styles.fieldHint}>
          {hint}
        </span>
      )}
      <AnimatePresence initial={false}>
        {error && (
          <motion.span
            key={error}
            id={`${id}-error`}
            className={styles.fieldError}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.13 } }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
