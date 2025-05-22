import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n/settings'

// Редирект с корневого маршрута на локализованный маршрут
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
