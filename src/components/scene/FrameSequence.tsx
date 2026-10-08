import { useReducedMotion, type MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface FrameSequenceProps {
  /** folder holding f000.webp … */
  dir: string;
  count: number;
  /** 0..1 scroll progress that scrubs the sequence */
  progress: MotionValue<number>;
  /** the slice of progress that maps onto frame 0 → last */
  range: [number, number];
  /** before scrolling, ping-pong through frames 0..idleEnd so the scene is alive */
  idleEnd?: number;
  /** progress over which the idle loop hands over to scrubbing */
  handover?: number;
  /** last frame the scrub reaches (default: the last frame) */
  end?: number;
  /** once the scrub is done, ping-pong between these frames (e.g. a wave) */
  hold?: [number, number];
  /** show this one frame and ignore scroll (reduced motion) */
  still?: number;
  label: string;
  className?: string;
}

const FPS = 12;
const pad = (i: number) => String(i).padStart(3, '0');
const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Scroll-scrubbed video, Apple-style: frames from a video are preloaded as images
 * and drawn to a canvas, with scroll progress choosing the frame. The canvas is
 * sized by CSS (it fills its box) and redraws only when the frame changes.
 */
export function FrameSequence({ dir, count, progress, range, idleEnd = 0, handover = 0.1, end = count - 1, hold, still, label, className }: FrameSequenceProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    let alive = true;
    const frames: (HTMLImageElement | null)[] = new Array(count).fill(null);
    let drawn = -1;
    let dirty = true;

    // in order, a few at a time; a still needs only its one frame
    const order = still === undefined ? [...Array(count).keys()] : [still];
    let next = 0;
    let sized = false;
    const loadNext = () => {
      if (!alive || next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.src = `${dir}/f${pad(i)}.webp`;
      img
        .decode()
        .then(() => {
          if (!alive) return;
          frames[i] = img;
          if (!sized) {
            sized = true;
            resize(); // first frame in: now we know the source width
          }
          dirty = true;
        })
        .catch(() => {})
        .finally(loadNext);
    };
    for (let k = 0; k < 6; k++) loadNext();

    // canvas resolution follows its CSS box at device pixels (bounded at 2x the source),
    // so the browser's high-quality resampling does the upscale rather than CSS stretching
    const resize = () => {
      const src = frames.find(Boolean);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(c.clientWidth * dpr);
      const max = (src ? src.naturalWidth : 1920) * 2;
      const scale = Math.min(1, max / Math.max(1, w));
      c.width = Math.max(1, Math.round(w * scale));
      c.height = Math.max(1, Math.round(c.clientHeight * dpr * scale));
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    // nothing to draw while scrolled away
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);

    const nearest = (i: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    let raf = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const p = progress.get();
      const pingpong = (from: number, to: number) => {
        const span = to - from;
        const phase = ((t / 1000) * FPS) % (span * 2);
        return from + (phase < span ? phase : span * 2 - phase);
      };
      const scrub = smooth(range[0], range[1], p) * end;
      let f = still ?? scrub;
      if (still === undefined && idleEnd > 0 && !reduce) f = pingpong(0, idleEnd) + (scrub - pingpong(0, idleEnd)) * smooth(0, handover, p);
      if (still === undefined && hold && !reduce) f += (pingpong(hold[0], hold[1]) - f) * smooth(range[1], range[1] + 0.03, p);
      const i = nearest(Math.round(f));
      if (i < 0 || (i === drawn && !dirty)) return;
      ctx.drawImage(frames[i]!, 0, 0, c.width, c.height);
      drawn = i;
      dirty = false;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [dir, count, progress, range, idleEnd, handover, end, hold, still, reduce]);

  return <canvas ref={canvas} className={className} role="img" aria-label={label} />;
}
