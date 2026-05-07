import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getIsAdmin } from '../../lib/cms'

export function useAdminSession() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      const client = supabase
      if (!client) {
        if (!mounted) return
        setLoading(false)
        setAuthenticated(false)
        setIsAdmin(false)
        return
      }

      const { data } = await client.auth.getSession()
      const has = !!data.session
      const admin = has ? await getIsAdmin() : false
      if (!mounted) return
      setAuthenticated(has)
      setIsAdmin(admin)
      setLoading(false)
    }
    run()

    const client = supabase
    if (!client) return
    const { data: sub } = client.auth.onAuthStateChange(async (_event, session) => {
      const has = !!session
      const admin = has ? await getIsAdmin() : false
      if (!mounted) return
      setAuthenticated(has)
      setIsAdmin(admin)
      setLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return { loading, authenticated, isAdmin }
}

