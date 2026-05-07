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
  return (data ?? []) as CmsProject[]
}

export function useProjects() {
  return useCmsQuery<CmsProject[]>('projects', fetchProjects, { realtime: { table: 'projects' } })
}

