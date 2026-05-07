import { useCmsQuery } from '../useCmsQuery'
import { fallbackCertificates } from '../../lib/cmsFallback'
import { requireSupabase, supabase } from '../../lib/supabase'
import type { CmsCertificate } from '../../types/cms'

async function fetchCertificates(): Promise<CmsCertificate[]> {
  if (!supabase) return fallbackCertificates()
  const client = requireSupabase()
  const { data, error } = await client
    .from('certificates')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as CmsCertificate[]
}

export function useCertificates() {
  return useCmsQuery<CmsCertificate[]>('certificates', fetchCertificates, {
    realtime: { table: 'certificates' },
  })
}

