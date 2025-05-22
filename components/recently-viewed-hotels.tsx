'use client'

import { useRecentlyViewed } from '@/context/recently-viewed-context'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function RecentlyViewedHotels() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed()
  const t = useTranslations('common')

  // Если нет недавно просмотренных отелей, не отображаем компонент
  if (recentlyViewed.length === 0) {
    return null
  }

  return (
    <Card className="bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 shadow-md backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('recentlyViewed')}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentlyViewed}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4 mr-1" />
            {t('clear')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {recentlyViewed.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/hotel/${hotel.id}`} className="block">
                  <div className="relative group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                    <div className="relative h-32 w-full">
                      <Image
                        src={hotel.images[0] || '/hotel-placeholder.svg'}
                        alt={hotel.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                      <h3 className="font-medium text-sm line-clamp-1">{hotel.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs opacity-90">{hotel.location}</span>
                        <span className="font-bold text-sm">{hotel.price.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
