import { SlidersHorizontal, Star, Wallet } from 'lucide-react'
import { cn } from '../lib/cn'
import type React from 'react'
import { useI18n } from '../lib/i18n'

export type SortMode = 'distance' | 'rating'

export type AdvancedFilters = {
  openNow: boolean
  minRating: number
  maxDistanceKm: number
  price1: boolean
  price2: boolean
  price3: boolean
  sort: SortMode
}

export const DEFAULT_FILTERS: AdvancedFilters = {
  openNow: false,
  minRating: 0,
  maxDistanceKm: 10,
  price1: true,
  price2: true,
  price3: true,
  sort: 'distance',
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  hint?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left text-[13px] font-semibold transition',
        checked
          ? 'border-brand-500/30 bg-brand-500/10 text-brand-700 dark:text-brand-200'
          : 'border-zinc-200 bg-white/60 text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10',
      )}
    >
      <div className="min-w-0">
        <div className="truncate">{label}</div>
        {hint ? (
          <div className="mt-0.5 text-[12px] font-medium opacity-70">
            {hint}
          </div>
        ) : null}
      </div>
      <span
        className={cn(
          'inline-flex h-6 w-10 items-center rounded-full p-1 transition',
          checked ? 'bg-brand-500' : 'bg-zinc-300 dark:bg-white/20',
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            'h-4 w-4 rounded-full bg-white transition',
            checked ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </span>
    </button>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-2 text-[13px] font-semibold transition',
        active
          ? 'bg-zinc-900 text-white shadow-glass dark:bg-white dark:text-black'
          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15',
      )}
    >
      {children}
    </button>
  )
}

export function AdvancedFiltersPanel({
  value,
  onChange,
  onReset,
}: {
  value: AdvancedFilters
  onChange: (next: AdvancedFilters) => void
  onReset: () => void
}) {
  const { t } = useI18n()
  const selectedPrices =
    (value.price1 ? 1 : 0) + (value.price2 ? 1 : 0) + (value.price3 ? 1 : 0)

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
            {t('explore_advanced_filters')}
          </div>
          <div className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
            {t('nav_explore')}‑ийн шүүлтүүр (live).
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl bg-zinc-100 px-3 py-2 text-[12px] font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
        >
          {t('common_reset')}
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <Toggle
          checked={value.openNow}
          onChange={(openNow) => onChange({ ...value, openNow })}
          label={t('place_open')}
          hint="Одоогоор нээлттэй газрууд"
        />

        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              <Star className="h-4 w-4 text-zinc-400" />
              Минимум үнэлгээ
            </div>
            <div className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-200">
              {value.minRating.toFixed(1)}+
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={value.minRating}
            onChange={(e) =>
              onChange({ ...value, minRating: Number(e.target.value) })
            }
            className="mt-2 w-full accent-orange-500"
          />
          <div className="mt-1 flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>0</span>
            <span>5</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              Хамгийн их зай
            </div>
            <div className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-200">
              {value.maxDistanceKm.toFixed(0)} км
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={value.maxDistanceKm}
            onChange={(e) =>
              onChange({ ...value, maxDistanceKm: Number(e.target.value) })
            }
            className="mt-2 w-full accent-orange-500"
          />
          <div className="mt-1 flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>1км</span>
            <span>25км</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              <Wallet className="h-4 w-4 text-zinc-400" />
              Үнэ
            </div>
            <div className="text-[12px] text-zinc-500 dark:text-zinc-400">
              {selectedPrices}/3
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip
              active={value.price1}
              onClick={() => onChange({ ...value, price1: !value.price1 })}
            >
              $
            </Chip>
            <Chip
              active={value.price2}
              onClick={() => onChange({ ...value, price2: !value.price2 })}
            >
              $$
            </Chip>
            <Chip
              active={value.price3}
              onClick={() => onChange({ ...value, price3: !value.price3 })}
            >
              $$$
            </Chip>
          </div>
          <div className="mt-2 text-[12px] text-zinc-500 dark:text-zinc-400">
            Tip: Хэрвээ бүгд унтарвал “Reset” дарж сэргээнэ.
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
            Эрэмбэлэх
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip
              active={value.sort === 'distance'}
              onClick={() => onChange({ ...value, sort: 'distance' })}
            >
              Зай
            </Chip>
            <Chip
              active={value.sort === 'rating'}
              onClick={() => onChange({ ...value, sort: 'rating' })}
            >
              Үнэлгээ
            </Chip>
          </div>
        </div>
      </div>
    </div>
  )
}

