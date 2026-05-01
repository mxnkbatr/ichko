import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Heart, Star } from 'lucide-react'
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
    >
      <Link
        to={`/place/${place.id}`}
        className={cn(
          "relative flex flex-col rounded-3xl bg-white overflow-hidden border border-zinc-100 transition-colors duration-150 cursor-pointer",
          "md:flex-row md:gap-4 md:p-4 md:border-b-0 md:border-zinc-100",
          "dark:bg-zinc-900/40 dark:border-white/5",
          "hover:bg-zinc-50 dark:hover:bg-white/3",
          selected && "ring-2 ring-inset ring-orange-500 bg-orange-50/30 dark:bg-orange-500/10"
        )}
      >
        {/* Index number */}
        <div className="absolute top-3 left-3 z-10 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm md:static md:mt-1 md:flex-none">
          {index + 1}
        </div>

        {/* Photo */}
        <div className="relative w-full aspect-[4/3] md:w-[140px] md:h-[105px] md:aspect-auto md:flex-none md:rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={place.photos[0]?.url}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Distance Badge */}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
            {place.distanceKm.toFixed(1)} км
          </div>
        </div>

        <div className="flex-1 min-w-0 p-4 pt-4 md:p-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-[18px] text-zinc-900 dark:text-white leading-tight truncate">
              {place.name}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center gap-1 text-orange-500 font-bold text-[14px]">
                <Star className="h-3.5 w-3.5 fill-current" />
                {place.rating.toFixed(1)}
              </div>
              <motion.button
                whileTap={{ scale: 1.4 }}
                onClick={handleToggleFav}
                className={cn(
                  "flex-none transition-colors p-1.5 rounded-full bg-zinc-50 dark:bg-white/5",
                  isFav ? "text-rose-500" : "text-zinc-300 hover:text-rose-400"
                )}
              >
                <Heart className={cn("h-4.5 w-4.5", isFav && "fill-current")} />
              </motion.button>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-2 text-[13px] font-medium text-zinc-500">
            <span>{place.reviewCount.toLocaleString()} үнэлгээ</span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-600 dark:text-zinc-300 font-bold">{CAT_LABEL[place.category]}</span>
            <span className="text-zinc-300">·</span>
            <span className="font-bold text-zinc-950 dark:text-zinc-100">{'$'.repeat(place.priceLevel)}</span>
          </div>

          <div className="mt-1.5 text-[12px] text-zinc-500 flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-zinc-400" />
            <span className="truncate">{place.address}</span>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-[12px]">
            <span className={cn(
              "font-semibold flex items-center gap-1",
              place.openNow ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full", place.openNow ? "bg-emerald-500" : "bg-rose-500")} />
              {place.openNow ? 'Нээлттэй' : 'Хаалттай'}
            </span>
            {place.openNow && <span className="text-zinc-400">· {place.closesAt} хүртэл</span>}
          </div>

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {place.highlights.slice(0, 2).map(h => (
              <span
                key={h}
                className="rounded-lg border border-zinc-200 bg-transparent px-2 py-1 text-[11px] font-medium text-zinc-500 dark:border-white/10 dark:text-zinc-400"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
