import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Moon, Bookmark, CalendarCheck,
  SlidersHorizontal, Sun, User, Search, MapPin,
  Compass,
} from 'lucide-react'
import { cn } from '../lib/cn'
import { applyTheme, getStoredTheme, type ThemeMode } from '../lib/theme'
import { useEffect, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav_explore', icon: Compass },
  { to: '/filters', labelKey: 'nav_filters', icon: SlidersHorizontal },
  { to: '/bookings', labelKey: 'nav_bookings', icon: CalendarCheck },
  { to: '/favorites', labelKey: 'nav_favorites', icon: Bookmark },
  { to: '/me', labelKey: 'nav_me', icon: User },
] as const

import { CATEGORIES } from '../data/places'

export function AppLayout() {
  const nav = useNavigate()
  const loc = useLocation()
  const [params, setParams] = useSearchParams()
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme() ?? 'light')
  const { lang, setLang, t } = useI18n()

  // Geolocation state simulation (usually this would be in a context)
  const [hasLocation, setHasLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState(params.get('q') ?? '')

  useEffect(() => {
    // Check if geolocation was already granted or simulate
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(res => {
        if (res.state === 'granted') setHasLocation(true)
      })
    }
  }, [])

  const currentCat = params.get('cat') || 'all'

  const active = (to: string) =>
    to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(to)


  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const next = new URLSearchParams(params)
    if (searchQuery.trim()) next.set('q', searchQuery.trim())
    else next.delete('q')
    setParams(next, { replace: true })
    if (loc.pathname !== '/' && loc.pathname !== '/filters') {
      nav(`/?${next.toString()}`)
    }
  }

  const setCategory = (id: string) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('cat')
    else next.set('cat', id)
    setParams(next, { replace: true })
    if (loc.pathname !== '/' && loc.pathname !== '/filters') {
      nav(`/?${next.toString()}`)
    }
  }

  return (
    <div className="min-h-svh bg-[#f8f7f5] font-sans text-zinc-900 dark:bg-[#0f0f12] dark:text-zinc-50">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-2xl dark:border-white/8 dark:bg-black/80">
        <div className="mx-auto max-w-7xl px-4">

          {/* Row 1: Logo, Search, Actions */}
          <div className="flex h-16 items-center gap-4 py-2 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2 outline-none">
              <span className="text-[22px] font-black tracking-tighter text-orange-500">
                🍊 ICHKO
              </span>
            </Link>

            {/* Dual Search Bar (Desktop) */}
            <form
              onSubmit={handleSearch}
              className="mx-4 hidden flex-1 md:block"
            >
              <div className="flex w-full max-w-3xl items-center gap-0 rounded-full border border-zinc-200 bg-zinc-50 p-1 shadow-sm transition-focus-within focus-within:border-orange-500/50 focus-within:ring-4 focus-within:ring-orange-500/10 dark:border-white/10 dark:bg-white/5">
                {/* What */}
                <div className="flex flex-1 items-center gap-3 px-4">
                  <Search className="h-4 w-4 shrink-0 text-zinc-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Хайх: нэр, хаяг, vibe…"
                    className="w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-zinc-400"
                  />
                </div>

                <div className="h-6 w-px bg-zinc-200 dark:bg-white/10" />

                {/* Where */}
                <div className="flex flex-1 items-center gap-3 px-4">
                  <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
                  <div className={cn(
                    "w-full truncate text-[14px] font-medium",
                    hasLocation ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"
                  )}>
                    {hasLocation ? "Миний байршил ✓" : "Байршил оруулах..."}
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600 active:scale-95"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setLang(lang === 'mn' ? 'en' : 'mn')}
                className="hidden h-10 px-3 text-[13px] font-bold text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/8 sm:block"
              >
                {lang === 'mn' ? 'MN' : 'EN'}
              </button>

              <button
                onClick={() => {
                  const next = theme === 'dark' ? 'light' : 'dark'
                  setTheme(next); applyTheme(next)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/8"
              >
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Row 2: Nav + Category Pills (Desktop) */}
          <div className="hidden h-12 items-center justify-between border-t border-zinc-100 py-1 dark:border-white/5 md:flex">
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = active(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition',
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/8 dark:hover:text-white',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mr-2">Шүүх:</span>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-bold transition",
                    currentCat === c.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
                  )}
                >
                  <span>{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <main className="relative min-h-svh pb-28 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={loc.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── MOBILE NAV (Bottom Tab Bar) ───────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white dark:border-white/8 dark:bg-zinc-950 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = active(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-0.5 py-3 transition-colors',
                  isActive ? 'text-orange-500' : 'text-zinc-400 dark:text-zinc-500'
                )}
              >
                {/* Active pill indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="absolute top-0 h-[3px] w-8 rounded-full bg-orange-500"
                    />
                  )}
                </AnimatePresence>

                <Icon className={cn('h-[22px] w-[22px] transition-transform duration-200', isActive && 'scale-110')} />
                <span className={cn('text-[10px] font-bold tracking-tight', isActive ? 'text-orange-500' : 'text-zinc-400')}>
                  {t(item.labelKey).split(' ')[0]}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
