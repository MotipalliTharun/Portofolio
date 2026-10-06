import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import styles from './Engineer.module.css';

/**
 * Places a Font Awesome Free icon inside an SVG scene as an inked prop.
 * Icons: Font Awesome Free by Fonticons, Inc. (https://fontawesome.com), CC BY 4.0.
 *
 * The outer <g> takes className so CSS animations don't fight the positioning
 * transform on the inner <g>.
 */
export function FaProp({ icon, x, y, size, className }: { icon: IconDefinition; x: number; y: number; size: number; className?: string }) {
  const [w, h, , , d] = icon.icon;
  const s = size / Math.max(w, h);
  const paths = Array.isArray(d) ? d : [d];
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y}) scale(${s})`} className={styles.fa}>
        {paths.map((p, i) => (
          <path key={i} d={p} />
        ))}
      </g>
    </g>
  );
}
