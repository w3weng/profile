import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NAV_ITEMS } from '../../constants/nav'
import { cn } from '../../lib/cn'
import { useActiveSection } from '../../hooks/useActiveSection'
import { ResumeActions } from '../resume/ResumeActions'

function scrollToHash(href: string) {
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Navbar() {
  const ids = useMemo(() => NAV_ITEMS.map((i) => i.href.replace('#', '')), [])
  const active = useActiveSection({ ids })
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      <div className="container-pad pt-4">
        <div className="glass gradient-border rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                scrollToHash('#home')
                setOpen(false)
              }}
              className="group inline-flex items-center gap-2"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <span className="h-2 w-2 rounded-full bg-glow-cyan shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-zinc-50">Emman</p>
                <p className="text-[11px] text-zinc-300">Full‑Stack Developer</p>
              </div>
            </a>

            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.href.replace('#', '')
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToHash(item.href)
                    }}
                    className={cn(
                      'relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-300 transition hover:text-zinc-50',
                      'hover:bg-white/[0.04]',
                    )}
                  >
                    <item.icon className="h-4 w-4 opacity-80" />
                    {item.label}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-xl border border-white/10 bg-white/[0.04]"
                        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                      />
                    ) : null}
                  </a>
                )
              })}
            </nav>

            <div className="hidden md:block">
              <ResumeActions compact />
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-100 transition hover:border-white/20 hover:bg-white/[0.06] md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden md:hidden"
              >
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                  {NAV_ITEMS.map((item) => {
                    const isActive = active === item.href.replace('#', '')
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToHash(item.href)
                          setOpen(false)
                        }}
                        className={cn(
                          'glass glass-hover inline-flex items-center gap-2 rounded-2xl px-3 py-3 text-xs text-zinc-100',
                          isActive && 'border-white/20',
                        )}
                      >
                        <item.icon className="h-4 w-4 opacity-80" />
                        {item.label}
                      </a>
                    )
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

