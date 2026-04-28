import { X } from 'lucide-react'
import { cn } from '../lib/cn'
import type React from 'react'
import { useI18n } from '../lib/i18n'

export function FilterChip({
  children,
  onClear,
  className,
}: {
  children: React.ReactNode
  onClear: () => void
  className?: string
}) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={onClear}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-[13px] font-semibold text-zinc-800 shadow-sm backdrop-blur transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10',
        className,
      )}
      aria-label={t('common_clear_filter')}
      title={t('common_clear_filter')}
    >
      <span className="truncate">{children}</span>
      <span className="grid h-5 w-5 place-items-center rounded-full bg-zinc-100 text-zinc-500 transition group-hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-300 dark:group-hover:bg-white/15">
        <X className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}

