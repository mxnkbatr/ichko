import { Link } from 'react-router-dom'
import { ChevronRight, MapPin, Navigation, Star } from 'lucide-react'
import type { Place } from '../data/places'
import { cn } from '../lib/cn'
import { useI18n } from '../lib/i18n'

function priceText(level: Place['priceLevel']) {
  return '$'.repeat(level)
}

function categoryText(cat: Place['category']) {
  if (cat === 'restaurant') return 'category_restaurant'
  if (cat === 'pub') return 'category_pub'
  return 'category_cafe'
}

export function PlaceCard({
  place,
  selected,
}: {
  place: Place
  selected?: boolean
}) {
  const { t } = useI18n()
  return (
    <Link
      to={`/place/${place.id}`}
      className={cn(
        'group relative block overflow-hidden rounded-[2.5rem] border border-zinc-200/50 bg-white/60 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 dark:border-white/10 dark:bg-white/5',
        selected && 'ring-2 ring-brand-500/60 shadow-lg shadow-orange-500/15',
      )}
    >
      <div className="flex gap-5">
        {/* Image Section */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[2rem] bg-zinc-100 shadow-inner dark:bg-white/5">
          <img
            src={place.photos[0]?.url}
            alt={place.photos[0]?.alt ?? place.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-zinc-900 shadow-sm backdrop-blur-md dark:bg-black/80 dark:text-white">
            <Star className="h-2.5 w-2.5 fill-orange-500 text-orange-500" />
            {place.rating.toFixed(1)}
          </div>
        </div>

        {/* Content Section */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-[18px] font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {place.name}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-200">
                  {t(categoryText(place.category) as any)}
                </span>
                <span className="text-[12px] font-medium text-zinc-400">
                  {priceText(place.priceLevel)}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
                  <span className="h-1 w-1 rounded-full bg-zinc-300" />
                  {place.reviewCount} үнэлгээ
                </span>
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-colors group-hover:bg-orange-500 group-hover:text-white dark:bg-white/5">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100/50 pt-3 dark:border-white/5">
            <div className="flex min-w-0 items-center gap-2 text-[12px] text-zinc-500 dark:text-zinc-400">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-400" />
              <span className="truncate">{place.address}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-900 dark:text-zinc-100">
                <Navigation className="h-3.5 w-3.5 text-zinc-400" />
                {place.distanceKm.toFixed(1)} км
              </div>
              <div className={cn(
                'flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider',
                place.openNow ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'
              )}>
                <span className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  place.openNow ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-300'
                )} />
                {place.openNow ? 'Нээлттэй' : 'Хаалттай'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

