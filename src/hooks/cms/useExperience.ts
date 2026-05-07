import { useCmsQuery } from '../useCmsQuery'
import { fallbackExperience } from '../../lib/cmsFallback'
import { requireSupabase, supabase } from '../../lib/supabase'
import type { CmsExperience } from '../../types/cms'

async function fetchExperience(): Promise<CmsExperience[]> {
  if (!supabase) return fallbackExperience()
  const client = requireSupabase()
  const { data, error } = await client
    .from('experience')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as CmsExperience[]
}

export function useExperience() {
  return useCmsQuery<CmsExperience[]>('experience', fetchExperience, {
    realtime: { table: 'experience' },
  })
}

