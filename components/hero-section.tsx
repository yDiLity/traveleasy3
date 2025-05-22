'use client'

import { useState, useEffect } from 'react'
import { SafeImage } from './safe-image'
import { motion } from 'framer-motion'
import { HotelSearch } from './hotel-search'
// import { useTranslations } from 'next-intl'

// Статические изображения для фона
const backgroundImages = [
  'https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg',
  'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg',
  'https://images.pexels.com/photos/1179156/pexels-photo-1179156.jpeg'
]

// Заглушки на случай, если API не сработает
const fallbackImages = [
  '/images/hero/hero-1.svg',
  '/images/hero/hero-2.svg',
  '/images/hero/hero-3.svg',
]

export function HeroSection() {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Найдите идеальное место для отдыха',
      'subtitle': 'Лучшие отели и апартаменты по выгодным ценам',
      'searchTitle': 'Поиск отелей'
    }
    return translations[key] || key
  }
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Автоматическое переключение фоновых изображений
  useEffect(() => {
    if (backgroundImages.length === 0) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Фоновые изображения с анимацией перехода */}
      {backgroundImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <SafeImage
            src={image}
            alt="Travel destination"
            fill
            priority
            className="object-cover"
            fallbackSrc={fallbackImages[index % fallbackImages.length]}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </div>
      ))}

      {/* Контент героя */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 left-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
        >
          <span className="text-white text-sm font-medium">Надежный сервис бронирования с 2023 года</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-200"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {t('searchTitle')}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-blue-600 mt-2 mb-6 mx-auto md:mx-0"></div>
            </div>
            <HotelSearch />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center"
        >
          <div className="flex space-x-3">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
