import { lazy, Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import RouteErrorPage from './pages/RouteError'

const HomePage = lazy(() => import('./pages/Home'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))
const AdminLoginPage = lazy(() => import('./pages/AdminLogin'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboard'))

const fallback = (
  <div className="container-pad py-14">
    <div className="glass rounded-2xl p-6">
      <div className="h-5 w-36 rounded-full bg-white/[0.06]" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded-full bg-white/[0.05]" />
        <div className="h-4 w-5/6 rounded-full bg-white/[0.05]" />
        <div className="h-4 w-2/3 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={fallback}>
            <HomePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    errorElement: <RouteErrorPage />,
    element: (
      <Suspense fallback={fallback}>
        <NotFoundPage />
      </Suspense>
    ),
  },
  {
    path: '/admin/login',
    errorElement: <RouteErrorPage />,
    element: (
      <Suspense fallback={fallback}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    errorElement: <RouteErrorPage />,
    element: (
      <Suspense fallback={fallback}>
        <AdminDashboardPage />
      </Suspense>
    ),
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
