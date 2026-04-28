import { cn } from '../lib/cn'
import type React from 'react'

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-2 py-0.5 text-[12px] font-medium text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-200',
        className,
      )}
    >
      {children}
    </span>
  )
}

