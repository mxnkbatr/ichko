import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Calendar, Clock, Users, MapPin, 
  Plus, X, RotateCcw, XCircle, ChevronDown,
  CalendarCheck2, Search
} from 'lucide-react'
import { cancelBooking, listBookings, rescheduleBooking } from '../lib/bookings'
import { getPlaceById } from '../data/places'
import { generateSlots, todayIso } from '../lib/time'
import { cn } from '../lib/cn'
import { useI18n } from '../lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'

export function BookingsPage() {
  const { t } = useI18n()
  const [sp, setSp] = useSearchParams()
  const bookings = listBookings()
  const confirmed = bookings.filter((b) => b.status === 'confirmed')
  const cancelled = bookings.filter((b) => b.status === 'cancelled')

  // Reschedule state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null)
  const [newDate, setNewDate] = useState(todayIso())
  const [newTime, setNewTime] = useState('19:00')

  const slots = generateSlots({ start: '11:00', end: '23:00', stepMin: 30 })

  const handleReschedule = (id: string) => {
    rescheduleBooking(id, newDate, newTime)
    setReschedulingId(null)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-[32px] font-black tracking-tight text-zinc-950 dark:text-white">Миний захиалгууд</h1>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-[14px] font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95"
        >
          <Plus className="h-4.5 w-4.5" />
          Шинэ захиалга
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border border-zinc-100 bg-white py-24 text-center dark:border-white/5 dark:bg-white/3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50 text-[32px] dark:bg-white/5">
            📅
          </div>
          <h2 className="mt-6 text-[20px] font-black text-zinc-900 dark:text-white">Одоогоор захиалга байхгүй байна</h2>
          <p className="mt-2 text-[15px] text-zinc-500">Шинэ газар хайж ширээ захиалаарай.</p>
          <Link
            to="/"
            className="mt-8 flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3.5 text-[14px] font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black"
          >
            <Search className="h-4 w-4" />
            Газар хайж захиалах
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Confirmed Section */}
          {confirmed.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-zinc-400">БАТАЛГААЖСАН ({confirmed.length})</h2>
              </div>
              <motion.div 
                variants={{
                  show: { transition: { staggerChildren: 0.04 } }
                }}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {confirmed.map((b) => {
                  const place = getPlaceById(b.placeId)
                  const isEditing = reschedulingId === b.id
                  
                  return (
                    <motion.div
                      key={b.id}
                      layout
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0 }
                      }}
                      className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-white/8 dark:bg-zinc-900"
                    >
                      <div className="flex flex-wrap gap-4 p-5 md:flex-nowrap">
                        {/* Photo */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                          <img src={place?.photos[0]?.url} className="h-full w-full object-cover" />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-[18px] font-black text-zinc-900 dark:text-white">{b.placeName}</h3>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                  CONFIRMED
                                </span>
                              </div>
                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {b.date}</span>
                                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {b.time}</span>
                                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {b.people} хүн</span>
                              </div>
                              <div className="mt-2 flex items-center gap-1.5 text-[12px] text-zinc-400">
                                <MapPin className="h-3 w-3" /> {place?.address}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => {
                                if (isEditing) setReschedulingId(null)
                                else {
                                  setReschedulingId(b.id)
                                  setNewDate(b.date)
                                  setNewTime(b.time)
                                }
                              }}
                              className={cn(
                                "flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold transition",
                                isEditing 
                                  ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white" 
                                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 dark:bg-transparent dark:border-white/10 dark:text-zinc-400"
                              )}
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Цаг өөрчлөх
                            </button>
                            <button
                              onClick={() => cancelBooking(b.id)}
                              className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[12px] font-bold text-rose-500 transition hover:bg-rose-50 dark:bg-transparent dark:border-white/10 dark:hover:bg-rose-500/10"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Цуцлах
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Reschedule Accordion */}
                      <AnimatePresence>
                        {isEditing && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="border-t border-zinc-100 bg-zinc-50 dark:border-white/5 dark:bg-white/3"
                          >
                            <div className="p-6">
                              <h4 className="mb-4 text-[13px] font-bold text-zinc-900 dark:text-white">Шинэ цаг сонгох</h4>
                              <div className="grid gap-4 md:grid-cols-2">
                                <input
                                  type="date"
                                  value={newDate}
                                  onChange={e => setNewDate(e.target.value)}
                                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-[14px] font-bold outline-none dark:border-white/10 dark:bg-zinc-900"
                                />
                                <div className="grid grid-cols-4 gap-2">
                                  {slots.slice(12, 20).map(s => (
                                    <button
                                      key={s}
                                      onClick={() => setNewTime(s)}
                                      className={cn(
                                        "rounded-xl border py-2 text-[12px] font-bold transition",
                                        newTime === s 
                                          ? "bg-zinc-900 text-white dark:bg-white dark:text-black" 
                                          : "bg-white border-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:border-white/5"
                                      )}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-6 flex justify-end gap-2">
                                <button
                                  onClick={() => setReschedulingId(null)}
                                  className="rounded-full px-5 py-2 text-[13px] font-bold text-zinc-500"
                                >
                                  Болих
                                </button>
                                <button
                                  onClick={() => handleReschedule(b.id)}
                                  className="rounded-full bg-orange-500 px-6 py-2 text-[13px] font-black text-white"
                                >
                                  Хадгалах
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            </section>
          )}

          {/* Cancelled Section */}
          {cancelled.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3 opacity-50">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-zinc-400">ЦУЦЛАГДСАН ({cancelled.length})</h2>
              </div>
              <div className="space-y-3 opacity-60">
                {cancelled.map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-3xl border border-zinc-100 bg-white p-4 dark:border-white/5 dark:bg-white/2">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl grayscale opacity-50">
                        <img src={getPlaceById(b.placeId)?.photos[0]?.url} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-zinc-900 dark:text-white line-through">{b.placeName}</div>
                        <div className="text-[12px] text-zinc-500">{b.date} · {b.time}</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500">CANCELLED</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
