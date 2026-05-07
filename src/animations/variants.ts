export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
} as const

export const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
} as const

