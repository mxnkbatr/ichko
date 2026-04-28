import { useMemo, useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import type { Review } from '../lib/reviews'
import { cn } from '../lib/cn'

function stars(rating: number) {
  return '★'.repeat(Math.max(0, Math.min(5, Math.round(rating))))
}

function dateText(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

export function ReviewCard({
  review,
  onHelpful,
  className,
}: {
  review: Review
  onHelpful?: (id: string) => void
  className?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const hasLongText = review.text.length > 130
  const photos = useMemo(() => review.photos ?? [], [review.photos])

  return (
    <div
      className={cn(
        'rounded-[2rem] border border-zinc-200/50 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <img
          src={review.authorAvatar}
          alt={review.authorName}
          className="h-10 w-10 rounded-full border border-white/70 object-cover dark:border-white/20"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
              {review.authorName}
            </div>
            <div className="text-[12px] text-zinc-500 dark:text-zinc-400">
              {dateText(review.date)}
            </div>
          </div>
          <div className="mt-0.5 text-[12px] tracking-wide text-amber-500">
            {stars(review.rating)}{' '}
            <span className="ml-1 text-zinc-500 dark:text-zinc-400">
              {review.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div
        className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-zinc-700 dark:text-zinc-300"
        style={
          expanded
            ? undefined
            : {
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
        }
      >
        {review.text}
      </div>
      {hasLongText ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-[12px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          {expanded ? 'Хураах' : '더보기'}
        </button>
      ) : null}

      {photos.length ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((p) => (
            <img
              key={p}
              src={p}
              alt="review"
              className="h-16 w-20 shrink-0 rounded-xl border border-zinc-200 object-cover dark:border-white/10"
            />
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onHelpful?.(review.id)}
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-zinc-700 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        Helpful ({review.helpful})
      </button>
    </div>
  )
}
