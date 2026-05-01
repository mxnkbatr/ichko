import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ChevronLeft, Check, Map, Utensils, Beer, Coffee,
  Smile, PartyPopper, Heart, Users, Laptop, Guitar, FlaskConical
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/cn'
import { places as allPlaces, type VibeTag } from '../data/places'
import { applyFilters, clearAllFilters, parseFilterState, writeAdvancedToParams } from '../lib/filters'
import { useMemo } from 'react'

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

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
      {children}
    </h3>
  )
}

export function FiltersPage() {
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()

  const f = parseFilterState(params)
  
  const resultsCount = useMemo(() => {
    return applyFilters(allPlaces, f).length
  }, [f])

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col items-center bg-white dark:bg-zinc-950"
    >
      <div className="w-full max-w-2xl flex-1 flex flex-col relative h-full border-x border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-950">
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-100 bg-white/90 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/90">
        <div className="flex w-20 items-center">
          <button
            onClick={() => nav(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition active:scale-90"
          >
            <ChevronLeft className="h-6 w-6 text-zinc-900 dark:text-white" />
          </button>
        </div>
        
        <h1 className="text-[17px] font-bold tracking-tight text-zinc-950 dark:text-white">
          Шүүлтүүр
        </h1>

        <div className="flex w-20 justify-end">
          <button
            onClick={() => setParams(clearAllFilters(params), { replace: true })}
            className="px-2 text-[14px] font-bold text-zinc-400 transition hover:text-zinc-900 active:opacity-60 dark:hover:text-zinc-200"
          >
            Цэвэрлэх
          </button>
        </div>
      </header>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-40">
        
        {/* ANGIЛАЛ */}
        <section className="px-6 py-8 border-b border-zinc-100 dark:border-white/5">
          <SectionHeader>АНГИЛАЛ</SectionHeader>
          <div className="space-y-3">
            {CATS.map(c => {
              const active = f.cat === c.id || (c.id === 'all' && !f.cat)
              return (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setParam('cat', c.id === 'all' ? '' : c.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border p-4 transition-all duration-300",
                    active
                      ? "border-orange-500 bg-orange-50/30 dark:bg-orange-500/10 ring-1 ring-orange-500"
                      : "border-zinc-100 bg-white hover:border-zinc-200 dark:bg-white/5 dark:border-white/10"
                  )}
                >
                  <span className={cn(
                    "flex items-center gap-4 text-[15px]",
                    active ? "font-bold text-zinc-950 dark:text-white" : "font-semibold text-zinc-500 dark:text-zinc-400"
                  )}>
                    <c.icon className={cn("h-5 w-5", active ? "text-orange-500" : "text-zinc-400")} />
                    {c.label}
                  </span>
                  {active && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                      <Check className="h-3 w-3 text-white stroke-[3px]" />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* ҮНИЙН ТӨВШИН - Segmented Control */}
        <section className="px-6 py-8 border-b border-zinc-100 dark:border-white/5">
          <SectionHeader>ҮНИЙН ТӨВШИН</SectionHeader>
          <div className="flex h-12 rounded-2xl bg-zinc-100 p-1 dark:bg-white/5">
            {[1, 2, 3].map(lvl => {
              const key = `p${lvl}` as 'price1' | 'price2' | 'price3'
              const active = adv[key]
              return (
                <button
                  key={lvl}
                  onClick={() => setAdv({ [key]: !active })}
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-[14px] text-[15px] font-bold transition-all",
                    active
                      ? "bg-white text-orange-600 shadow-sm dark:bg-zinc-800 dark:text-orange-400"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  )}
                >
                  {'$'.repeat(lvl)}
                </button>
              )
            })}
          </div>
        </section>

        {/* VIBE / MOOD - Chips */}
        <section className="px-6 py-8 border-b border-zinc-100 dark:border-white/5">
          <SectionHeader>VIBE / MOOD</SectionHeader>
          <div className="flex flex-wrap gap-2.5">
            {VIBES.map(v => {
              const active = f.vibes?.includes(v.id)
              return (
                <motion.button
                  key={v.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleVibe(v.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-bold transition-all",
                    active
                      ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200 dark:bg-white/5 dark:border-white/10 dark:text-zinc-400"
                  )}
                >
                  <v.icon className={cn("h-4 w-4", active ? "text-white" : "text-zinc-400")} />
                  {v.label}
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* ОДОО НЭЭЛТТЭЙ */}
        <section className="px-6 py-8 border-b border-zinc-100 flex items-center justify-between dark:border-white/5">
          <div>
            <h3 className="text-[15px] font-bold text-zinc-950 dark:text-white">Одоо нээлттэй</h3>
            <p className="text-[12px] text-zinc-400 mt-0.5 font-medium">Зөвхөн одоо ажиллаж байгаа газрууд</p>
          </div>
          <button
            onClick={() => setAdv({ openNow: !adv.openNow })}
            className={cn(
              "relative h-7 w-12 rounded-full p-1 transition-colors duration-300",
              adv.openNow ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-800"
            )}
          >
            <motion.div
              layout
              className="h-5 w-5 rounded-full bg-white shadow-md"
              animate={{ x: adv.openNow ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </section>

        {/* МИН. ҮНЭЛГЭЭ */}
        <section className="px-6 py-8">
          <SectionHeader>МИН. ҮНЭЛГЭЭ</SectionHeader>
          <div className="flex items-center justify-between rounded-[2rem] bg-zinc-50 p-6 dark:bg-white/2">
            <div className="flex gap-2 text-[26px]">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setAdv({ minRating: star })}
                  className={cn(
                    "transition-all active:scale-125",
                    star <= adv.minRating ? "text-orange-500" : "text-zinc-200 dark:text-zinc-700"
                  )}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="text-[18px] font-black text-zinc-950 dark:text-white">
              {adv.minRating.toFixed(1)}
            </span>
          </div>
        </section>
      </div>

      {/* ── STICKY FOOTER ACTION ──────────────────────────────── */}
      <footer className="absolute bottom-0 left-0 right-0 border-t border-zinc-100 bg-white/90 p-6 backdrop-blur-2xl safe-area-bottom dark:border-white/5 dark:bg-zinc-950/90 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.06)]">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => nav(-1)}
          className="relative flex h-[60px] w-full items-center justify-center overflow-hidden rounded-2xl bg-orange-500 text-[16px] font-black text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-600"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={resultsCount}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              {resultsCount} газар харах
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </footer>
      </div>
    </motion.div>
  )
}
