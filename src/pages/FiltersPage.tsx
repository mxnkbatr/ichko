import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Check, Map, Utensils, Beer, Coffee,
  Smile, PartyPopper, Heart, Users, Laptop, Guitar, FlaskConical
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/cn'
import { places as allPlaces, type VibeTag } from '../data/places'
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#F9FAFB] dark:bg-zinc-950"
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-100 bg-white/90 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/90">
        <div className="flex w-20 items-center">
          <button
            onClick={() => nav(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-zinc-50 active:scale-90 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-6 w-6 text-zinc-900 dark:text-white" />
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
        <section className="bg-white px-6 py-8 border-b border-zinc-100 dark:bg-transparent dark:border-white/5">
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
                    "relative flex w-full items-center justify-between rounded-2xl border p-5 transition-all duration-300",
                    active
                      ? "border-orange-500 bg-white shadow-sm ring-1 ring-orange-500 dark:bg-orange-500/5"
                      : "border-zinc-100 bg-zinc-50/50 hover:border-zinc-200 dark:border-white/5 dark:bg-white/2"
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

        {/* ҮНИЙН ТӨВШИН */}
        <section className="bg-white px-6 py-8 border-b border-zinc-100 dark:bg-transparent dark:border-white/5">
          <SectionHeader>ҮНИЙН ТӨВШИН</SectionHeader>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(lvl => {
              const key = `p${lvl}` as 'price1' | 'price2' | 'price3'
              const active = adv[key]
              return (
                <motion.button
                  key={lvl}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAdv({ [key]: !active })}
                  className={cn(
                    "rounded-2xl border py-5 text-center transition-all duration-300",
                    active
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                      : "border-zinc-100 bg-zinc-50/50 hover:border-zinc-200 dark:border-white/5 dark:bg-white/2"
                  )}
                >
                  <span className={cn(
                    "text-[15px] font-bold",
                    active ? "text-orange-600 dark:text-orange-400" : "text-zinc-500 dark:text-zinc-400"
                  )}>
                    {'$'.repeat(lvl)}
                  </span>
                  <div className={cn(
                    "mt-1 text-[10px] font-bold uppercase tracking-wider",
                    active ? "text-orange-500" : "text-zinc-400"
                  )}>
                    {lvl === 1 ? 'Хямд' : lvl === 2 ? 'Дунд' : 'Үнэтэй'}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* VIBE / MOOD */}
        <section className="bg-white px-6 py-8 border-b border-zinc-100 dark:bg-transparent dark:border-white/5">
          <SectionHeader>VIBE / MOOD</SectionHeader>
          <div className="flex flex-wrap gap-3">
            {VIBES.map(v => {
              const active = f.vibes?.includes(v.id)
              return (
                <motion.button
                  key={v.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleVibe(v.id)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-full border px-6 py-3 text-[14px] font-bold transition-all duration-300",
                    active
                      ? "border-orange-500 bg-white text-zinc-950 ring-1 ring-orange-500 dark:bg-orange-500/5 dark:text-white"
                      : "border-zinc-100 bg-zinc-50/50 text-zinc-500 hover:border-zinc-200 dark:border-white/5 dark:bg-white/2 dark:text-zinc-400"
                  )}
                >
                  <v.icon className={cn("h-4 w-4", active ? "text-orange-500" : "text-zinc-400")} />
                  {v.label}
                  {active && (
                    <div className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500">
                      <Check className="h-2.5 w-2.5 text-white stroke-[3px]" />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* ОДОО НЭЭЛТТЭЙ */}
        <section className="bg-white px-6 py-8 border-b border-zinc-100 flex items-center justify-between dark:bg-transparent dark:border-white/5">
          <div>
            <h3 className="text-[14px] font-bold text-zinc-950 dark:text-white">Одоо нээлттэй</h3>
            <p className="text-[12px] text-zinc-400">Зөвхөн одоо ажиллаж байгаа газрууд</p>
          </div>
          <button
            onClick={() => setAdv({ openNow: !adv.openNow })}
            className={cn(
              "relative h-7 w-12 rounded-full p-1 transition-colors duration-200",
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
        <section className="bg-white px-6 py-8 dark:bg-transparent">
          <SectionHeader>МИН. ҮНЭЛГЭЭ</SectionHeader>
          <div className="flex items-center justify-between rounded-2xl bg-zinc-50 p-6 dark:bg-white/2">
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
            <span className="text-[16px] font-black text-zinc-950 dark:text-white">
              {adv.minRating.toFixed(1)}
            </span>
          </div>
        </section>
      </div>

      {/* ── FOOTER CTA ────────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-zinc-100 bg-white/95 p-6 backdrop-blur-2xl safe-area-bottom dark:border-white/5 dark:bg-zinc-950/95 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => nav(-1)}
          className="w-full rounded-2xl bg-orange-500 py-4 text-[16px] font-bold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 active:scale-[0.98]"
        >
          {results.length} газар харах
        </button>
      </footer>
    </motion.div>
  )
}
