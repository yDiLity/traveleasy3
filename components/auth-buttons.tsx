'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AuthButtons() {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'common.profile': 'Профиль',
      'common.favorites': 'Избранное',
      'common.bookings': 'Мои бронирования',
      'common.logout': 'Выйти',
      'common.login': 'Войти',
      'common.register': 'Регистрация'
    }
    return translations[key] || key
  }
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    )
  }

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
              <AvatarFallback>{getInitials(session.user.name || '')}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('common.profile')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">{t('common.profile')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/favorites">{t('common.favorites')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/bookings">{t('common.bookings')}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-red-600 cursor-pointer"
          >
            {t('common.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/login">
        <Button variant="ghost">{t('common.login')}</Button>
      </Link>
      <Link href="/register">
        <Button>{t('common.register')}</Button>
      </Link>
    </div>
  )
}

// Вспомогательная функция для получения инициалов из имени
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
