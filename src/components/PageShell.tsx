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
    <div className="mx-auto max-w-4xl">
      {/* Page Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {/* Content — NO wrapper card, just children directly */}
      <div>{children}</div>
    </div>
  )
}
