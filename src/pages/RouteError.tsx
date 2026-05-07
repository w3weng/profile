import { AlertTriangle, Home } from 'lucide-react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function RouteError() {
  const error = useRouteError()

  let message = 'Something unexpected happened.'
  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="container-pad py-20">
      <div className="glass rounded-2xl p-8">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <AlertTriangle className="h-5 w-5 text-amber-300" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Unexpected application error</h1>
        <p className="mt-2 text-sm text-zinc-300">{message}</p>
        <Link to="/" className="mt-6 inline-flex">
          <Button variant="secondary">
            <Home className="h-4 w-4" />
            Back to homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}

