import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ImagePlus } from 'lucide-react'
import { addReview } from '../lib/reviews'
import { cn } from '../lib/cn'

export function WriteReviewSheet({
  placeId,
  open,
  onClose,
  onAdded,
}: {
  placeId: string
  open: boolean
  onClose: () => void
  onAdded?: () => void
}) {
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function reset() {
    setAuthorName('')
    setRating(5)
    setText('')
    setError('')
  }

  function submit() {
    if (text.trim().length < 20) {
      setError('Үнэлгээний текст хамгийн багадаа 20 тэмдэгт байна.')
      return
    }
    addReview({
      placeId,
      authorName: authorName.trim() || 'Guest',
      authorAvatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
        authorName.trim() || 'Guest',
      )}`,
      rating,
      text: text.trim(),
      photos: [],
    })
    reset()
    onAdded?.()
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ y: 440, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 480, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 240 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-2xl rounded-t-[2.2rem] border border-zinc-200/70 bg-white/90 p-5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#121212]/95"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Үнэлгээ өгөх
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-zinc-100 p-2 text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Таны нэр"
                className="w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-[14px] outline-none ring-brand-500/40 placeholder:text-zinc-400 focus:ring-2 dark:border-white/10 dark:bg-white/5"
              />

              <div>
                <div className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-200">
                  Үнэлгээ
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1
                    const active = val <= rating
                    return (
                      <motion.button
                        key={val}
                        whileTap={{ scale: 0.88 }}
                        whileHover={{ scale: 1.05 }}
                        type="button"
                        onClick={() => setRating(val)}
                        className={cn(
                          'h-9 w-9 rounded-full text-xl leading-none transition',
                          active
                            ? 'bg-amber-100 text-amber-500 dark:bg-amber-500/20'
                            : 'bg-zinc-100 text-zinc-400 dark:bg-white/10',
                        )}
                      >
                        ★
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="Туршлагаа 20+ тэмдэгтээр бичнэ үү..."
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-[14px] outline-none ring-brand-500/40 placeholder:text-zinc-400 focus:ring-2 dark:border-white/10 dark:bg-white/5"
                />
                {error ? (
                  <div className="mt-1 text-[12px] text-rose-500">{error}</div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-zinc-50/70 p-4 dark:border-white/15 dark:bg-white/5">
                <div className="flex items-center gap-2 text-[13px] text-zinc-600 dark:text-zinc-300">
                  <ImagePlus className="h-4 w-4" />
                  Зураг нэмэх (UI placeholder)
                </div>
              </div>

              <button
                type="button"
                onClick={submit}
                className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-[14px] font-semibold text-white shadow-glass transition hover:opacity-95"
              >
                Илгээх
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
