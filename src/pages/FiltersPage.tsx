import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowUpDown, BookOpen, ChevronDown, ChevronUp,
  Eraser, LayoutGrid, MapPin, Navigation, SearchX,
  SlidersHorizontal, Sparkles, Star, Wallet, X,
} from 'lucide-react'
import { PlaceCard } from '../components/PlaceCard'
import { cn } from '../lib/cn'
import {
  places as allPlaces,
  type PlaceCategory,
  type UbDistrict,
  type VibeTag,
} from '../data/places'
import {
  applyFilters,
  clearAllFilters,
  parseFilterState,
  writeAdvancedToParams,
} from '../lib/filters'
import { DEFAULT_FILTERS } from '../components/AdvancedFiltersPanel'
import { useI18n } from '../lib/i18n'

type SortMode = 'distance' | 'rating'

const CATS: { id: 'all' | PlaceCategory; emoji: string; key: string }[] = [
  { id: 'all', emoji: '🗺️', key: 'category_all' },
  { id: 'restaurant', emoji: '🍽️', key: 'category_restaurant' },
  { id: 'pub', emoji: '🍺', key: 'category_pub' },
  { id: 'cafe', emoji: '☕', key: 'category_cafe' },
]

const VIBES: { id: VibeTag; emoji: string; key: string }[] = [
  { id: 'chill', emoji: '😌', key: 'vibe_chill' },
  { id: 'party', emoji: '🎉', key: 'vibe_party' },
  { id: 'romantic', emoji: '❤️', key: 'vibe_romantic' },
  { id: 'family', emoji: '👨‍👩‍👧', key: 'vibe_family' },
  { id: 'work', emoji: '💻', key: 'vibe_work' },
  { id: 'music', emoji: '🎸', key: 'vibe_music' },
  { id: 'craft', emoji: '🍶', key: 'vibe_craft' },
]

const DISTRICTS: { id: UbDistrict; label: string }[] = [
  { id: 'СБД', label: 'СБД' },
  { id: 'БГД', label: 'БГД' },
  { id: 'СХД', label: 'СХД' },
]

function PillBtn({
  active, onClick, children, className,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-2xl px-3 py-2 text-[13px] font-semibold transition-all duration-150',
        active
          ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
          : 'bg-zinc-100/80 text-zinc-700 hover:bg-zinc-200 dark:bg-white/8 dark:text-zinc-200 dark:hover:bg-white/12',
        className,
      )}
    >
      {children}
    </button>
  )
}

function Chip({
  children, onRemove, variant = 'default',
}: {
  children: React.ReactNode
  onRemove: () => void
  variant?: 'default' | 'green'
}) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold transition',
      variant === 'green'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
        : 'border-brand-200/70 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200',
    )}>
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 opacity-60 transition hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-[13px] font-semibold transition-all',
        checked
          ? 'border-brand-400/30 bg-brand-500/10 text-brand-700 dark:text-brand-200'
          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/4 dark:text-zinc-200',
      )}
    >
      {label}
      <span className={cn('flex h-5 w-9 items-center rounded-full p-0.5 transition-colors', checked ? 'bg-brand-500' : 'bg-zinc-300 dark:bg-white/20')}>
        <span className={cn('h-4 w-4 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-4' : 'translate-x-0')} />
      </span>
    </button>
  )
}

function SliderRow({ label, icon: Icon, min, max, step, value, display, onChange }: {
  label: string; icon: React.ElementType; min: number; max: number; step: number
  value: number; display: string; onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-200">
          <Icon className="h-3.5 w-3.5 text-zinc-400" />{label}
        </div>
        <span className="rounded-lg bg-brand-500/10 px-2 py-0.5 font-bold text-brand-700 dark:text-brand-200">{display}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-zinc-200 dark:bg-white/10">
        <div className="absolute left-0 h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-400">{/* labels */}
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  )
}

