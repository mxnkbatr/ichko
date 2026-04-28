import { MapPinned } from 'lucide-react'
import type { Place } from '../data/places'
import { cn } from '../lib/cn'

export function MapMock({
  places,
  selectedId,
  onSelect,
}: {
  places: Place[]
  selectedId?: string
  onSelect?: (id: string) => void
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,.22),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,.55),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(59,130,246,.18),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,.10),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(59,130,246,.12),transparent_45%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,black_1px,transparent_1px),linear-gradient(to_bottom,black_1px,transparent_1px)] [background-size:52px_52px] dark:opacity-[0.14]" />

      <div className="relative min-h-[420px] p-4">
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Map (prototype)
          </div>
          <div className="text-[12px] text-zinc-500 dark:text-zinc-400">
            Pins are clickable
          </div>
        </div>

        <div className="relative mt-4 h-[360px] rounded-2xl bg-white/40 ring-1 ring-black/5 dark:bg-black/10 dark:ring-white/10">
          {places.map((p, idx) => {
            const left = 18 + ((idx * 23) % 70)
            const top = 14 + ((idx * 37) % 72)
            const selected = p.id === selectedId
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect?.(p.id)}
                className={cn(
                  'absolute -translate-x-1/2 -translate-y-full rounded-full px-3 py-2 text-left shadow-glass outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500/70',
                  selected
                    ? 'bg-brand-500 text-white'
                    : 'bg-white/85 text-zinc-900 hover:bg-white dark:bg-black/60 dark:text-zinc-50 dark:hover:bg-black/70',
                )}
                style={{ left: `${left}%`, top: `${top}%` }}
                aria-label={`Select ${p.name}`}
              >
                <div className="flex items-center gap-2">
                  <MapPinned
                    className={cn(
                      'h-4 w-4',
                      selected ? 'text-white' : 'text-brand-600',
                    )}
                  />
                  <div className="max-w-[170px]">
                    <div className="truncate text-[12px] font-semibold">
                      {p.name}
                    </div>
                    <div
                      className={cn(
                        'truncate text-[11px]',
                        selected ? 'text-white/90' : 'text-zinc-500',
                      )}
                    >
                      {p.distanceKm.toFixed(1)} км · {p.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

