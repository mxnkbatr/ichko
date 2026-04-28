import { CalendarCheck, Plus, RotateCcw, XCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { cancelBooking, listBookings, rescheduleBooking } from '../lib/bookings'
import { generateSlots, todayIso } from '../lib/time'
import { cn } from '../lib/cn'
import { useI18n } from '../lib/i18n'

export function BookingsPage() {
  const { t } = useI18n()
  const [sp, setSp] = useSearchParams()
  const action = sp.get('action')
  const bookingId = sp.get('id')
  const date = sp.get('date') ?? todayIso()
  const time = sp.get('time') ?? '19:00'

  const bookings = listBookings()
  const confirmed = bookings.filter((b) => b.status === 'confirmed')

  const slots = generateSlots({ start: '11:00', end: '23:00', stepMin: 30 })

  return (
    <PageShell
      title={t('bookings_title')}
      subtitle={t('bookings_subtitle')}
      right={
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-3 py-2 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95 dark:bg-white dark:text-black"
        >
          <Plus className="h-4 w-4" />
          {t('bookings_new')}
        </Link>
      }
    >
      <div className="space-y-4">
        {action === 'reschedule' && bookingId ? (
          <div className="rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[14px] font-semibold text-zinc-900 dark:text-zinc-50">
                  <RotateCcw className="h-4 w-4 text-zinc-400" />
                  {t('bookings_reschedule_title')}
                </div>
                <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                  {t('bookings_reschedule_hint')}
                </div>
              </div>
              <Link
                to="/bookings"
                className="rounded-2xl bg-zinc-100 px-3 py-2 text-[13px] font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
              >
                {t('common_close')}
              </Link>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <div className="mb-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
                  Date
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    const next = new URLSearchParams(sp)
                    next.set('date', e.target.value)
                    setSp(next, { replace: true })
                  }}
                  className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2.5 text-[14px] outline-none ring-brand-500/40 focus:ring-2 dark:border-white/10 dark:bg-white/5"
                />
              </label>

              <div className="block">
                <div className="mb-2 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
                  Time slot
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {slots.slice(8, 20).map((s) => {
                    const active = time === s
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          const next = new URLSearchParams(sp)
                          next.set('time', s)
                          setSp(next, { replace: true })
                        }}
                        className={cn(
                          'rounded-2xl border px-2 py-2 text-[12px] font-semibold transition',
                          active
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
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  rescheduleBooking(bookingId, date, time)
                  setSp(new URLSearchParams(), { replace: true })
                }}
                className="rounded-2xl bg-brand-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95"
              >
                {t('bookings_save_changes')}
              </button>
              <Link
                to="/bookings"
                className="rounded-2xl bg-zinc-100 px-4 py-2.5 text-[13px] font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
              >
                {t('common_cancel')}
              </Link>
            </div>
          </div>
        ) : null}

        {bookings.length === 0 ? (
          <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-500/10 text-brand-700 dark:text-brand-200">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-50">
                {t('bookings_none')}
              </div>
              <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                {t('bookings_none_hint')}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {confirmed.map((b) => (
              <div
                key={b.id}
                className="rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-50">
                      {b.placeName}
                    </div>
                    <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                      {b.date} · {b.time} · {b.people} хүн · {b.name}
                    </div>
                    {b.note ? (
                      <div className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-300">
                        {t('common_note')}: {b.note}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <Link
                      to={`/bookings?action=reschedule&id=${b.id}&date=${encodeURIComponent(b.date)}&time=${encodeURIComponent(b.time)}`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-3 py-2 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95 dark:bg-white dark:text-black"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t('bookings_reschedule')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => cancelBooking(b.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-3 py-2 text-[13px] font-semibold text-white transition hover:opacity-95"
                    >
                      <XCircle className="h-4 w-4" />
                      {t('bookings_cancel')}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {bookings.some((b) => b.status === 'cancelled') ? (
              <details className="rounded-3xl border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                <summary className="cursor-pointer text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
                  {t('bookings_cancelled')} (
                  {bookings.filter((b) => b.status === 'cancelled').length})
                </summary>
                <div className="mt-3 space-y-2">
                  {bookings
                    .filter((b) => b.status === 'cancelled')
                    .map((b) => (
                      <div
                        key={b.id}
                        className="rounded-2xl border border-zinc-200 bg-white/70 p-3 text-[13px] text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                      >
                        {b.placeName} · {b.date} · {b.time} · {b.people} хүн
                      </div>
                    ))}
                </div>
              </details>
            ) : null}
          </div>
        )}
      </div>
    </PageShell>
  )
}

