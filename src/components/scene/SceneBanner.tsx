import { DepthScene } from './DepthScene';
import styles from './SceneBanner.module.css';

interface SceneBannerProps {
  scene: { bg: string; fg?: string; alt: string };
  eyebrow: string;
  line: string;
  focus?: string;
  focusMobile?: string;
}

/** A wide, rounded 2.5D scene with a caption on its shaded side. */
export function SceneBanner({ scene, eyebrow, line, focus, focusMobile }: SceneBannerProps) {
  return (
    <DepthScene className={styles.banner} bg={scene.bg} fg={scene.fg} alt={scene.alt} focus={focus} focusMobile={focusMobile} depth={14}>
      <div className={styles.caption}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <p className={styles.line}>{line}</p>
      </div>
    </DepthScene>
  );
}
