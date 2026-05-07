export type CmsProject = {
  id: string
  title: string
  description: string
  long_description: string
  thumbnail_url: string | null
  featured: boolean
  categories: string[]
  tags: string[]
  tech: string[]
  features: string[]
  github_url: string | null
  live_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type CmsSkill = {
  id: string
  category: 'Frontend' | 'Backend' | 'Tools'
  name: string
  level: number
  sort_order: number
  created_at: string
  updated_at: string
}

export type CmsExperience = {
  id: string
  role: string
  org: string
  team: string
  period: string
  bullets: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export type CmsCertificate = {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  file_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type CmsTestimonial = {
  id: string
  name: string
  role: string
  org: string
  quote: string
  avatar_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type CmsCurrentlyWorking = {
  id: string
  items: string[]
  updated_at: string
}

export type CmsResume = {
  id: string
  title: string
  file_url: string
  uploaded_at: string
}

