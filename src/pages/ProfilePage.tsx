import { useEffect, useState } from 'react'
import {
  Moon, Sun, Languages,
  Trash2, LogOut, History,
  Star, User, ChevronRight
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

  // Mocking auth state based on the prompt
  const isLoggedIn = false 
  const userLevel = 3

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
    { label: 'ЗАХИАЛГА', value: bookings.length },
    { label: 'ДУРТАЙ', value: favorites.length },
    { label: 'ҮНЭЛГЭЭ', value: 0 },
  ]

  const recentPlaces = recentIds.map(id => getPlaceById(id)).filter(Boolean)

  return (
    <div className="min-h-svh bg-zinc-50 pb-24 dark:bg-[#0f0f12]">
      <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        
        {/* ── 1. HEADER & USER INFO ───────────────────────────────────── */}
        <section className="mb-8 flex items-center gap-4">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-zinc-200/50 dark:bg-white/10">
            {isLoggedIn ? (
              <span className="text-[28px] font-bold text-orange-500">Б</span>
            ) : (
              <User className="h-8 w-8 text-zinc-400 dark:text-zinc-500" strokeWidth={1} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              {isLoggedIn ? 'Бат-Эрдэнэ' : 'Зочин хэрэглэгч'}
            </h1>
            {isLoggedIn ? (
              <p className="text-[14px] text-zinc-500 font-medium">Түвшин {userLevel} • 2025 оноос</p>
            ) : (
              <p className="text-[13px] text-zinc-500 mt-0.5">Нэвтрээд оноогоо цуглуулаарай</p>
            )}
          </div>
          {!isLoggedIn && (
            <button className="shrink-0 rounded-2xl bg-orange-500 px-5 h-11 text-[14px] font-semibold text-white shadow-sm shadow-orange-500/20 active:scale-95 transition-all">
              Нэвтрэх
            </button>
          )}
        </section>

        {/* ── 2. STATS SECTION ────────────────────────────────────────── */}
        <section className="mb-8">
          <div className="flex rounded-2xl bg-white shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-white/5 py-4">
            {stats.map((s, i) => (
              <div 
                key={s.label} 
                className={cn(
                  "flex-1 text-center",
                  i !== stats.length - 1 && "border-r border-zinc-100 dark:border-white/5"
                )}
              >
                <div className="text-[20px] font-bold text-zinc-950 dark:text-white leading-none mb-1">
                  {s.value}
                </div>
                <div className="text-[11px] font-semibold text-zinc-400 tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. SETTINGS LIST ────────────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="mb-2 ml-4 text-[13px] font-medium text-zinc-500">Тохиргоо</h2>
          <div className="overflow-hidden rounded-2xl bg-white border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-white/5">
            
            {/* Personal Info */}
            <Link to="#" className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-white/5 dark:active:bg-white/10">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
                <User className="h-4 w-4 text-zinc-600 dark:text-zinc-300" strokeWidth={2} />
              </div>
              <span className="flex-1 text-[15px] font-medium text-zinc-900 dark:text-zinc-100">Хувийн мэдээлэл</span>
              <ChevronRight className="h-4.5 w-4.5 text-zinc-300 dark:text-zinc-600" strokeWidth={2} />
            </Link>
            
            <div className="mx-4 h-px bg-zinc-100 dark:bg-white/5" />

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-white/5 dark:active:bg-white/10">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                {theme === 'dark' 
                  ? <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" strokeWidth={2} /> 
                  : <Sun className="h-4 w-4 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                }
              </div>
              <span className="flex-1 text-left text-[15px] font-medium text-zinc-900 dark:text-zinc-100">Харанхуй горим</span>
              <div className={cn(
                "relative h-[26px] w-[46px] rounded-full p-0.5 transition-colors duration-200",
                theme === 'dark' ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
              )}>
                <motion.div
                  layout
                  className="h-5 w-5 rounded-full bg-white shadow-sm"
                  animate={{ x: theme === 'dark' ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </button>

            <div className="mx-4 h-px bg-zinc-100 dark:bg-white/5" />

            {/* Language */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                <Languages className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              </div>
              <span className="flex-1 text-[15px] font-medium text-zinc-900 dark:text-zinc-100">Хэл</span>
              <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
                {['mn', 'en'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l as any)}
                    className={cn(
                      "rounded-md px-3 py-1 text-[13px] font-semibold transition",
                      lang === l 
                        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white" 
                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── 4. RECENTLY VIEWED ──────────────────────────────────────── */}
        {recentPlaces.length > 0 && (
          <section className="mb-8">
            <div className="mb-2 ml-4 flex items-center justify-between pr-4">
              <h2 className="text-[13px] font-medium text-zinc-500 flex items-center gap-1.5">
                <History className="h-4 w-4" strokeWidth={2} /> Сүүлд үзсэн
              </h2>
              <button
                onClick={() => { localStorage.removeItem('ichko.recentlyViewed'); setRecentIds([]) }}
                className="text-[13px] font-medium text-zinc-400 hover:text-rose-500"
              >
                Цэвэрлэх
              </button>
            </div>
            <div className="grid gap-3">
              {recentPlaces.map((p, _i) => (
                p && (
                  <Link
                    key={p.id}
                    to={`/place/${p.id}`}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-zinc-100 transition-all active:scale-[0.98] dark:bg-zinc-900 dark:border-white/5"
                  >
                    <div className="flex gap-4 p-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        <img
                          src={p.photos[0]?.url}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center min-w-0">
                        <h3 className="text-[16px] font-bold text-zinc-900 dark:text-white truncate">
                          {p.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-[13px] font-medium text-zinc-500">
                          <div className="flex items-center gap-1 text-orange-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {p.rating.toFixed(1)}
                          </div>
                          <span>•</span>
                          <span className="truncate">{p.address}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center justify-center px-2">
                        <ChevronRight className="h-4.5 w-4.5 text-zinc-300 dark:text-zinc-600" strokeWidth={2} />
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </section>
        )}

        {/* ── 5. DANGER ZONE ──────────────────────────────────────────── */}
        <section className="mb-8">
          <div className="overflow-hidden rounded-2xl bg-white border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-white/5">
            <button
              onClick={() => { localStorage.clear(); window.location.reload() }}
              className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-rose-50 active:bg-rose-100 dark:hover:bg-rose-500/10"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
                <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-400" strokeWidth={2} />
              </div>
              <span className="flex-1 text-left text-[15px] font-medium text-rose-600 dark:text-rose-500">Өгөгдөл устгах</span>
            </button>

            <div className="mx-4 h-px bg-zinc-100 dark:bg-white/5" />

            <button className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-rose-50 active:bg-rose-100 dark:hover:bg-rose-500/10">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
                <LogOut className="h-4 w-4 text-rose-600 dark:text-rose-400" strokeWidth={2} />
              </div>
              <span className="flex-1 text-left text-[15px] font-medium text-rose-600 dark:text-rose-500">Гарах</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}
