import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium outline-none transition active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-glow-blue/50 focus-visible:ring-offset-0',
        variant === 'primary' &&
          'gradient-border text-zinc-50 shadow-glow hover:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_0_52px_rgba(96,165,250,0.18)]',
        variant === 'secondary' &&
          'glass glass-hover text-zinc-100 hover:bg-white/[0.06]',
        variant === 'ghost' &&
          'text-zinc-200 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10',
        className,
      )}
      {...props}
    />
  )
}

