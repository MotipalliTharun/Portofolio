// Turns the portfolio's resume data into the plain shape the tailoring agent works on.
import {
  delivery,
  education,
  experience,
  languages,
  profile,
  projects,
  publication,
  skillFlow,
} from '../../src/data/resume.ts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2025-07' → 'Jul 2025'; undefined → 'Present'. */
export function formatMonth(value?: string): string {
  if (!value) return 'Present';
  const [year, month] = value.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** Every skill named anywhere in the resume. The agent may only list skills from this set. */
function collectSkills(): string[] {
  const all = [
    ...experience.flatMap((e) => e.stack),
    ...projects.flatMap((p) => p.stack),
    ...skillFlow.flatMap((s) => s.skills.map((k) => k.name)),
    ...languages.map((l) => l.name),
    ...delivery,
  ];
  return [...new Set(all)];
}

export const baseResume = {
  name: profile.name,
  title: profile.title,
  location: profile.location,
  email: profile.email,
  linkedin: profile.linkedinLabel,
  linkedinUrl: profile.linkedin,
  summary: profile.summary.join(' '),
  experience: experience.map((e) => ({
    id: e.id,
    role: e.role,
    company: e.client ? `${e.company} (client: ${e.client})` : e.company,
    location: e.location,
    dates: `${formatMonth(e.start)} – ${formatMonth(e.end)}`,
    project: e.project ? `${e.project.name}: ${e.project.description}` : undefined,
    bullets: e.highlights.map((h) => (h.label ? `${h.label}: ${h.text}` : h.text)),
    stack: e.stack,
  })),
  projects: projects.map((p) => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    details: [p.problem, ...p.approach],
    stack: p.stack,
  })),
  skills: collectSkills(),
  education: education.map((e) => ({
    degree: e.degree,
    school: e.school,
    location: e.location,
    years: e.years,
  })),
  publication: `${publication.authors} "${publication.title}." ${publication.venue}, ${publication.publisher}, ${publication.year}.`,
};

export type BaseResume = typeof baseResume;
