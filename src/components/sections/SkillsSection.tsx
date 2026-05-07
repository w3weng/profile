import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { cn } from '../../lib/cn'
import { useMemo } from 'react'
import { useSkills } from '../../hooks/cms/useSkills'

type UiSkill = { name: string; level: number }
type UiCategory = { id: string; title: string; items: UiSkill[] }

export function SkillsSection() {
  const { data, loading, error } = useSkills()

  const categories = useMemo<UiCategory[]>(() => {
    const rows = data ?? []
    const by = new Map<string, UiSkill[]>()
    for (const r of rows) {
      const list = by.get(r.category) ?? []
      list.push({ name: r.name, level: r.level })
      by.set(r.category, list)
    }
    const order = ['Frontend', 'Backend', 'Tools']
    return order
      .filter((t) => by.has(t))
      .map((title) => ({
        id: title.toLowerCase(),
        title,
        items: by.get(title)!,
      }))
  }, [data])

  return (
    <section id="skills" className="container-pad py-16 sm:py-20">
      <SectionHeading
        eyebrow="Skills"
        title="A focused stack, built for real systems."
        description="Frontend polish with reliable backend logic. I prioritize clean UX, maintainable code, and practical tools that ship."
      />

      {error ? (
        <div className="mb-6 glass rounded-2xl p-5">
          <p className="text-sm text-zinc-200">Failed to load skills.</p>
          <p className="mt-1 text-xs text-zinc-400">{error}</p>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-3">
        {(loading ? Array.from({ length: 3 }) : categories).map((cat, idx) => {
          if (loading) {
            const k = `skeleton-${idx}`
            return (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded-full bg-white/[0.05]" />
                  <div className="h-3 w-16 rounded-full bg-white/[0.05]" />
                </div>
                <div className="mt-5 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-24 rounded-full bg-white/[0.05]" />
                        <div className="h-3 w-10 rounded-full bg-white/[0.05]" />
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                        <div className="h-2 w-2/3 bg-white/[0.06]" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          }

          const real = cat as UiCategory
          return (
          <motion.div
            key={real.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: idx * 0.05 }}
            className="glass glass-hover rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-50">{real.title}</p>
              <span className="text-xs text-zinc-400">{real.items.length} skills</span>
            </div>

            <div className="mt-5 space-y-4">
              {real.items.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-200">{s.name}</span>
                    <span className="text-zinc-400">{s.level}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/[0.05]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={cn(
                        'h-2 rounded-full',
                        'bg-gradient-to-r from-glow-cyan/80 via-glow-blue/70 to-glow-purple/70 shadow-[0_0_22px_rgba(96,165,250,0.14)]',
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          )
        })}
      </div>
    </section>
  )
}

