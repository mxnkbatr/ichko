import { Heart, MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { useI18n } from '../lib/i18n'

export function FavoritesPage() {
  const { t } = useI18n()
  return (
    <PageShell
      title={t('favorites_title')}
      subtitle={t('favorites_subtitle')}
      right={
        <div className="inline-flex items-center gap-2 rounded-2xl bg-brand-500/10 px-3 py-2 text-[13px] font-semibold text-brand-700 dark:text-brand-200">
          <Heart className="h-4 w-4" />
          {t('favorites_saved')}: 0
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-900 text-white shadow-glass dark:bg-white dark:text-black">
          <MapPinned className="h-6 w-6" />
        </div>
        <div className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-50">
          {t('favorites_empty_title')}
        </div>
        <div className="max-w-md text-[13px] text-zinc-500 dark:text-zinc-400">
          {t('favorites_empty_hint')}
        </div>
        <Link
          to="/"
          className="mt-2 rounded-2xl bg-brand-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95"
        >
          {t('favorites_explore_nearby')}
        </Link>
      </div>
    </PageShell>
  )
}

