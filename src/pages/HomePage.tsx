import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  SlidersHorizontal,
  MapPin, X, ChevronDown, Map as MapIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { places as allPlaces, type PlaceCategory } from '../data/places'
import { PlaceCard } from '../components/PlaceCard'
import { OsmMap } from '../components/OsmMap'
import { cn } from '../lib/cn'
import { haversineKm } from '../lib/geo'

type SortMode = 'distance' | 'rating'

// ── Dropdown Component ────────────────────────────────────────────────────────
function CustomDropdown({ 
  label, 
  options, 
  value, 
  onChange 
}: { 
  label: string; 
  options: { value: string; label: string }[]; 
  value: string; 
  onChange: (val: any) => void 
}) {
  const [open, setOpen] = useState(false)
  const current = options.find(o => o.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13px] font-semibold transition hover:border-zinc-300 dark:border-white/10 dark:bg-white/5",
          open && "border-zinc-900 ring-2 ring-zinc-900/5 dark:border-white"
        )}
      >
        {label}: {current?.label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-zinc-100 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-zinc-900"
            >
              {options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-[13px] font-medium transition-colors hover:bg-zinc-50 dark:hover:bg-white/5",
                    value === opt.value ? "text-orange-500" : "text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export function HomePage() {
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [userLoc] = useState<{ lat: number; lng: number } | null>(null)
  const [mapSheetOpen, setMapSheetOpen] = useState(false)

  // Filter State
  const cat  = (params.get('cat') ?? 'all') as 'all' | PlaceCategory
  const q    = params.get('q') ?? ''
  const openNow = params.get('open') === '1'
  const minRating = Number(params.get('minR') ?? 0)
  const price1 = params.get('p1') !== '0'
  const price2 = params.get('p2') !== '0'
  const price3 = params.get('p3') !== '0'
  const sort = (params.get('sort') ?? 'distance') as SortMode

  const filtered = useMemo(() => {
    const base = allPlaces.map(p =>
      userLoc ? { ...p, distanceKm: haversineKm(userLoc, p.coords) } : p
    )
    return base
      .filter(p => cat === 'all' ? true : p.category === cat)
      .filter(p => openNow ? p.openNow : true)
      .filter(p => p.rating >= minRating)
      .filter(p => {
        if (!price1 && !price2 && !price3) return true // if none selected, show all? or specific yelp logic
        return (price1 && p.priceLevel === 1) || (price2 && p.priceLevel === 2) || (price3 && p.priceLevel === 3)
      })
      .filter(p => q.trim() ? `${p.name} ${p.address} ${p.highlights.join(' ')}`.toLowerCase().includes(q.toLowerCase()) : true)
      .sort((a, b) => sort === 'rating' ? b.rating - a.rating : a.distanceKm - b.distanceKm)
  }, [cat, q, userLoc, openNow, minRating, price1, price2, price3, sort])


  const setParam = (key: string, val?: string) => {
    const n = new URLSearchParams(params)
    if (val === undefined || val === '') n.delete(key); else n.set(key, val)
    setParams(n, { replace: true })
  }

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onClear: () => void }[] = []
    if (openNow) chips.push({ key: 'open', label: 'Нээлттэй', onClear: () => setParam('open', '') })
    if (minRating > 0) chips.push({ key: 'minR', label: `${minRating}+ Үнэлгээ`, onClear: () => setParam('minR', '') })
    if (price1 && price2 && price3) { /* nothing */ }
    else {
      if (price1) chips.push({ key: 'p1', label: '$', onClear: () => setParam('p1', '0') })
      if (price2) chips.push({ key: 'p2', label: '$$', onClear: () => setParam('p2', '0') })
      if (price3) chips.push({ key: 'p3', label: '$$$', onClear: () => setParam('p3', '0') })
    }
    return chips
  }, [openNow, minRating, price1, price2, price3])

  const categoryLabel = useMemo(() => {
    if (cat === 'restaurant') return 'ресторан'
    if (cat === 'pub') return 'паб'
    if (cat === 'cafe') return 'кафе'
    return 'газар'
  }, [cat])

  return (
    <div className="flex flex-col">
      {/* ── FILTER BAR ────────────────────────────────────────── */}
      <div className="sticky top-[104px] z-20 border-b border-zinc-200 bg-white dark:border-white/8 dark:bg-black/90 md:top-[128px]">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Sort */}
            <CustomDropdown
              label="↕ Эрэмбэ"
              value={sort}
              onChange={val => setParam('sort', val)}
              options={[
                { value: 'distance', label: 'Зайгаар' },
                { value: 'rating', label: 'Үнэлгээгээр' }
              ]}
            />

            {/* Open Now */}
            <button
              onClick={() => setParam('open', openNow ? '' : '1')}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition",
                openNow 
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white" 
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              )}
            >
              <div className={cn("h-2 w-2 rounded-full", openNow ? "bg-emerald-400" : "bg-emerald-500")} />
              Одоо нээлттэй
            </button>

            {/* Price Pills */}
            <div className="flex shrink-0 rounded-full border border-zinc-200 bg-white p-0.5 dark:border-white/10 dark:bg-white/5">
              {[1, 2, 3].map(lvl => {
                const key = `p${lvl}` as 'p1'|'p2'|'p3'
                const active = params.get(key) !== '0'
                return (
                  <button
                    key={lvl}
                    onClick={() => setParam(key, active ? '0' : '1')}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-[13px] font-bold transition",
                      active ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    )}
                  >
                    {'$'.repeat(lvl)}
                  </button>
                )
              })}
            </div>

            {/* All Filters */}
            <button
              onClick={() => nav(`/filters?${params.toString()}`)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13px] font-semibold text-zinc-700 hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              ⋯ Бүх шүүлтүүр
            </button>
          </div>

          {/* Active Filter Chips */}
          <AnimatePresence>
            {activeChips.length > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 flex flex-wrap items-center gap-2 overflow-hidden"
              >
                {activeChips.map(chip => (
                  <button
                    key={chip.key}
                    onClick={chip.onClear}
                    className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[12px] font-bold text-orange-700 ring-1 ring-inset ring-orange-200 transition hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/20"
                  >
                    {chip.label}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                <button 
                  onClick={() => setParams(new URLSearchParams())}
                  className="text-[12px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  Бүгдийг устгах
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-7xl items-start lg:gap-0">
        
        {/* Map Panel (Desktop Sticky) */}
        <aside className="sticky top-[192px] hidden h-[calc(100vh-192px)] w-[420px] shrink-0 overflow-hidden border-r border-zinc-200 dark:border-white/8 lg:block md:top-[192px]">
          <OsmMap
            places={filtered}
            selectedId={selectedId}
            userLocation={userLoc ?? undefined}
            onSelect={id => setSelectedId(id)}
          />
        </aside>

        {/* Results Panel */}
        <main className="flex-1 bg-white dark:bg-transparent">
          <div className="px-4 py-6 md:px-8">
            <header className="mb-6">
              <h1 className="text-[24px] font-black tracking-tight text-zinc-900 dark:text-white">
                Шилдэг {categoryLabel}
              </h1>
              <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                {filtered.length} {categoryLabel} Улаанбаатар хотод
              </p>
            </header>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-white/5">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-[18px] font-bold text-zinc-900 dark:text-white">Илэрц олдсонгүй</h3>
                <p className="mt-1 text-[14px] text-zinc-500 dark:text-zinc-400">
                  Шүүлтүүрээ өөрчилж дахин оролдоорой
                </p>
              </div>
            ) : (
              <motion.div 
                variants={{
                  show: { transition: { staggerChildren: 0.04 } }
                }}
                initial="hidden"
                animate="show"
                className="flex flex-col"
              >
                {filtered.map((p, i) => (
                  <motion.div 
                    key={p.id} 
                    onMouseEnter={() => setSelectedId(p.id)}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <PlaceCard 
                      place={p} 
                      index={i} 
                      selected={p.id === selectedId} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* ── MOBILE MAP BUTTON ─────────────────────────────────── */}
      <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <button
          onClick={() => setMapSheetOpen(true)}
          className="flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-[14px] font-black text-white shadow-2xl transition active:scale-95 dark:bg-white dark:text-black"
        >
          <MapIcon className="h-4 w-4" />
          Газрын зураг
        </button>
      </div>

      {/* ── MOBILE MAP SHEET ──────────────────────────────────── */}
      <AnimatePresence>
        {mapSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMapSheetOpen(false)}
              className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[60] h-[70dvh] overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl dark:bg-zinc-900 md:hidden"
            >
              <div className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-zinc-200 dark:bg-white/10" />
              <button 
                onClick={() => setMapSheetOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur dark:bg-black/40"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="h-full pt-10">
                <OsmMap
                  places={filtered}
                  selectedId={selectedId}
                  userLocation={userLoc ?? undefined}
                  onSelect={id => setSelectedId(id)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
