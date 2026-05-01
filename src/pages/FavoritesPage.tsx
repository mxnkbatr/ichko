import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search } from 'lucide-react'
import { getFavorites } from '../lib/favorites'
import { getPlaceById } from '../data/places'
import { PlaceCard } from '../components/PlaceCard'
import { cn } from '../lib/cn'
import { motion, AnimatePresence } from 'framer-motion'

export function FavoritesPage() {
  const [favIds, setFavIds] = useState<string[]>([])

  useEffect(() => {
    setFavIds(getFavorites())
  }, [])

  const favPlaces = favIds.map(id => getPlaceById(id)).filter(Boolean)

  return (
    <div className="mx-auto max-w-4xl px-6 py-6 md:py-10">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-black tracking-tight text-zinc-950 dark:text-white md:text-[40px]">Дуртай газрууд</h1>
          <p className="mt-1 text-[14px] font-medium text-zinc-400 md:text-[15px]">
            Таны хадгалсан шилдэг газрууд
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-rose-500/5 px-3 py-1.5 text-[12px] font-bold text-rose-500 dark:bg-rose-500/10">
          <Heart className="h-3.5 w-3.5 fill-current" />
          <span className="font-black">{favPlaces.length}</span> хадгалсан
        </div>
      </div>

      {/* Filter Chips */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {['Бүгд', 'Ресторан', 'Кафе', 'Паб'].map(c => (
          <button
            key={c}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-bold transition",
              c === 'Бүгд' 
                ? "bg-zinc-950 text-white dark:bg-white dark:text-black" 
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {favPlaces.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-[3rem] border border-zinc-100 bg-white py-24 text-center shadow-2xl shadow-zinc-200/40 dark:border-white/5 dark:bg-white/3 dark:shadow-none"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 scale-150 rounded-full bg-rose-500/10 blur-2xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl dark:bg-zinc-800">
              <Heart className="h-10 w-10 text-rose-500" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-[18px] font-black text-zinc-950 dark:text-white">Танд одоогоор дуртай газар алга</h2>
          <p className="mt-2 max-w-xs text-[14px] font-medium text-zinc-400">
            Шинэ газруудтай танилцаж, өөрийн цуглуулгаа үүсгээрэй.
          </p>
          <Link
            to="/"
            className="mt-10 flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-[14px] font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-95"
          >
            <Search className="h-4 w-4" />
            Газруудтай танилцах
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={{
            show: { transition: { staggerChildren: 0.04 } }
          }}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {favPlaces.map((place, i) => (
              place && (
                <motion.div
                  key={place.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <PlaceCard 
                    place={place} 
                    index={i} 
                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
