import { Lock } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { toast } from '../components/ui/Toaster'
import { useAdminSession } from '../hooks/admin/useAdminSession'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { requireSupabase, supabase } from '../lib/supabase'

export default function AdminLogin() {
  useDocumentTitle('Admin Login — Portfolio CMS')
  const navigate = useNavigate()
  const { loading, authenticated, isAdmin } = useAdminSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!supabase) {
    return (
      <div className="container-pad py-20">
        <div className="glass rounded-2xl p-8">
          <p className="text-sm text-zinc-200">Supabase is not configured.</p>
          <p className="mt-2 text-xs text-zinc-400">Add env keys in `.env` first.</p>
        </div>
      </div>
    )
  }

  if (!loading && authenticated && isAdmin) return <Navigate to="/admin" replace />

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const client = requireSupabase()
      const { error } = await client.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Welcome back.')
      navigate('/admin')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-pad py-20">
      <form onSubmit={onSubmit} className="mx-auto w-full max-w-md glass rounded-2xl p-8">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <Lock className="h-5 w-5 text-glow-cyan" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-zinc-50">Admin login</h1>
        <p className="mt-1 text-sm text-zinc-300">Sign in to manage portfolio content.</p>

        <label className="mt-5 block">
          <span className="text-xs text-zinc-300">Email</span>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/20"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-xs text-zinc-300">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/20"
          />
        </label>

        <Button type="submit" className="mt-6 w-full" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}

