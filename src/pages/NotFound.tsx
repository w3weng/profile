import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="container-pad py-20">
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-xs text-zinc-300">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-300">
          The page you’re looking for doesn’t exist (or it moved). Head back to the homepage.
        </p>
        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

