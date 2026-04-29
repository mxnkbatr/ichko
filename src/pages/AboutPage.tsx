import { ExternalLink, Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'

export function AboutPage() {
  const { t } = useI18n()
  
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[32px] font-black tracking-tight text-zinc-950 dark:text-white">
            {t('about_title')}
          </h1>
          <p className="mt-1 text-[15px] font-medium text-zinc-500">
            Улаанбаатар хотын шилдэг газруудын лавлах
          </p>
        </div>
        <Link
          to="/"
          className="hidden shrink-0 items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-[14px] font-bold text-white shadow-xl shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95 sm:flex"
        >
          <Sparkles className="h-4 w-4" />
          {t('nav_explore')}
        </Link>
      </div>

      <div className="space-y-6">
        {/* Section 1 */}
        <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-zinc-900">
          <h2 className="text-[18px] font-black tracking-tight text-zinc-900 dark:text-white">Энэ апп юу хийдэг вэ?</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-[15px] font-medium text-zinc-600 dark:text-zinc-400">
            <li>Ойрхон ресторан, паб, кафе санал болгоно.</li>
            <li>Газрын зураг дээрээс олж, дэлгэрэнгүй мэдээлэл болон меню харуулна.</li>
            <li>Цаг захиалгын (reservation) нэгдсэн систем.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-500/10">
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
            <h2 className="text-[18px] font-black tracking-tight text-zinc-900 dark:text-white">Нууцлал ба байршил</h2>
          </div>
          <p className="mt-4 text-[15px] font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
            Таны байршлын мэдээллийг зөвхөн таны зөвшөөрлөөр ашиглана. 
            Бид хэрэглэгчийн нууцлалыг чандлан сахиж, мэдээллийг зөвхөн үйлчилгээг сайжруулахад ашигладаг.
          </p>
        </div>

        {/* OSM Link */}
        <div className="flex justify-center pt-4">
          <a
            href="https://www.openstreetmap.org/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-zinc-100 bg-white px-6 py-3 text-[14px] font-bold text-zinc-500 transition hover:bg-zinc-50 dark:border-white/5 dark:bg-zinc-900 dark:text-zinc-300"
          >
            OpenStreetMap data
            <ExternalLink className="h-4 w-4 text-orange-500" />
          </a>
        </div>
      </div>
    </div>
  )
}
