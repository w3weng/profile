import { ArrowUp } from 'lucide-react'
import { SITE } from '../../constants/site'

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-white/10">
      <div className="container-pad py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-50">{SITE.name}</p>
            <p className="mt-1 text-xs text-zinc-400">
              © {new Date().getFullYear()} • Built with React, Tailwind, Framer Motion
            </p>
          </div>

          <button
            type="button"
            onClick={toTop}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-zinc-100 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Back to top <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}

