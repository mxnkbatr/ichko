import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, ArrowRight } from 'lucide-react'
import { getFavorites } from '../lib/favorites'
import { getPlaceById } from '../data/places'
import { PlaceCard } from '../components/PlaceCard'
import { motion, AnimatePresence } from 'framer-motion'

export function FavoritesPage() {
  const [favIds, setFavIds] = useState<string[]>([])

  useEffect(() => {
    setFavIds(getFavorites())
  }, [])

  const favPlaces = favIds.map(id => getPlaceById(id)).filter(Boolean)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-[32px] font-black tracking-tight text-zinc-950 dark:text-white">Дуртай газрууд</h1>
          <p className="mt-1 text-[15px] font-medium text-zinc-500">
            Таны хадгалсан шилдэг газрууд
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-[14px] font-black text-rose-600 dark:bg-rose-500/10">
          <Heart className="h-4 w-4 fill-current" />
          {favPlaces.length} хадгалсан
        </div>
      </div>

      {favPlaces.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-[3rem] border border-zinc-100 bg-white py-24 text-center dark:border-white/5 dark:bg-white/3"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-[32px] text-rose-500 dark:bg-rose-500/10">
            ♡
          </div>
          <h2 className="mt-6 text-[20px] font-black text-zinc-900 dark:text-white">Дуртай газраа хадгал</h2>
          <p className="mt-2 max-w-xs text-[15px] text-zinc-500">
            Газрын хуудсан дээрх ♡ товчийг дарж өөрийн дуртай газруудын жагсаалтыг үүсгээрэй.
          </p>
          <Link
            to="/"
            className="mt-8 flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3.5 text-[14px] font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black"
          >
            <Search className="h-4 w-4" />
            Газар хайх
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={{
            show: { transition: { staggerChildren: 0.04 } }
          }}
          initial="hidden"
          animate="show"
          className="grid gap-2"
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
