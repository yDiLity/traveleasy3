'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Menu, Home, Search, Heart, User, Moon, Sun, Globe } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface MobileNavigationProps {
  locale: string
  translations: {
    home: string
    hotels: string
    favorites: string
    login: string
    logout: string
  }
}

export function MobileNavigation({ locale, translations }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()

  // Закрываем меню при изменении пути
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Блокируем прокрутку страницы, когда меню открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { href: `/${locale}`, label: translations.home, icon: <Home className="w-5 h-5 mr-2" /> },
    { href: `/${locale}/hotels`, label: translations.hotels, icon: <Search className="w-5 h-5 mr-2" /> },
    { href: `/${locale}/favorites`, label: translations.favorites, icon: <Heart className="w-5 h-5 mr-2" /> },
    { href: `/${locale}/login`, label: translations.login, icon: <User className="w-5 h-5 mr-2" /> },
  ]

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden text-gray-700 dark:text-gray-300 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Затемнение фона */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={toggleMenu}
            />

            {/* Мобильное меню */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 z-50 shadow-xl overflow-y-auto"
            >
              <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-primary">TravelEasy</h2>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Закрыть меню"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="p-4">
                <ul className="space-y-4">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center p-3 rounded-lg transition-colors",
                          pathname === item.href
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Тема</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Язык</span>
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
