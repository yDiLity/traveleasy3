'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { locales } from '@/i18n/settings'
// import { useTranslations } from 'next-intl'

export function LanguageSwitcher() {
  // Создаем состояние для текущей локали
  const [currentLocale, setCurrentLocale] = useState<string>('ru')

  // Используем useEffect для доступа к window только на клиенте
  useEffect(() => {
    const path = window.location.pathname
    setCurrentLocale(path.startsWith('/en') ? 'en' : 'ru')
  }, [])

  // Функция для переключения языка
  const switchLanguage = (newLocale: string) => {
    if (typeof window === 'undefined') return

    // Получаем текущий путь
    const currentPath = window.location.pathname

    // Получаем текущий путь без локали
    let pathWithoutLocale = currentPath

    // Удаляем префикс локали из пути
    if (currentPath.startsWith('/en')) {
      pathWithoutLocale = currentPath.substring(3) || '/'
    }

    // Создаем новый путь с новой локалью
    const newPath = newLocale === 'ru' ? pathWithoutLocale : `/en${pathWithoutLocale}`

    console.log('Switching language:', {
      from: currentLocale,
      to: newLocale,
      currentPath,
      pathWithoutLocale,
      newPath
    })

    // Переходим на новый URL
    window.location.href = newPath
  }

  // Отображаемые названия языков
  const localeNames: Record<string, string> = {
    ru: 'Русский',
    en: 'English',
  }

  // Флаги для языков (можно заменить на реальные изображения флагов)
  const localeFlags: Record<string, string> = {
    ru: '🇷🇺',
    en: '🇬🇧',
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <span>{localeFlags[currentLocale]}</span>
          <span className="hidden md:inline">{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => switchLanguage(l)}
            className={l === currentLocale ? 'bg-muted font-medium' : ''}
          >
            <span className="mr-2">{localeFlags[l]}</span>
            {localeNames[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
