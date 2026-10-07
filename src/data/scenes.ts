// The illustrated scenes of Tharun. Each 2.5D scene is a background plate with the
// figure painted out plus the figure cut out on transparency (same size, 1376×768),
// layered by <DepthScene>.

const base = `${import.meta.env.BASE_URL}scenes/`;

export const scenes = {
  cafe: {
    bg: `${base}cafe-bg.webp`,
    fg: `${base}cafe-fg.webp`,
    alt: 'Illustrated Tharun sitting outside a café at golden hour, hands clasped, deep in thought, an iced coffee on the table beside him.',
  },
  /** the same desk by day, uncut, for the day-to-night time-lapse */
  day: {
    src: `${base}desk.webp`,
    alt: 'Illustrated Tharun at his desk in warm afternoon light, typing on a laptop.',
  },
  /** the opening frame of the hero video: the same desk at night */
  night: {
    src: `${import.meta.env.BASE_URL}frames/desktop/f000.webp`,
    alt: 'Illustrated Tharun at the same desk late at night, lit by his laptop screen.',
  },
  workspace: {
    bg: `${base}workspace.webp`,
    alt: 'A sunlit café desk with an open laptop, an iced coffee, earbuds and a notebook.',
  },
};
