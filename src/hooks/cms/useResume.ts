import { useCmsQuery } from '../useCmsQuery'
import { fallbackResume } from '../../lib/cmsFallback'
import { requireSupabase, supabase } from '../../lib/supabase'
import type { CmsResume } from '../../types/cms'

async function fetchResume(): Promise<CmsResume | null> {
  if (!supabase) return fallbackResume()
  const client = requireSupabase()
  const { data, error } = await client
    .from('resume')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return (data ?? null) as CmsResume | null
}

export function useResume() {
  return useCmsQuery<CmsResume | null>('resume', fetchResume, { realtime: { table: 'resume' } })
}

