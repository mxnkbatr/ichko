import { ExternalLink, Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { useI18n } from '../lib/i18n'

export function AboutPage() {
  const { t } = useI18n()
  return (
    <PageShell
      title={t('about_title')}
      subtitle="Platform concept + roadmap (prototype)."
      right={
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-3 py-2 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95"
        >
          <Sparkles className="h-4 w-4" />
          {t('nav_explore')}
        </Link>
      }
    >
      <div className="space-y-4 text-[13px] text-zinc-600 dark:text-zinc-300">
        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="font-semibold text-zinc-900 dark:text-zinc-50">
            Энэ апп юу хийдэг вэ?
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Ойрхон ресторан/паб/кафе санал болгоно</li>
            <li>Map дээрээс олж, дэлгэрэнгүй мэдээлэл (меню) харуулна</li>
            <li>Цаг захиалга (reservation) урсгал</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
            <Shield className="h-4 w-4 text-zinc-400" />
            Нууцлал ба байршил
          </div>
          <div className="mt-2">
            Geolocation зөвхөн таны зөвшөөрлөөр ажиллана. Production шатанд
            permission, retention, analytics‑ийн бодлогыг тодорхойлно.
          </div>
        </div>

        <a
          href="https://www.openstreetmap.org/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-3 py-2 font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
        >
          OpenStreetMap
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </PageShell>
  )
}

