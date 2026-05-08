import { motion } from 'framer-motion'
import { BriefcaseBusiness } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { useExperience } from '../../hooks/cms/useExperience'
import type { CmsExperience } from '../../types/cms'

export function ExperienceSection() {
  const { data, loading, error } = useExperience()
  const rows: CmsExperience[] = data ?? []

  return (
    <section id="experience" className="container-pad py-16 sm:py-20">
      <SectionHeading
        eyebrow="Experience"
        title="Hands-on internship experience."
        description="A focused internship where I supported web systems, office digitization, and real workflows inside a government environment."
      />

      {error ? (
        <div className="mb-6 glass rounded-2xl p-5">
          <p className="text-sm text-zinc-200">Failed to load experience.</p>
          <p className="mt-1 text-xs text-zinc-400">{error}</p>
        </div>
      ) : null}

      <div className="relative">
        <div className="absolute left-4 top-0 hidden h-full w-px bg-white/10 sm:block" />
        <div className="space-y-4">
          {(loading ? Array.from({ length: 1 }) : rows).map((e, idx) => {
            if (loading) {
              return (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45 }}
                  className="glass rounded-2xl p-6 sm:pl-10"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <div className="h-7 w-28 rounded-full bg-white/[0.05]" />
                    <div className="h-4 w-24 rounded-full bg-white/[0.05]" />
                    <div className="h-4 w-36 rounded-full bg-white/[0.05]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded-full bg-white/[0.05]" />
                    <div className="h-4 w-5/6 rounded-full bg-white/[0.05]" />
                    <div className="h-4 w-2/3 rounded-full bg-white/[0.05]" />
                  </div>
                </motion.div>
              )
            }

            const row = e as CmsExperience
            return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="glass glass-hover rounded-2xl p-6 sm:pl-10"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-200">
                  <BriefcaseBusiness className="h-4 w-4 text-glow-cyan" />
                  {row.period}
                </span>
                <p className="text-sm font-semibold text-zinc-50">{row.role}</p>
                <span className="text-xs text-zinc-400">•</span>
                <p className="text-xs text-zinc-200">{row.org}</p>
                <span className="text-xs text-zinc-400">•</span>
                <p className="text-xs text-zinc-300">{row.team}</p>
              </div>

              <ul className="space-y-3 text-sm text-zinc-300">
                {(row.bullets ?? []).map((b: string) => (
                  <li key={b} className="grid gap-2 sm:grid-cols-[auto_1fr]">
                    <span className="mt-1 h-2 w-2 rounded-full bg-glow-purple" />
                    <span className="whitespace-pre-wrap">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

