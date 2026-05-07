import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '../../lib/cn'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ open, title, onClose, children, className }: Props) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-base-800/80 shadow-glass backdrop-blur-xl',
              className,
            )}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <p className="text-sm font-medium text-zinc-50">{title}</p>
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto p-5 scrollbar-premium">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

