import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useCurrentlyWorking } from '../../hooks/cms/useCurrentlyWorking'
import { SectionHeading } from '../ui/SectionHeading'

export function CurrentlyWorkingSection() {
  const { data, loading } = useCurrentlyWorking()
  const items = data?.items ?? []

  return (
    <section id="currently-working" className="container-pad py-16 sm:py-20">
      <SectionHeading
        eyebrow="Currently Working On"
        title="What I’m actively building right now."
        description="Live focus areas are managed from CMS, so this section updates automatically."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {(loading ? Array.from({ length: 4 }).map((_, i) => `loading-${i}`) : items).map((item, idx) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="glass glass-hover rounded-2xl p-5"
          >
            {loading ? (
              <div className="h-4 w-5/6 rounded-full bg-white/[0.05]" />
            ) : (
              <p className="flex items-center gap-3 text-sm text-zinc-200">
                <Sparkles className="h-4 w-4 text-glow-cyan" />
                {item}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

