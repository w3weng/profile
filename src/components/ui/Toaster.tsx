import toast, { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(20,20,23,0.85)',
          color: 'rgba(244,244,245,0.92)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.55)',
          backdropFilter: 'blur(16px)',
        },
      }}
    />
  )
}

export { toast }

