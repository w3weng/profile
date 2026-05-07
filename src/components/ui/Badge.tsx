import { cn } from '../../lib/cn'

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]',
        className,
      )}
      {...props}
    />
  )
}

