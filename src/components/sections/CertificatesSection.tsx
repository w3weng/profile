import { motion } from 'framer-motion'
import { Award, Eye } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { SectionHeading } from '../ui/SectionHeading'
import { useCertificates } from '../../hooks/cms/useCertificates'
import type { CmsCertificate } from '../../types/cms'

export function CertificatesSection() {
  const { data, loading, error } = useCertificates()
  const [selected, setSelected] = useState<CmsCertificate | null>(null)
  const rows = data ?? []

  return (
    <section id="certificates" className="container-pad py-16 sm:py-20">
      <SectionHeading
        eyebrow="Certificates"
        title="Achievements & learning milestones."
        description="Elegant placeholders for certificates and awards—ready for real uploads as you collect more credentials."
      />

      {error ? (
        <div className="mb-6 glass rounded-2xl p-5">
          <p className="text-sm text-zinc-200">Failed to load certificates.</p>
          <p className="mt-1 text-xs text-zinc-400">{error}</p>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(loading ? Array.from({ length: 3 }) : rows).map((c, idx) => {
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
                <div className="flex items-start justify-between gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-white/[0.05]" />
                  <div className="h-9 w-24 rounded-2xl bg-white/[0.05]" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-5/6 rounded-full bg-white/[0.05]" />
                  <div className="h-3 w-1/2 rounded-full bg-white/[0.05]" />
                  <div className="h-3 w-full rounded-full bg-white/[0.05]" />
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/[0.03]">
                    <div className="absolute inset-y-0 left-0 w-1/2 -translate-x-[60%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </div>
                </div>
              </motion.div>
            )
          }

          const row = c as CmsCertificate
          return (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: idx * 0.05 }}
            className="glass glass-hover rounded-2xl p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <Award className="h-5 w-5 text-glow-cyan" />
              </div>
              <Button variant="ghost" className="px-3 py-2" onClick={() => setSelected(row)}>
                <Eye className="h-4 w-4" /> Preview
              </Button>
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-50">{row.title}</p>
            <p className="mt-1 text-xs text-zinc-300">
              {row.issuer} • {row.date}
            </p>
            <p className="mt-3 text-sm text-zinc-300">{row.description}</p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                {row.file_url ? (
                  <>
                    <img
                      src={row.file_url}
                      alt={`${row.title} file`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base-900/70 via-transparent to-transparent" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-glow-blue/15 via-glow-purple/10 to-transparent" />
                    <div className="absolute inset-0 opacity-70 bg-grid-fade [background-size:44px_44px]" />
                    <div className="absolute inset-0 grid place-items-center">
                      <p className="text-xs text-zinc-200/90">Certificate Preview</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
          )
        })}
      </div>

      <Modal
        open={!!selected}
        title={selected ? selected.title : 'Certificate'}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-300">
              <span className="text-zinc-50">{selected.issuer}</span> • {selected.date}
            </p>
            <div className="glass rounded-2xl p-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                {selected.file_url ? (
                  <>
                    <img
                      src={selected.file_url}
                      alt={`${selected.title} preview`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base-900/70 via-transparent to-transparent" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-glow-cyan/15 via-glow-purple/10 to-transparent" />
                    <div className="absolute inset-0 opacity-70 bg-grid-fade [background-size:44px_44px]" />
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-50">Preview Placeholder</p>
                        <p className="mt-2 text-xs text-zinc-300">
                          Upload an image/PDF file later in the Admin Dashboard.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <p className="mt-4 text-sm text-zinc-300">{selected.description}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}

