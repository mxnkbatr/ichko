import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Phone, Clock, Star, 
  ChevronRight, Share2, Heart, ExternalLink, 
  Users, Calendar, Check, Info
} from 'lucide-react'
import { places as allPlaces, type Place } from '../data/places'
import { OsmMap } from '../components/OsmMap'
import { cn } from '../lib/cn'
import { motion, AnimatePresence } from 'framer-motion'

// ── Stars Helper ─────────────────────────────────────────────────────────────
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const fullStars = Math.floor(rating)
  const stars = Array.from({ length: 5 }, (_, i) => i < fullStars ? '★' : '☆')
  
  return (
    <div className={cn(
      "flex items-center text-orange-500 tracking-tight",
      size === "sm" ? "text-[14px]" : size === "md" ? "text-[18px]" : "text-[24px]"
    )}>
      {stars.map((s, i) => (
        <span key={i} className={s === '☆' ? "text-zinc-200" : ""}>{s}</span>
      ))}
      <span className="ml-1.5 font-bold text-zinc-900 dark:text-zinc-100 text-[13px]">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

// ── Mock Reviews ─────────────────────────────────────────────────────────────
const MOCK_REVIEWS = [
  { id: 1, name: 'Б.Мөнхбат', rating: 5, date: '2024-12-01', text: 'Маш сайхан орчин, хоол нь үнэхээр амттай байсан. Үйлчилгээ нь их хурдан шуурхай.' },
  { id: 2, name: 'А.Энхжин', rating: 4, date: '2024-11-28', text: 'Уур амьсгал нь гоё, гэхдээ арай чимээтэй байсан. Паб хэсэг нь илүү таалагдсан.' },
  { id: 3, name: 'С.Тулга', rating: 5, date: '2024-11-15', text: 'Найзуудтайгаа суухад хамгийн тохиромжтой газар. Үнэ нь боломжийн.' },
]

// ── Booking Time Slots ───────────────────────────────────────────────────────
const TIME_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']

export function PlaceDetailsPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const place = allPlaces.find(p => p.id === id)
  
  const [activePhoto, setActivePhoto] = useState(0)
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0])
  const [bookingTime, setBookingTime] = useState('19:00')
  const [partySize, setPartySize] = useState(2)
  const [menuTab, setMenuTab] = useState('Бүгд')

  // Recently Viewed Tracking
  useEffect(() => {
    if (!id) return
    const key = 'ichko.recentlyViewed'
    const stored = JSON.parse(localStorage.getItem(key) ?? '[]') as string[]
    const next = [id, ...stored.filter(x => x !== id)].slice(0, 5)
    localStorage.setItem(key, JSON.stringify(next))
  }, [id])

  if (!place) return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Газар олдсонгүй</h1>
      <Link to="/" className="mt-4 text-orange-500 font-bold">Нүүр хуудас руу буцах</Link>
    </div>
  )

  const menuTags = useMemo(() => {
    const tags = new Set<string>(['Бүгд'])
    place.menu.forEach(item => item.tags?.forEach(t => tags.add(t)))
    return Array.from(tags)
  }, [place.menu])

  const filteredMenu = useMemo(() => {
    if (menuTab === 'Бүгд') return place.menu
    return place.menu.filter(item => item.tags?.includes(menuTab))
  }, [place.menu, menuTab])

  const handleBooking = () => {
    nav(`/place/${place.id}/book?date=${bookingDate}&time=${bookingTime}&size=${partySize}`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 md:py-8">
      {/* Back Button */}
      <button 
        onClick={() => nav(-1)}
        className="mb-6 flex items-center gap-2 text-[14px] font-bold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Буцах
      </button>

      {/* ── PHOTO GALLERY ──────────────────────────────────────── */}
      <section className="mb-8 overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800 shadow-sm">
        <div className="relative h-64 w-full md:h-[420px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={activePhoto}
              src={place.photos[activePhoto]?.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>
          
          {/* Action Overlay */}
          <div className="absolute right-4 top-4 flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors">
              <Share2 className="h-5 w-5 text-zinc-700" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors">
              <Heart className="h-5 w-5 text-rose-500" />
            </button>
          </div>
        </div>
        
        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-white/5 scrollbar-hide">
          {place.photos.map((ph, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhoto(idx)}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                activePhoto === idx ? "border-orange-500 scale-95" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={ph.url} className="h-full w-full object-cover" />
            </button>
          ))}
          {place.photos.length > 5 && (
            <button className="flex h-16 w-24 shrink-0 flex-col items-center justify-center rounded-xl bg-zinc-100 text-[11px] font-bold text-zinc-500 dark:bg-white/5">
              <span>+{place.photos.length - 5}</span>
              <span>зураг үзэх</span>
            </button>
          )}
        </div>
      </section>

      {/* ── TWO COLUMN CONTENT ─────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        
        {/* LEFT COLUMN: Info, Menu, Reviews */}
        <div className="min-w-0 space-y-12">
          
          {/* Business Header */}
          <section>
            <h1 className="text-[32px] md:text-[42px] font-black tracking-tight text-zinc-950 dark:text-white leading-tight">
              {place.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <StarRating rating={place.rating} size="md" />
              <span className="text-zinc-300">·</span>
              <div className="flex items-center gap-2 text-[14px] font-semibold text-zinc-500 dark:text-zinc-400">
                <span>{place.category === 'restaurant' ? 'Ресторан' : place.category === 'pub' ? 'Паб / Бар' : 'Кафе'}</span>
                <span>·</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-bold">{'$'.repeat(place.priceLevel)}</span>
                <span>·</span>
                <span className={cn(place.openNow ? "text-emerald-600" : "text-rose-500")}>
                  {place.openNow ? 'Одоо нээлттэй' : 'Хаалттай'}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="mt-8 space-y-4 border-t border-zinc-100 pt-8 dark:border-white/5">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-orange-500" />
                <div className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300">
                  {place.address}
                  <button className="ml-2 text-orange-500 hover:underline flex items-center gap-1 text-[13px] font-bold">
                    Газрын зураг <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-orange-500" />
                <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300">{place.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 shrink-0 text-orange-500" />
                <div className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2 font-bold">
                    Даваа – Ням
                    <span className="text-zinc-400 font-normal">10:00 – {place.closesAt}</span>
                  </div>
                  <p className="mt-1 text-[13px] text-zinc-400">Цагийн хуваарь баярын өдрүүдэд өөрчлөгдөж болно.</p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-8 flex flex-wrap gap-2">
              {place.highlights.map(h => (
                <span key={h} className="rounded-full bg-zinc-100 dark:bg-white/5 px-4 py-1.5 text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">
                  ✨ {h}
                </span>
              ))}
              {place.vibes.map(v => (
                <span key={v} className="rounded-full bg-orange-50 dark:bg-orange-500/10 px-4 py-1.5 text-[13px] font-bold text-orange-700 dark:text-orange-400">
                  # {v}
                </span>
              ))}
            </div>
          </section>

          {/* ── MENU SECTION ───────────────────────────────────── */}
          <section>
            <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-white/5">
              <h2 className="text-[22px] font-black tracking-tight">Цэс</h2>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {menuTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setMenuTab(tag)}
                    className={cn(
                      "whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-bold transition",
                      menuTab === tag 
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-black" 
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-1">
              {filteredMenu.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center justify-between py-4",
                    idx !== filteredMenu.length - 1 && "border-b border-zinc-100/50 dark:border-white/5"
                  )}
                >
                  <div className="min-w-0 pr-4">
                    <h4 className="text-[16px] font-bold text-zinc-900 dark:text-white leading-tight">{item.name}</h4>
                    <p className="mt-1 truncate text-[13px] text-zinc-400 font-medium">{item.description}</p>
                  </div>
                  <div className="shrink-0 text-[15px] font-black text-orange-500">
                    ₮{item.priceMnt.toLocaleString('mn-MN')}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REVIEWS SECTION ────────────────────────────────── */}
          <section>
            <div className="mb-8 flex items-end justify-between border-b border-zinc-100 pb-6 dark:border-white/5">
              <div>
                <h2 className="text-[22px] font-black tracking-tight">Үнэлгээ & Сэтгэгдэл</h2>
                <div className="mt-2 flex items-center gap-3">
                  <StarRating rating={place.rating} size="lg" />
                  <span className="text-[13px] font-bold text-zinc-400">Бүх {place.reviewCount} үнэлгээ</span>
                </div>
              </div>
              <button className="rounded-full bg-zinc-900 px-6 py-2.5 text-[13px] font-black text-white shadow-lg transition hover:bg-orange-500 dark:bg-white dark:text-black">
                Үнэлгээ өгөх
              </button>
            </div>

            <div className="space-y-6">
              {MOCK_REVIEWS.map(rev => (
                <div key={rev.id} className="rounded-3xl border border-zinc-100 bg-white p-6 dark:border-white/5 dark:bg-zinc-900/40">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-[15px] font-black text-orange-600 dark:bg-orange-500/20">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-zinc-950 dark:text-white">{rev.name}</div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <StarRating rating={rev.rating} size="sm" />
                        <span className="text-[11px] font-medium text-zinc-400">{rev.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── MAP SECTION ────────────────────────────────────── */}
          <section>
            <h2 className="mb-4 text-[22px] font-black tracking-tight">Байршил</h2>
            <div className="h-64 overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm">
              <OsmMap 
                places={[place]} 
                selectedId={place.id} 
                interactive={false} 
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400">
                {place.address}
              </div>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${place.coords.lat},${place.coords.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2 text-[13px] font-black text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                Замыг харах <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN: BOOKING PANEL ───────────────────────── */}
        <aside className="relative">
          <div className="sticky top-[200px] rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
            <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Ширээ захиалах</h3>
            <p className="mt-1 text-[13px] text-zinc-500">Үнэгүй, хурдан захиалга</p>

            <div className="mt-6 space-y-5">
              {/* Date */}
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-zinc-400">Өдөр</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-[14px] font-bold outline-none focus:border-orange-500 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>

              {/* Party Size */}
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-zinc-400">👥 Хүний тоо</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  {[1, 2, 3, 4, 5, 6, 8].map(size => (
                    <button
                      key={size}
                      onClick={() => setPartySize(size)}
                      className={cn(
                        "flex h-10 min-w-[40px] items-center justify-center rounded-xl text-[14px] font-bold transition",
                        partySize === size 
                          ? "bg-orange-500 text-white" 
                          : "bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-zinc-400">🕐 Цаг сонгох</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setBookingTime(slot)}
                      className={cn(
                        "rounded-xl py-2.5 text-[12px] font-bold transition",
                        bookingTime === slot 
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-black" 
                          : "border border-zinc-200 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleBooking}
                className="group relative w-full overflow-hidden rounded-full bg-orange-500 py-4 text-[15px] font-black text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-600 active:scale-95"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  Цаг захиалах <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100 dark:border-white/5" /></div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-zinc-400"><span className="bg-white px-2 dark:bg-zinc-900">Эсвэл</span></div>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 py-3.5 text-[14px] font-bold text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-white">
                <Phone className="h-4 w-4 text-emerald-500" /> Утсаар захиалах
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
            <Info className="h-5 w-5 text-zinc-400" />
            <p className="text-[11px] text-zinc-500">Захиалга баталгаажуулахын тулд таны утасны дугаар шаардлагатай.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
