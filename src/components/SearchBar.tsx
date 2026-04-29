import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'
import { cn } from '../lib/cn'

const RECENT_KEY = 'hool.search.recent'
const MAX_RECENT = 8

const placeholders = [
  'Тавиур кафе хаана байна?',
  'Romantic dinner for 2...',
  'Craft beer + live music...',
]

const trending = ['Бууз', 'Specialty coffee', 'Date night', 'Work cafe', 'Craft beer']

function readRecent() {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

export function addRecentSearch(query: string) {
  const q = query.trim()
  if (!q || typeof window === 'undefined') return
  const next = [q, ...readRecent().filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(
    0,
    MAX_RECENT,
  )
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

export function getRecentSearches() {
  return readRecent()
}

export function SearchBar({
  onOpenModal,
  onSearch,
  onCategorySelect,
}: {
  onOpenModal: () => void
  onSearch: (query: string) => void
  onCategorySelect: (category: 'restaurant' | 'cafe' | 'pub') => void
}) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [q, setQ] = useState('')
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    setRecent(getRecentSearches())
    const timer = window.setInterval(() => {
      setPlaceholderIndex((v) => (v + 1) % placeholders.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [])

  const currentPlaceholder = useMemo(
    () => placeholders[placeholderIndex] ?? placeholders[0],
    [placeholderIndex],
  )

  function submit(value: string) {
    const text = value.trim()
    if (!text) return
    addRecentSearch(text)
    setRecent(getRecentSearches())
    onSearch(text)
  }

  return (
    <div className="hidden w-full max-w-2xl md:block">
      <div className="relative flex w-full items-center gap-2 rounded-[2rem] border border-zinc-200/60 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <Search className="h-4 w-4 shrink-0 text-zinc-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit(q)
          }}
          onFocus={onOpenModal}
          placeholder={currentPlaceholder}
          className="w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-zinc-400"
        />
        <button
          type="button"
          onClick={onOpenModal}
          className="inline-flex items-center gap-1 rounded-xl bg-brand-500/10 px-2 py-1 text-[11px] font-semibold text-brand-700 dark:text-brand-200"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI
        </button>
        <span className="hidden rounded-lg border border-zinc-200 bg-white/80 px-2 py-1 text-[11px] font-semibold text-zinc-500 dark:border-white/10 dark:bg-white/5 md:inline">
          ⌘K
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentPlaceholder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute left-10 top-3.5 hidden text-[14px] text-zinc-400 sm:block"
          >
            {q ? '' : currentPlaceholder}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {recent.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => submit(item)}
            className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-zinc-700 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {trending.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => submit(item)}
            className="rounded-full bg-zinc-100 px-3 py-1.5 text-[12px] font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {[
          { id: 'restaurant', label: '🍽️ Ресторан' },
          { id: 'cafe', label: '☕ Кафе' },
          { id: 'pub', label: '🍺 Паб' },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onCategorySelect(c.id as 'restaurant' | 'cafe' | 'pub')}
            className={cn(
              'rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-[12px] font-semibold text-brand-700 transition hover:bg-brand-500/20 dark:text-brand-200',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
