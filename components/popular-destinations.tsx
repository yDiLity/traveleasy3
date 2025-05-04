'use client'

import { useState, useEffect } from 'react'
import { SafeImage } from './safe-image'
import Link from 'next/link'
// import { useTranslations } from 'next-intl'
import { getPopularCities } from '@/data/cities'
import { getHotelsByCity } from '@/data/hotels'
import { API_KEYS } from '@/config/api-config'

interface Destination {
  id: number
  name: string
  image: string
  slug: string
  hotelCount: number
  loading?: boolean
}

// Получаем популярные города и количество отелей в каждом
const popularCities = getPopularCities();
const initialDestinations: Destination[] = popularCities.map(city => ({
  id: city.id,
  name: city.name,
  image: city.image, // Используем статические URL изображений
  slug: city.slug,
  hotelCount: getHotelsByCity(city.id).length,
  loading: false // Изображения уже загружены
}))

export function PopularDestinations() {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Популярные направления',
      'subtitle': 'Исследуйте самые популярные города для путешествий',
      'explore': 'Исследовать',
      'hotels': 'отелей'
    }
    return translations[key] || key
  }

  const [destinations] = useState<Destination[]>(initialDestinations)
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            {t('title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <DestinationCard key={destination.id} destination={destination} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/search">
            <button className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              Показать все направления
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function DestinationCard({ destination, index }: { destination: Destination, index: number }) {
  // Используем тот же объект переводов, что и в родительском компоненте
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Популярные направления',
      'subtitle': 'Исследуйте самые популярные города для путешествий',
      'explore': 'Исследовать',
      'hotels': 'отелей'
    }
    return translations[key] || key
  }
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="h-80 relative rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {destination.loading ? (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">Загрузка...</span>
        </div>
      ) : (
        <SafeImage
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          fallbackSrc="/city-placeholder.svg"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
        <span className="text-white text-xs font-medium">{destination.hotelCount} {t('hotels')}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 text-white">
        <h3 className="text-2xl font-bold mb-3">{destination.name}</h3>
        <Link href={`/search?location=${destination.name}`}>
          <button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            {t('explore')}
          </button>
        </Link>
      </div>
    </div>
  )
}