// ── Filter Panel (reused in sidebar + mobile drawer) ──────────────────────────
function FilterPanel({ params, setParams, t }: {
  params: URLSearchParams
  setParams: (p: URLSearchParams, opts?: { replace?: boolean }) => void
  t: (k: string) => string
}) {
  const f = parseFilterState(params)
  const vibes = f.vibes ?? []
  const district = (f.district ?? '') as UbDistrict | ''

  const adv = {
    openNow: f.openNow, minRating: f.minRating, maxDistanceKm: f.maxDistanceKm,
    price1: f.price1, price2: f.price2, price3: f.price3, sort: f.sort as SortMode,
  }

  const set = (key: string, value?: string) => {
    const n = new URLSearchParams(params)
    if (!value) n.delete(key); else n.set(key, value)
    setParams(n, { replace: true })
  }

  const setAdv = (next: typeof adv) =>
    setParams(writeAdvancedToParams(params, { ...f, ...next }), { replace: true })

  const setDistrict = (d: UbDistrict | '') => {
    const n = new URLSearchParams(params)
    if (!d) { n.delete('dist'); n.delete('city') } else { n.set('dist', d); n.set('city', 'Улаанбаатар') }
    setParams(n, { replace: true })
  }

  const toggleVibe = (v: VibeTag) => {
    const n = new URLSearchParams(params)
    const cur = (n.get('v') ?? '').split(',').map(s => s.trim()).filter(Boolean) as VibeTag[]
    const updated = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]
    if (updated.length) n.set('v', updated.join(',')); else n.delete('v')
    setParams(n, { replace: true })
  }

  return (
    <div className="space-y-7">
      {/* Category */}
      <section>
        <h4 className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500">
          <LayoutGrid className="h-3 w-3" /> {t('filter_category')}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {CATS.map(c => (
            <PillBtn key={c.id} active={c.id === f.cat}
              onClick={() => set('cat', c.id === 'all' ? '' : c.id)}
              className="py-2.5"
            >
              <span className="mr-1.5">{c.emoji}</span> {t(c.key as any)}
            </PillBtn>
          ))}
        </div>
      </section>

      {/* District */}
      <section>
        <h4 className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500">
          <MapPin className="h-3 w-3" /> Байршил
        </h4>
        <div className="flex flex-wrap gap-2">
          <PillBtn active={!district} onClick={() => setDistrict('')} className="px-4">🏙️ Бүгд</PillBtn>
          {DISTRICTS.map(d => (
            <PillBtn key={d.id} active={district === d.id}
              onClick={() => setDistrict(district === d.id ? '' : d.id)}
              className="px-4"
            >
              {d.label}
            </PillBtn>
          ))}
        </div>
      </section>

      {/* Vibe */}
      <section>
        <h4 className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500">
          <Sparkles className="h-3 w-3" /> Mood / Vibe
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {VIBES.map(v => (
            <PillBtn key={v.id} active={vibes.includes(v.id)} onClick={() => toggleVibe(v.id)} className="py-2.5">
              <span className="mr-1.5">{v.emoji}</span> {t(v.key as any)}
            </PillBtn>
          ))}
        </div>
      </section>

      {/* Toggles & Sliders */}
      <div className="space-y-6 pt-2">
        <Toggle checked={adv.openNow} onChange={v => setAdv({ ...adv, openNow: v })} label="🟢 Одоо нээлттэй" />

        <div className="space-y-5 rounded-3xl bg-zinc-50/50 p-4 dark:bg-white/4">
          <SliderRow label="Мин. үнэлгээ" icon={Star} min={0} max={5} step={0.1}
            value={adv.minRating} display={`${adv.minRating.toFixed(1)}⭐`}
            onChange={v => setAdv({ ...adv, minRating: v })} />

          <SliderRow label="Хамгийн их зай" icon={Navigation} min={1} max={25} step={1}
            value={adv.maxDistanceKm} display={`${adv.maxDistanceKm}км`}
            onChange={v => setAdv({ ...adv, maxDistanceKm: v })} />
        </div>
      </div>

      {/* Price */}
      <section>
        <h4 className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500">
          <Wallet className="h-3 w-3" /> Үнийн түвшин
        </h4>
        <div className="flex gap-2">
          {[
            { key: 'price1' as const, label: '$' },
            { key: 'price2' as const, label: '$$' },
            { key: 'price3' as const, label: '$$$' },
          ].map(p => (
            <PillBtn key={p.key} active={adv[p.key]} className="flex-1 py-2.5 text-center"
              onClick={() => setAdv({ ...adv, [p.key]: !adv[p.key] })}>
              {p.label}
            </PillBtn>
          ))}
        </div>
      </section>

      {/* Sort */}
      <section>
        <h4 className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500">
          <ArrowUpDown className="h-3 w-3" /> Эрэмбэ
        </h4>
        <div className="flex gap-2">
          <PillBtn active={adv.sort === 'distance'} className="flex-1 py-2.5"
            onClick={() => setAdv({ ...adv, sort: 'distance' })}>📍 Зай</PillBtn>
          <PillBtn active={adv.sort === 'rating'} className="flex-1 py-2.5"
            onClick={() => setAdv({ ...adv, sort: 'rating' })}>⭐ Үнэлгээ</PillBtn>
        </div>
      </section>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function FiltersPage() {
  const [params, setParams] = useSearchParams()
  const { t } = useI18n()
  const nav = useNavigate()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const f = parseFilterState(params)
  const results = applyFilters(allPlaces, f)

  const hasAnyFilters =
    f.cat !== 'all' || Boolean(f.q.trim()) || f.openNow || f.minRating > 0 ||
    f.maxDistanceKm !== DEFAULT_FILTERS.maxDistanceKm || !f.price1 || !f.price2 ||
    !f.price3 || f.sort !== 'distance' || Boolean(f.district) || Boolean(f.city) ||
    (f.vibes?.length ?? 0) > 0

  const counts = results.reduce(
    (acc, p) => { acc[p.category] = (acc[p.category] ?? 0) + 1; return acc },
    {} as Record<PlaceCategory, number>,
  )

  return (
    <div className="min-h-screen">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-[64px] z-20 -mx-4 mb-4 border-b border-zinc-200/60 bg-white/75 px-4 py-3 backdrop-blur-2xl dark:border-white/8 dark:bg-black/25 md:top-[72px]">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/?${params.toString()}`}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-zinc-100/80 px-3 py-2 text-[13px] font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" /> {t('nav_explore')}
          </Link>

          <div className="text-center">
            <div className="text-[15px] font-bold text-zinc-900 dark:text-zinc-50">{t('filter_wizard_title')}</div>
            <div className="text-[11px] text-zinc-400">
              {results.length} газар · 🍽️{counts.restaurant ?? 0} 🍺{counts.pub ?? 0} ☕{counts.cafe ?? 0}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasAnyFilters && (
              <button
                type="button"
                onClick={() => setParams(clearAllFilters(params), { replace: true })}
                className="inline-flex items-center gap-1 rounded-2xl bg-zinc-100/80 px-3 py-2 text-[13px] font-semibold text-zinc-600 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-200"
              >
                <Eraser className="h-4 w-4" />
                <span className="hidden sm:inline">{t('common_clear_all')}</span>
              </button>
            )}
            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(o => !o)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-[13px] font-semibold transition md:hidden',
                mobileFiltersOpen
                  ? 'bg-brand-500 text-white'
                  : 'bg-zinc-100/80 text-zinc-700 dark:bg-white/10 dark:text-zinc-200',
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('nav_filters')}
              {mobileFiltersOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="mt-3 rounded-3xl border border-zinc-200/60 bg-white/80 p-4 backdrop-blur-xl dark:border-white/8 dark:bg-black/30 md:hidden">
            <FilterPanel params={params} setParams={setParams} t={t} />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full rounded-2xl bg-brand-500 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-brand-500/25"
            >
              {t('common_apply')} · {results.length} газар харах
            </button>
          </div>
        )}
      </div>

      {/* ── 2-column layout ──────────────────────────────────────────── */}
      <div className="flex gap-6">

        {/* Left: Sticky filter sidebar (desktop only) */}
        <aside className="hidden w-72 shrink-0 md:block">
          <div className="sticky top-[130px] overflow-hidden rounded-[2.5rem] border border-zinc-200/50 bg-white/60 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-white/2">
            <div className="border-b border-zinc-100/50 bg-zinc-50/50 px-6 py-5 dark:border-white/5 dark:bg-white/2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-black tracking-tight text-zinc-950 dark:text-zinc-50">Шүүлтүүр</h3>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Тохиргоо</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <FilterPanel params={params} setParams={setParams} t={t} />
            </div>
          </div>
        </aside>

        {/* Right: Results */}
        <main className="min-w-0 flex-1">
          {/* Active filter chips */}
          {hasAnyFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {f.cat !== 'all' && (
                <Chip onRemove={() => { const n = new URLSearchParams(params); n.delete('cat'); setParams(n, { replace: true }) }}>
                  {f.cat === 'restaurant' ? '🍽️' : f.cat === 'pub' ? '🍺' : '☕'} {t(`category_${f.cat}` as any)}
                </Chip>
              )}
              {f.district && (
                <Chip onRemove={() => { const n = new URLSearchParams(params); n.delete('dist'); n.delete('city'); setParams(n, { replace: true }) }}>
                  📍 {f.district}
                </Chip>
              )}
              {(f.vibes ?? []).map(v => (
                <Chip key={v} onRemove={() => {
                  const n = new URLSearchParams(params)
                  const cur = (n.get('v') ?? '').split(',').filter(x => x.trim() && x.trim() !== v)
                  if (cur.length) n.set('v', cur.join(',')); else n.delete('v')
                  setParams(n, { replace: true })
                }}>
                  {VIBES.find(x => x.id === v)?.emoji} {t(`vibe_${v}` as any)}
                </Chip>
              ))}
              {f.openNow && (
                <Chip onRemove={() => { const n = new URLSearchParams(params); n.delete('open'); setParams(n, { replace: true }) }} variant="green">
                  🟢 Нээлттэй
                </Chip>
              )}
              <button
                type="button"
                onClick={() => setParams(clearAllFilters(params), { replace: true })}
                className="ml-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400 transition hover:text-brand-500"
              >
                Бүгдийг арилгах
              </button>
            </div>
          )}

          {/* Clean Header Bar */}
          <div className="mb-6 flex items-end justify-between px-1">
            <div>
              <h2 className="text-[24px] font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                Илэрцүүд
              </h2>
              <p className="mt-0.5 text-[13px] font-medium text-zinc-400">
                Таны шүүлтүүрт {results.length} газар тохирлоо
              </p>
            </div>
            <div className="flex gap-3 text-[11px] font-bold text-zinc-400">
              <span className="flex items-center gap-1">🍽️ {counts.restaurant ?? 0}</span>
              <span className="flex items-center gap-1">🍺 {counts.pub ?? 0}</span>
              <span className="flex items-center gap-1">☕ {counts.cafe ?? 0}</span>
            </div>
          </div>

          {/* Results Grid / List */}
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-[3rem] border border-zinc-200/50 bg-white/40 py-24 text-center backdrop-blur-xl dark:border-white/5 dark:bg-white/2">
              <div className="relative">
                <SearchX className="h-12 w-12 text-zinc-200 dark:text-zinc-700" />
                <div className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-orange-400/20" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-zinc-600 dark:text-zinc-400">Илэрц олдсонгүй</h3>
                <p className="mt-1 text-[13px] text-zinc-400">Шүүлтүүрээ бага зэрэг суллаад үзэх үү?</p>
              </div>
              <button
                type="button"
                onClick={() => setParams(clearAllFilters(params), { replace: true })}
                className="mt-2 rounded-full bg-zinc-900 px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-orange-500 dark:bg-white dark:text-zinc-900"
              >
                Шүүлтүүр арилгах
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(place => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}

          {/* Premium CTA */}
          {results.length > 0 && (
            <div className="mt-10 overflow-hidden rounded-[3rem] bg-zinc-900 p-8 dark:bg-orange-500/10">
              <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="text-center md:text-left">
                  <h3 className="text-[20px] font-black text-white">Хайж буй газраа олсон уу?</h3>
                  <p className="mt-1 text-[14px] font-medium text-zinc-400 dark:text-orange-200/60">
                    Газар дээр дарж цэс болон ширээний мэдээллийг хараарай.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => results[0] && nav(`/place/${results[0].id}`)}
                  className="flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3 text-[14px] font-black text-white shadow-xl shadow-orange-500/25 transition hover:scale-105 active:scale-95"
                >
                  <BookOpen className="h-4 w-4" />
                  Эхний газрыг үзэх
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
