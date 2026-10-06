import { useId, type ReactElement } from 'react';
import {
  faBroom,
  faBucket,
  faCode,
  faCodeMerge,
  faEnvelope,
  faFolderOpen,
  faHeart,
  faHelmetSafety,
  faLightbulb,
  faMagnifyingGlass,
  faMugHot,
  faPaperPlane,
  faScroll,
  faSprayCanSparkles,
  faToolbox,
  faWrench,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import { FaProp } from './FaProp';
import type { SceneId } from '@/data/resume';
import { cn } from '@/lib/cn';
import styles from './Engineer.module.css';

/**
 * The engineer: a rigged SVG character (viewBox 0 0 240 200, ground at y=184).
 *
 * Parts are drawn in the root coordinate space with pivots at fixed points
 * (shoulders, elbows, neck). Each scene is a CSS class on the frame that poses
 * the rig and runs its keyframes; tools hang off the forearm so they move with
 * the hand. See Engineer.module.css for the choreography.
 */

interface SceneMeta {
  /** Horizontal offset of the character so it can reach the scene's props. */
  dx: number;
  seated: boolean;
  activity: string;
  alt: string;
}

export const sceneMeta: Record<SceneId, SceneMeta> = {
  code: { dx: 0, seated: true, activity: 'typing', alt: 'The engineer types at a laptop while a data packet pops out of the screen.' },
  cleanse: { dx: 0, seated: false, activity: 'scrubbing', alt: 'The engineer scrubs the noise off a raw data block until it shines.' },
  join: { dx: 18, seated: false, activity: 'connecting', alt: 'The engineer tightens a pipe junction where two data streams merge into one.' },
  build: { dx: 16, seated: false, activity: 'hammering', alt: 'The engineer hammers together a stack of API, ETL and DQ blocks.' },
  index: { dx: 28, seated: false, activity: 'filing', alt: 'The engineer files skill cards into a cabinet drawer.' },
  archive: { dx: 0, seated: true, activity: 'reading', alt: 'The engineer, wearing a graduation cap, reads a book.' },
  serve: { dx: 6, seated: false, activity: 'serving', alt: 'The engineer waves while serving a finished data packet on a tray.' },
};

/** Small Bit glyph for use inside scenes. */
export function Packet({ x, y, s = 14, tone = 'accent', className }: { x: number; y: number; s?: number; tone?: 'accent' | 'raw' | 'ok' | 'run'; className?: string }) {
  const e = s * 0.13;
  return (
    <g className={className}>
      <rect x={x} y={y} width={s} height={s} rx={s * 0.3} className={styles[`tone_${tone}`]} />
      <circle cx={x + s * 0.34} cy={y + s * 0.45} r={e} className={styles.packetEye} />
      <circle cx={x + s * 0.66} cy={y + s * 0.45} r={e} className={styles.packetEye} />
    </g>
  );
}

function Tool({ scene }: { scene: SceneId }) {
  switch (scene) {
    case 'cleanse':
      return <rect x="94" y="127" width="13" height="9" rx="2.5" className={styles.sponge} />;
    case 'join':
      return (
        <g>
          <line x1="100" y1="128" x2="100" y2="141" className={styles.metal} />
          <circle cx="100" cy="144.5" r="4" className={styles.metalRing} />
        </g>
      );
    case 'build':
      return (
        <g>
          <line x1="100" y1="126" x2="100" y2="147" className={styles.wood} />
          <rect x="92" y="144" width="16" height="7" rx="1.5" className={styles.hammerHead} />
        </g>
      );
    case 'index':
      return (
        <g className={styles.card}>
          <rect x="94" y="129" width="13" height="10" rx="1.5" className={styles.paper} />
          <line x1="96.5" y1="132.5" x2="104" y2="132.5" className={styles.paperLine} />
          <line x1="96.5" y1="135.5" x2="102" y2="135.5" className={styles.paperLine} />
        </g>
      );
    default:
      return null;
  }
}

function Legs({ seated }: { seated: boolean }) {
  if (seated) {
    return (
      <g>
        <rect x="58" y="130" width="42" height="7" rx="3.5" className={styles.propDark} />
        <line x1="66" y1="137" x2="61" y2="184" className={styles.stoolLeg} />
        <line x1="93" y1="137" x2="98" y2="184" className={styles.stoolLeg} />
        {/* far leg, then near leg */}
        <rect x="111" y="126" width="11" height="50" rx="5.5" className={styles.pantsShade} />
        <rect x="76" y="121" width="44" height="12" rx="6" className={styles.pantsShade} />
        <rect x="74" y="124" width="42" height="12.5" rx="6.25" className={styles.pants} />
        <rect x="104" y="128" width="12" height="48" rx="6" className={styles.pants} />
        <Shoe x={109} />
        <Shoe x={102} />
      </g>
    );
  }
  return (
    <g>
      <rect x="72" y="122" width="12" height="54" rx="6" className={styles.pantsShade} />
      <rect x="86" y="122" width="12" height="54" rx="6" className={styles.pants} />
      <Shoe x={70} />
      <Shoe x={85} />
    </g>
  );
}

function Shoe({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 181 v-4.5 q0 -4 4.5 -4 h6 q7 0 8 6.5 v2 z`} className={styles.shoe} />
      <path d={`M${x} 181 h18.5`} className={styles.sole} />
    </g>
  );
}

function Eyes() {
  const id = useId().replace(/:/g, '');
  const L = 'M73.5 53.2 Q76.5 49.4 81.5 49.6 Q84.6 50 85.4 52.6 Q84.6 57.2 79.6 57.6 Q75.4 57.4 73.5 53.2 Z';
  const R = 'M91.8 52.6 Q93.4 49.8 97.4 49.6 Q101.2 49.8 102.4 53 Q100.6 57.2 96.8 57.4 Q93 57.2 91.8 52.6 Z';
  return (
    <g>
      <defs>
        <clipPath id={`eyeL${id}`}>
          <path d={L} />
        </clipPath>
        <clipPath id={`eyeR${id}`}>
          <path d={R} />
        </clipPath>
      </defs>
      {/* open eyes: almond sclera, section-hued iris tucked under a heavy upper lid */}
      <g className={cn(styles.rig, styles.eyesOpen)}>
        <path d={L} className={styles.sclera} />
        <path d={R} className={styles.sclera} />
        <g className={cn(styles.rig, styles.look)}>
          <g clipPath={`url(#eyeL${id})`}>
            <ellipse cx="80" cy="54" rx="3.2" ry="4" className={styles.iris} />
            <ellipse cx="80" cy="55.6" rx="2.2" ry="1.8" className={styles.irisLight} />
            <ellipse cx="80" cy="53.8" rx="1.4" ry="2.1" className={styles.pupil} />
            <circle cx="78.8" cy="52.2" r="1.1" className={styles.shine} />
          </g>
          <g clipPath={`url(#eyeR${id})`}>
            <ellipse cx="97.4" cy="54" rx="2.8" ry="4" className={styles.iris} />
            <ellipse cx="97.4" cy="55.6" rx="1.9" ry="1.8" className={styles.irisLight} />
            <ellipse cx="97.4" cy="53.8" rx="1.25" ry="2.1" className={styles.pupil} />
            <circle cx="96.3" cy="52.2" r="1" className={styles.shine} />
          </g>
        </g>
        <path d="M70.6 52 L72.6 52.8 Q76.5 48.2 82 48.6 Q85.5 49 86.6 52.2" className={styles.lash} />
        <path d="M90.8 51.6 Q94 48.4 98 48.6 Q101.8 49 103 52.4 L104.8 53.6" className={styles.lash} />
        <path d="M76 57.7 Q79.5 58.5 83 57.3" className={styles.lowerLid} />
        <path d="M94 57.4 Q97 58.2 100 57" className={styles.lowerLid} />
      </g>
      {/* closed happy eyes ^ ^ (blink frames, and the serve scene) */}
      <g className={cn(styles.rig, styles.eyesClosed)}>
        <path d="M73.8 55 Q79 50.4 84.8 54.4" className={styles.lash} />
        <path d="M92 54.4 Q97 50.4 102.4 55" className={styles.lash} />
      </g>
      {/* thin angled brows */}
      <path d="M73.6 46.4 Q78.6 43.6 84.4 45" className={cn(styles.rig, styles.brow, styles.browL)} />
      <path d="M92.4 44.8 Q97.4 43.4 102.2 45.8" className={cn(styles.rig, styles.brow, styles.browR)} />
    </g>
  );
}

function Mouth({ scene }: { scene: SceneId }) {
  switch (scene) {
    case 'serve':
      return (
        <g>
          <path d="M84.2 64.6 Q88.6 65.6 93 64.6 Q92 71 88.6 71 Q85.2 71 84.2 64.6 Z" className={styles.mouthOpen} />
          <path d="M86.2 69.2 Q88.6 67.6 91 69.2 Q88.6 70.8 86.2 69.2 Z" className={styles.tongue} />
        </g>
      );
    case 'build':
      return <path d="M85.6 67 L91.6 66.2" className={styles.mouth} />;
    case 'join':
      return <path d="M85.6 67.4 Q88.6 65.9 91.6 67.4" className={styles.mouth} />;
    case 'archive':
      return <ellipse cx="88.6" cy="67" rx="1.5" ry="1.9" className={styles.mouthOpen} />;
    default:
      return <path d="M85 65.8 Q88.6 68.8 92.2 65.8" className={styles.mouth} />;
  }
}

function Arm({ side, scene }: { side: 'L' | 'R'; scene: SceneId }) {
  const x = side === 'L' ? 68 : 100;
  const front = side === 'R';
  return (
    <g className={cn(styles.rig, front ? styles.armRU : styles.armLU)}>
      <rect x={x - 5.5} y="83" width="11" height="26" rx="5.5" className={front ? styles.hoodie : styles.hoodieShade} />
      <g className={cn(styles.rig, front ? styles.armRF : styles.armLF)}>
        <rect x={x - 5} y="103" width="10" height="20" rx="5" className={front ? styles.hoodie : styles.hoodieShade} />
        <rect x={x - 5} y="119.5" width="10" height="5.5" rx="2.5" className={styles.cuff} />
        {front && <Tool scene={scene} />}
        <circle cx={x} cy="128.6" r="4.7" className={front ? styles.skin : styles.skinShade} />
        <ellipse cx={x + 3.6} cy="126.8" rx="1.9" ry="2.6" className={front ? styles.skin : styles.skinShade} />
      </g>
    </g>
  );
}

export function Engineer({ scene }: { scene: SceneId }) {
  const { seated } = sceneMeta[scene];
  return (
    <g>
      <ellipse cx={seated ? 92 : 86} cy="185" rx="30" ry="3.5" className={styles.shadow} />
      <Legs seated={seated} />
      <g className={cn(styles.rig, styles.upper)}>
        <Arm side="L" scene={scene} />

        {/* hoodie with cel shadow, pocket and drawstrings */}
        <path d="M66 86 C66 82 70 80 76 80 H92 C98 80 102 82 102 86 L104 124 C104 129 101 132 96 132 H72 C67 132 64 129 64 124 Z" className={styles.hoodie} />
        <path d="M67 84 C66 98 65 112 64.6 124 C64.6 129 67 132 72 132 H74.5 C72.5 116 72 100 73 82 Z" className={styles.hoodieCel} />
        <path d="M73 111 H95 L97 124 H71 Z" className={styles.pocket} />
        <path d="M80.5 86 L79.6 98" className={styles.string} />
        <path d="M88 86 L88.8 98" className={styles.string} />
        <circle cx="79.6" cy="99" r="1.2" className={styles.aglet} />
        <circle cx="88.8" cy="99" r="1.2" className={styles.aglet} />

        {/* hood collar + neck + headphones */}
        <path d="M68 84 Q84 72 100 84 Q94 89.5 84 89.5 Q74 89.5 68 84 Z" className={styles.hoodieShade} />
        <path d="M80 68 H88.5 V82 Q84.2 85 80 82 Z" className={styles.skinShade} />
        <path d="M70 80 Q84 93 98 80" className={styles.phones} />
        <rect x="64" y="74" width="7.5" height="10.5" rx="3.2" className={styles.phoneCup} />
        <rect x="96.5" y="74" width="7.5" height="10.5" rx="3.2" className={styles.phoneCup} />

        {/* head */}
        <g className={cn(styles.rig, styles.head)}>
          {/* back hair with spikes swept behind the head */}
          <path
            d="M66 52 C60 50 54 47 49 44.5 C55 43.4 59.6 42.2 62.6 40.2 C57.6 37 53.6 33.2 51.4 29.6 C57.6 30.8 62.6 31.8 66 32 C68.4 26 76 21 86 21 C100 21 109 31 108 46 C108 55 106 62 103 66 L99 52 L70 54 L68 64 C66.4 60 66 56 66 52 Z"
            className={styles.hairBack}
          />
          <ellipse cx="68.8" cy="55.5" rx="3.6" ry="4.6" className={styles.skin} />
          <path d="M67.6 55.6 q1.4 -2.4 2.4 0.4" className={styles.nose} />
          <path
            d="M68.5 45 C68.5 34 76.5 28.5 86.5 28.5 C97 28.5 104 35.5 104 45.5 C104 53 102.5 59 99 64.5 L91.5 72.5 C89.5 74.6 86.6 75 84.6 73.8 C78 70 71.5 63 69.5 55.5 C68.8 52 68.5 48.5 68.5 45 Z"
            className={styles.face}
          />
          {/* cel shadows: jagged hair shadow on the forehead, cheek shadow away from the light */}
          <path
            d="M69 43 L72 47.4 L74.6 44 L78 48.4 L81.6 44.6 L85 48.8 L88.6 44.6 L92.6 48.2 L95 44 L99 48.6 L101 44.2 L104 46.6 V42 C100 39 94 38 86 38 C78 38 72 40 69 43 Z"
            className={styles.faceCel}
          />
          <path d="M69.5 55.5 C71.5 63 78 70 84.6 73.8 C79.6 73 73.8 68.2 71.2 61.6 Z" className={styles.faceCel} />
          <ellipse cx="77.5" cy="62.2" rx="3.4" ry="1.4" className={styles.blush} />
          <ellipse cx="98" cy="62" rx="2.8" ry="1.3" className={styles.blush} />
          <Eyes />
          <path d="M91.6 57.8 L93.6 62.2 L91.2 62.8" className={styles.nose} />
          <Mouth scene={scene} />
          {/* swept bangs: sharp strands falling between the eyes */}
          <path
            d="M67.5 47 C66.5 34 75 25 87 24.5 C99.5 24 106.5 32.5 106 44.5 L102.4 39.5 L101.6 48 L97 40 L94 50.6 L90.6 40.6 L86.6 49.8 L83.4 41 L79 49 L76.6 41.8 L72.6 49.5 L71 44 Z"
            className={styles.hair}
          />
          <path d="M68 43 C65.5 51 66 60 69.2 67.5 C70.6 61 71.2 52 72 45 Z" className={styles.hair} />
          <path d="M74.6 31.4 L78.2 35 L80.8 30.8 L84.4 35 L87 30.2 L90.6 34.4 L93.2 30.6 L96.8 33.8" className={styles.hairShine} />
          <path d="M98.6 32.6 Q102.4 35.4 103.6 40" className={styles.hairShine} />
          {scene !== 'build' && (
            <g className={cn(styles.rig, styles.ahoge)}>
              <path d="M88 25.6 C86 18 90 12.6 96.6 14.4 C92.2 15.6 90.6 19.2 90.8 25.2 Z" className={styles.hair} />
            </g>
          )}
          {scene === 'join' && <path d="M106 37 q3.2 5 0 7.4 q-3.2 -2.4 0 -7.4 z" className={styles.sweat} />}
          {scene === 'build' && <FaProp icon={faHelmetSafety} x={67} y={7} size={40} className={styles.helmet} />}
          {scene === 'archive' && (
            <g>
              <rect x="74" y="27" width="24" height="8" rx="1.5" className={styles.cap} />
              <path d="M60 28 L86 19.5 L112 28 L86 36.5 Z" className={styles.cap} />
              <g className={cn(styles.rig, styles.tassel)}>
                <path d="M86 28 L106 31.5 V43" className={styles.tasselLine} />
                <circle cx="106" cy="44.8" r="2.4" className={styles.tasselEnd} />
              </g>
            </g>
          )}
        </g>

        <Arm side="R" scene={scene} />
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- props */

function CodeProps() {
  return (
    <g>
      {/* packet rises out from behind the screen */}
      <Packet x={157} y={72} s={14} tone="raw" className={styles.popPacket} />
      <rect x="138" y="64" width="52" height="43" rx="4" className={styles.propDark} />
      <rect x="142" y="68" width="44" height="33" rx="2" className={styles.screen} />
      {[
        [146, 30, 'accent'],
        [150, 22, 'run'],
        [150, 26, 'accent'],
        [146, 18, 'ok'],
        [150, 28, 'accent'],
      ].map(([x, w, tone], i) => (
        <rect key={i} x={x as number} y={72 + i * 5.5} width={w as number} height="2.6" rx="1.3" className={cn(styles.codeLine, styles[`tone_${tone}`])} style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
      <rect x="130" y="106" width="66" height="6" rx="2" className={styles.propDark} />
      {/* desk */}
      <rect x="110" y="112" width="122" height="7" rx="2" className={styles.desk} />
      <rect x="118" y="119" width="5" height="65" className={styles.deskLeg} />
      <rect x="219" y="119" width="5" height="65" className={styles.deskLeg} />
      <FaProp icon={faMugHot} x={202} y={91} size={22} className={styles.mugFa} />
      {/* wall poster + code glyph floating out of the laptop */}
      <rect x="186" y="16" width="40" height="34" rx="3" className={styles.poster} />
      <FaProp icon={faDatabase} x={198} y={22} size={22} className={styles.posterIcon} />
      <FaProp icon={faCode} x={134} y={46} size={18} className={styles.floatCode} />
    </g>
  );
}

function CleanseProps() {
  const specks = [
    [126, 132], [160, 130], [130, 168], [158, 170], [145, 176], [164, 152], [124, 152],
  ];
  return (
    <g>
      <rect x="116" y="122" width="58" height="62" rx="12" className={styles.rawBlock} />
      <circle cx="136" cy="148" r="5.5" className={styles.paper} />
      <circle cx="156" cy="148" r="5.5" className={styles.paper} />
      <circle cx="135" cy="149" r="2.4" className={styles.pupil} />
      <circle cx="155" cy="149" r="2.4" className={styles.pupil} />
      <path d="M139 162 Q146 167 153 162" className={styles.blockMouth} />
      {specks.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="4" rx="1" className={styles.speck} style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
      {[
        [182, 116, 1],
        [110, 112, 0.7],
        [184, 160, 0.8],
      ].map(([x, y, k], i) => (
        <path
          key={i}
          d={`M${x} ${y - 7 * k} L${x + 2 * k} ${y - 2 * k} L${x + 7 * k} ${y} L${x + 2 * k} ${y + 2 * k} L${x} ${y + 7 * k} L${x - 2 * k} ${y + 2 * k} L${x - 7 * k} ${y} L${x - 2 * k} ${y - 2 * k} Z`}
          className={styles.sparkle}
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
      <FaProp icon={faBroom} x={194} y={138} size={44} className={styles.broom} />
      <FaProp icon={faBucket} x={186} y={162} size={22} className={styles.bucket} />
      <FaProp icon={faSprayCanSparkles} x={44} y={169} size={15} className={styles.spray} />
      {/* suds */}
      {[
        [118, 128, 3],
        [124, 122, 2.2],
        [113, 136, 2],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} className={styles.bubble} style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
    </g>
  );
}

function JoinProps() {
  return (
    <g>
      <path d="M150 14 V118 H240" className={styles.pipeOuter} />
      <path d="M150 190 V118" className={styles.pipeOuter} />
      <path d="M150 14 V118 H240" className={styles.pipeInner} />
      <path d="M150 190 V118" className={styles.pipeInner} />
      {[0, 0.9].map((d) => (
        <rect key={`d${d}`} x="146" y="16" width="8" height="8" rx="2" className={cn(styles.pktDown, styles.tone_run)} style={{ animationDelay: `${d}s` }} />
      ))}
      {[0.45, 1.35].map((d) => (
        <rect key={`u${d}`} x="146" y="176" width="8" height="8" rx="2" className={cn(styles.pktUp, styles.tone_raw)} style={{ animationDelay: `${d}s` }} />
      ))}
      {[0.3, 0.75, 1.2, 1.65].map((d) => (
        <rect key={`r${d}`} x="156" y="114" width="8" height="8" rx="2" className={cn(styles.pktRight, styles.tone_accent)} style={{ animationDelay: `${d}s` }} />
      ))}
      <rect x="140" y="108" width="20" height="20" rx="4" className={styles.coupling} />
      {[
        [144, 112],
        [156, 112],
        [144, 124],
        [156, 124],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" className={styles.bolt} />
      ))}
      <FaProp icon={faToolbox} x={196} y={160} size={24} className={styles.toolbox} />
      <rect x="204" y="132" width="22" height="20" rx="3" className={styles.poster} />
      <FaProp icon={faCodeMerge} x={208.5} y={135} size={14} className={styles.posterIcon} />
      <text x="160" y="30" className={styles.label}>claims</text>
      <text x="160" y="176" className={styles.label}>members</text>
      <text x="196" y="106" className={styles.label}>joined</text>
    </g>
  );
}

function BuildProps() {
  return (
    <g>
      {/* anime smear arc that flashes on the downswing */}
      <path d="M146 34 Q172 54 168 104" className={styles.smear} />
      <path d="M153 36 Q177 58 173 98" className={cn(styles.smear, styles.smearThin)} />
      <g>
        <rect x="134" y="160" width="64" height="24" rx="4" className={styles.tone_accent} />
        <text x="166" y="175.5" className={styles.blockText}>API</text>
      </g>
      <g>
        <rect x="140" y="136" width="54" height="24" rx="4" className={styles.tone_run} />
        <text x="167" y="151.5" className={styles.blockText}>ETL</text>
      </g>
      <g className={styles.topBlock}>
        <rect x="146" y="112" width="44" height="24" rx="4" className={styles.tone_ok} />
        <text x="168" y="127.5" className={styles.blockText}>DQ</text>
      </g>
      <FaProp icon={faWrench} x={202} y={174} size={14} className={styles.wrenchFa} />
      <g className={styles.sparks}>
        {[-60, -20, 20, 60].map((a) => (
          <line key={a} x1="168" y1="104" x2="168" y2="96" transform={`rotate(${a} 168 110)`} className={styles.sparkLine} />
        ))}
      </g>
    </g>
  );
}

function IndexProps() {
  return (
    <g>
      <rect x="150" y="80" width="76" height="104" rx="6" className={styles.cabinet} />
      {[0, 2].map((i) => (
        <g key={i}>
          <rect x="156" y={88 + i * 31} width="64" height="26" rx="3" className={styles.drawer} />
          <rect x="180" y={99 + i * 31} width="16" height="4" rx="2" className={styles.propDark} />
        </g>
      ))}
      <g className={styles.drawerOpen}>
        <rect x="156" y="119" width="64" height="26" rx="3" className={styles.drawer} />
        <rect x="180" y="130" width="16" height="4" rx="2" className={styles.propDark} />
      </g>
      <FaProp icon={faFolderOpen} x={174} y={64} size={18} className={styles.folder} />
      <FaProp icon={faMagnifyingGlass} x={206} y={36} size={16} className={styles.magnifier} />
    </g>
  );
}

function ArchiveProps() {
  return (
    <g>
      {/* idea bulb */}
      <g className={styles.bulb}>
        <FaProp icon={faLightbulb} x={115} y={10} size={20} className={styles.bulbFa} />
        {[-55, 0, 55].map((a) => (
          <line key={a} x1="122" y1="5" x2="122" y2="1" transform={`rotate(${a} 122 20)`} className={styles.rayLine} />
        ))}
      </g>
      {/* book held in front */}
      <rect x="104" y="93" width="16" height="20" rx="1.5" className={styles.bookPage} />
      <rect x="120" y="93" width="16" height="20" rx="1.5" className={styles.bookPage} />
      {[98, 102, 106].map((y) => (
        <line key={y} x1="107" y1={y} x2="117" y2={y} className={styles.paperLine} />
      ))}
      <rect x="120" y="93" width="16" height="20" rx="1.5" className={cn(styles.bookPage, styles.page)} />
      <line x1="120" y1="93" x2="120" y2="113" className={styles.spine} />
      {/* stack of books */}
      <rect x="158" y="172" width="54" height="12" rx="2" className={styles.tone_accent} />
      <rect x="164" y="160" width="44" height="12" rx="2" className={styles.tone_run} />
      <rect x="156" y="148" width="48" height="12" rx="2" className={styles.tone_ok} />
      <text x="184" y="181" className={styles.blockText}>M.S.</text>
      <FaProp icon={faScroll} x={166} y={129} size={22} className={styles.scrollFa} />
    </g>
  );
}

function ServeProps() {
  return (
    <g>
      <g className={styles.speech}>
        <rect x="134" y="16" width="86" height="26" rx="9" className={styles.speechBox} />
        <path d="M150 42 L144 52 L160 42 Z" className={styles.speechBox} />
        <text x="177" y="33" className={styles.speechText}>let’s talk!</text>
      </g>
      {[
        [124, 62, 0.6],
        [220, 54, 0.5],
        [118, 30, 0.45],
      ].map(([x, y, k], i) => (
        <path
          key={i}
          d={`M${x} ${y - 7 * k} L${x + 2 * k} ${y - 2 * k} L${x + 7 * k} ${y} L${x + 2 * k} ${y + 2 * k} L${x} ${y + 7 * k} L${x - 2 * k} ${y + 2 * k} L${x - 7 * k} ${y} L${x - 2 * k} ${y - 2 * k} Z`}
          className={styles.sparkle}
          style={{ animationDelay: `${i * 0.5}s`, animationDuration: '2.4s' }}
        />
      ))}
      <FaProp icon={faPaperPlane} x={14} y={22} size={18} className={styles.plane} />
      <FaProp icon={faEnvelope} x={206} y={62} size={16} className={styles.envelope} />
      <FaProp icon={faHeart} x={222} y={14} size={10} className={styles.heart} />
      <rect x="122" y="99" width="40" height="4" rx="2" className={styles.propDark} />
      <g className={styles.served}>
        <Packet x={133} y={80} s={18} tone="ok" />
        <circle cx="152" cy="80" r="5" className={styles.tone_accent} />
        <path d="M149.6 80 l1.8 1.8 l3.2 -3.6" className={styles.check} />
      </g>
    </g>
  );
}

const PROPS: Record<SceneId, () => ReactElement> = {
  code: CodeProps,
  cleanse: CleanseProps,
  join: JoinProps,
  build: BuildProps,
  index: IndexProps,
  archive: ArchiveProps,
  serve: ServeProps,
};

/** Props drawn behind the character (cabinet, pipes) vs. in front (desk, book). */
const PROPS_IN_FRONT: SceneId[] = ['code', 'archive', 'serve'];

export function SceneArt({ scene, playing, entered }: { scene: SceneId; playing: boolean; entered: boolean }) {
  const meta = sceneMeta[scene];
  const Props = PROPS[scene];
  const front = PROPS_IN_FRONT.includes(scene);
  return (
    <svg
      viewBox="0 0 240 200"
      className={cn(styles.svg, styles[scene])}
      data-playing={playing || undefined}
      role="img"
      aria-label={meta.alt}
    >
      <line x1="0" y1="184.5" x2="240" y2="184.5" className={styles.ground} />
      {!front && <Props />}
      <g className={cn(styles.enter, entered && styles.entered)}>
        <g transform={`translate(${meta.dx} 0)`}>
          <Engineer scene={scene} />
        </g>
      </g>
      {front && <Props />}
    </svg>
  );
}
