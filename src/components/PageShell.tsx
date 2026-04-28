import type React from 'react'

export function PageShell({
  title,
  subtitle,
  right,
  children,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[24px] font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
        {children}
      </div>
    </div>
  )
}

