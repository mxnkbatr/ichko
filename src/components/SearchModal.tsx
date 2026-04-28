import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Star, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { places } from '../data/places'
import { addRecentSearch, getRecentSearches } from './SearchBar'
import { cn } from '../lib/cn'

type PlaceCategory = 'restaurant' | 'cafe' | 'pub'

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    if (!open) return
    setRecent(getRecentSearches())
    setQ('')
    setDebouncedQ('')
    setActiveIndex(0)
  }, [open])

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(q), 150)
    return () => window.clearTimeout(timer)
  }, [q])

  const results = useMemo(() => {
    const text = debouncedQ.trim().toLowerCase()
    if (!text) return []
    return places
      .filter((p) => {
        const hay = `${p.name} ${p.address} ${p.highlights.join(' ')} ${p.category}`.toLowerCase()
        return hay.includes(text)
      })
      .slice(0, 16)
  }, [debouncedQ])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'ArrowDown' && results.length) {
        e.preventDefault()
        setActiveIndex((v) => (v + 1) % results.length)
      }
      if (e.key === 'ArrowUp' && results.length) {
        e.preventDefault()
        setActiveIndex((v) => (v - 1 + results.length) % results.length)
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const selected = results[activeIndex]
        if (selected) {
          addRecentSearch(selected.name)
          nav(`/place/${selected.id}`)
          onClose()
        } else if (q.trim()) {
          addRecentSearch(q.trim())
          nav(`/?q=${encodeURIComponent(q.trim())}`)
          onClose()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, nav, onClose, open, q, results])

  function searchText(text: string) {
    addRecentSearch(text)
    nav(`/?q=${encodeURIComponent(text)}`)
    onClose()
  }

  function searchCategory(category: PlaceCategory) {
    nav(`/?cat=${encodeURIComponent(category)}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 14 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 mx-auto h-full max-w-5xl overflow-y-auto px-4 py-6"
          >
            <div className="rounded-[2.2rem] border border-zinc-200/60 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#101010]/90">
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-200/70 bg-white/80 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                <Search className="h-4 w-4 text-zinc-500" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search places, vibes, food..."
                  className="w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-zinc-400"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {recent.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => searchText(item)}
                    className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                  >
                    {item}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => searchCategory('restaurant')}
                  className="rounded-full bg-brand-500/10 px-3 py-1.5 text-[12px] font-semibold text-brand-700 dark:text-brand-200"
                >
                  🍽️ Ресторан
                </button>
                <button
                  type="button"
                  onClick={() => searchCategory('cafe')}
                  className="rounded-full bg-brand-500/10 px-3 py-1.5 text-[12px] font-semibold text-brand-700 dark:text-brand-200"
                >
                  ☕ Кафе
                </button>
                <button
                  type="button"
                  onClick={() => searchCategory('pub')}
                  className="rounded-full bg-brand-500/10 px-3 py-1.5 text-[12px] font-semibold text-brand-700 dark:text-brand-200"
                >
                  🍺 Паб
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {results.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      addRecentSearch(p.name)
                      nav(`/place/${p.id}`)
                      onClose()
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-200/70 bg-white/60 px-4 py-3 text-left backdrop-blur dark:border-white/10 dark:bg-white/5',
                      idx === activeIndex && 'border-brand-500/50 bg-brand-500/10',
                    )}
                  >
                    <div>
                      <div className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
                        {p.name}
                      </div>
                      <div className="mt-1 inline-flex items-center gap-2 text-[12px] text-zinc-500 dark:text-zinc-400">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-white/10">
                          {p.category}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-brand-500" />
                          {p.rating.toFixed(1)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {p.distanceKm.toFixed(1)} км
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                {!results.length && debouncedQ.trim() ? (
                  <div className="rounded-2xl border border-zinc-200 bg-white/60 px-4 py-4 text-[13px] text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                    Илэрц олдсонгүй.
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
