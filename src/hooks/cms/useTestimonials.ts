import { useCmsQuery } from '../useCmsQuery'
import { fallbackTestimonials } from '../../lib/cmsFallback'
import { requireSupabase, supabase } from '../../lib/supabase'
import type { CmsTestimonial } from '../../types/cms'

async function fetchTestimonials(): Promise<CmsTestimonial[]> {
  if (!supabase) return fallbackTestimonials()
  const client = requireSupabase()
  const { data, error } = await client
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as CmsTestimonial[]
}

export function useTestimonials() {
  return useCmsQuery<CmsTestimonial[]>('testimonials', fetchTestimonials, {
    realtime: { table: 'testimonials' },
  })
}

