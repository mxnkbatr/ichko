import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
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
  const isEmpty = favPlaces.length === 0

  if (isEmpty) {
    return (
      <div className="flex h-full min-h-[80svh] flex-col items-center justify-center px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center max-w-sm"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50 border border-zinc-100 dark:bg-zinc-900/50 dark:border-white/5">
            <Heart className="h-8 w-8 text-zinc-300 dark:text-zinc-600" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-[20px] font-bold tracking-tight text-zinc-950 dark:text-white">
            Танд одоогоор дуртай газар алга
          </h2>
          
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Та таалагдсан ресторан, кафе, пабуудаа энд хадгалж, хожуу хялбархан олох боломжтой.
          </p>

          <Link
            to="/"
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-orange-500 py-3.5 text-[15px] font-semibold text-white transition hover:bg-orange-600 active:scale-95"
          >
            Шилдэг газруудыг үзэх
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-zinc-950 dark:text-white">Дуртай газрууд</h1>
          <p className="mt-1.5 text-[14px] text-zinc-500">
            Таны хадгалсан шилдэг газрууд
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[12px] font-bold text-rose-500 dark:bg-rose-500/10">
          <Heart className="h-3.5 w-3.5 fill-current" />
          {favPlaces.length}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {['Бүгд', 'Ресторан', 'Кафе', 'Паб'].map(c => (
          <button
            key={c}
            className={cn(
              "whitespace-nowrap rounded-[14px] px-4 py-2 text-[13px] font-bold transition",
              c === 'Бүгд' 
                ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-black" 
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
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
      
      {/* Bottom padding for mobile nav */}
      <div className="h-6" />
    </div>
  )
}
