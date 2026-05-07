import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

export function MouseGlow() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 220, damping: 32, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 32, mass: 0.6 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX - 180)
      y.set(e.clientY - 180)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [x, y])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[360px] w-[360px] rounded-full blur-3xl"
      style={{
        translateX: sx,
        translateY: sy,
        background:
          'radial-gradient(circle at 35% 35%, rgba(34,211,238,0.22), rgba(167,139,250,0.14) 40%, rgba(0,0,0,0) 70%)',
      }}
    />
  )
}

