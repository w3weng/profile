/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#050507',
          900: '#0a0a0a',
          800: '#0f1117',
        },
        glow: {
          cyan: '#22d3ee',
          blue: '#60a5fa',
          purple: '#a78bfa',
          fuchsia: '#e879f9',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
      boxShadow: {
        glass:
          '0 1px 0 rgba(255,255,255,0.06) inset, 0 0 0 1px rgba(255,255,255,0.06) inset, 0 20px 40px rgba(0,0,0,0.55)',
        glow: '0 0 0 1px rgba(96,165,250,0.18), 0 0 40px rgba(96,165,250,0.12)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'radial-spot':
          'radial-gradient(60% 60% at 50% 40%, rgba(96,165,250,0.18) 0%, rgba(167,139,250,0.12) 32%, rgba(0,0,0,0) 70%)',
        'sheen':
          'linear-gradient(120deg, rgba(34,211,238,0.18), rgba(167,139,250,0.16), rgba(232,121,249,0.12))',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(18px, -22px) scale(1.06)' },
          '66%': { transform: 'translate(-14px, 14px) scale(0.98)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-60%)' },
          '100%': { transform: 'translateX(60%)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        blob: 'blob 16s ease-in-out infinite',
        shimmer: 'shimmer 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

