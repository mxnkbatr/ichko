import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  X, Check, Map, Utensils, Beer, Coffee,
  Smile, PartyPopper, Heart, Users, Laptop, Guitar, FlaskConical
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/cn'
import { places as allPlaces, type UbDistrict, type VibeTag } from '../data/places'
import { applyFilters, clearAllFilters, parseFilterState, writeAdvancedToParams } from '../lib/filters'

const CATS = [
  { id: 'all' as const, icon: Map, label: 'Бүгд' },
  { id: 'restaurant' as const, icon: Utensils, label: 'Ресторан' },
  { id: 'pub' as const, icon: Beer, label: 'Паб' },
  { id: 'cafe' as const, icon: Coffee, label: 'Кафе' },
]

const VIBES: { id: VibeTag; icon: any; label: string }[] = [
  { id: 'chill', icon: Smile, label: 'Chill' },
  { id: 'party', icon: PartyPopper, label: 'Party' },
  { id: 'romantic', icon: Heart, label: 'Romantic' },
  { id: 'family', icon: Users, label: 'Family' },
  { id: 'work', icon: Laptop, label: 'Work' },
  { id: 'music', icon: Guitar, label: 'Music' },
  { id: 'craft', icon: FlaskConical, label: 'Craft' },
]

const DISTRICTS: { id: UbDistrict; label: string }[] = [
  { id: 'СБД', label: 'СБД' },
  { id: 'БГД', label: 'БГД' },
  { id: 'СХД', label: 'СХД' },
]

// ── Components ─────────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
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
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-6 dark:border-white/5">
          <h2 className="text-[20px] font-black tracking-tight text-zinc-950 dark:text-white">Шүүлтүүр</h2>
          <button
            onClick={() => nav(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-500"
          >
            <X className="h-4 w-4" />
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
                  <span className={cn(
                    "flex items-center gap-3 text-[15px]",
                    f.cat === c.id ? "font-black text-orange-600" : "font-bold text-zinc-700 dark:text-zinc-300"
                  )}>
                    <c.icon className={cn("h-5 w-5", f.cat === c.id ? "text-orange-500" : "text-zinc-400")} />
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
                      "rounded-2xl border py-4 text-center transition-all duration-300",
                      active
                        ? "border-orange-500 bg-orange-50/50 dark:bg-orange-500/10"
                        : "border-zinc-100 bg-white hover:border-zinc-200 dark:border-white/5 dark:bg-transparent"
                    )}
                  >
                    <span className={cn(
                      "text-[14px] font-black",
                      active ? "text-orange-600 dark:text-orange-400" : "text-[#4B5563] dark:text-zinc-400"
                    )}>
                      {'$'.repeat(lvl)}
                    </span>
                    <div className={cn(
                      "mt-0.5 text-[10px] font-bold uppercase tracking-wider",
                      active ? "text-orange-500/70" : "text-zinc-400"
                    )}>
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
                    "flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-bold transition-all duration-300",
                    f.vibes?.includes(v.id)
                      ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-200 dark:border-white/10 dark:bg-transparent dark:text-zinc-400"
                  )}
                >
                  <v.icon className={cn("h-3.5 w-3.5", f.vibes?.includes(v.id) ? "text-white" : "text-zinc-400")} />
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
              className="px-4 text-[14px] font-bold text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              Цэвэрлэх
            </button>
            <button
              onClick={() => nav(-1)}
              className="flex-1 rounded-full bg-orange-500 py-4 text-[15px] font-black text-white shadow-2xl shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.98]"
            >
              {results.length} газар харах
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  )
}
