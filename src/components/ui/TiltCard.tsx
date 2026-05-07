import type { HTMLAttributes } from 'react'
import { useRef } from 'react'
import { cn } from '../../lib/cn'

type Props = HTMLAttributes<HTMLDivElement> & {
  intensity?: number
}

export function TiltCard({ className, intensity = 10, ...props }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width - 0.5
    const py = y / rect.height - 0.5
    el.style.setProperty('--rx', `${(-py * intensity).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(px * intensity).toFixed(2)}deg`)
  }

  const onLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', `0deg`)
    el.style.setProperty('--ry', `0deg`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'will-change-transform [transform:perspective(1200px)_rotateX(var(--rx))_rotateY(var(--ry))]',
        'transition-transform duration-300',
        className,
      )}
      {...props}
    />
  )
}

