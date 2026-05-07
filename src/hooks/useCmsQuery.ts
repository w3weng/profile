import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

type State<T> = {
  data: T | null
  loading: boolean
  error: string | null
  fromRealtime: boolean
}

type Options = {
  realtime?: { schema?: string; table: string }
  enabled?: boolean
}

export function useCmsQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: Options = {},
): State<T> {
  const enabled = opts.enabled ?? true
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: enabled,
    error: null,
    fromRealtime: false,
  })

  const stableKey = useMemo(() => key, [key])
  const instanceIdRef = useRef(
    `i${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
  )

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fetcher()
      .then((data) => {
        if (cancelled) return
        setState({ data, loading: false, error: null, fromRealtime: false })
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const message = e instanceof Error ? e.message : 'Failed to load content.'
        setState({ data: null, loading: false, error: message, fromRealtime: false })
      })
    return () => {
      cancelled = true
    }
  }, [enabled, stableKey])

  useEffect(() => {
    const rt = opts.realtime
    if (!enabled || !rt) return
    const client = supabase
    if (!client) return

    const schema = rt.schema ?? 'public'
    const channel = client
      .channel(`rt:${schema}:${rt.table}:${stableKey}:${instanceIdRef.current}`)
      .on(
        'postgres_changes',
        { event: '*', schema, table: rt.table },
        async () => {
          try {
            const data = await fetcher()
            setState({ data, loading: false, error: null, fromRealtime: true })
          } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to refresh content.'
            setState((s) => ({ ...s, error: message }))
          }
        },
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [enabled, stableKey, opts.realtime?.schema, opts.realtime?.table])

  return state
}

