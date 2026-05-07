import { requireSupabase } from './supabase'
import type {
  CmsCertificate,
  CmsCurrentlyWorking,
  CmsExperience,
  CmsProject,
  CmsResume,
  CmsSkill,
  CmsTestimonial,
} from '../types/cms'

type TableName =
  | 'projects'
  | 'skills'
  | 'experience'
  | 'certificates'
  | 'testimonials'
  | 'currently_working'
  | 'resume'
  | 'contact_messages'

export async function fetchTable<T>(table: TableName, orderBy = 'sort_order') {
  const client = requireSupabase()
  const q = client.from(table).select('*')
  let query
  if (table === 'currently_working') {
    query = q.order('updated_at', { ascending: false }).limit(1)
  } else if (table === 'resume') {
    query = q.order('uploaded_at', { ascending: false }).limit(1)
  } else if (table === 'contact_messages') {
    query = q.order('created_at', { ascending: false })
  } else {
    query = q.order(orderBy, { ascending: true }).order('created_at', { ascending: false })
  }
  const { data, error } = await withTimeout<any>(
    query,
    `Loading ${table} timed out.`,
  )
  if (error) throw error
  return (data ?? []) as T[]
}

export async function upsertRow<T extends { id?: string }>(table: TableName, payload: Partial<T>) {
  const client = requireSupabase()
  const { data, error } = await withTimeout<any>(
    client.from(table).upsert(payload as any).select('*').single(),
    `Saving ${table} timed out.`,
  )
  if (error) throw error
  return data
}

export async function insertRow<T>(table: TableName, payload: Partial<T>) {
  const client = requireSupabase()
  const { data, error } = await withTimeout<any>(
    client.from(table).insert(payload as any).select('*').single(),
    `Creating ${table} entry timed out.`,
  )
  if (error) throw error
  return data
}

export async function updateRow<T>(table: TableName, id: string, payload: Partial<T>) {
  const client = requireSupabase()
  const { data, error } = await withTimeout<any>(
    client.from(table).update(payload as any).eq('id', id).select('*').single(),
    `Updating ${table} entry timed out.`,
  )
  if (error) throw error
  return data
}

export async function deleteRow(table: TableName, id: string) {
  const client = requireSupabase()
  const { error } = await withTimeout<any>(
    client.from(table).delete().eq('id', id),
    `Deleting ${table} entry timed out.`,
  )
  if (error) throw error
}

export async function uploadToPortfolio(path: string, file: File) {
  const client = requireSupabase()
  const { error } = await withTimeout<any>(
    client.storage.from('portfolio').upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    }),
    'File upload timed out.',
  )
  if (error) throw error
  const { data } = client.storage.from('portfolio').getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFromPortfolio(path: string) {
  const client = requireSupabase()
  const { error } = await withTimeout<any>(
    client.storage.from('portfolio').remove([path]),
    'File delete timed out.',
  )
  if (error) throw error
}

export async function submitContactMessage(input: { name: string; email: string; message: string }) {
  const client = requireSupabase()
  const { error } = await withTimeout(
    client.from('contact_messages').insert(input),
    'Sending message timed out.',
  )
  if (error) throw error
}

export async function getIsAdmin() {
  const client = requireSupabase()
  const { data: auth } = await withTimeout<any>(client.auth.getUser(), 'Auth request timed out.')
  const user = auth.user
  if (!user) return false
  const { data, error } = await withTimeout<any>(
    client.from('profiles').select('is_admin').eq('id', user.id).maybeSingle(),
    'Admin check timed out.',
  )
  if (error) return false
  return !!data?.is_admin
}

async function withTimeout<T>(promiseLike: PromiseLike<T>, message: string, ms = 15000): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const timeout = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), ms)
  })
  try {
    return await Promise.race([Promise.resolve(promiseLike), timeout])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

export type CmsEntity =
  | CmsProject
  | CmsSkill
  | CmsExperience
  | CmsCertificate
  | CmsTestimonial
  | CmsCurrentlyWorking
  | CmsResume

