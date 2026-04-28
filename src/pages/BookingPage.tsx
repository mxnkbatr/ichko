import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Calendar, CheckCircle2, Clock, Users } from 'lucide-react'
import { getPlaceById } from '../data/places'
import { createBooking, hasConflict } from '../lib/bookings'
import { generateSlots, todayIso } from '../lib/time'
import { cn } from '../lib/cn'
import { useI18n } from '../lib/i18n'

const DEFAULT_OPEN = '11:00'

export function BookingPage() {
  const { t } = useI18n()
  const nav = useNavigate()
  const { placeId } = useParams()
  const [sp] = useSearchParams()
  const place = placeId ? getPlaceById(placeId) : undefined

  const [date, setDate] = useState(() => sp.get('date') ?? todayIso())
  const [time, setTime] = useState(() => sp.get('time') ?? '19:00')
  const [people, setPeople] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const summary = useMemo(() => {
    return `${date} • ${time} • ${people} хүн`
  }, [date, time, people])

  const slots = useMemo(() => {
    const close = place?.closesAt || '23:00'
    const start = DEFAULT_OPEN
    return generateSlots({ start, end: close, stepMin: 30 })
  }, [place?.closesAt])

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
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={`/place/${place.id}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-3 py-2 text-[13px] font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common_back')}
        </Link>
        <button
          type="button"
          onClick={() => nav('/')}
          className="rounded-2xl px-3 py-2 text-[13px] font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"
        >
          {t('common_exit')}
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[22px] font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {t('booking_title')}
            </div>
            <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
              {place.name} · {place.address}
            </div>
          </div>
          <div className="rounded-2xl bg-brand-500/10 px-3 py-2 text-[13px] font-semibold text-brand-700 dark:text-brand-200">
            {summary}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-[13px] font-semibold text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
            {error}
          </div>
        )}

        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            setError(null)
            if (hasConflict(place.id, date, time)) {
              setError(t('booking_error_conflict'))
              return
            }
            createBooking({
              placeId: place.id,
              placeName: place.name,
              date,
              time,
              people,
              name,
              phone,
              note: note.trim() ? note : undefined,
            })
            setSubmitted(true)
            setTimeout(() => nav('/bookings'), 600)
          }}
        >
          <label className="block">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              <Calendar className="h-4 w-4 text-zinc-400" />
              Өдөр
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2.5 text-[14px] outline-none ring-brand-500/40 focus:ring-2 dark:border-white/10 dark:bg-white/5"
              required
            />
          </label>

          <div className="block">
            <div className="mb-2 flex items-center justify-between gap-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-400" />
                {t('booking_time_slot')}
              </span>
              <span className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                {DEFAULT_OPEN}–{place.closesAt}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((s) => {
                const busy = hasConflict(place.id, date, s)
                const active = time === s
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={busy}
                    onClick={() => setTime(s)}
                    className={cn(
                      'rounded-2xl border px-3 py-2 text-[13px] font-semibold transition',
                      busy
                        ? 'cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-white/10 dark:bg-white/5 dark:text-white/30'
                        : active
                          ? 'border-brand-500/40 bg-brand-500 text-white shadow-glass'
                          : 'border-zinc-200 bg-white/70 text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10',
                    )}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="block">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              <Users className="h-4 w-4 text-zinc-400" />
              {t('booking_people')}
            </div>
            <input
              type="number"
              min={1}
              max={20}
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2.5 text-[14px] outline-none ring-brand-500/40 focus:ring-2 dark:border-white/10 dark:bg-white/5"
              required
            />
          </label>

          <label className="block">
            <div className="mb-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              {t('booking_name')}
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('booking_name')}
              className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2.5 text-[14px] outline-none ring-brand-500/40 focus:ring-2 dark:border-white/10 dark:bg-white/5"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <div className="mb-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              {t('booking_phone')}
            </div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+976 .... ...."
              className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2.5 text-[14px] outline-none ring-brand-500/40 focus:ring-2 dark:border-white/10 dark:bg-white/5"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <div className="mb-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              {t('booking_note')}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('booking_note_ph')}
              rows={4}
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2.5 text-[14px] outline-none ring-brand-500/40 focus:ring-2 dark:border-white/10 dark:bg-white/5"
            />
          </label>

          <button
            type="submit"
            className="sm:col-span-2 rounded-2xl bg-brand-500 px-4 py-3 text-[14px] font-semibold text-white shadow-glass transition hover:opacity-95"
          >
            {t('booking_confirm')}
          </button>
        </form>
      </div>

      {submitted && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm backdrop-blur dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-emerald-900 dark:text-emerald-100">
                {t('booking_created')}
              </div>
              <div className="mt-1 text-[13px] text-emerald-700 dark:text-emerald-200">
                {place.name} · {summary} · {name}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/"
                  className="rounded-2xl bg-emerald-600 px-3 py-2 text-[13px] font-semibold text-white transition hover:opacity-95"
                >
                  {t('nav_explore')}
                </Link>
                <Link
                  to="/bookings"
                  className="rounded-2xl bg-white px-3 py-2 text-[13px] font-semibold text-emerald-900 ring-1 ring-emerald-200 transition hover:bg-emerald-50 dark:bg-black/30 dark:text-emerald-50 dark:ring-emerald-500/30 dark:hover:bg-black/40"
                >
                  {t('nav_bookings')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

