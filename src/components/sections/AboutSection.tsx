import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Rocket, Sparkles } from 'lucide-react'
import { SITE } from '../../constants/site'
import { useGithubProfile } from '../../hooks/useGithubProfile'
import { SectionHeading } from '../ui/SectionHeading'

const TIMELINE = [
  {
    title: 'BSIT Student',
    meta: 'USTP Claveria',
    icon: GraduationCap,
    desc: 'Building strong foundations in systems, development, and practical problem‑solving.',
  },
  {
    title: 'Real‑World Systems',
    meta: 'Full‑stack focus',
    icon: Rocket,
    desc: 'Passionate about dashboards, management platforms, and workflows that make operations faster and clearer.',
  },
  {
    title: 'UI/UX + Backend Logic',
    meta: 'Clean & maintainable',
    icon: Sparkles,
    desc: 'I enjoy crafting premium interfaces and reliable backend logic—so the system feels great and works great.',
  },
] as const

export function AboutSection() {
  const github = useGithubProfile(SITE.githubUsername)
  const stats = [
    { label: 'Projects Completed', value: `${github?.public_repos ?? '8'}+` },
    { label: 'Technologies Used', value: '15+' },
    { label: 'Internship Experience', value: '1' },
  ]

  return (
    <section id="about" className="container-pad py-16 sm:py-20">
      <SectionHeading
        eyebrow="About"
        title="Building systems that feel premium."
        description="I’m a BSIT student from USTP Claveria with a strong passion for web development—especially full‑stack systems, polished UI/UX, and backend logic that makes platforms dependable."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
              <MapPin className="h-4 w-4 text-glow-cyan" />
              Based in {TIMELINE[0].meta}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
              <Sparkles className="h-4 w-4 text-glow-purple" />
              Futuristic developer aesthetic
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="gradient-border rounded-2xl p-4"
              >
                <p className="text-2xl font-semibold tracking-tight text-zinc-50">{s.value}</p>
                <p className="mt-1 text-xs text-zinc-300">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-sm leading-relaxed text-zinc-300">
            <p>
              I love building real‑world systems—tools that help teams monitor progress, track work, and make
              decisions faster. My usual approach is simple: design the flow first, make it clean, then
              implement it with maintainable code.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {TIMELINE.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="glass glass-hover rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <t.icon className="h-5 w-5 text-glow-cyan" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-50">{t.title}</p>
                    <span className="text-xs text-zinc-400">•</span>
                    <p className="text-xs text-zinc-300">{t.meta}</p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-300">{t.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

