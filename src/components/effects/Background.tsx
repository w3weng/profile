import { cn } from '../../lib/cn'

export function Background({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none fixed inset-0 -z-10', className)}>
      <div className="absolute inset-0 bg-base-900" />
      <div className="absolute inset-0 opacity-70 bg-radial-spot" />
      <div className="absolute inset-0 grid-bg opacity-[0.22]" />

      {/* Blobs */}
      <div className="absolute -left-24 top-20 h-[320px] w-[320px] animate-blob rounded-full bg-glow-blue/20 blur-3xl" />
      <div className="absolute -right-24 top-44 h-[360px] w-[360px] animate-blob rounded-full bg-glow-purple/20 blur-3xl [animation-delay:2.5s]" />
      <div className="absolute left-1/2 top-[70vh] h-[380px] w-[380px] -translate-x-1/2 animate-blob rounded-full bg-glow-cyan/15 blur-3xl [animation-delay:5s]" />

      {/* subtle noise-ish sheen layer */}
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:120px_120px]" />
    </div>
  )
}

