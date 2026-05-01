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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#fdfdfd] dark:bg-zinc-950"
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-100 bg-white/80 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/80">
        <button
          onClick={() => nav(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full transition active:scale-90"
        >
          <ArrowLeft className="h-6 w-6 text-zinc-900 dark:text-white" />
        </button>
        
        <h1 className="text-[17px] font-black tracking-tight text-zinc-950 dark:text-white">
          Шүүлтүүр
        </h1>

        <button
          onClick={() => setParams(clearAllFilters(params), { replace: true })}
          className="px-2 text-[14px] font-bold text-orange-500 transition active:opacity-60"
        >
          Цэвэрлэх
        </button>
      </header>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12 pb-40">
        
        {/* ANGIЛАЛ */}
        <section>
          <SectionHeader>АНГИЛАЛ</SectionHeader>
          <div className="space-y-3">
            {CATS.map(c => (
              <button
                key={c.id}
                onClick={() => setParam('cat', c.id === 'all' ? '' : c.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border p-5 transition-all duration-300",
                  f.cat === c.id
                    ? "border-orange-500 bg-white ring-4 ring-orange-500/10 dark:bg-orange-500/5"
                    : "border-zinc-100 bg-white hover:border-zinc-300 dark:border-white/5 dark:bg-transparent"
                )}
              >
                <span className={cn(
                  "flex items-center gap-4 text-[16px]",
                  f.cat === c.id ? "font-black text-orange-600" : "font-bold text-zinc-700 dark:text-zinc-300"
                )}>
                  <c.icon className={cn("h-6 w-6", f.cat === c.id ? "text-orange-500" : "text-zinc-400")} />
                  {c.label}
                </span>
                {f.cat === c.id && <Check className="h-6 w-6 text-orange-500" />}
              </button>
            ))}
          </div>
        </section>

        {/* ҮНИЙН ТӨВШИН */}
        <section>
          <SectionHeader>ҮНИЙН ТӨВШИН</SectionHeader>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(lvl => {
              const key = `p${lvl}` as 'price1' | 'price2' | 'price3'
              const active = adv[key]
              return (
                <button
                  key={lvl}
                  onClick={() => setAdv({ [key]: !active })}
                  className={cn(
                    "rounded-[2rem] border py-5 text-center transition-all duration-300",
                    active
                      ? "border-orange-500 bg-white ring-4 ring-orange-500/10 dark:bg-orange-500/5"
                      : "border-zinc-100 bg-white hover:border-zinc-200 dark:border-white/5 dark:bg-transparent"
                  )}
                >
                  <span className={cn(
                    "text-[16px] font-black",
                    active ? "text-orange-600 dark:text-orange-400" : "text-zinc-600 dark:text-zinc-400"
                  )}>
                    {'$'.repeat(lvl)}
                  </span>
                  <div className={cn(
                    "mt-1 text-[11px] font-bold uppercase tracking-wider",
                    active ? "text-orange-500" : "text-zinc-400"
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
          <div className="flex flex-wrap gap-3">
            {VIBES.map(v => {
              const active = f.vibes?.includes(v.id)
              return (
                <button
                  key={v.id}
                  onClick={() => toggleVibe(v.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-full border px-6 py-3 text-[14px] font-bold transition-all duration-300",
                    active
                      ? "border-orange-500 bg-white text-orange-600 ring-4 ring-orange-500/10 dark:bg-orange-500/5"
                      : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-200 dark:border-white/10 dark:bg-transparent dark:text-zinc-400"
                  )}
                >
                  <v.icon className={cn("h-4 w-4", active ? "text-orange-500" : "text-zinc-400")} />
                  {v.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* ОДОО НЭЭЛТТЭЙ */}
        <section className="flex items-center justify-between border-t border-zinc-50 pt-10 dark:border-white/5">
          <h3 className="text-[14px] font-black text-zinc-900 dark:text-white">Одоо нээлттэй</h3>
          <button
            onClick={() => setAdv({ openNow: !adv.openNow })}
            className={cn(
              "relative h-8 w-14 rounded-full p-1 transition-colors duration-200",
              adv.openNow ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-800"
            )}
          >
            <motion.div
              layout
              className="h-6 w-6 rounded-full bg-white shadow-md"
              animate={{ x: adv.openNow ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </section>

        {/* МИН. ҮНЭЛГЭЭ */}
        <section>
          <SectionHeader>МИН. ҮНЭЛГЭЭ</SectionHeader>
          <div className="flex items-center justify-between rounded-3xl bg-zinc-50 p-6 dark:bg-white/5">
            <div className="flex gap-2 text-[28px]">
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

      {/* ── FOOTER CTA ────────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-zinc-100 bg-white/95 p-6 backdrop-blur-2xl safe-area-bottom dark:border-white/5 dark:bg-zinc-950/95">
        <button
          onClick={() => nav(-1)}
          className="w-full rounded-[2rem] bg-orange-500 py-5 text-[16px] font-black text-white shadow-2xl shadow-orange-500/40 transition hover:bg-orange-600 active:scale-[0.98]"
        >
          {results.length} газар харах
        </button>
      </footer>
    </motion.div>
  )
}
