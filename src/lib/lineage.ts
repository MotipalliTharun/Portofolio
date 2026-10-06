import { experience, projects, type Skill } from '@/data/resume';

export interface LineageSource {
  kind: 'role' | 'project';
  id: string;
  label: string;
  sub: string;
}

/** Every role and project whose stack uses this skill. */
export function traceSkill(skill: Skill): LineageSource[] {
  const keys = (skill.match ?? [skill.name]).map((k) => k.toLowerCase());
  const uses = (stack: string[]) => stack.some((s) => keys.includes(s.toLowerCase()));
  return [
    ...experience
      .filter((e) => uses(e.stack))
      .map((e) => ({ kind: 'role' as const, id: e.id, label: e.company, sub: e.role })),
    ...projects
      .filter((p) => uses(p.stack))
      .map((p) => ({ kind: 'project' as const, id: p.id, label: p.title, sub: p.kind })),
  ];
}
