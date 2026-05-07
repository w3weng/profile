import { AnimatePresence, motion } from 'framer-motion'
import { Download, ExternalLink, FileText, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useResume } from '../../hooks/cms/useResume'
import { Button } from '../ui/Button'

export function ResumeActions({ compact = false }: { compact?: boolean }) {
  const { data, loading } = useResume()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (loading) {
    return (
      <Button variant="secondary" disabled className={compact ? 'px-3 py-2 text-xs' : ''}>
        <FileText className="h-4 w-4" /> Loading resume...
      </Button>
    )
  }

  if (!data?.file_url) {
    return (
      <Button variant="ghost" disabled className={compact ? 'px-3 py-2 text-xs' : ''}>
        Resume coming soon
      </Button>
    )
  }

  // Cleaner PDF embed: fit width and hide side panes when supported.
  const previewUrl = `${data.file_url}#view=FitH&zoom=page-width&toolbar=1&navpanes=0&scrollbar=1`

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} className={compact ? 'px-3 py-2 text-xs' : ''}>
        <FileText className="h-4 w-4" /> Resume
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close resume preview"
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.995 }}
              transition={{ duration: 0.2 }}
              className="relative m-2 sm:m-4 h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-base-900/95 shadow-glass"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-3 sm:px-4">
                <p className="text-sm font-medium text-zinc-50">{data.title || 'Resume'}</p>
                <div className="flex items-center gap-2">
                  <a href={data.file_url} target="_blank" rel="noreferrer">
                    <Button className="px-3 py-2 text-xs">
                      Open <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href={data.file_url} download>
                    <Button variant="secondary" className="px-3 py-2 text-xs">
                      Download <Download className="h-4 w-4" />
                    </Button>
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-100 transition hover:bg-white/[0.06]"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="h-[calc(100%-58px)] bg-zinc-950">
                <iframe
                  src={previewUrl}
                  title={data.title || 'Resume preview'}
                  className="h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

