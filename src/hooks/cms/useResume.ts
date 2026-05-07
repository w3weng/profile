import { useCmsQuery } from '../useCmsQuery'
import { fallbackResume } from '../../lib/cmsFallback'
import { requireSupabase, supabase } from '../../lib/supabase'
import type { CmsResume } from '../../types/cms'

async function fetchResume(): Promise<CmsResume | null> {
  if (!supabase) return fallbackResume()
  const client = requireSupabase()
  // Prefer single active resume if schema supports `is_active`.
  const activeQuery = await client
    .from('resume')
    .select('*')
    .eq('is_active', true)
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!activeQuery.error) return (activeQuery.data ?? null) as CmsResume | null

  // Backward compatibility: if `is_active` column does not exist (or PostgREST surfaces it as 400),
  // fallback to latest resume row.
  const errCode = activeQuery.error.code ?? ''
  const errMsg = `${activeQuery.error.message ?? ''} ${activeQuery.error.details ?? ''}`.toLowerCase()
  const isMissingIsActive =
    errCode === '42703' ||
    errCode.startsWith('PGRST') ||
    errMsg.includes('is_active') ||
    errMsg.includes('column') ||
    errMsg.includes('schema cache')

  if (isMissingIsActive) {
    const { data, error } = await client
      .from('resume')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) throw error
    return (data ?? null) as CmsResume | null
  }

  throw activeQuery.error
}

export function useResume() {
  return useCmsQuery<CmsResume | null>('resume', fetchResume, { realtime: { table: 'resume' } })
}

