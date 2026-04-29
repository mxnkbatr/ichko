import { useEffect, useState } from 'react'
import { 
  Settings, Moon, Sun, Languages, 
  Trash2, LogOut, History,
  Bookmark, CalendarCheck, Star
} from 'lucide-react'
import { motion } from 'framer-motion'
import { listBookings } from '../lib/bookings'
import { getFavorites } from '../lib/favorites'
import { getPlaceById } from '../data/places'
import { PlaceCard } from '../components/PlaceCard'
import { applyTheme, getStoredTheme, type ThemeMode } from '../lib/theme'
import { useI18n } from '../lib/i18n'
import { cn } from '../lib/cn'

export function ProfilePage() {
  const { lang, setLang } = useI18n()
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme() ?? 'light')
  
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
    { label: 'Захиалга', value: bookings.length, icon: CalendarCheck },
    { label: 'Дуртай', value: favorites.length, icon: Bookmark },
    { label: 'Үнэлгээ', value: 0, icon: Star },
  ]

  const recentPlaces = recentIds.map(id => getPlaceById(id)).filter(Boolean)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
      {/* Profile Header */}
      <section className="mb-10 flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-[28px] font-black text-orange-600 dark:bg-orange-500/20">
          З
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[24px] font-black tracking-tight text-zinc-950 dark:text-white">Зочин хэрэглэгч</h1>
          <p className="text-[14px] text-zinc-500">Гишүүн болсон: 2025 оноос</p>
          <button className="mt-2 text-[13px] font-bold text-orange-500 hover:underline">
            Нэвтрэх / Бүртгүүлэх
          </button>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-white/5">
          <Settings className="h-5 w-5 text-zinc-500" />
        </button>
      </section>

      {/* Stats Grid */}
      <div className="mb-12 grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-[2rem] border border-zinc-100 bg-white p-5 text-center shadow-sm dark:border-white/5 dark:bg-zinc-900">
            <div className="text-[32px] font-black text-zinc-950 dark:text-white leading-none">
              {s.value}
            </div>
            <div className="mt-2 text-[12px] font-bold uppercase tracking-wider text-zinc-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Settings Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">ТОХИРГОО</h2>
        <div className="overflow-hidden rounded-[2rem] border border-zinc-100 bg-white dark:border-white/5 dark:bg-zinc-900">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-50 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 dark:bg-white/5">
                {theme === 'dark' ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
              </div>
              <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-200">Харанхуй горим</span>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                "relative h-7 w-12 rounded-full p-1 transition-colors duration-200",
                theme === 'dark' ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-800"
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
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 dark:bg-white/5">
                <Languages className="h-5 w-5 text-zinc-500" />
              </div>
              <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-200">Хэл: {lang === 'mn' ? 'Монгол' : 'English'}</span>
            </div>
            <div className="flex rounded-full bg-zinc-100 p-1 dark:bg-white/5">
              {['mn', 'en'].map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l as any)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[12px] font-black transition",
                    lang === l ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentPlaces.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400 flex items-center gap-2">
              <History className="h-3.5 w-3.5" /> Сүүлд үзсэн газрууд
            </h2>
            <button 
              onClick={() => { localStorage.removeItem('ichko.recentlyViewed'); setRecentIds([]) }}
              className="text-[11px] font-bold text-zinc-400 hover:text-rose-500"
            >
              Цэвэрлэх
            </button>
          </div>
          <div className="grid gap-2">
            {recentPlaces.map((p, i) => (
              p && <PlaceCard key={p.id} place={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Danger Zone */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => { localStorage.clear(); window.location.reload() }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 py-4 text-[14px] font-bold text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/10 dark:bg-rose-500/5 dark:text-rose-400"
        >
          <Trash2 className="h-4.5 w-4.5" />
          Өгөгдөл устгах
        </button>
        <button className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-100 bg-white py-4 text-[14px] font-bold text-zinc-400 transition hover:bg-zinc-50 dark:border-white/5 dark:bg-zinc-900">
          <LogOut className="h-4.5 w-4.5" />
          Гарах
        </button>
      </div>
    </div>
  )
}
