import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Place } from '../data/places'
import { cn } from '../lib/cn'
import { isFavorite, toggleFavorite } from '../lib/favorites'

const CAT_LABEL: Record<Place['category'], string> = {
  restaurant: 'Ресторан',
  pub: 'Паб / Бар',
  cafe: 'Кафе',
}

export function PlaceCard({
  place,
  selected,
  index = 0,
}: {
  place: Place
  selected?: boolean
  index?: number
}) {
  const [isFav, setIsFav] = useState(() => isFavorite(place.id))

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(place.id)
    setIsFav(!isFav)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="h-full"
    >
      <Link
        to={`/place/${place.id}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden transition-all duration-300 cursor-pointer rounded-2xl",
          selected && "ring-2 ring-inset ring-orange-500 bg-orange-50/10 dark:bg-orange-500/5"
        )}
      >
        {/* Photo Container */}
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
          <img
            src={place.photos[0]?.url}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlay for Top text */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent opacity-80" />

          {/* Top Actions: Distance & Favorite */}
          <div className="absolute top-3 inset-x-3 flex items-start justify-between z-10">
            {/* Distance Pill */}
            <div className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-md">
              {place.distanceKm.toFixed(1)} км
            </div>

            {/* Favorite Button */}
            <motion.button
              whileTap={{ scale: 1.4 }}
              onClick={handleToggleFav}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-black/40 backdrop-blur-md transition-colors hover:bg-black/60"
            >
              <Heart className={cn("h-4 w-4", isFav ? "fill-rose-500 text-rose-500" : "text-white")} strokeWidth={isFav ? 0 : 2} />
            </motion.button>
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col flex-1 pt-3 pb-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[17px] text-zinc-950 dark:text-white leading-tight truncate">
              {place.name}
            </h3>
            
            {/* Rating Pill */}
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[12px] font-bold text-zinc-900 dark:bg-zinc-800 dark:text-white">
              <span className="text-zinc-900 dark:text-white">{place.rating.toFixed(1)}</span>
              <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
            </div>
          </div>

          <div className="mt-1 flex items-center text-[13px] text-zinc-500 gap-1.5">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">{CAT_LABEL[place.category]}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span className="font-medium text-zinc-600 dark:text-zinc-400">{'$'.repeat(place.priceLevel)}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span className="truncate">{place.address}</span>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <span className={cn(
              "rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
              place.openNow ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" : "text-zinc-500 dark:bg-white/10 dark:text-zinc-400"
            )}>
              {place.openNow ? 'Нээлттэй' : 'Хаалттай'}
            </span>
            
            {/* Highlights (max 2, tag style) */}
            <div className="flex items-center gap-1.5 overflow-hidden">
              {place.highlights.slice(0, 2).map(h => (
                <span
                  key={h}
                  className="shrink-0 rounded border border-zinc-200 bg-transparent px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
