import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  X, Check,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/cn'
import { places as allPlaces, type UbDistrict, type VibeTag } from '../data/places'
import { applyFilters, clearAllFilters, parseFilterState, writeAdvancedToParams } from '../lib/filters'

const CATS = [
  { id: 'all' as const, emoji: '🗺️', label: 'Бүгд' },
  { id: 'restaurant' as const, emoji: '🍽️', label: 'Ресторан' },
  { id: 'pub' as const, emoji: '🍺', label: 'Паб' },
  { id: 'cafe' as const, emoji: '☕', label: 'Кафе' },
]

const VIBES: { id: VibeTag; emoji: string; label: string }[] = [
  { id: 'chill', emoji: '😌', label: 'Chill' },
  { id: 'party', emoji: '🎉', label: 'Party' },
  { id: 'romantic', emoji: '❤️', label: 'Romantic' },
  { id: 'family', emoji: '👨‍👩‍👧', label: 'Family' },
  { id: 'work', emoji: '💻', label: 'Work' },
  { id: 'music', emoji: '🎸', label: 'Music' },
  { id: 'craft', emoji: '🍶', label: 'Craft' },
]

const DISTRICTS: { id: UbDistrict; label: string }[] = [
  { id: 'СБД', label: 'СБД' },
  { id: 'БГД', label: 'БГД' },
  { id: 'СХД', label: 'СХД' },
]

// ── Components ─────────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">
      {children}
    </h3>
  )
}

export function FiltersPage() {
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()

  const f = parseFilterState(params)
  const results = applyFilters(allPlaces, f)
  const adv = {
    openNow: f.openNow,
    minRating: f.minRating,
    maxDistanceKm: f.maxDistanceKm,
    price1: f.price1,
    price2: f.price2,
    price3: f.price3,
    sort: f.sort
  }

  const setParam = (key: string, value?: string) => {
    const n = new URLSearchParams(params)
    if (!value) n.delete(key); else n.set(key, value)
    setParams(n, { replace: true })
  }

  const setAdv = (next: Partial<typeof adv>) =>
    setParams(writeAdvancedToParams(params, { ...f, ...next }), { replace: true })

  const toggleVibe = (v: VibeTag) => {
    const n = new URLSearchParams(params)
    const cur = (n.get('v') ?? '').split(',').map(s => s.trim()).filter(Boolean) as VibeTag[]
    const next = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]
    if (next.length) n.set('v', next.join(',')); else n.delete('v')
    setParams(n, { replace: true })
  }

  const setDistrict = (d: UbDistrict) => {
    const n = new URLSearchParams(params)
    if (n.get('dist') === d) { n.delete('dist'); n.delete('city') }
    else { n.set('dist', d); n.set('city', 'Улаанбаатар') }
    setParams(n, { replace: true })
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => nav(-1)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-zinc-950"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-white/5">
          <h2 className="text-[18px] font-black tracking-tight text-zinc-900 dark:text-white">Шүүлтүүр</h2>
          <button
            onClick={() => nav(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32">

          {/* ANGIЛАЛ (Category) */}
          <section>
            <SectionHeader>АНГИЛАЛ</SectionHeader>
            <div className="space-y-2">
              {CATS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setParam('cat', c.id === 'all' ? '' : c.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border p-4 transition-all",
                    f.cat === c.id
                      ? "border-orange-500 bg-orange-50/50 dark:bg-orange-500/10"
                      : "border-zinc-100 bg-white hover:border-zinc-300 dark:border-white/5 dark:bg-transparent"
                  )}
                >
                  <span className="flex items-center gap-3 text-[15px] font-bold">
                    <span className="text-[18px]">{c.emoji}</span>
                    {c.label}
                  </span>
                  {f.cat === c.id && <Check className="h-5 w-5 text-orange-500" />}
                </button>
              ))}
            </div>
          </section>

          {/* ҮНИЙН ТӨВШИН (Price) */}
          <section>
            <SectionHeader>ҮНИЙН ТӨВШИН</SectionHeader>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(lvl => {
                const key = `p${lvl}` as 'price1' | 'price2' | 'price3'
                const active = adv[key]
                return (
                  <button
                    key={lvl}
                    onClick={() => setAdv({ [key]: !active })}
                    className={cn(
                      "rounded-2xl border py-3 text-center text-[13px] font-bold transition-all",
                      active
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-zinc-100 text-zinc-500 hover:border-zinc-300 dark:border-white/10 dark:text-zinc-400"
                    )}
                  >
                    {'$'.repeat(lvl)}
                    <div className="mt-0.5 text-[10px] font-medium opacity-60">
                      {lvl === 1 ? 'Хямд' : lvl === 2 ? 'Дунд' : 'Үнэтэй'}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* VIBE / MOOD */}
          <section>
            <SectionHeader>VIBE / MOOD</SectionHeader>
            <div className="flex flex-wrap gap-2">
              {VIBES.map(v => (
                <button
                  key={v.id}
                  onClick={() => toggleVibe(v.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all",
                    f.vibes?.includes(v.id)
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-200 dark:border-white/10 dark:bg-transparent dark:text-zinc-400"
                  )}
                >
                  <span>{v.emoji}</span>
                  {v.label}
                </button>
              ))}
            </div>
          </section>

          {/* ОДОО НЭЭЛТТЭЙ (Open Now) */}
          <section className="flex items-center justify-between">
            <SectionHeader>ОДОО НЭЭЛТТЭЙ</SectionHeader>
            <button
              onClick={() => setAdv({ openNow: !adv.openNow })}
              className={cn(
                "relative h-7 w-12 rounded-full p-1 transition-colors duration-200",
                adv.openNow ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-800"
              )}
            >
              <motion.div
                layout
                className="h-5 w-5 rounded-full bg-white shadow-sm"
                animate={{ x: adv.openNow ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </section>

          {/* МИН. ҮНЭЛГЭЭ (Rating) */}
          <section>
            <SectionHeader>МИН. ҮНЭЛГЭЭ</SectionHeader>
            <div className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
              <div className="flex gap-1 text-[24px]">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setAdv({ minRating: star })}
                    className={cn(
                      "transition-colors",
                      star <= adv.minRating ? "text-orange-500" : "text-zinc-200 dark:text-zinc-700"
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="text-[15px] font-black text-zinc-900 dark:text-white">
                {adv.minRating.toFixed(1)}
              </span>
            </div>
          </section>

          {/* ДҮҮРЭГ (Districts) */}
          <section>
            <SectionHeader>ДҮҮРЭГ</SectionHeader>
            <div className="grid grid-cols-3 gap-2">
              {DISTRICTS.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDistrict(d.id)}
                  className={cn(
                    "rounded-xl border py-3 text-[13px] font-bold transition-all",
                    f.district === d.id
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-zinc-100 text-zinc-500 hover:border-zinc-300 dark:border-white/10 dark:text-zinc-400"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-100 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-950/80">
          <div className="flex gap-4">
            <button
              onClick={() => setParams(clearAllFilters(params), { replace: true })}
              className="px-4 text-[14px] font-bold text-zinc-400 transition hover:text-zinc-950 dark:hover:text-white"
            >
              Цэвэрлэх
            </button>
            <button
              onClick={() => nav(-1)}
              className="flex-1 rounded-full bg-orange-500 py-4 text-[15px] font-black text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-600 active:scale-95"
            >
              {results.length} газар харах
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  )
}
