import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useUI } from '@/providers/UIProvider';
import styles from './CopyButton.module.css';

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Copies `value`, swaps its label to a tick, and announces the result in a toast. */
export function CopyButton({ value, label = 'Copy', what = 'Text' }: { value: string; label?: string; what?: string }) {
  const { toast } = useUI();
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const ok = await copyText(value);
    toast(ok ? `${what} copied to clipboard` : `Couldn't copy. Select ${value} instead.`);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button type="button" className={styles.btn} onClick={onClick} aria-label={`${label} ${what.toLowerCase()}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'done' : 'idle'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {copied ? '✓ Copied' : label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
