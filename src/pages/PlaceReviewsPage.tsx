import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getPlaceById } from '../data/places'
import { getReviews, markHelpful } from '../lib/reviews'
import { ReviewCard } from '../components/ReviewCard'
import { WriteReviewSheet } from '../components/WriteReviewSheet'

export function PlaceReviewsPage() {
  const { placeId } = useParams()
  const place = placeId ? getPlaceById(placeId) : undefined
  const [openWrite, setOpenWrite] = useState(false)
  const [refreshTick, setRefreshTick] = useState(0)

  const reviews = useMemo(() => {
    if (!place) return []
    void refreshTick
    return getReviews(place.id)
  }, [place, refreshTick])

  if (!place) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 text-[14px] text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
        Place not found.
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={`/place/${place.id}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-3 py-2 text-[13px] font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
        >
          <ArrowLeft className="h-4 w-4" />
          Буцах
        </Link>
        <button
          type="button"
          onClick={() => setOpenWrite(true)}
          className="rounded-2xl bg-brand-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95"
        >
          Үнэлгээ өгөх
        </button>
      </div>

      <div className="rounded-[2rem] border border-zinc-200/60 bg-white/60 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="text-[18px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {place.name} · Бүх үнэлгээ
        </div>
        <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
          Нийт {reviews.length} review
        </div>
      </div>

      <div className="space-y-3">
        {reviews.length ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpful={(id) => {
                markHelpful(id)
                setRefreshTick((v) => v + 1)
              }}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 text-[13px] text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            Одоогоор review байхгүй байна.
          </div>
        )}
      </div>

      <WriteReviewSheet
        placeId={place.id}
        open={openWrite}
        onClose={() => setOpenWrite(false)}
        onAdded={() => setRefreshTick((v) => v + 1)}
      />
    </div>
  )
}
