import type { FlowStageId } from './resume';

/**
 * Flaticon stickers by kerismaker (https://www.flaticon.com/authors/kerismaker),
 * from the "School & University Activity" and "Web Development" packs.
 * Flaticon free license: attribution required (shown in the footer and CREDITS.md).
 *
 * Every sticker stands for something real in the content:
 *  - objects illustrate pipeline stages and projects
 *  - people illustrate how Tharun works with other people
 */
export const stickerCredit = {
  author: 'kerismaker',
  authorUrl: 'https://www.flaticon.com/authors/kerismaker',
  site: 'Flaticon',
  siteUrl: 'https://www.flaticon.com',
};

const src = (file: string) => `${import.meta.env.BASE_URL}stickers/${file}.png`;

/** Skills pipeline: the object that does each stage's job. Orchestrate has no fitting sticker. */
export const stageArt: Partial<Record<FlowStageId, string>> = {
  ingest: src('prop-folder'),
  process: src('prop-gears'),
  store: src('prop-database'),
  validate: src('prop-search'),
  serve: src('prop-server'),
  learn: src('prop-chip'),
  ship: src('prop-upload'),
};

/** Projects: what each project is about. */
export const projectArt: Record<string, string> = {
  'energy-anomaly': src('prop-chip'),
  'claims-lakehouse': src('prop-database'),
  'dq-framework': src('prop-search'),
  'triage-assistant': src('prop-bug'),
};

/** "How I work" practices: people stickers, because these are about working with people. */
export const practiceArt: Record<string, string> = {
  demos: src('statistic'),
  mentoring: src('course'),
  client: src('language'),
};
