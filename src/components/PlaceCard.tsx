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
      layout
    >
      <Link
        to={`/place/${place.id}`}
        className={cn(
          "flex gap-4 rounded-3xl bg-white p-4 border-b border-zinc-100 transition-colors duration-150 cursor-pointer",
          "dark:bg-zinc-900/40 dark:border-white/5",
          "hover:bg-zinc-50 dark:hover:bg-white/3",
          selected && "ring-2 ring-inset ring-orange-500 bg-orange-50/30 dark:bg-orange-500/10"
        )}
      >
        {/* Index number */}
        <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center justify-center flex-none mt-1 shadow-sm">
          {index + 1}
        </div>

        {/* Photo */}
        <div className="w-[120px] h-[90px] rounded-2xl overflow-hidden flex-none bg-zinc-100 dark:bg-zinc-800">
          <img
            src={place.photos[0]?.url}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-[16px] text-zinc-950 dark:text-white leading-snug truncate">
              {place.name}
            </h3>
            <motion.button
              whileTap={{ scale: 1.4 }}
              onClick={handleToggleFav}
              className={cn(
                "ml-2 flex-none transition-colors p-1",
                isFav ? "text-rose-500" : "text-zinc-300 hover:text-rose-400"
              )}
            >
              <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
            </motion.button>
          </div>

          <div className="mt-1 flex items-center gap-2 text-[13px]">
            <span className="text-orange-500 font-bold flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-current" /> {place.rating.toFixed(1)}
            </span>
            <span className="text-zinc-400">({place.reviewCount.toLocaleString()})</span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-600 dark:text-zinc-300 font-medium">{CAT_LABEL[place.category]}</span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-500 font-bold">{'$'.repeat(place.priceLevel)}</span>
          </div>

          <div className="mt-1.5 text-[12px] text-zinc-500 flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-zinc-400" />
            <span className="truncate">{place.address}</span>
            <span className="text-zinc-300">·</span>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">{place.distanceKm.toFixed(1)}км</span>
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

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {place.highlights.slice(0, 3).map(h => (
              <span
                key={h}
                className="rounded-full bg-zinc-100 dark:bg-white/8 px-2.5 py-0.5 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium"
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
