import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, Phone, Star } from 'lucide-react'
import { getPlaceById } from '../data/places'
import { Badge } from '../components/Badge'
import { useI18n } from '../lib/i18n'

function priceText(level: 1 | 2 | 3) {
  return '$'.repeat(level)
}

export function PlaceDetailsPage() {
  const { t } = useI18n()
  const { placeId } = useParams()
  const place = placeId ? getPlaceById(placeId) : undefined

  if (!place) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 text-[14px] text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
        {t('place_not_found')}.{' '}
        <Link to="/" className="underline">
          {t('common_back')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-3 py-2 text-[13px] font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common_back')}
        </Link>

        <Link
          to={`/place/${place.id}/book`}
          className="rounded-2xl bg-brand-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95"
        >
          {t('place_details_book_time')}
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="relative h-[260px]">
            <img
              src={place.photos[0]?.url}
              alt={place.photos[0]?.alt ?? place.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-[24px] font-semibold tracking-tight text-white">
                {place.name}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="border-white/15 bg-white/10 text-white">
                  {priceText(place.priceLevel)}
                </Badge>
                <Badge className="border-white/15 bg-white/10 text-white">
                  <Star className="mr-1 inline h-3.5 w-3.5 text-brand-300" />
                  {place.rating.toFixed(1)}{' '}
                  <span className="text-white/70">({place.reviewCount})</span>
                </Badge>
                <Badge className="border-white/15 bg-white/10 text-white">
                  {place.distanceKm.toFixed(1)} {t('place_away_km')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid gap-3 text-[13px] text-zinc-700 dark:text-zinc-200 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <div className="font-semibold">{t('place_address')}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {place.address}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <div className="font-semibold">{t('place_hours')}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {place.openNow ? t('place_open') : t('place_closed')} ·{' '}
                    {t('place_closes_at')} {place.closesAt}
                  </div>
                </div>
              </div>
              {place.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-zinc-400" />
                  <div>
                    <div className="font-semibold">{t('place_phone')}</div>
                    <div className="text-zinc-500 dark:text-zinc-400">
                      {place.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5">
              <div className="text-[14px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t('place_highlights')}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {place.highlights.map((h) => (
                  <Badge
                    key={h}
                    className="border-brand-500/20 bg-brand-500/10 text-brand-700 dark:text-brand-200"
                  >
                    {h}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="text-[14px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t('place_menu_picks')}
            </div>
            <div className="mt-3 space-y-3">
              {place.menu.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-50">
                        {m.name}
                      </div>
                      <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                        {m.description}
                      </div>
                      {m.tags?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.tags.map((t) => (
                            <Badge key={t}>{t}</Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="shrink-0 rounded-xl bg-zinc-900 px-2.5 py-1.5 text-[13px] font-semibold text-white dark:bg-white dark:text-black">
                      {m.priceMnt.toLocaleString()}₮
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={`/place/${place.id}/book`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-brand-500 px-4 py-3 text-[14px] font-semibold text-white shadow-glass transition hover:opacity-95"
            >
              {t('place_book_table')}
            </Link>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white/70 p-5 text-[13px] text-zinc-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            Энэ бол UI prototype. Дараагийн шатанд Maps API, real-time “open
            hours”, төлбөр/баталгаажуулалт, бодит захиалгын backend холбоно.
          </div>
        </div>
      </div>
    </div>
  )
}

