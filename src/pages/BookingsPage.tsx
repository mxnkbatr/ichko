import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, Clock, Users, MapPin, 
  Plus, RotateCcw, XCircle,
  Search
} from 'lucide-react'
import { cancelBooking, listBookings, rescheduleBooking } from '../lib/bookings'
import { places as allPlaces, getPlaceById } from '../data/places'
import { generateSlots, todayIso } from '../lib/time'
import { cn } from '../lib/cn'
import { motion, AnimatePresence } from 'framer-motion'

// ── Stars Helper ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-orange-500">
      <span className="text-[14px]">★</span>
      <span className="text-[12px] font-black text-zinc-900 dark:text-zinc-100">{rating.toFixed(1)}</span>
    </div>
  )
}

export function BookingsPage() {
  const allBookings = listBookings()
  const [tab, setTab] = useState<'active' | 'completed' | 'cancelled'>('active')

  const bookings = useMemo(() => {
    if (tab === 'active') return allBookings.filter(b => b.status === 'confirmed')
    if (tab === 'completed') return [] // Mock empty for completed
    if (tab === 'cancelled') return allBookings.filter(b => b.status === 'cancelled')
    return []
  }, [allBookings, tab])

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
    <div className="min-h-svh bg-zinc-50 pb-20 dark:bg-[#0f0f12]">
      <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[28px] font-black tracking-tight text-zinc-950 dark:text-white md:text-[32px]">Миний захиалгууд</h1>
          <Link
            to="/"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 text-orange-600 transition hover:bg-orange-200 active:scale-95 dark:bg-orange-500/20 dark:text-orange-500"
          >
            <Plus className="h-5 w-5 stroke-[2.5px]" />
          </Link>
        </div>

        {/* Segmented Control */}
        <div className="mb-8 flex rounded-2xl bg-zinc-200/60 p-1 dark:bg-white/5">
          {(['active', 'completed', 'cancelled'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setReschedulingId(null) }}
              className={cn(
                "flex-1 rounded-[14px] py-2.5 text-[13px] font-bold transition-all",
                tab === t
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              {t === 'active' ? 'Идэвхтэй' : t === 'completed' ? 'Дууссан' : 'Цуцлагдсан'}
            </button>
          ))}
        </div>

        {bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-zinc-100 bg-white py-16 text-center shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
              <div className="relative mb-6">
                <div className="absolute inset-0 scale-150 rounded-full bg-orange-500/10 blur-2xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl dark:bg-zinc-800">
                  <Calendar className="h-10 w-10 text-orange-500" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-[18px] font-black text-zinc-950 dark:text-white">
                {tab === 'active' ? 'Идэвхтэй захиалга байхгүй байна' : tab === 'completed' ? 'Дууссан захиалга алга' : 'Цуцлагдсан захиалга алга'}
              </h2>
              <p className="mt-2 max-w-[200px] text-[14px] font-medium text-zinc-400">Шинэ газар хайж ширээ захиалаарай.</p>
              
              {tab === 'active' && (
                <Link
                  to="/"
                  className="mt-8 flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-[14px] font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-95"
                >
                  <Search className="h-4 w-4" />
                  Газар хайж захиалах
                </Link>
              )}
            </div>

            {/* Recommended Section (Simplified for now) */}
            {tab === 'active' && (
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Танд санал болгох</h3>
                  <Link to="/" className="text-[12px] font-bold text-orange-500">Бүгдийг харах</Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {allPlaces.slice(0, 3).map(p => (
                    <Link key={p.id} to={`/place/${p.id}`} className="w-[200px] shrink-0 group">
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-zinc-100">
                        <img src={p.photos[0]?.url} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="mt-3">
                        <h4 className="font-bold text-zinc-900 dark:text-white line-clamp-1">{p.name}</h4>
                        <div className="mt-0.5 flex items-center gap-2 text-[12px] text-zinc-500">
                          <div className="flex items-center gap-1 text-orange-500">
                            <StarRating rating={p.rating} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            <motion.div 
              variants={{ show: { transition: { staggerChildren: 0.04 } } }}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {bookings.map((b) => {
                const place = getPlaceById(b.placeId)
                const isEditing = reschedulingId === b.id
                
                if (tab === 'cancelled') {
                  return (
                    <motion.div
                      key={b.id}
                      layout
                      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                      className="overflow-hidden rounded-[24px] border border-zinc-100 bg-white shadow-sm opacity-60 dark:border-white/8 dark:bg-zinc-900/50"
                    >
                      <div className="flex gap-4 p-5">
                        <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 grayscale dark:bg-zinc-800">
                          <img src={place?.photos[0]?.url} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col justify-center gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-[16px] md:text-[18px] font-bold text-zinc-900 line-through dark:text-white leading-snug line-clamp-1">{b.placeName}</h3>
                            <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-rose-500 dark:bg-rose-500/10 dark:text-rose-400">
                              CANCELLED
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 stroke-[1.5px]" /> {b.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 stroke-[1.5px]" /> {b.time}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                }

                // Active (Confirmed)
                return (
                  <motion.div
                    key={b.id}
                    layout
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    className="overflow-hidden rounded-[24px] border border-zinc-100 bg-white shadow-sm dark:border-white/8 dark:bg-zinc-900/50"
                  >
                    <div className="flex gap-4 p-5">
                      {/* Photo */}
                      <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                        <img src={place?.photos[0]?.url} className="h-full w-full object-cover" />
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-[16px] md:text-[18px] font-bold text-zinc-900 dark:text-white leading-snug line-clamp-1">{b.placeName}</h3>
                            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                              CONFIRMED
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 stroke-[1.5px]" /> {b.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 stroke-[1.5px]" /> {b.time}</span>
                            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 stroke-[1.5px]" /> {b.people} хүн</span>
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center gap-1.5 text-[12px] text-zinc-400">
                          <MapPin className="h-3.5 w-3.5 stroke-[1.5px] shrink-0" /> <span className="truncate">{place?.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex divide-x divide-zinc-100 border-t border-zinc-100 bg-zinc-50/50 dark:divide-white/5 dark:border-white/5 dark:bg-white/2">
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
                          "flex flex-1 items-center justify-center gap-2 py-3.5 text-[13px] font-bold transition",
                          isEditing 
                            ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5"
                        )}
                      >
                        <RotateCcw className="h-4 w-4 stroke-[1.5px]" />
                        Цаг өөрчлөх
                      </button>
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[13px] font-bold text-rose-500 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                      >
                        <XCircle className="h-4 w-4 stroke-[1.5px]" />
                        Цуцлах
                      </button>
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
                          <div className="p-5 md:p-6">
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
                                className="rounded-full px-5 py-2 text-[13px] font-bold text-zinc-500 transition hover:bg-zinc-200 dark:hover:bg-white/10"
                              >
                                Болих
                              </button>
                              <button
                                onClick={() => handleReschedule(b.id)}
                                className="rounded-full bg-orange-500 px-6 py-2 text-[13px] font-black text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95"
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
          </div>
        )}
      </div>
    </div>
  )
}
