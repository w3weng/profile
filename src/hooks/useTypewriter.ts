import { useEffect, useMemo, useRef, useState } from 'react'

type Options = {
  typeMs?: number
  deleteMs?: number
  pauseMs?: number
}

export function useTypewriter(words: string[], opts: Options = {}) {
  const typeMs = opts.typeMs ?? 42
  const deleteMs = opts.deleteMs ?? 28
  const pauseMs = opts.pauseMs ?? 950

  const safeWords = useMemo(() => (words.length ? words : ['']), [words])
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const current = safeWords[index % safeWords.length]

    const tick = () => {
      if (!isDeleting) {
        const next = current.slice(0, value.length + 1)
        setValue(next)
        if (next === current) {
          timeoutRef.current = window.setTimeout(() => setIsDeleting(true), pauseMs)
          return
        }
        timeoutRef.current = window.setTimeout(tick, typeMs)
        return
      }

      const next = current.slice(0, Math.max(0, value.length - 1))
      setValue(next)
      if (!next) {
        setIsDeleting(false)
        setIndex((v) => (v + 1) % safeWords.length)
        timeoutRef.current = window.setTimeout(tick, 220)
        return
      }

      timeoutRef.current = window.setTimeout(tick, deleteMs)
    }

    timeoutRef.current = window.setTimeout(tick, 180)
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [deleteMs, index, isDeleting, pauseMs, safeWords, typeMs, value.length])

  return value
}

