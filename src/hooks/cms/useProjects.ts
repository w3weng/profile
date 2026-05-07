import { useCmsQuery } from '../useCmsQuery'
import { fallbackProjects } from '../../lib/cmsFallback'
import { requireSupabase, supabase } from '../../lib/supabase'
import type { CmsProject } from '../../types/cms'

async function fetchProjects(): Promise<CmsProject[]> {
  if (!supabase) return fallbackProjects()
  const client = requireSupabase()
  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  const rows = (data ?? []) as CmsProject[]
  return rows.map((p) => ({
    ...p,
    cover_image: p.cover_image ?? p.thumbnail_url ?? null,
    screenshots: p.screenshots ?? (p.cover_image || p.thumbnail_url ? [p.cover_image ?? p.thumbnail_url ?? ''] : []),
    github: p.github ?? p.github_url ?? null,
    demo: p.demo ?? p.live_url ?? null,
  }))
}

export function useProjects() {
  return useCmsQuery<CmsProject[]>('projects', fetchProjects, { realtime: { table: 'projects' } })
}

