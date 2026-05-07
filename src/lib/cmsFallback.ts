import { CERTIFICATES } from '../data/certificates'
import { EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { SKILL_CATEGORIES } from '../data/skills'
import type {
  CmsCertificate,
  CmsExperience,
  CmsProject,
  CmsResume,
  CmsSkill,
  CmsTestimonial,
  CmsCurrentlyWorking,
} from '../types/cms'

export function fallbackProjects(): CmsProject[] {
  return PROJECTS.map((p, idx) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    long_description: p.longDescription,
    thumbnail_url: p.thumbnail ?? null,
    featured: idx === 0,
    categories: p.tags,
    tags: p.tags,
    tech: p.tech,
    features: p.features,
    github_url: p.githubUrl ?? null,
    live_url: p.liveUrl ?? null,
    sort_order: idx,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
}

export function fallbackSkills(): CmsSkill[] {
  const map: Record<string, 'Frontend' | 'Backend' | 'Tools'> = {
    Frontend: 'Frontend',
    Backend: 'Backend',
    Tools: 'Tools',
  }
  const items: CmsSkill[] = []
  let i = 0
  for (const cat of SKILL_CATEGORIES) {
    const category = map[cat.title] ?? 'Frontend'
    for (const s of cat.items) {
      items.push({
        id: `${cat.id}-${s.name}`.toLowerCase().replace(/\s+/g, '-'),
        category,
        name: s.name,
        level: s.level,
        sort_order: i++,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }
  return items
}

export function fallbackExperience(): CmsExperience[] {
  return EXPERIENCE.map((e, idx) => ({
    id: e.id,
    role: e.role,
    org: e.org,
    team: e.team,
    period: e.period,
    bullets: e.bullets,
    sort_order: idx,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
}

export function fallbackCertificates(): CmsCertificate[] {
  return CERTIFICATES.map((c, idx) => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    date: c.date,
    description: c.description,
    file_url: null,
    sort_order: idx,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
}

export function fallbackTestimonials(): CmsTestimonial[] {
  return []
}

export function fallbackCurrentlyWorking(): CmsCurrentlyWorking | null {
  return {
    id: 'default',
    items: ['Web systems', 'Dashboards', 'Management platforms', 'UI/UX improvements'],
    updated_at: new Date().toISOString(),
  }
}

export function fallbackResume(): CmsResume | null {
  return null
}

