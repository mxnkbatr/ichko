import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Filter, LocateFixed, ShieldAlert, ChevronLeft, ChevronRight, Star, Clock, MapPin, ArrowRight } from 'lucide-react'
import { places as allPlaces, type PlaceCategory, type Place } from '../data/places'
import { PlaceCard } from '../components/PlaceCard'
import { OsmMap } from '../components/OsmMap'
import { cn } from '../lib/cn'
import { haversineKm } from '../lib/geo'
import { DEFAULT_FILTERS, type SortMode } from '../components/AdvancedFiltersPanel'
import { FilterChip } from '../components/FilterChip'
import { useI18n } from '../lib/i18n'


function HomeBanner({ featured }: { featured: Place[] }) {
  const [index, setIndex] = useState(0)
  const nav = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [featured.length])

  if (!featured.length) return null

  const current = featured[index]

  return (
    <div className="group relative mb-10 overflow-hidden rounded-[3rem] border border-zinc-200/50 bg-zinc-900 shadow-2xl dark:border-white/5">
      {/* Background Image with Crossfade-like feel */}
      <div className="relative h-[320px] w-full overflow-hidden md:h-[420px]">
        {featured.map((p, i) => (
          <img
            key={p.id}
            src={p.photos[0]?.url}
            alt={p.name}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out',
              i === index ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
            )}
          />
        ))}
        {/* Gradients for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-2xl transform transition-all duration-700 ease-out">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-brand-500 px-4 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-500/25">
              Онцлох газар
            </span>
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-white backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
              {current.rating.toFixed(1)}
            </div>
          </div>

          <h1 className="text-[32px] font-black leading-tight tracking-tight text-white md:text-[48px]">
            {current.name}
          </h1>

          <p className="mt-3 line-clamp-2 text-[15px] font-medium text-zinc-300 md:text-[18px] md:text-zinc-200">
            {current.highlights.join(' • ')}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => nav(`/place/${current.id}`)}
              className="flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[14px] font-black text-zinc-900 transition hover:scale-105 active:scale-95"
            >
              Захиалга өгөх
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2 text-[13px] font-bold">
                <MapPin className="h-4 w-4 text-brand-400" />
                {current.address.split(',')[0]}
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold">
                <Clock className="h-4 w-4 text-brand-400" />
                {current.closesAt} хүртэл нээлттэй
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === index ? 'w-8 bg-brand-500' : 'w-2 bg-white/30 hover:bg-white/50'
            )}
          />
        ))}
      </div>

      {/* Arrow Controls (Hidden on mobile) */}
      <button
        onClick={() => setIndex((i) => (i - 1 + featured.length) % featured.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:bg-white/20 hidden md:block"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % featured.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:bg-white/20 hidden md:block"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}

const categoryChips: Array<{ id: 'all' | PlaceCategory; labelKey: string }> = [
  { id: 'all', labelKey: 'category_all' },
  { id: 'restaurant', labelKey: 'category_restaurant' },
  { id: 'pub', labelKey: 'category_pub' },
  { id: 'cafe', labelKey: 'category_cafe' },
]

export function HomePage() {
  const { t } = useI18n()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | undefined>(
    allPlaces[0]?.id,
  )
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(
    null,
  )
  const [locError, setLocError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)

  const cat = (params.get('cat') ?? 'all') as 'all' | PlaceCategory
  const q = params.get('q') ?? ''
  const openNow = params.get('open') === '1'
  const minRating = Number(params.get('minR') ?? DEFAULT_FILTERS.minRating)
  const maxDistanceKm = Number(params.get('maxD') ?? DEFAULT_FILTERS.maxDistanceKm)
  const price1 = params.get('p1') !== '0'
  const price2 = params.get('p2') !== '0'
  const price3 = params.get('p3') !== '0'
  const sort = (params.get('sort') ?? DEFAULT_FILTERS.sort) as SortMode

  const adv = {
    openNow,
    minRating: Number.isFinite(minRating) ? Math.max(0, Math.min(5, minRating)) : 0,
    maxDistanceKm: Number.isFinite(maxDistanceKm)
      ? Math.max(1, Math.min(25, maxDistanceKm))
      : DEFAULT_FILTERS.maxDistanceKm,
    price1,
    price2,
    price3,
    sort,
  }

  const filtered = useMemo(() => {
    const withDistance: Place[] = allPlaces.map((p) => {
      if (!userLoc) return p
      const km = haversineKm(userLoc, p.coords)
      return { ...p, distanceKm: km }
    })

    return withDistance
      .filter((p) => (cat === 'all' ? true : p.category === cat))
      .filter((p) => (adv.openNow ? p.openNow : true))
      .filter((p) => p.rating >= adv.minRating)
      .filter((p) => p.distanceKm <= adv.maxDistanceKm)
      .filter((p) => {
        const ok1 = adv.price1 && p.priceLevel === 1
        const ok2 = adv.price2 && p.priceLevel === 2
        const ok3 = adv.price3 && p.priceLevel === 3
        return ok1 || ok2 || ok3
      })
      .filter((p) => {
        const hay = `${p.name} ${p.address} ${p.highlights.join(' ')}`.toLowerCase()
        return q.trim() ? hay.includes(q.trim().toLowerCase()) : true
      })
      .sort((a, b) => {
        if (adv.sort === 'rating') return b.rating - a.rating
        return a.distanceKm - b.distanceKm
      })
  }, [cat, q, userLoc, adv.maxDistanceKm, adv.minRating, adv.openNow, adv.price1, adv.price2, adv.price3, adv.sort])

  const grouped = useMemo(() => {
    const order: PlaceCategory[] = ['restaurant', 'pub', 'cafe']
    const map = new Map<PlaceCategory, Place[]>()
    order.forEach((c) => map.set(c, []))
    filtered.forEach((p) => {
      const arr = map.get(p.category) ?? []
      arr.push(p)
      map.set(p.category, arr)
    })
    return { order, map }
  }, [filtered])

  const requestLocation = () => {
    setLocError(null)
    if (!('geolocation' in navigator)) {
      setLocError('This browser does not support geolocation.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      (err) => {
        setLocError(err.message || 'Location permission denied.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 },
    )
  }

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value == null || value === '') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const clearKey = (key: string) => {
    const next = new URLSearchParams(params)
    next.delete(key)
    setParams(next, { replace: true })
  }

  const clearAllFilters = () => {
    const next = new URLSearchParams(params)
    ;['cat', 'q', 'open', 'minR', 'maxD', 'sort', 'p1', 'p2', 'p3'].forEach(
      (k) => next.delete(k),
    )
    setParams(next, { replace: true })
  }

  const activeChips = (() => {
    const chips: Array<{ key: string; label: string; onClear: () => void }> = []

    if (cat !== 'all')
      chips.push({
        key: 'cat',
        label: `${t('filter_category')}: ${t(
          cat === 'restaurant'
            ? 'category_restaurant'
            : cat === 'pub'
              ? 'category_pub'
              : 'category_cafe',
        )}`,
        onClear: () => clearKey('cat'),
      })

    if (q.trim())
      chips.push({
        key: 'q',
        label: `${t('filter_search')}: “${q.trim()}”`,
        onClear: () => clearKey('q'),
      })

    if (adv.openNow)
      chips.push({
        key: 'open',
        label: t('place_open'),
        onClear: () => clearKey('open'),
      })

    if (adv.minRating > 0)
      chips.push({
        key: 'minR',
        label: `${adv.minRating.toFixed(1)}+`,
        onClear: () => clearKey('minR'),
      })

    if (adv.maxDistanceKm !== DEFAULT_FILTERS.maxDistanceKm)
      chips.push({
        key: 'maxD',
        label: `≤ ${adv.maxDistanceKm.toFixed(0)} км`,
        onClear: () => clearKey('maxD'),
      })

    const anyPriceOff = !price1 || !price2 || !price3
    if (anyPriceOff) {
      const parts = [
        price1 ? '$' : null,
        price2 ? '$$' : null,
        price3 ? '$$$' : null,
      ].filter(Boolean)
      chips.push({
        key: 'price',
        label: `Үнэ: ${parts.length ? parts.join(' ') : '—'}`,
        onClear: () => {
          const next = new URLSearchParams(params)
          next.delete('p1')
          next.delete('p2')
          next.delete('p3')
          setParams(next, { replace: true })
        },
      })
    }

    if (adv.sort !== DEFAULT_FILTERS.sort)
      chips.push({
        key: 'sort',
        label: `Эрэмбэ: ${adv.sort === 'rating' ? 'Үнэлгээ' : 'Зай'}`,
        onClear: () => clearKey('sort'),
      })

    return chips
  })()

  const featuredPlaces = useMemo(() => {
    return allPlaces.filter(p => ['p1', 'p3', 'p5'].includes(p.id))
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero Banner Section */}
      {!cat || cat === 'all' ? <HomeBanner featured={featuredPlaces} /> : null}

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <section className="space-y-4">
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[22px] font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {t('explore_title')}
              </div>
              <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                {t('explore_subtitle')}
              </div>
            </div>
            <button
              type="button"
              onClick={requestLocation}
              disabled={locating}
              className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-3 py-2 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95 dark:bg-white dark:text-black"
            >
              <LocateFixed className="h-4 w-4" />
              {locating
                ? t('explore_locating')
                : userLoc
                  ? t('explore_location_on')
                  : t('explore_my_location')}
            </button>
          </div>

          {locError && (
            <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-[13px] text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
              <ShieldAlert className="mt-0.5 h-4 w-4" />
              <div className="min-w-0">
                <div className="font-semibold">{t('explore_location_not_available_title')}</div>
                <div className="opacity-80">{locError || t('explore_location_not_available_hint')}</div>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-[13px] text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
              <Filter className="h-4 w-4 text-zinc-400" />
              <input
                value={q}
                onChange={(e) => {
                  updateParam('q', e.target.value)
                }}
                placeholder={t('explore_search_placeholder')}
                className="w-56 bg-transparent outline-none placeholder:text-zinc-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryChips.map((chip) => {
                const active = chip.id === cat
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      if (chip.id === 'all') updateParam('cat', '')
                      else updateParam('cat', chip.id)
                    }}
                    className={cn(
                      'rounded-full px-3 py-2 text-[13px] font-semibold transition',
                      active
                        ? 'bg-brand-500 text-white shadow-glass'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15',
                    )}
                  >
                    {t(chip.labelKey as any)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => nav(`/filters?${params.toString()}`)}
              className="rounded-full bg-zinc-900 px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-95 dark:bg-white dark:text-black"
            >
              {t('explore_advanced_filters')}
            </button>

            {activeChips.length ? (
              <>
                {activeChips.map((c) => (
                  <FilterChip key={c.key} onClear={c.onClear}>
                    {c.label}
                  </FilterChip>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-[13px] font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
                >
                  {t('common_clear_all')}
                </button>
              </>
            ) : (
              <span className="text-[12px] text-zinc-500 dark:text-zinc-400">
                {t('explore_no_active_filters')}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {cat === 'all' ? (
            grouped.order.map((c) => {
              const items = grouped.map.get(c) ?? []
              if (!items.length) return null
              return (
                <div key={c} className="space-y-2">
                  <div className="flex items-end justify-between px-1">
                    <div className="text-[13px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {t(
                        c === 'restaurant'
                          ? 'category_restaurant'
                          : c === 'pub'
                            ? 'category_pub'
                            : 'category_cafe',
                      )}
                    </div>
                    <div className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">
                      {items.length}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {items.map((p) => (
                      <div key={p.id} onMouseEnter={() => setSelectedId(p.id)}>
                        <PlaceCard place={p} selected={p.id === selectedId} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            filtered.map((p) => (
              <div key={p.id} onMouseEnter={() => setSelectedId(p.id)}>
                <PlaceCard place={p} selected={p.id === selectedId} />
              </div>
            ))
          )}
          {filtered.length === 0 && (
            <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 text-[14px] text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              Илэрц олдсонгүй. Хайлт эсвэл filter-ээ өөрчлөөрэй.
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            const first = filtered[0]
            if (first) nav(`/place/${first.id}`)
          }}
          className="w-full rounded-3xl bg-brand-500 px-4 py-3 text-[14px] font-semibold text-white shadow-glass transition hover:opacity-95"
        >
          {t('explore_quick_open_first')}
        </button>
      </section>

      <section className="space-y-4">
        <OsmMap
          places={filtered.length ? filtered : allPlaces}
          selectedId={selectedId}
          userLocation={userLoc ?? undefined}
          onSelect={(id) => {
            setSelectedId(id)
            nav(`/place/${id}`)
          }}
        />

        <div className="rounded-3xl border border-zinc-200 bg-white/70 p-4 text-[13px] text-zinc-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          {t('explore_tip')}
        </div>
      </section>
      </div>
    </div>
  )
}

