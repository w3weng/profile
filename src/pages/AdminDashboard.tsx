import { motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  FolderKanban,
  GraduationCap,
  Hammer,
  Mail,
  MessageSquareQuote,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { toast } from '../components/ui/Toaster'
import { useAdminSession } from '../hooks/admin/useAdminSession'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  deleteFromPortfolio,
  deleteRow,
  fetchTable,
  insertRow,
  updateRow,
  uploadToPortfolio,
} from '../lib/cms'
import { requireSupabase } from '../lib/supabase'
import type {
  CmsCertificate,
  CmsContactMessage,
  CmsCurrentlyWorking,
  CmsExperience,
  CmsProject,
  CmsResume,
  CmsSkill,
  CmsTestimonial,
} from '../types/cms'

type TabId =
  | 'projects'
  | 'skills'
  | 'experience'
  | 'certificates'
  | 'testimonials'
  | 'currently'
  | 'resume'
  | 'messages'

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'experience', label: 'Experience', icon: BriefcaseBusiness },
  { id: 'certificates', label: 'Certificates', icon: GraduationCap },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { id: 'currently', label: 'Currently Working', icon: Hammer },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'messages', label: 'Messages', icon: Mail },
]

const toCsv = (arr: string[]) => arr.join(', ')
const fromCsv = (v: string) =>
  v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export default function AdminDashboard() {
  useDocumentTitle('Admin Dashboard — Portfolio CMS')
  const { loading, authenticated, isAdmin } = useAdminSession()
  const [activeTab, setActiveTab] = useState<TabId>('projects')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<{ table: string; id: string; label: string } | null>(null)

  const [projects, setProjects] = useState<CmsProject[]>([])
  const [skills, setSkills] = useState<CmsSkill[]>([])
  const [experience, setExperience] = useState<CmsExperience[]>([])
  const [certificates, setCertificates] = useState<CmsCertificate[]>([])
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([])
  const [currently, setCurrently] = useState<CmsCurrentlyWorking | null>(null)
  const [resume, setResume] = useState<CmsResume | null>(null)
  const [messages, setMessages] = useState<CmsContactMessage[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [projectForm, setProjectForm] = useState({
    id: '',
    slug: '',
    title: '',
    description: '',
    long_description: '',
    category: '',
    categories: '',
    tags: '',
    tech: '',
    features: '',
    status: 'Completed',
    year: '2026',
    github_url: '',
    demo: '',
    live_url: '',
    featured: false,
    sort_order: 0,
    cover_image: '',
    screenshots: '',
  })
  const [projectCoverFile, setProjectCoverFile] = useState<File | null>(null)
  const [projectScreenshotFiles, setProjectScreenshotFiles] = useState<File[]>([])
  const [projectPreview, setProjectPreview] = useState('')
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([])
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [resumeTitle, setResumeTitle] = useState('Resume')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const loadAll = async () => {
    try {
      setLoadingData(true)
      const [p, s, e, c, t, cw, r, m] = await Promise.all([
        fetchTable<CmsProject>('projects'),
        fetchTable<CmsSkill>('skills'),
        fetchTable<CmsExperience>('experience'),
        fetchTable<CmsCertificate>('certificates'),
        fetchTable<CmsTestimonial>('testimonials'),
        fetchTable<CmsCurrentlyWorking>('currently_working', 'updated_at'),
        fetchTable<CmsResume>('resume', 'uploaded_at'),
        fetchTable<CmsContactMessage>('contact_messages', 'created_at'),
      ])
      setProjects(p)
      setSkills(s)
      setExperience(e)
      setCertificates(c)
      setTestimonials(t)
      setCurrently(cw[0] ?? null)
      setResume(r[0] ?? null)
      setMessages(m)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load admin data.')
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loading && (!authenticated || !isAdmin)) return <Navigate to="/admin/login" replace />

  const filteredProjects = projects.filter((p) =>
    `${p.title} ${p.description} ${(p.tags ?? []).join(' ')}`.toLowerCase().includes(search.toLowerCase()),
  )

  const saveProject = async () => {
    try {
      setSaving(true)
      const slug = projectForm.slug.trim() || projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      let coverImage = projectForm.cover_image
      if (projectCoverFile) {
        const ext = (projectCoverFile.name.split('.').pop() || 'png').toLowerCase()
        const path = `projects/${slug}/cover.${ext}`
        coverImage = await uploadToPortfolio(path, projectCoverFile)
      }

      const existingScreenshots = fromCsv(projectForm.screenshots)
      const uploadedScreenshots = await Promise.all(
        projectScreenshotFiles.map(async (file, idx) => {
          const ext = (file.name.split('.').pop() || 'png').toLowerCase()
          const path = `projects/${slug}/screenshots/${idx + 1}-${Date.now()}.${ext}`
          return uploadToPortfolio(path, file)
        }),
      )
      const screenshots = [...existingScreenshots, ...uploadedScreenshots]

      const payload = {
        slug,
        title: projectForm.title,
        description: projectForm.description,
        long_description: projectForm.long_description,
        category: projectForm.category || null,
        categories: fromCsv(projectForm.categories),
        tags: fromCsv(projectForm.tags),
        tech: fromCsv(projectForm.tech),
        features: fromCsv(projectForm.features),
        status: projectForm.status || 'Completed',
        year: projectForm.year || null,
        github_url: projectForm.github_url || null,
        github: projectForm.github_url || null,
        demo: projectForm.demo || null,
        live_url: projectForm.live_url || null,
        featured: projectForm.featured,
        sort_order: Number(projectForm.sort_order) || 0,
        cover_image: coverImage || null,
        thumbnail_url: coverImage || null,
        screenshots,
      }

      const saved = projectForm.id
        ? ((await updateRow<CmsProject>('projects', projectForm.id, payload)) as CmsProject)
        : ((await insertRow<CmsProject>('projects', payload)) as CmsProject)
      toast.success(projectForm.id ? 'Project updated.' : 'Project added.')
      setProjects((prev) => {
        if (projectForm.id) {
          return prev.map((p) => (p.id === projectForm.id ? { ...p, ...saved } : p))
        }
        return [saved, ...prev]
      })
      setProjectForm({
        id: '',
        slug: '',
        title: '',
        description: '',
        long_description: '',
        category: '',
        categories: '',
        tags: '',
        tech: '',
        features: '',
        status: 'Completed',
        year: '2026',
        github_url: '',
        demo: '',
        live_url: '',
        featured: false,
        sort_order: 0,
        cover_image: '',
        screenshots: '',
      })
      setProjectCoverFile(null)
      setProjectScreenshotFiles([])
      setProjectPreview('')
      setScreenshotPreviews([])
      setProjectModalOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save project.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteRow(deleting.table as any, deleting.id)
      toast.success('Deleted successfully.')
      setProjects((prev) => prev.filter((v) => v.id !== deleting.id))
      setSkills((prev) => prev.filter((v) => v.id !== deleting.id))
      setExperience((prev) => prev.filter((v) => v.id !== deleting.id))
      setCertificates((prev) => prev.filter((v) => v.id !== deleting.id))
      setTestimonials((prev) => prev.filter((v) => v.id !== deleting.id))
      setMessages((prev) => prev.filter((v) => v.id !== deleting.id))
      setCurrently((prev) => (prev?.id === deleting.id ? null : prev))
      setResume((prev) => (prev?.id === deleting.id ? null : prev))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed.')
    } finally {
      setDeleting(null)
    }
  }

  const saveResume = async () => {
    if (!resumeFile && !resume?.file_url) {
      toast.error('Upload a resume file first.')
      return
    }
    try {
      setSaving(true)
      let fileUrl = resume?.file_url ?? ''
      if (resumeFile) {
        const path = `resume/${Date.now()}-${resumeFile.name}`
        fileUrl = await uploadToPortfolio(path, resumeFile)
      }
      const saved = (await insertRow<CmsResume>('resume', {
        title: resumeTitle || 'Resume',
        file_url: fileUrl,
      })) as CmsResume
      toast.success('Resume updated.')
      setResumeFile(null)
      setResume(saved)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Resume upload failed.')
    } finally {
      setSaving(false)
    }
  }

  const deleteResume = async () => {
    if (!resume) return
    try {
      setSaving(true)
      await deleteRow('resume', resume.id)
      const storagePath = resume.file_url.split('/portfolio/')[1]
      if (storagePath) await deleteFromPortfolio(storagePath)
      toast.success('Resume removed.')
      setResume(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete resume.')
    } finally {
      setSaving(false)
    }
  }

  const signOut = async () => {
    try {
      const client = requireSupabase()
      await client.auth.signOut()
      toast.success('Signed out.')
    } catch {
      toast.error('Could not sign out.')
    }
  }

  return (
    <div className="container-pad py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass rounded-2xl p-4 lg:sticky lg:top-24 lg:h-fit">
          <p className="px-2 text-xs text-zinc-400">CMS Dashboard</p>
          <div className="mt-3 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                  activeTab === tab.id
                    ? 'bg-white/[0.08] text-zinc-50 border border-white/15'
                    : 'text-zinc-300 hover:bg-white/[0.04]'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
          <Button variant="ghost" className="mt-4 w-full justify-between" onClick={signOut}>
            Sign out <ChevronRight className="h-4 w-4" />
          </Button>
        </aside>

        <section className="glass rounded-2xl p-5 sm:p-7">
          {loadingData ? (
            <div className="space-y-3">
              <div className="h-6 w-48 rounded-full bg-white/[0.05]" />
              <div className="h-4 w-full rounded-full bg-white/[0.05]" />
              <div className="h-4 w-5/6 rounded-full bg-white/[0.05]" />
            </div>
          ) : null}

          {!loadingData && activeTab === 'projects' ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-zinc-50">Projects Manager</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search projects"
                      className="rounded-2xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-4 text-sm outline-none"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setProjectForm({
                        id: '',
                        slug: '',
                        title: '',
                        description: '',
                        long_description: '',
                        category: '',
                        categories: '',
                        tags: '',
                        tech: '',
                        features: '',
                        status: 'Completed',
                        year: '2026',
                        github_url: '',
                        demo: '',
                        live_url: '',
                        featured: false,
                        sort_order: 0,
                        cover_image: '',
                        screenshots: '',
                      })
                      setProjectCoverFile(null)
                      setProjectScreenshotFiles([])
                      setProjectPreview('')
                      setScreenshotPreviews([])
                      setProjectModalOpen(true)
                    }}
                  >
                    Add Project
                  </Button>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.04] text-zinc-300">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Tags</th>
                      <th className="px-4 py-3">Featured</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="border-t border-white/10">
                        <td className="px-4 py-3 text-zinc-100">{p.title}</td>
                        <td className="px-4 py-3 text-zinc-300">{(p.tags ?? []).slice(0, 2).join(', ')}</td>
                        <td className="px-4 py-3">{p.featured ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              className="px-3 py-1 text-xs"
                              onClick={() => {
                                setProjectForm({
                                  id: p.id,
                                  slug: p.slug ?? '',
                                  title: p.title,
                                  description: p.description,
                                  long_description: p.long_description,
                                  category: p.category ?? '',
                                  categories: toCsv(p.categories ?? []),
                                  tags: toCsv(p.tags ?? []),
                                  tech: toCsv(p.tech ?? []),
                                  features: toCsv(p.features ?? []),
                                  github_url: p.github_url ?? '',
                                  demo: p.demo ?? '',
                                  live_url: p.live_url ?? '',
                                  status: p.status ?? 'Completed',
                                  year: p.year ?? '2026',
                                  featured: p.featured,
                                  sort_order: p.sort_order,
                                  cover_image: p.cover_image ?? p.thumbnail_url ?? '',
                                  screenshots: toCsv(p.screenshots ?? []),
                                })
                                setProjectCoverFile(null)
                                setProjectScreenshotFiles([])
                                setScreenshotPreviews([])
                                setProjectPreview('')
                                setProjectModalOpen(true)
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              className="px-2 py-1 text-xs text-rose-300"
                              onClick={() => setDeleting({ table: 'projects', id: p.id, label: p.title })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {!loadingData && activeTab === 'skills' ? (
            <SimpleManager<CmsSkill>
              title="Skills Manager"
              rows={skills}
              fields={['category', 'name', 'level', 'sort_order']}
              onSerialize={(field, value) =>
                field === 'level' || field === 'sort_order' ? Number(value) || 0 : value
              }
              onSave={async (row) => {
                if (row.id) {
                  const saved = (await updateRow('skills', row.id, row)) as CmsSkill
                  setSkills((prev) => prev.map((v) => (v.id === row.id ? { ...v, ...saved } : v)))
                } else {
                  const created = (await insertRow('skills', row)) as CmsSkill
                  setSkills((prev) => [created, ...prev])
                }
              }}
              onDelete={(id, label) => setDeleting({ table: 'skills', id, label })}
            />
          ) : null}

          {!loadingData && activeTab === 'experience' ? (
            <SimpleManager<CmsExperience>
              title="Experience Manager"
              rows={experience}
              fields={['role', 'org', 'team', 'period', 'bullets', 'sort_order']}
              onSerialize={(field, value) =>
                field === 'bullets'
                  ? String(value)
                      .split(/\r?\n/)
                      .map((item) => item.trim())
                      .filter(Boolean)
                  : field === 'sort_order'
                    ? Number(value) || 0
                    : value
              }
              onInitial={(field, value) =>
                field === 'bullets' && Array.isArray(value)
                  ? (value as string[]).join('\n')
                  : Array.isArray(value)
                    ? toCsv(value)
                    : (value as any)
              }
              onSave={async (row) => {
                if (row.id) {
                  const saved = (await updateRow('experience', row.id, row)) as CmsExperience
                  setExperience((prev) => prev.map((v) => (v.id === row.id ? { ...v, ...saved } : v)))
                } else {
                  const created = (await insertRow('experience', row)) as CmsExperience
                  setExperience((prev) => [created, ...prev])
                }
              }}
              onDelete={(id, label) => setDeleting({ table: 'experience', id, label })}
            />
          ) : null}

          {!loadingData && activeTab === 'certificates' ? (
            <SimpleManager<CmsCertificate>
              title="Certificates Manager"
              rows={certificates}
              fields={['title', 'issuer', 'date', 'description', 'file_url', 'sort_order']}
              onSerialize={(field, value) =>
                field === 'sort_order' ? Number(value) || 0 : value
              }
              onSave={async (row) => {
                if (row.id) {
                  const saved = (await updateRow('certificates', row.id, row)) as CmsCertificate
                  setCertificates((prev) => prev.map((v) => (v.id === row.id ? { ...v, ...saved } : v)))
                } else {
                  const created = (await insertRow('certificates', row)) as CmsCertificate
                  setCertificates((prev) => [created, ...prev])
                }
              }}
              onDelete={(id, label) => setDeleting({ table: 'certificates', id, label })}
            />
          ) : null}

          {!loadingData && activeTab === 'testimonials' ? (
            <SimpleManager<CmsTestimonial>
              title="Testimonials Manager"
              rows={testimonials}
              fields={['name', 'role', 'org', 'quote', 'avatar_url', 'sort_order']}
              onSerialize={(field, value) =>
                field === 'sort_order' ? Number(value) || 0 : value
              }
              onSave={async (row) => {
                if (row.id) {
                  const saved = (await updateRow('testimonials', row.id, row)) as CmsTestimonial
                  setTestimonials((prev) => prev.map((v) => (v.id === row.id ? { ...v, ...saved } : v)))
                } else {
                  const created = (await insertRow('testimonials', row)) as CmsTestimonial
                  setTestimonials((prev) => [created, ...prev])
                }
              }}
              onDelete={(id, label) => setDeleting({ table: 'testimonials', id, label })}
            />
          ) : null}

          {!loadingData && activeTab === 'currently' ? (
            <div>
              <h2 className="text-xl font-semibold text-zinc-50">Currently Working Manager</h2>
              <p className="mt-1 text-sm text-zinc-300">Comma-separated items.</p>
              <textarea
                defaultValue={toCsv(currently?.items ?? [])}
                rows={6}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm outline-none"
                id="currently-input"
              />
              <Button
                className="mt-4"
                onClick={async () => {
                  const el = document.getElementById('currently-input') as HTMLTextAreaElement | null
                  const items = fromCsv(el?.value ?? '')
                  try {
                    const saved = currently?.id
                      ? ((await updateRow('currently_working', currently.id, { items })) as CmsCurrentlyWorking)
                      : ((await insertRow('currently_working', { items })) as CmsCurrentlyWorking)
                    toast.success('Updated currently working section.')
                    setCurrently(saved)
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : 'Save failed.')
                  }
                }}
              >
                Save
              </Button>
              {currently?.id ? (
                <Button
                  variant="ghost"
                  className="mt-2 text-rose-300"
                  onClick={() =>
                    setDeleting({
                      table: 'currently_working',
                      id: currently.id,
                      label: 'Currently Working section',
                    })
                  }
                >
                  Delete currently working entry
                </Button>
              ) : null}
            </div>
          ) : null}

          {!loadingData && activeTab === 'resume' ? (
            <div>
              <h2 className="text-xl font-semibold text-zinc-50">Resume Manager</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-xs text-zinc-300">Resume title</span>
                  <input
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label>
                  <span className="text-xs text-zinc-300">Upload PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-sm"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={saveResume} disabled={saving}>
                  <Upload className="h-4 w-4" /> {saving ? 'Uploading...' : 'Upload / Replace Resume'}
                </Button>
                {resume?.file_url ? (
                  <>
                    <a href={resume.file_url} target="_blank" rel="noreferrer">
                      <Button variant="secondary">Preview current resume</Button>
                    </a>
                    <Button variant="ghost" className="text-rose-300" onClick={deleteResume}>
                      Delete resume
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-zinc-400">Resume coming soon</p>
                )}
              </div>
            </div>
          ) : null}

          {!loadingData && activeTab === 'messages' ? (
            <div>
              <h2 className="text-xl font-semibold text-zinc-50">Contact Messages</h2>
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.04] text-zinc-300">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((m) => (
                      <tr key={m.id} className="border-t border-white/10 align-top">
                        <td className="px-4 py-3 text-zinc-100">{m.name}</td>
                        <td className="px-4 py-3 text-zinc-300">{m.email}</td>
                        <td className="max-w-[320px] whitespace-pre-wrap px-4 py-3 text-zinc-300">
                          {m.message}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">
                          {new Date(m.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            className="px-2 py-1 text-xs text-rose-300"
                            onClick={() =>
                              setDeleting({
                                table: 'contact_messages',
                                id: m.id,
                                label: `message from ${m.name}`,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <Modal
        open={projectModalOpen}
        title={projectForm.id ? 'Edit project' : 'Add project'}
        onClose={() => setProjectModalOpen(false)}
        className="max-w-3xl"
      >
        <div className="space-y-3">
          {([
            'slug',
            'title',
            'description',
            'long_description',
            'category',
            'categories',
            'tags',
            'tech',
            'features',
            'status',
            'year',
            'github_url',
            'demo',
            'live_url',
            'screenshots',
          ] as const).map((f) => (
            <input
              key={f}
              value={(projectForm as any)[f]}
              onChange={(e) => setProjectForm((v) => ({ ...v, [f]: e.target.value }))}
              placeholder={f.replaceAll('_', ' ')}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none"
            />
          ))}
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={projectForm.featured}
              onChange={(e) => setProjectForm((v) => ({ ...v, featured: e.target.checked }))}
            />
            Featured project
          </label>

          <label className="block text-xs text-zinc-300">
            Upload cover image
            <input
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] p-2"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setProjectCoverFile(file)
                setProjectPreview(file ? URL.createObjectURL(file) : '')
              }}
            />
          </label>
          {projectPreview || projectForm.cover_image ? (
            <img
              src={projectPreview || projectForm.cover_image}
              alt="preview"
              className="h-32 w-full rounded-xl object-cover"
            />
          ) : null}
          <label className="block text-xs text-zinc-300">
            Upload screenshots (multiple)
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] p-2"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? [])
                setProjectScreenshotFiles(files)
                setScreenshotPreviews(files.map((f) => URL.createObjectURL(f)))
              }}
            />
          </label>
          {screenshotPreviews.length ? (
            <div className="grid grid-cols-3 gap-2">
              {screenshotPreviews.map((url, idx) => (
                <div key={url} className="relative overflow-hidden rounded-lg border border-white/10">
                  <img src={url} alt={`shot-${idx}`} className="h-16 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setProjectScreenshotFiles((arr) => arr.filter((_, i) => i !== idx))
                      setScreenshotPreviews((arr) => arr.filter((_, i) => i !== idx))
                    }}
                    className="absolute right-1 top-1 rounded bg-black/60 px-1 text-[10px] text-white"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <Button onClick={saveProject} disabled={saving} className="w-full">
            <Upload className="h-4 w-4" /> {saving ? 'Saving...' : 'Save project'}
          </Button>
        </div>
      </Modal>

      <Modal
        open={!!deleting}
        title="Confirm deletion"
        onClose={() => setDeleting(null)}
        className="max-w-md"
      >
        <p className="text-sm text-zinc-300">
          Delete <span className="text-zinc-100">{deleting?.label}</span>? This cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} className="bg-rose-600/30">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

type SimpleManagerProps<T extends { id?: string }> = {
  title: string
  rows: T[]
  fields: (keyof T)[]
  onSave: (row: Partial<T>) => Promise<void>
  onDelete: (id: string, label: string) => void
  onSerialize?: (field: keyof T, value: string | number) => unknown
  onInitial?: (field: keyof T, value: unknown) => string | number
}

function SimpleManager<T extends { id?: string }>({
  title,
  rows,
  fields,
  onSave,
  onDelete,
  onSerialize,
  onInitial,
}: SimpleManagerProps<T>) {
  const [draft, setDraft] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const openCreate = () => {
    const next: Record<string, any> = {}
    for (const f of fields) next[String(f)] = ''
    setDraft(next)
    setEditingId(null)
    setOpen(true)
  }

  const openEdit = (row: T) => {
    const next: Record<string, any> = {}
    for (const f of fields) {
      const raw = row[f]
      next[String(f)] = onInitial ? onInitial(f, raw) : raw
    }
    setDraft(next)
    setEditingId(String(row.id))
    setOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-zinc-50">{title}</h2>
        <Button onClick={openCreate} className="px-3 py-2 text-xs">
          Add new
        </Button>
      </div>
      <div className="mt-5 grid gap-4">
        {rows.map((row) => (
          <motion.div key={(row.id as string) ?? Math.random()} className="rounded-2xl border border-white/10 p-4">
            <div className="grid gap-2 md:grid-cols-2">
              {fields.slice(0, 4).map((field) => (
                <p key={String(field)} className="text-xs text-zinc-300">
                  <span className="text-zinc-500">{String(field)}:</span>{' '}
                  {Array.isArray(row[field]) ? toCsv((row[field] as string[]) ?? []) : String(row[field] ?? '')}
                </p>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                className="px-3 py-1 text-xs"
                onClick={() => openEdit(row)}
              >
                Edit
              </Button>
              {row.id ? (
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-xs text-rose-300"
                  onClick={() => onDelete(String(row.id), String((row as any).title ?? (row as any).name ?? row.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        open={open}
        title={editingId ? 'Edit entry' : 'Add entry'}
        onClose={() => setOpen(false)}
        className="max-w-2xl"
      >
        <div className="space-y-3">
          {fields.map((field) => {
            const fieldName = String(field)
            const isCategory = fieldName === 'category' && title === 'Skills Manager'
            const isBullets = fieldName === 'bullets' && title === 'Experience Manager'
            const isQuote = fieldName === 'quote' && title === 'Testimonials Manager'
            return isCategory ? (
              <select
                key={`form-${fieldName}`}
                value={draft[fieldName] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, [fieldName]: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Tools">Tools</option>
              </select>
            ) : isBullets || isQuote ? (
              <textarea
                key={`form-${fieldName}`}
                value={draft[fieldName] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, [fieldName]: e.target.value }))}
                placeholder={isBullets ? 'Add one bullet per line' : 'Add one quote line per line'}
                rows={isBullets ? 5 : 4}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm resize-y"
              />
            ) : (
              <input
                key={`form-${fieldName}`}
                value={draft[fieldName] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, [fieldName]: e.target.value }))}
                placeholder={fieldName}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm"
              />
            )
          })}
          <Button
            className="w-full"
            onClick={async () => {
              try {
                setSaving(true)
                const payload: Record<string, any> = editingId ? { id: editingId } : {}
                for (const f of fields) {
                  const raw = draft[String(f)]
                  payload[String(f)] = onSerialize ? onSerialize(f, raw ?? '') : raw
                }
                await onSave(payload as Partial<T>)
                toast.success(editingId ? 'Saved.' : 'Added.')
                setOpen(false)
              } catch (e) {
                toast.error(e instanceof Error ? e.message : 'Save failed.')
              } finally {
                setSaving(false)
              }
            }}
            disabled={saving}
          >
            {saving ? 'Processing...' : editingId ? 'Save changes' : 'Create entry'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

