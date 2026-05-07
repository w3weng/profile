import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useTestimonials } from '../../hooks/cms/useTestimonials'
import type { CmsTestimonial } from '../../types/cms'
import { SectionHeading } from '../ui/SectionHeading'

export function TestimonialsSection() {
  const { data, loading } = useTestimonials()
  const rows = data ?? []

  return (
    <section id="testimonials" className="container-pad py-16 sm:py-20">
      <SectionHeading
        eyebrow="Testimonials"
        title="What people say about working with me."
        description="Recommendations, feedback, and collaboration highlights."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(loading ? Array.from({ length: 3 }) : rows).map((row, idx) => {
          const item = row as CmsTestimonial
          return (
          <motion.div
            key={loading ? `s-${idx}` : item.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.04 }}
            className="glass glass-hover rounded-2xl p-6"
          >
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 w-2/3 rounded-full bg-white/[0.05]" />
                <div className="h-4 w-full rounded-full bg-white/[0.05]" />
                <div className="h-4 w-5/6 rounded-full bg-white/[0.05]" />
              </div>
            ) : (
              <>
                <Quote className="h-5 w-5 text-glow-cyan" />
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{item.quote}</p>
                <p className="mt-4 text-sm font-semibold text-zinc-50">{item.name}</p>
                <p className="text-xs text-zinc-400">
                  {item.role} • {item.org}
                </p>
              </>
            )}
          </motion.div>
          )
        })}
      </div>
    </section>
  )
}

