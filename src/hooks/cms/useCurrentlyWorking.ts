import { useCmsQuery } from '../useCmsQuery'
import { fallbackCurrentlyWorking } from '../../lib/cmsFallback'
import { requireSupabase, supabase } from '../../lib/supabase'
import type { CmsCurrentlyWorking } from '../../types/cms'

async function fetchCurrentlyWorking(): Promise<CmsCurrentlyWorking | null> {
  if (!supabase) return fallbackCurrentlyWorking()
  const client = requireSupabase()
  const { data, error } = await client
    .from('currently_working')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return (data ?? null) as CmsCurrentlyWorking | null
}

export function useCurrentlyWorking() {
  return useCmsQuery<CmsCurrentlyWorking | null>('currently_working', fetchCurrentlyWorking, {
    realtime: { table: 'currently_working' },
  })
}

