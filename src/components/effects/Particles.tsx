import { useMemo } from 'react'

type Dot = { id: number; left: string; top: string; size: number; delay: string; duration: string }

export function Particles({ count = 18 }: { count?: number }) {
  const dots = useMemo<Dot[]>(() => {
    const r = (min: number, max: number) => Math.random() * (max - min) + min
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${r(0, 100).toFixed(2)}%`,
      top: `${r(0, 100).toFixed(2)}%`,
      size: Math.round(r(2, 5)),
      delay: `${r(0, 6).toFixed(2)}s`,
      duration: `${r(8, 16).toFixed(2)}s`,
    }))
  }, [count])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 opacity-70">
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-white/10 shadow-[0_0_18px_rgba(96,165,250,0.12)]"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animation: `floaty ${d.duration} ease-in-out ${d.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}

