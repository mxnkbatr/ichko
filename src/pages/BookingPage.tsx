import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, Calendar, Check, Clock, Users, 
  ChevronRight, Phone, User, MessageSquare, ShieldCheck,
  CheckCircle2, Home, List
} from 'lucide-react'
import { getPlaceById } from '../data/places'
import { createBooking, hasConflict } from '../lib/bookings'
import { generateSlots, todayIso } from '../lib/time'
import { cn } from '../lib/cn'
import { useI18n } from '../lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'

const DEFAULT_OPEN = '11:00'

export function BookingPage() {
  const { t } = useI18n()
  const nav = useNavigate()
  const { placeId } = useParams()
  const [sp] = useSearchParams()
  const place = placeId ? getPlaceById(placeId) : undefined

  const [date, setDate] = useState(() => sp.get('date') ?? todayIso())
  const [time, setTime] = useState(() => sp.get('time') ?? '19:00')
  const [people, setPeople] = useState(() => Number(sp.get('size') ?? 2))
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const slots = useMemo(() => {
    const close = place?.closesAt || '23:00'
    const start = DEFAULT_OPEN
    return generateSlots({ start, end: close, stepMin: 30 })
  }, [place?.closesAt])

  if (!place) return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Газар олдсонгүй</h1>
      <Link to="/" className="mt-4 text-orange-500 font-bold">Буцах</Link>
    </div>
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (hasConflict(place.id, date, time)) {
      setError('Уучлаарай, энэ цагт захиалга дүүрсэн байна.')
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
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-12 text-center md:py-24">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/20"
        >
          <Check className="h-12 w-12 text-white stroke-[4]" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h1 className="text-[28px] font-black tracking-tight text-zinc-950 dark:text-white">
            Захиалга амжилттай!
          </h1>
          <p className="mt-2 text-[15px] font-medium text-zinc-500 dark:text-zinc-400">
            Таны захиалгыг баталгаажууллаа.
          </p>

          <div className="mt-8 rounded-3xl border border-zinc-100 bg-zinc-50 p-6 text-left dark:border-white/5 dark:bg-white/5">
            <div className="text-[17px] font-bold text-zinc-900 dark:text-white">{place.name}</div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-zinc-500">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {date}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {time}</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {people} хүн</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <Link
              to="/bookings"
              className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 py-4 text-[15px] font-bold text-white shadow-xl transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
            >
              <List className="h-4.5 w-4.5" />
              Захиалгуудаа харах
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 py-4 text-[15px] font-bold text-zinc-600 transition hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5"
            >
              <Home className="h-4.5 w-4.5" />
              Нүүр хуудас руу
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      {/* Back link */}
      <Link 
        to={`/place/${place.id}`}
        className="mb-8 flex items-center gap-2 text-[14px] font-bold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {place.name} руу буцах
      </Link>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        {/* FORM COLUMN */}
        <div className="space-y-10">
          <section>
            <h1 className="text-[32px] font-black tracking-tight text-zinc-950 dark:text-white">Захиалгын мэдээлэл</h1>
            <p className="mt-2 text-zinc-500">Доорх мэдээллийг бөглөж захиалгаа баталгаажуулна уу.</p>
          </section>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-[14px] font-bold text-rose-600 dark:bg-rose-500/10">
                <ShieldCheck className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Date & Time */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">📅 Огноо</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pl-12 text-[14px] font-bold outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">🕐 Цаг сонгох</label>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-4">
                {slots.map(s => {
                  const busy = hasConflict(place.id, date, s)
                  const active = time === s
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={busy}
                      onClick={() => setTime(s)}
                      className={cn(
                        "rounded-2xl border py-2.5 text-[13px] font-bold transition-all",
                        busy 
                          ? "opacity-30 cursor-not-allowed line-through border-zinc-100 dark:border-white/5" 
                          : active
                            ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25 scale-105"
                            : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                      )}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Party Size */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">👥 Хэдэн хүн?</label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {[1, 2, 3, 4, 5, 6, 8, 10].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPeople(s)}
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-[15px] font-bold transition-all",
                      people === s
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400"
                    )}
                  >
                    {s}{s === 10 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* User Info */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">👤 Таны нэр</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Нэрээ оруулна уу"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pl-12 text-[14px] font-bold outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">📞 Утасны дугаар</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+976 ...."
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pl-12 text-[14px] font-bold outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">📝 Нэмэлт тэмдэглэл</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-zinc-400" />
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Жишээ нь: Цонхны дэргэд суумаар байна..."
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 pl-12 text-[14px] font-bold outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                />
              </div>
            </div>
            
            {/* Hidden submit to handle Enter key */}
            <button type="submit" className="hidden" />
          </form>
        </div>

        {/* SUMMARY COLUMN */}
        <aside className="relative">
          <div className="sticky top-[200px] space-y-6">
            <div className="rounded-[2.5rem] border border-zinc-100 bg-zinc-50/50 p-8 dark:border-white/5 dark:bg-white/5">
              <h3 className="text-[13px] font-black uppercase tracking-widest text-zinc-400">Хураангуй</h3>
              
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-zinc-200">
                    <img src={place.photos[0]?.url} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[18px] font-black text-zinc-900 dark:text-white">{place.name}</div>
                    <div className="text-[13px] font-medium text-zinc-500">{place.district} · {place.category === 'restaurant' ? 'Ресторан' : 'Паб'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-y border-zinc-100 py-6 dark:border-white/5">
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Огноо</div>
                    <div className="mt-1 text-[13px] font-bold text-zinc-900 dark:text-white">{date}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Цаг</div>
                    <div className="mt-1 text-[13px] font-bold text-zinc-900 dark:text-white">{time}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Хүн</div>
                    <div className="mt-1 text-[13px] font-bold text-zinc-900 dark:text-white">{people}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Захиалах дүрэм:</h4>
                  <ul className="space-y-2 text-[13px] font-medium text-zinc-500">
                    <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-orange-500" /> Захиалгыг 30 мин өмнө цуцлах</li>
                    <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-orange-500" /> Хоол заавал захиалах</li>
                    <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-orange-500" /> 15 минут хоцроход цуцлагдана</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="group relative w-full overflow-hidden rounded-full bg-orange-500 py-5 text-[15px] font-black text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-600 active:scale-95"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                Захиалга баталгаажуулах 
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
