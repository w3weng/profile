import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Background } from '../components/effects/Background'
import { MouseGlow } from '../components/effects/MouseGlow'
import { Particles } from '../components/effects/Particles'
import { Navbar } from '../components/nav/Navbar'
import { Footer } from '../components/sections/Footer'
import { Toaster } from '../components/ui/Toaster'

export function RootLayout() {
  const location = useLocation()
  return (
    <div className="min-h-dvh">
      <Background />
      <Particles />
      <MouseGlow />
      <Navbar />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollRestoration />
      <Toaster />
    </div>
  )
}

