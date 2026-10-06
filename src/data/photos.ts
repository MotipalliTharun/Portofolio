/**
 * Photos from Unsplash (https://unsplash.com/license): free for commercial use,
 * no attribution required. Photographers are credited in CREDITS.md.
 * Stored as 1100px WebP in public/images and lazy-loaded.
 */
const src = (file: string) => `${import.meta.env.BASE_URL}images/${file}.webp`;

/** Industry banner for each role. */
export const rolePhotos: Record<string, { src: string; industry: string; focus: string }> = {
  cigna: { src: src('exp-cigna'), industry: 'Healthcare data', focus: 'center 78%' },
  jnj: { src: src('exp-jnj'), industry: 'Pharma manufacturing', focus: 'center 40%' },
  ngp: { src: src('exp-ngp'), industry: 'Energy monitoring', focus: 'center 45%' },
};

/** Cover photo for each project. */
export const projectPhotos: Record<string, string> = {
  'energy-anomaly': src('proj-energy'),
  'claims-lakehouse': src('proj-lakehouse'),
  'dq-framework': src('proj-dq'),
  'triage-assistant': src('proj-triage'),
};
