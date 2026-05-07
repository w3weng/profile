import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import { SITE } from '../../constants/site'
import { useTypewriter } from '../../hooks/useTypewriter'
import { useCurrentlyWorking } from '../../hooks/cms/useCurrentlyWorking'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ResumeActions } from '../resume/ResumeActions'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const TECH_BADGES = ['React', 'Tailwind', 'PHP', 'Node.js', 'MySQL', 'Framer Motion'] as const

export function HeroSection() {
  const { data } = useCurrentlyWorking()
  const typing = useTypewriter(
    data?.items?.length
      ? data.items
      : ['Web systems', 'Dashboards', 'Management platforms', 'Clean UI/UX'],
  )

  return (
    <section id="home" className="relative">
      <div className="container-pad min-h-[calc(100svh-92px)] py-14 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-glow-cyan shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
              Available for internships and collaborative projects
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-6xl"
            >
              Hi, I’m <span className="bg-sheen bg-clip-text text-transparent">{SITE.shortName}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-pretty text-lg text-zinc-200/90 sm:text-xl"
            >
              {SITE.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-zinc-300"
            >
              {SITE.tagline}{' '}
              <span className="text-zinc-200">
                Currently crafting: <span className="text-glow-cyan">{typing}</span>
                <span className="ml-0.5 inline-block h-4 w-[1px] translate-y-[3px] bg-zinc-300/70" />
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button onClick={() => scrollTo('projects')}>
                View Projects <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Button>
              <Button variant="secondary" onClick={() => scrollTo('contact')}>
                <Mail className="h-4 w-4" /> Contact Me
              </Button>
              <ResumeActions />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {TECH_BADGES.map((t) => (
                <Badge key={t} className="hover:border-white/20 hover:bg-white/[0.05] transition">
                  {t}
                </Badge>
              ))}
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="relative mx-auto aspect-square w-full max-w-sm"
            >
              {/* avatar image slot (replace /public/avatar.svg with your real photo) */}
              <div className="absolute inset-0 rounded-[34px] bg-gradient-to-br from-glow-cyan/20 via-glow-purple/15 to-glow-fuchsia/10 blur-2xl" />
              <div className="absolute inset-0 rounded-[34px] bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-glass" />

              <div className="absolute inset-0 p-6 sm:p-8">
                <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02]">
                  <img
                    src="/avatarr.png"
                    alt={`${SITE.name} avatar`}
                    className="h-full w-full object-cover opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.16),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(167,139,250,0.12),transparent_52%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-900/65 via-transparent to-transparent" />
                </div>
              </div>

              {/* floating stack chips */}
              <motion.div
                className="absolute -left-6 top-12 hidden sm:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Badge className="gradient-border">Full‑Stack</Badge>
              </motion.div>
              <motion.div
                className="absolute -right-6 top-24 hidden sm:block"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Badge className="gradient-border">UI/UX‑Driven</Badge>
              </motion.div>
              <motion.div
                className="absolute left-10 bottom-10 hidden sm:block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Badge className="gradient-border">Backend Logic</Badge>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

