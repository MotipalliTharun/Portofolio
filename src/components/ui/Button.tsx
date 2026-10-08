import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import type { ReactNode, MouseEvent, PointerEvent } from 'react';
import { cn } from '@/lib/cn';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'quiet';
  size?: 'md' | 'lg';
  href?: string;
  external?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** Gently pulls toward the cursor on hover. */
  magnetic?: boolean;
  icon?: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

export function Button({
  children,
  variant = 'ghost',
  size = 'md',
  href,
  external,
  onClick,
  magnetic,
  icon,
  className,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!magnetic || reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const props = {
    className: cn(styles.btn, styles[variant], styles[size], className),
    style: magnetic ? { x, y } : undefined,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    onClick,
    'aria-label': ariaLabel,
    whileTap: reduce ? undefined : { scale: 0.97 },
  };

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <motion.a href={href} {...props} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button type={type} {...props}>
      {content}
    </motion.button>
  );
}
