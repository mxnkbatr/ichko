import { BadgeCheck, Mail, Settings2 } from 'lucide-react'
import { PageShell } from '../components/PageShell'
import { useI18n } from '../lib/i18n'

export function ProfilePage() {
  const { t } = useI18n()
  return (
    <PageShell
      title={t('profile_title')}
      subtitle="Профайл ба тохиргоо (prototype)."
      right={
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-3 py-2 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95 dark:bg-white dark:text-black"
        >
          <Settings2 className="h-4 w-4" />
          Тохиргоо
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
            Бүртгэл
          </div>
          <div className="mt-3 flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-500 text-white shadow-glass">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold">Зочин хэрэглэгч</div>
              <div className="mt-1 flex items-center gap-2 text-[13px] text-zinc-500 dark:text-zinc-400">
                <Mail className="h-4 w-4" />
                удахгүй нэвтрэлт
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
            Тохиргоо
          </div>
          <div className="mt-2 text-[13px] text-zinc-500 dark:text-zinc-400">
            Хэл: MN/EN · Theme: dark/light · Radius: 24px
          </div>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              className="rounded-2xl bg-brand-500 px-3 py-2.5 text-[13px] font-semibold text-white shadow-glass transition hover:opacity-95"
            >
              Upgrade (prototype)
            </button>
            <button
              type="button"
              className="rounded-2xl bg-zinc-100 px-3 py-2.5 text-[13px] font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
            >
              Гарах
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

