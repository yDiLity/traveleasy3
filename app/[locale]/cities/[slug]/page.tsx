'use client'

import { useParams } from 'next/navigation'
// import { useTranslations } from 'next-intl'
import { getCityBySlug } from '@/data/cities'
import { getHotelsByCity } from '@/data/hotels'
import Image from 'next/image'
import Link from 'next/link'
import { CityGallery } from '@/components/city-gallery'
import { SafeImage } from '@/components/safe-image'

export default function CityPage() {
  const params = useParams()
  const slug = params.slug as string
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'cityNotFound': 'Город не найден',
      'backToHome': 'Вернуться на главную',
      'about': 'О городе'
    }
    return translations[key] || key
  }

  const city = getCityBySlug(slug)

  if (!city) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">{t('cityNotFound')}</h1>
        <Link href="/" className="text-primary hover:underline">
          {t('backToHome')}
        </Link>
      </div>
    )
  }

  const hotels = getHotelsByCity(city.id)

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">{city.name}</h1>
      <p className="text-gray-600 mb-8">{city.country}</p>

      {/* Изображение города с использованием CityGallery */}
      <CityGallery cityName={city.name} loadImagesFromApi={true} />

      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">{t('about')}</h2>
        <p className="text-gray-700">{city.description}</p>
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">{hotels.length} отелей в этом городе</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <div key={hotel.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-4">
              <div className="h-36 relative rounded-lg mb-4 overflow-hidden">
                <SafeImage
                  src={hotel.images[0]}
                  alt={hotel.name}
                  fill
                  fallbackSrc="/hotel-placeholder.svg"
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-base mb-1">{hotel.name}</h3>
              <p className="text-xs text-gray-700 dark:text-gray-200 mb-2">{hotel.description.substring(0, 60)}...</p>
              <div className="flex justify-between items-center">
                <div className="font-bold text-base text-primary dark:text-primary">
                  {hotel.price.toLocaleString('ru-RU')} ₽ <span className="text-xs text-gray-600 dark:text-gray-300">/ ночь</span>
                </div>
                <div className="flex">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
