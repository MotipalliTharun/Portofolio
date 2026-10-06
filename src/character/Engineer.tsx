import type { ReactElement } from 'react';
import {
  faBroom,
  faBucket,
  faFolderOpen,
  faHelmetSafety,
  faLightbulb,
  faMugHot,
  faPaperPlane,
  faScroll,
  faToolbox,
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
        <rect x="110" y="127" width="12" height="49" rx="6" className={styles.pantsShade} />
        <rect x="74" y="122" width="43" height="13" rx="6.5" className={styles.pants} />
        <rect x="103" y="127" width="12.5" height="49" rx="6.25" className={styles.pants} />
        <Shoe x={108} />
        <Shoe x={101} />
      </g>
    );
  }
  return (
    <g>
      <rect x="72" y="122" width="12.5" height="54" rx="6.25" className={styles.pantsShade} />
      <rect x="86" y="122" width="12.5" height="54" rx="6.25" className={styles.pants} />
      <Shoe x={70} />
      <Shoe x={85} />
    </g>
  );
}

/** Flat sneaker with an orange sole. */
function Shoe({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 181 v-4.5 q0 -4.8 5.4 -4.8 h5.4 q8.6 0 9.6 7.6 v1.7 z`} className={styles.shoe} />
      <rect x={x} y="179.6" width="20.4" height="2.8" rx="1.4" className={styles.sole} />
    </g>
  );
}

function Face({ scene }: { scene: SceneId }) {
  return (
    <g>
      {/* dot eyes with a highlight; ^ ^ when happy */}
      <g className={cn(styles.rig, styles.eyesOpen)}>
        <g className={cn(styles.rig, styles.look)}>
          <ellipse cx="80.5" cy="53" rx="1.8" ry="2.4" className={styles.eye} />
          <ellipse cx="93" cy="53" rx="1.7" ry="2.4" className={styles.eye} />
          <circle cx="80" cy="52.1" r="0.65" className={styles.eyeShine} />
          <circle cx="92.5" cy="52.1" r="0.6" className={styles.eyeShine} />
        </g>
      </g>
      <g className={cn(styles.rig, styles.eyesClosed)}>
        <path d="M78.2 53.8 Q80.5 51 82.8 53.8" className={styles.eyeLine} />
        <path d="M90.7 53.8 Q93 51 95.3 53.8" className={styles.eyeLine} />
      </g>
      <path d="M77.6 48.4 Q80.4 46.8 83 47.8" className={cn(styles.rig, styles.brow, styles.browL)} />
      <path d="M90.4 47.6 Q93 46.6 95.8 48.2" className={cn(styles.rig, styles.brow, styles.browR)} />
      <path d="M88 55.4 Q89.8 58.6 87.4 59.4" className={styles.nose} />
      <ellipse cx="77.4" cy="59.6" rx="3" ry="1.8" className={styles.blush} />
      <ellipse cx="96.2" cy="59.6" rx="2.6" ry="1.7" className={styles.blush} />
      <Mouth scene={scene} />
    </g>
  );
}

function Mouth({ scene }: { scene: SceneId }) {
  switch (scene) {
    case 'serve':
    case 'cleanse':
      return (
        <g>
          <path d="M83.6 62 Q88 63.2 92.4 61.8 Q91.4 68 88 68 Q84.6 68 83.6 62 Z" className={styles.mouth} />
          <path d="M84.3 62.2 Q88 63.1 91.7 62 L91.4 63.6 Q88 64.3 84.6 63.8 Z" className={styles.teeth} />
          <path d="M85.8 66.6 Q88 65.2 90.2 66.6 Q88 67.8 85.8 66.6 Z" className={styles.tongue} />
        </g>
      );
    case 'build':
    case 'join':
      return <path d="M85 64.2 Q88 63 91 64.2" className={styles.mouthLine} />;
    case 'archive':
      return <ellipse cx="88" cy="64.2" rx="1.4" ry="1.7" className={styles.mouth} />;
    case 'code':
      return <path d="M85 63 Q88 65.6 91 62.8" className={styles.mouthLine} />;
    default:
      return (
        <g>
          <path d="M84.2 62.4 Q88 63.4 91.6 62.2 Q90.6 66.6 87.8 66.6 Q85 66.6 84.2 62.4 Z" className={styles.mouth} />
          <path d="M84.9 62.6 Q88 63.3 91 62.4 L90.8 63.6 Q88 64.2 85.2 63.8 Z" className={styles.teeth} />
        </g>
      );
  }
}

function Arm({ side, scene }: { side: 'L' | 'R'; scene: SceneId }) {
  const x = side === 'L' ? 68 : 100;
  const front = side === 'R';
  return (
    <g className={cn(styles.rig, front ? styles.armRU : styles.armLU)}>
      <rect x={x - 6} y="83" width="12" height="27" rx="6" className={front ? styles.top : styles.topShade} />
      <g className={cn(styles.rig, front ? styles.armRF : styles.armLF)}>
        <rect x={x - 5.5} y="103" width="11" height="21" rx="5.5" className={front ? styles.top : styles.topShade} />
        <rect x={x - 5.5} y="119.5" width="11" height="5" rx="2.5" className={styles.cuff} />
        {front && <Tool scene={scene} />}
        <circle cx={x} cy="128.6" r="4.8" className={front ? styles.skin : styles.skinShade} />
        <ellipse cx={x + 3.4} cy="126.6" rx="1.8" ry="2.5" className={front ? styles.skin : styles.skinShade} />
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

        {/* neck, then black long-sleeve top with a shaded side, crew neck and lanyard badge */}
        <rect x="79.8" y="64" width="9.4" height="20" rx="3.5" className={styles.skinShade} />
        <path d="M67 88 C67 83.6 71 81 77 81 H91 C97 81 101 83.6 101 88 L103.5 124 C104 129.5 100.5 133 95 133 H73 C67.5 133 64 129.5 64.5 124 Z" className={styles.top} />
        <path d="M67.4 85.6 C66.2 98 65 112 64.6 124 C64.6 129.5 67.6 133 73 133 H75.6 C73.4 117 73 101 74.2 83 C71 82.8 68.8 83.6 67.4 85.6 Z" className={styles.topShade} />
        <path d="M78 81 Q84.5 88.4 91 81" className={styles.collar} />
        <path d="M79.6 83.4 L84.4 99.4 L89.4 83.4" className={styles.lanyard} />
        <rect x="80.4" y="98.6" width="8" height="10.4" rx="1.6" className={styles.badge} />
        <rect x="82" y="101" width="4.8" height="2.6" rx="0.8" className={styles.badgeChip} />

        {/* head */}
        <g className={cn(styles.rig, styles.head)}>
          <path d="M66 50 C64 36 73 27 85 27 C98 27 106 36 105 50 C105 56 103 61 100 64 L99 50 L70 50 L69 63 C67 59 66 55 66 50 Z" className={styles.hairBack} />
          <ellipse cx="69.6" cy="55" rx="3.2" ry="4.2" className={styles.skin} />
          <ellipse cx="69.8" cy="55.2" rx="1.3" ry="2.3" className={styles.skinShade} />
          <path d="M70 46 C70 37 76.5 32 85 32 C94 32 100.5 37.5 100.5 47 C100.5 57 97.5 64.5 92.5 68.5 C89.6 70.8 86.6 71.6 84 71 C77.5 69.6 72.2 64 70.8 56 C70.3 53 70 49.5 70 46 Z" className={styles.skin} />
          <path d="M70 47 C74 44 80 42.5 86 42.6 C92 42.5 97 43.6 100.4 46 L100.5 43 C97 39.6 91 38.4 85 38.4 C78 38.4 73 40.4 70 44 Z" className={styles.faceShade} />
          <Face scene={scene} />
          {/* swept fringe, sideburn, soft shine */}
          <path d="M68 47 C66.6 35 75 27.6 86 27.4 C97.6 27.2 105 35 104.2 46.6 C101.6 42.6 98 40.6 94 40 C95 42.6 94.6 44.8 93.2 46.4 C91.4 42.6 87.6 40.2 82.6 39.8 C79.6 41.4 76.6 42 73 41.6 C71.8 43.4 70.4 45.4 68 47 Z" className={styles.hair} />
          <path d="M69.5 45.6 C68.6 50 68.6 54 69.8 57.8 C70.6 54 71 50 71.6 47 Z" className={styles.hair} />
          <path d="M78 31.6 C83 29.6 89 29.6 94.4 31.8 C90 31.4 85.6 31.6 81.4 33 Z" className={styles.hairShine} />
          {scene === 'join' && <path d="M104 38 q3 4.8 0 7.2 q-3 -2.4 0 -7.2 z" className={styles.sweat} />}
          {scene === 'build' && <FaProp icon={faHelmetSafety} x={63} y={8} size={42} className={styles.helmet} />}
          {scene === 'archive' && (
            <g>
              <rect x="74" y="29.5" width="22" height="8" rx="1.5" className={styles.cap} />
              <path d="M62 30 L85 22.5 L108 30 L85 37.5 Z" className={styles.cap} />
              <g className={cn(styles.rig, styles.tassel)}>
                <path d="M85 30 L104 33 V43" className={styles.tasselLine} />
                <circle cx="104" cy="45" r="2.3" className={styles.tasselEnd} />
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
