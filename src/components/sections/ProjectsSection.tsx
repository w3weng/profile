import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, GitBranch, Layers3 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { SectionHeading } from '../ui/SectionHeading'
import { TiltCard } from '../ui/TiltCard'
import { cn } from '../../lib/cn'
import { useProjects } from '../../hooks/cms/useProjects'
import type { CmsProject } from '../../types/cms'

type Filter = string | 'All'

function TechBadges({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tech.map((t) => (
        <Badge key={t} className="text-[11px] text-zinc-200">
          {t}
        </Badge>
      ))}
    </div>
  )
}

export function ProjectsSection() {
  const { data, loading, error } = useProjects()
  const [filter, setFilter] = useState<Filter>('All')
  const [selected, setSelected] = useState<CmsProject | null>(null)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const [activeImage, setActiveImage] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const projects = data ?? []
  const tags = useMemo<(string | 'All')[]>(() => {
    const set = new Set<string>()
    for (const p of projects) {
      for (const t of p.tags ?? []) set.add(t)
      for (const c of p.categories ?? []) set.add(c)
    }
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [projects])

  const list = useMemo(() => {
    if (filter === 'All') return projects
    return projects.filter((p) => (p.tags ?? []).includes(filter) || (p.categories ?? []).includes(filter))
  }, [filter, projects])

  const selectedScreenshots = useMemo(() => {
    if (!selected) return []
    const shots = selected.screenshots ?? []
    if (shots.length) return shots
    return [selected.cover_image ?? selected.thumbnail_url ?? ''].filter(Boolean)
  }, [selected])

  useEffect(() => {
    setActiveImage(0)
  }, [selected?.id])

  const showPrev = () => {
    if (!selectedScreenshots.length) return
    setActiveImage((v) => (v - 1 + selectedScreenshots.length) % selectedScreenshots.length)
  }

  const showNext = () => {
    if (!selectedScreenshots.length) return
    setActiveImage((v) => (v + 1) % selectedScreenshots.length)
  }

  return (
    <section id="projects" className="container-pad py-16 sm:py-20">
      <SectionHeading
        eyebrow="Projects"
        title="Showcase work with real impact."
        description="Three projects that reflect what I love building: monitoring dashboards, admin tools, and systems that keep operations organized."
      />

      <div className="flex flex-wrap items-center gap-2">
        {tags.map((t) => {
          const active = filter === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={cn(
                'rounded-full border px-4 py-2 text-xs transition',
                active
                  ? 'border-white/20 bg-white/[0.06] text-zinc-50 shadow-glow'
                  : 'border-white/10 bg-white/[0.03] text-zinc-200 hover:border-white/20 hover:bg-white/[0.05]',
              )}
            >
              {t}
            </button>
          )
        })}
      </div>

      {error ? (
        <div className="mt-6 glass rounded-2xl p-5">
          <p className="text-sm text-zinc-200">Failed to load projects.</p>
          <p className="mt-1 text-xs text-zinc-400">{error}</p>
        </div>
      ) : null}

      <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {(loading ? Array.from({ length: 3 }) : list).map((p, i) => {
            if (loading) {
              const k = `skeleton-${i}`
              return (
                <motion.div
                  key={k}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="relative aspect-[16/10] bg-white/[0.03] overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-1/2 -translate-x-[60%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 w-1/2 rounded-full bg-white/[0.05]" />
                      <div className="h-4 w-full rounded-full bg-white/[0.05]" />
                      <div className="h-4 w-5/6 rounded-full bg-white/[0.05]" />
                    </div>
                  </div>
                </motion.div>
              )
            }

            const proj = p as CmsProject
            const cover = proj.cover_image ?? proj.thumbnail_url ?? ''
            return (
            <motion.div
              key={proj.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.28 }}
            >
              <TiltCard className="h-full">
                <button
                  type="button"
                  onClick={() => setSelected(proj)}
                  className="group h-full w-full text-left"
                >
                  <div className="glass glass-hover h-full rounded-2xl overflow-hidden">
                    {/* premium thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {cover ? (
                        <img
                          src={cover}
                          alt={`${proj.title} thumbnail`}
                          loading="lazy"
                          onLoad={() => setLoaded((v) => ({ ...v, [proj.id]: true }))}
                          className={cn(
                            'absolute inset-0 h-full w-full object-cover',
                            'transition duration-700',
                            loaded[proj.id] ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]',
                          )}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-br from-glow-cyan/15 via-glow-purple/10 to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(167,139,250,0.18),transparent_50%),radial-gradient(circle_at_50%_90%,rgba(232,121,249,0.12),transparent_45%)]" />
                      <div className="absolute inset-0 opacity-70 bg-grid-fade [background-size:44px_44px]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-base-900/80 via-base-900/20 to-transparent" />

                      {!loaded[proj.id] ? (
                        <div className="absolute inset-0">
                          <div className="absolute inset-0 bg-white/[0.03]" />
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute inset-y-0 left-0 w-1/2 -translate-x-[60%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                          </div>
                        </div>
                      ) : null}

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
                            <Layers3 className="h-4 w-4 text-glow-cyan" />
                          </div>
                          <p className="text-sm font-semibold text-zinc-50">{proj.title}</p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-200">
                          View
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-zinc-300">{proj.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(proj.tags ?? []).slice(0, 3).map((t) => (
                          <Badge key={t} className="text-[11px]">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-zinc-400">Click for details</span>
                        <span className="text-xs text-zinc-200 transition group-hover:text-zinc-50">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </TiltCard>
            </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <Modal
        open={!!selected}
        title={selected ? selected.title : 'Project'}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              {selectedScreenshots[activeImage] ? (
                <motion.img
                  key={`${selected.id}-${activeImage}`}
                  src={selectedScreenshots[activeImage]}
                  alt={`${selected.title} screenshot ${activeImage + 1}`}
                  loading="lazy"
                  initial={{ opacity: 0.3, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.24 }}
                  className="h-auto min-h-[280px] w-full object-cover"
                  onTouchStart={(e) => setTouchStartX(e.changedTouches[0]?.clientX ?? null)}
                  onTouchEnd={(e) => {
                    const endX = e.changedTouches[0]?.clientX ?? null
                    if (touchStartX === null || endX === null) return
                    const delta = endX - touchStartX
                    if (Math.abs(delta) > 40) {
                      if (delta > 0) showPrev()
                      else showNext()
                    }
                    setTouchStartX(null)
                  }}
                />
              ) : (
                <div className="grid min-h-[280px] place-items-center bg-white/[0.03]">
                  <p className="text-xs text-zinc-300">No screenshot available</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-base-900/70 via-transparent to-transparent" />
              {selectedScreenshots.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/35 p-2 text-zinc-100 hover:bg-black/55"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/35 p-2 text-zinc-100 hover:bg-black/55"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              ) : null}
            </div>
            {selectedScreenshots.length > 1 ? (
              <div className="flex gap-2 overflow-auto pb-1 scrollbar-premium">
                {selectedScreenshots.map((img, idx) => (
                  <button
                    type="button"
                    key={`${img}-${idx}`}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      'relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border',
                      idx === activeImage ? 'border-white/30' : 'border-white/10',
                    )}
                  >
                    <img src={img} alt={`thumb ${idx + 1}`} loading="lazy" className="h-full w-full object-cover" />
                    <span
                      className={cn(
                        'absolute inset-0 bg-black/20 transition',
                        idx === activeImage && 'bg-transparent',
                      )}
                    />
                  </button>
                ))}
              </div>
            ) : null}
            <p className="text-sm leading-relaxed text-zinc-300">{selected.long_description}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-2xl p-4">
                <p className="text-xs font-medium text-zinc-50">Tech stack</p>
                <div className="mt-3">
                  <TechBadges tech={selected.tech ?? []} />
                </div>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-xs font-medium text-zinc-50">Key features</p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  {(selected.features ?? []).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-glow-blue" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {(selected.github_url ?? selected.github) ? (
                <a href={selected.github_url ?? selected.github ?? '#'} target="_blank" rel="noreferrer">
                  <Button variant="secondary">
                    <GitBranch className="h-4 w-4" /> GitHub Repo
                  </Button>
                </a>
              ) : null}
              {(selected.live_url ?? selected.demo) ? (
                <a href={selected.live_url ?? selected.demo ?? '#'} target="_blank" rel="noreferrer">
                  <Button>
                    Live Demo <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}

