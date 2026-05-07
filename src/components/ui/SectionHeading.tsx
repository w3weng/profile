import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

type Props = {
  eyebrow: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, description, className }: Props) {
  return (
    <div className={cn('mb-10', className)}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45 }}
        className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1 text-xs tracking-wide text-zinc-200"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-glow-cyan shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
        {eyebrow}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55 }}
        className="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
      >
        <span className="bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
          {title}
        </span>
      </motion.h2>

      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-300"
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  )
}

