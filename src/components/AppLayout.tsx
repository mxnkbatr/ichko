import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Moon,
  Bookmark,
  CalendarCheck,
  MapPinned,
  Search,
  SlidersHorizontal,
  Sun,
  Sparkles,
  User,
} from 'lucide-react'
import { cn } from '../lib/cn'
import { applyTheme, getStoredTheme, type ThemeMode } from '../lib/theme'
import { useMemo, useState } from 'react'
import { useI18n } from '../lib/i18n'

const DESKTOP_NAV = [
  { to: '/', labelKey: 'nav_explore', icon: MapPinned },
  { to: '/filters', labelKey: 'nav_filters', icon: SlidersHorizontal },
  { to: '/favorites', labelKey: 'nav_favorites', icon: Bookmark },
  { to: '/bookings', labelKey: 'nav_bookings', icon: CalendarCheck },
  { to: '/me', labelKey: 'nav_me', icon: User },
] as const

const MOBILE_NAV = [
  { to: '/', labelKey: 'nav_explore', icon: MapPinned },
  { to: '/filters', labelKey: 'nav_filters', icon: SlidersHorizontal },
  { to: '/bookings', labelKey: 'nav_bookings', icon: CalendarCheck },
  { to: '/me', labelKey: 'nav_me', icon: User },
] as const

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-500 text-white shadow-glass">
        <MapPinned className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="text-[13px] font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          HOOL (prototype)
        </div>
        <div className="text-[12px] text-zinc-500 dark:text-zinc-400">
          near • menu • booking
        </div>
      </div>
    </div>
  )
}

export function AppLayout() {
  const nav = useNavigate()
  const loc = useLocation()
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme() ?? 'dark')
  const { lang, setLang, t } = useI18n()

  const active = (to: string) => {
    if (to === '/') return loc.pathname === '/'
    return loc.pathname === to || loc.pathname.startsWith(`${to}/`)
  }

  const themeLabel = useMemo(
    () => (theme === 'dark' ? t('theme_dark') : t('theme_light')),
    [theme, t],
  )

  return (
    <div className="min-h-svh font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Light mode background */}
        <div className="absolute inset-0 dark:hidden">
          {/* Base: ivory-white canvas */}
          <div className="absolute inset-0 bg-[#fdfaf6]" />
          {/* Top-left: warm orange sunrise orb */}
          <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,.55)_0%,rgba(249,115,22,.28)_40%,transparent_70%)] blur-3xl" />
          {/* Top-right: soft amber glow */}
          <div className="absolute -right-20 -top-20 h-[380px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(253,186,116,.45)_0%,rgba(251,146,60,.18)_50%,transparent_75%)] blur-2xl" />
          {/* Center: creamy highlight */}
          <div className="absolute left-1/2 top-1/3 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,237,213,.80)_0%,transparent_65%)] blur-2xl" />
          {/* Bottom-right: lavender / purple bloom */}
          <div className="absolute -bottom-24 -right-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(196,181,253,.50)_0%,rgba(167,139,250,.22)_45%,transparent_70%)] blur-3xl" />
          {/* Bottom-left: soft rose tint */}
          <div className="absolute -bottom-16 left-1/4 h-[300px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(253,164,175,.30)_0%,rgba(251,113,133,.10)_50%,transparent_72%)] blur-2xl" />
          {/* Subtle dot grid for depth */}
          <div className="absolute inset-0 opacity-[0.055] [background-image:radial-gradient(circle,rgba(0,0,0,.55)_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        {/* Dark mode background */}
        <div className="hidden dark:absolute dark:inset-0 dark:block dark:bg-[#0f0f12]" />
        <div className="hidden dark:absolute dark:-top-24 dark:left-1/2 dark:block dark:h-[520px] dark:w-[820px] dark:-translate-x-1/2 dark:rounded-full dark:bg-gradient-to-b dark:from-brand-500/18 dark:via-brand-500/10 dark:to-transparent dark:blur-3xl" />
        <div className="hidden dark:absolute dark:-bottom-24 dark:left-1/3 dark:block dark:h-[420px] dark:w-[620px] dark:-translate-x-1/2 dark:rounded-full dark:bg-gradient-to-t dark:from-white/10 dark:via-white/5 dark:to-transparent dark:blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-orange-100/80 bg-white/75 shadow-[0_1px_0_rgba(249,115,22,.06)] backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <button
            type="button"
            onClick={() => nav('/')}
            className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70"
          >
            <BrandMark />
          </button>

          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex w-full max-w-xl items-center gap-2 rounded-3xl border border-zinc-200/70 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                placeholder={t('explore_search_placeholder')}
                className="w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-zinc-400"
              />
              <span className="inline-flex items-center gap-1 rounded-xl bg-brand-500/10 px-2 py-1 text-[12px] font-medium text-brand-700 dark:text-brand-200">
                <Sparkles className="h-3.5 w-3.5" />
                Nearby
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'mn' ? 'en' : 'mn')}
              className="inline-flex items-center gap-2 rounded-3xl bg-zinc-100/80 px-3 py-2 text-[13px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-200/80 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
              title="Language"
              aria-label="Language"
            >
              {lang === 'mn' ? t('lang_mn') : t('lang_en')}
            </button>

            <button
              type="button"
              onClick={() => {
                const next: ThemeMode = theme === 'dark' ? 'light' : 'dark'
                setTheme(next)
                applyTheme(next)
              }}
              className="inline-flex items-center gap-2 rounded-3xl bg-zinc-100/80 px-3 py-2 text-[13px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-200/80 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
              aria-label={`Switch theme (current ${themeLabel})`}
              title="Theme"
            >
              {theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="hidden md:inline">{themeLabel}</span>
            </button>

            <Link
              to="/favorites"
              className="inline-flex items-center gap-2 rounded-3xl bg-zinc-100/80 px-3 py-2 text-[13px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-200/80 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15 md:hidden"
              aria-label={t('nav_favorites')}
              title={t('nav_favorites')}
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav_favorites')}</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {DESKTOP_NAV.map((item) => {
              const Icon = item.icon
              const isActive = active(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-[13px] font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70',
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Link>
              )
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-orange-100/80 bg-white/80 shadow-[0_-1px_0_rgba(249,115,22,.06)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-4 px-2 py-2">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon
            const isActive = active(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'mx-1 flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500/70',
                  isActive
                    ? 'bg-brand-500/10 text-brand-700 dark:text-brand-200'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10',
                )}
              >
                <Icon className="h-5 w-5" />
                {t(item.labelKey)}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

