'use client'

// import { useTranslations } from 'next-intl'
import { ToursSection } from '@/components/tours-section'
import { HeroSection } from '@/components/hero-section'
import { PopularDestinations } from '@/components/popular-destinations'
import { FeaturesSection } from '@/components/features-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import Link from 'next/link'
import { SafeImage } from '@/components/safe-image'
import { useParams } from 'next/navigation'
import { getLuxuryHotels, getHotelsWithSpecialOffers } from '@/data/hotels'

export default function HomePage() {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Найдите идеальное место для отдыха',
      'subtitle': 'Лучшие отели и апартаменты по выгодным ценам',
      'searchTitle': 'Поиск отелей'
    }
    return translations[key] || key
  }

  const footerT = (key: string) => {
    const translations: Record<string, string> = {
      'subscription': 'Подписка на новости',
      'subscriptionText': 'Получайте эксклюзивные предложения и новости о путешествиях',
      'emailPlaceholder': 'Ваш email',
      'subscribe': 'Подписаться'
    }
    return translations[key] || key
  }
  const params = useParams()
  const locale = params.locale as string

  // Получаем данные о премиум отелях и отелях со специальными предложениями
  const luxuryHotels = getLuxuryHotels().slice(0, 3) // Берем только первые 3 отеля
  const specialOfferHotels = getHotelsWithSpecialOffers().slice(0, 3) // Берем только первые 3 отеля

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <HeroSection />

      {/* Popular Destinations */}
      <div id="popular-destinations">
        <PopularDestinations />
      </div>

      {/* View All Hotels Button */}
      <div className="py-8 text-center hide-on-search">
        <div className="opacity-100">
          <Link href={`/hotels`} className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md">
            Посмотреть все отели
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="hide-on-search">
        <FeaturesSection />
      </div>

      {/* Static Hotel Cards */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto hide-on-search">
        <div>
          <div className="my-8">
            <h2 className="text-2xl font-bold mb-2">Премиум отели</h2>
            <p className="text-gray-500 mb-4">Роскошные отели с высочайшим уровнем сервиса</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {luxuryHotels.map((hotel) => (
                <div key={hotel.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-4">
                  <div className="h-36 relative rounded-lg mb-4 overflow-hidden">
                    <SafeImage
                      src={hotel.images[0]}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                      fallbackSrc="/hotel-placeholder.svg"
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

          <div className="my-8">
            <h2 className="text-2xl font-bold mb-2">Специальные предложения</h2>
            <p className="text-gray-500 mb-4">Отели с особыми условиями и скидками</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {specialOfferHotels.map((hotel) => (
                <div key={hotel.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-4">
                  <div className="h-36 relative rounded-lg mb-4 overflow-hidden">
                    <SafeImage
                      src={hotel.images[0]}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                      fallbackSrc="/hotel-placeholder.svg"
                    />
                    <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                      Спецпредложение
                    </div>
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
      </div>

      {/* Tours Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto hide-on-search">
        <div>
          <ToursSection
            title="Премиум-туры с проживанием в частных отелях"
            subtitle="Эксклюзивные туры с пакетом 'Всё включено' и персональным сервисом"
          />
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="hide-on-search">
        <TestimonialsSection />
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-white dark:bg-gray-800 hide-on-search">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 dark:from-gray-700 dark:to-gray-800 p-8 md:p-12 rounded-2xl shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">{footerT('subscription')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {footerT('subscriptionText')}
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder={footerT('emailPlaceholder')}
                className="flex-grow px-4 py-3 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg sm:rounded-l-none transition-colors">
                {footerT('subscribe')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
