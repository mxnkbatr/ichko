import { useEffect, useState } from 'react'
import {
  Moon, Sun, Languages,
  Trash2, LogOut, History,
  CalendarCheck, Bookmark, Star, User, ChevronRight, UserCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { listBookings } from '../lib/bookings'
import { getFavorites } from '../lib/favorites'
import { getPlaceById } from '../data/places'
import { applyTheme, getStoredTheme, type ThemeMode } from '../lib/theme'
import { useI18n } from '../lib/i18n'
import { cn } from '../lib/cn'

export function ProfilePage() {
  const { lang, setLang } = useI18n()
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme() ?? 'light')

  // Mocking user state based on prompt
  const isLoggedIn = false // Set to true to see the level 3 badge

  const bookings = listBookings()
  const favorites = getFavorites()
  const [recentIds, setRecentIds] = useState<string[]>([])

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('ichko.recentlyViewed') ?? '[]')
    setRecentIds(ids)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  const stats = [
    { label: 'ЗАХИАЛГА', value: bookings.length, icon: CalendarCheck },
    { label: 'ДУРТАЙ', value: favorites.length, icon: Bookmark },
    { label: 'ҮНЭЛГЭЭ', value: 0, icon: Star },
  ]

  const recentPlaces = recentIds.map(id => getPlaceById(id)).filter(Boolean)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
      
      {/* 1. Header & User Info */}
      <section className="mb-4 flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-orange-100 text-[28px] font-bold text-orange-600 dark:bg-orange-500/20">
            3
          </div>
        ) : (
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
            <User className="h-8 w-8 text-zinc-400 stroke-[1.5px]" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-black tracking-tight text-zinc-950 dark:text-white">
            {isLoggedIn ? 'Batbold' : 'Зочин хэрэглэгч'}
          </h1>
          <p className="mt-0.5 text-[13px] text-zinc-500">
            Гишүүн болсон: {isLoggedIn ? '2024' : '2025'} оноос
          </p>
          {!isLoggedIn && (
            <button className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 px-6 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95">
              Нэвтрэх / Бүртгүүлэх
            </button>
          )}
        </div>
      </section>

      {!isLoggedIn && (
        <p className="mb-6 ml-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
          Нэвтрээд оноогоо цуглуулаарай
        </p>
      )}

      {/* 2. Stats Grid */}
      <div className="mb-8 flex overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-white/5 dark:bg-zinc-900">
        {stats.map((s, i) => (
          <div 
            key={s.label} 
            className={cn(
              "flex-1 p-5 text-center",
              i !== 0 && "border-l border-zinc-100 dark:border-white/5"
            )}
          >
            <div className="text-[26px] font-semibold text-zinc-950 dark:text-white leading-none">
              {s.value}
            </div>
            <div className="mt-1.5 text-[10px] font-bold tracking-wider text-zinc-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Settings List */}
      <section className="mb-10">
        <h2 className="mb-3 pl-4 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Тохиргоо</h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white dark:border-white/5 dark:bg-zinc-900">
          
          {/* Хувийн мэдээлэл */}
          <Link to="/profile" className="flex items-center justify-between border-b border-zinc-100 p-4 transition hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                <UserCircle className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              </div>
              <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">Хувийн мэдээлэл</span>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-300 stroke-[2px]" />
          </Link>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                {theme === 'dark' ? <Moon className="h-4.5 w-4.5 text-white" /> : <Sun className="h-4.5 w-4.5 text-white" />}
              </div>
              <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">Харанхуй горим</span>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                "relative h-7 w-12 rounded-full p-1 transition-colors duration-200",
                theme === 'dark' ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
              )}
            >
              <motion.div
                layout
                className="h-5 w-5 rounded-full bg-white shadow-sm"
                animate={{ x: theme === 'dark' ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                <Languages className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">Хэл: {lang === 'mn' ? 'Монгол' : 'English'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-full bg-zinc-100 p-0.5 dark:bg-white/5">
                {['mn', 'en'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l as any)}
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-bold uppercase transition",
                      lang === l ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white" : "text-zinc-400 hover:text-zinc-600"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-300 stroke-[2px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentPlaces.length > 0 && (
        <section className="mb-10">
          <div className="mb-3 pl-4 flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" /> Сүүлд үзсэн газрууд
            </h2>
            <button
              onClick={() => { localStorage.removeItem('ichko.recentlyViewed'); setRecentIds([]) }}
              className="text-[11px] font-bold text-zinc-400 hover:text-rose-500 pr-2"
            >
              Цэвэрлэх
            </button>
          </div>
          <div className="grid gap-4">
            {recentPlaces.map((p, _i) => (
              p && (
                <Link
                  key={p.id}
                  to={`/place/${p.id}`}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-900"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={p.photos[0]?.url}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-[18px] font-bold text-white leading-tight">
                        {p.name}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] font-medium text-white/80">
                        <div className="flex items-center gap-1 text-orange-400 font-bold">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {p.rating.toFixed(1)}
                        </div>
                        <span className="text-white/30">•</span>
                        <span className="truncate">{p.address}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        </section>
      )}

      {/* 5. Danger Zone */}
      <section className="mt-8 overflow-hidden rounded-2xl bg-white border border-zinc-100 dark:bg-zinc-900 dark:border-white/5 flex flex-col">
        <button
          onClick={() => { localStorage.clear(); window.location.reload() }}
          className="flex items-center justify-center gap-2 border-b border-zinc-100 py-4 text-[15px] font-semibold text-red-600 transition hover:bg-zinc-50 dark:border-white/5 dark:text-red-500 dark:hover:bg-white/5"
        >
          <Trash2 className="h-4.5 w-4.5 stroke-[2px]" />
          Өгөгдөл устгах
        </button>
        <button className="flex items-center justify-center gap-2 py-4 text-[15px] font-semibold text-red-600 transition hover:bg-zinc-50 dark:text-red-500 dark:hover:bg-white/5">
          <LogOut className="h-4.5 w-4.5 stroke-[2px]" />
          Гарах
        </button>
      </section>
      
      {/* Bottom padding for mobile nav */}
      <div className="h-6" />
    </div>
  )
}
