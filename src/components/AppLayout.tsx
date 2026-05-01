import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Moon, Bookmark, CalendarCheck, SlidersHorizontal, Sun, User, Search, MapPin,
  Compass, Menu, X, Info, HelpCircle, Bell, Shield,
  ChevronRight
} from 'lucide-react'
import { cn } from '../lib/cn'
import { applyTheme, getStoredTheme, type ThemeMode } from '../lib/theme'
import { useEffect, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchModal } from './SearchModal'

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
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Захиалга баталгаажлаа', body: 'Cloud Nine Coffee-д хийсэн захиалга амжилттай.', time: '5 минутын өмнө', isRead: false },
    { id: 2, title: 'Шинэ газар нэмэгдлээ', body: 'Таны сонирхдог "Кафе" ангилалд шинэ газар бүртгэгдлээ.', time: '2 цагийн өмнө', isRead: true },
    { id: 3, title: 'Урамшуулал', body: 'Амралтын өдрүүдэд Sakura Zen-д 10% хөнгөлөлттэй.', time: '1 өдрийн өмнө', isRead: true }
  ])

  const hasUnread = notifications.some(n => !n.isRead)

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  // Effect to mark as read when drawer opens
  useEffect(() => {
    if (notifOpen) {
      // Small delay to let the animation start
      const timer = setTimeout(markAllAsRead, 500)
      return () => clearTimeout(timer)
    }
  }, [notifOpen])

  // Simulated Real-time Notification logic (Supabase style)
  useEffect(() => {
    // This is where you would put your Supabase subscription logic:
    /*
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
        }
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
    */

    // FOR DEMO: Add a notification after 10 seconds
    const demoTimer = setTimeout(() => {
      const newNotif = {
        id: Date.now(),
        title: 'Шинэ мэдэгдэл!',
        body: 'Таны сонирхсон газар шинэ цэс гаргалаа.',
        time: 'Дөнгөж сая',
        isRead: false
      }
      setNotifications(prev => [newNotif, ...prev])
    }, 10000)

    return () => clearTimeout(demoTimer)
  }, [])

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
      <header className="glass sticky top-0 z-30 border-b border-zinc-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4">

          {/* Row 1: Logo, Search, Actions */}
          <div className="flex h-14 items-center gap-4 py-2 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2 outline-none">
              <span className="text-[20px] font-black tracking-tighter text-orange-500 md:text-[22px]">
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
                onClick={() => setSearchOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/8 md:hidden"
              >
                <Search className="h-[18px] w-[18px] stroke-[2.5px]" />
              </button>
              <button
                onClick={() => setNotifOpen(true)}
                className="relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-orange-500 active:scale-110 dark:text-zinc-400 dark:hover:bg-white/8"
              >
                <Bell className={cn("h-5 w-5 transition-transform", notifOpen && "scale-110 text-orange-500")} />
                {hasUnread && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-[#f8f7f5] dark:ring-[#0f0f12]"
                  />
                )}
              </button>

              <button
                onClick={() => setMenuOpen(true)}
                className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/8"
              >
                <Menu className="h-5 w-5" />
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
      <main className="relative min-h-svh pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-8">
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
        className="glass fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/50 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = active(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-0.5 py-2.5 px-2 transition-colors',
                  isActive ? 'text-orange-500' : 'text-zinc-400 dark:text-zinc-500'
                )}
              >
                <div className="flex items-center justify-center p-1.5">
                  <Icon className={cn('h-6 w-6 stroke-[1.8px] transition-all duration-300', isActive && 'scale-110')} />
                </div>
                <span className={cn('mt-0.5 text-[10px] font-bold leading-none tracking-tight transition-colors duration-300', isActive ? 'text-orange-500' : 'text-zinc-400')}>
                  {t(item.labelKey).split(' ')[0]}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute bottom-1 h-1 w-1 rounded-full bg-orange-500"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── SIDE DRAWER ────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-md dark:bg-black/40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-[70] w-full max-w-[300px] bg-white/80 shadow-2xl backdrop-blur-2xl dark:bg-zinc-900/80"
            >
              <div className="flex h-full flex-col p-6">
                {/* Close Button Header */}
                <div className="mb-10 flex items-center justify-between">
                  <span className="text-[18px] font-black tracking-tight">Цэс</span>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition active:scale-90 dark:bg-white/5"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  {[
                    { label: 'Бидний тухай', icon: Info, to: '/about' },
                    { label: 'Тусламж', icon: HelpCircle, to: '/help' },
                    { label: 'Мэдэгдэл', icon: Bell, to: '/notifications' },
                    { label: 'Нууцлалын бодлого', icon: Shield, to: '/privacy' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between rounded-2xl py-3 pl-2 pr-4 transition-all hover:bg-white dark:hover:bg-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 transition-transform group-hover:scale-110 dark:bg-orange-500/20">
                          <item.icon className="h-5 w-5 text-orange-500" strokeWidth={1.8} />
                        </div>
                        <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-200">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-300 stroke-[1.5px] transition group-hover:translate-x-1" />
                    </Link>
                  ))}

                  {/* Dark Mode Toggle inside Menu */}
                  <button
                    onClick={() => {
                      const next = theme === 'dark' ? 'light' : 'dark'
                      setTheme(next); applyTheme(next)
                    }}
                    className="group flex w-full items-center justify-between rounded-2xl py-3 pl-2 pr-4 transition-all hover:bg-white dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 transition-transform group-hover:scale-110 dark:bg-orange-500/20">
                        {theme === 'dark' ? <Moon className="h-5 w-5 text-orange-500" /> : <Sun className="h-5 w-5 text-orange-500" />}
                      </div>
                      <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-200">
                        {theme === 'dark' ? 'Харанхуй горим' : 'Гэрэлт горим'}
                      </span>
                    </div>
                    <div className="flex h-5 w-9 items-center rounded-full bg-zinc-200 p-1 transition-colors dark:bg-orange-500">
                      <motion.div
                        animate={{ x: theme === 'dark' ? 16 : 0 }}
                        className="h-3 w-3 rounded-full bg-white shadow-sm"
                      />
                    </div>
                  </button>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto space-y-8">
                  {/* Language Switcher Section */}
                  <div className="rounded-[2.2rem] bg-zinc-100/80 p-5 dark:bg-white/5">
                    <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Хэл солих</h4>
                    <div className="flex gap-1 rounded-2xl bg-zinc-200/50 p-1 dark:bg-black/20">
                      <button
                        onClick={() => setLang('mn')}
                        className={cn(
                          "flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-all",
                          lang === 'mn'
                            ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                        )}
                      >
                        Монгол
                      </button>
                      <button
                        onClick={() => setLang('en')}
                        className={cn(
                          "flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-all",
                          lang === 'en'
                            ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                        )}
                      >
                        English
                      </button>
                    </div>
                  </div>

                  <div className="text-center text-[11px] font-semibold tracking-wide text-zinc-400">
                    ICHKO v1.0.2 • 2024
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── NOTIFICATION DRAWER ────────────────────────────────── */}
      <AnimatePresence>
        {notifOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotifOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-md dark:bg-black/40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-[70] w-full max-w-[360px] bg-white/80 shadow-2xl backdrop-blur-2xl dark:bg-zinc-900/80"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                  <div>
                    <h2 className="text-[20px] font-black tracking-tight">Мэдэгдэл</h2>
                    {hasUnread && <p className="text-[12px] font-bold text-orange-500">Шинэ мэдэгдэл байна</p>}
                  </div>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition active:scale-90 dark:bg-white/5"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 py-2">
                  {notifications.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/5 dark:bg-orange-500/10">
                        <Bell className="h-10 w-10 text-orange-500/40" />
                      </div>
                      <h3 className="text-[16px] font-black">Танд одоогоор мэдэгдэл алга</h3>
                      <p className="mt-1 text-[13px] font-medium text-zinc-400">Шинэ мэдээлэл ирэх үед энд харагдана.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((n) => (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "group relative overflow-hidden rounded-2xl p-4 transition-all active:scale-[0.98]",
                            !n.isRead
                              ? "bg-orange-500/10 ring-1 ring-orange-500/20 dark:bg-orange-500/10 dark:ring-orange-500/30"
                              : "bg-white/50 ring-1 ring-zinc-100 hover:bg-white dark:bg-white/5 dark:ring-white/5 dark:hover:bg-white/10"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className={cn(
                                "text-[14px] font-black leading-tight",
                                !n.isRead ? "text-orange-950 dark:text-orange-100" : "text-zinc-800 dark:text-zinc-200"
                              )}>
                                {n.title}
                              </h4>
                              <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                                {n.body}
                              </p>
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                  {n.time}
                                </span>
                                {!n.isRead && (
                                  <>
                                    <span className="h-1 w-1 rounded-full bg-orange-500/30" />
                                    <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest">New</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {!n.isRead && (
                              <div className="h-2 w-2 shrink-0 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                {notifications.length > 0 && (
                  <div className="p-6">
                    <button
                      onClick={markAllAsRead}
                      className="w-full rounded-2xl bg-zinc-900 py-4 text-[14px] font-bold text-white transition hover:bg-black active:scale-95 dark:bg-white dark:text-zinc-900"
                    >
                      Бүгдийг уншсан болгох
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
