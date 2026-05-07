import { useEffect, useMemo, useState } from 'react'

type Options = {
  ids: string[]
  rootMargin?: string
}

export function useActiveSection({ ids, rootMargin = '-35% 0px -55% 0px' }: Options) {
  const [active, setActive] = useState(ids[0] ?? '')

  const stableIds = useMemo(() => ids, [ids.join('|')])

  useEffect(() => {
    const elements = stableIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))
        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      { root: null, threshold: [0.1, 0.2, 0.35, 0.5], rootMargin },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rootMargin, stableIds])

  return active
}

