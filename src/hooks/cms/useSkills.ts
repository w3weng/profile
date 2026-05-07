import { useCmsQuery } from '../useCmsQuery'
import { fallbackSkills } from '../../lib/cmsFallback'
import { requireSupabase, supabase } from '../../lib/supabase'
import type { CmsSkill } from '../../types/cms'

async function fetchSkills(): Promise<CmsSkill[]> {
  if (!supabase) return fallbackSkills()
  const client = requireSupabase()
  const { data, error } = await client.from('skills').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as CmsSkill[]
}

export function useSkills() {
  return useCmsQuery<CmsSkill[]>('skills', fetchSkills, { realtime: { table: 'skills' } })
}

