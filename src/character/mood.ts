import type { StageId } from '@/data/resume';
import type { BitMood } from './Bit';

export const moodForStage: Record<StageId, BitMood> = {
  hero: 'raw',
  about: 'clean',
  experience: 'curated',
  projects: 'curated',
  skills: 'curated',
  education: 'curated',
  contact: 'served',
};
