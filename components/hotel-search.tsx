'use client'

import { useState, useEffect, useCallback } from 'react'
import { Hotel, AccommodationType, MealType } from '@/types/hotel'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
// import { useTranslations } from 'next-intl'
import { SearchLocationInput } from './search-location-input'
import { SearchResults } from './search-results'
import { motion } from 'framer-motion'
import { Calendar, Users, Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function HotelSearch() {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'destination': 'Место назначения',
      'locationPlaceholder': 'Введите город или отель',
      'checkIn': 'Заезд',
      'checkOut': 'Выезд',
      'guests': 'Гости'
    }
    return translations[key] || key
  }

  const commonT = (key: string) => {
    const translations: Record<string, string> = {
      'loading': 'Загрузка...',
      'search': 'Поиск'
    }
    return translations[key] || key
  }
  // Основные параметры поиска
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('1')

  // Параметры фильтрации по цене и рейтингу
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [maxDistanceToCenter, setMaxDistanceToCenter] = useState('')

  // Параметры фильтрации по типу размещения и питания
  const [accommodationType, setAccommodationType] = useState<AccommodationType | ''>('')
  const [mealType, setMealType] = useState<MealType | ''>('')
  const [hotelChain, setHotelChain] = useState('')
  const [hasSpecialOffers, setHasSpecialOffers] = useState(false)

  // Параметры фильтрации по удобствам
  const [amenities, setAmenities] = useState({
    wifi: false,
    parking: false,
    pool: false,
    gym: false,
    restaurant: false,
    spa: false,
    airConditioning: false,
    petFriendly: false,
    conferenceRoom: false,
    transfer: false
  })

  // Параметры сортировки и состояние загрузки
  const [sortBy, setSortBy] = useState('rating')
  const [isLoading, setIsLoading] = useState(false)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Состояние для отображения расширенных фильтров
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Функция для скрытия содержимого главной страницы при отображении результатов поиска
  useEffect(() => {
    const popularDestinations = document.getElementById('popular-destinations')
    const footer = document.getElementById('main-footer')
    const otherSections = document.querySelectorAll('.hide-on-search')

    if (hasSearched && (hotels.length > 0 || isLoading)) {
      // Скрываем секции, когда есть результаты поиска
      if (popularDestinations) {
        popularDestinations.style.display = 'none'
      }

      // Скрываем футер
      if (footer) {
        footer.style.display = 'none'
      }

      otherSections.forEach(section => {
        if (section instanceof HTMLElement) {
          section.style.display = 'none'
        }
      })

      // Добавляем фоновый градиент на всю страницу
      document.body.classList.add('search-results-active')
    } else if (!isLoading && !hasSearched) {
      // Показываем секции, когда нет результатов поиска
      if (popularDestinations) {
        popularDestinations.style.display = 'block'
      }

      // Показываем футер
      if (footer) {
        footer.style.display = 'block'
      }

      otherSections.forEach(section => {
        if (section instanceof HTMLElement) {
          section.style.display = 'block'
        }
      })

      // Убираем класс с фоновым градиентом
      document.body.classList.remove('search-results-active')
    }
  }, [hasSearched, hotels.length, isLoading])

  // Функция для обновления состояния удобств
  const handleAmenityChange = (key: keyof typeof amenities, value: boolean) => {
    setAmenities(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Кэш для результатов поиска
  const [searchCache, setSearchCache] = useState<Record<string, Hotel[]>>({})
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ITEMS_PER_PAGE = 12 // Ограничиваем количество отелей на странице

  // Мемоизированная функция для создания ключа кэша
  const createCacheKey = useCallback((params: URLSearchParams) => {
    return params.toString()
  }, [])

  // Функция поиска отелей с дебаунсингом и кэшированием
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    setHasSearched(true) // Устанавливаем флаг, что поиск был выполнен

    try {
      // Создаем базовые параметры поиска
      const params = new URLSearchParams({
        location,
        checkIn,
        checkOut,
        guests
      })

      // Добавляем параметры фильтрации по цене и рейтингу
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (minRating) params.append('minRating', minRating)
      if (maxDistanceToCenter) params.append('maxDistanceToCenter', maxDistanceToCenter)

      // Добавляем параметры фильтрации по типу размещения и питания
      if (accommodationType) params.append('accommodationType', accommodationType)
      if (mealType) params.append('mealType', mealType)
      if (hotelChain) params.append('hotelChain', hotelChain)
      if (hasSpecialOffers) params.append('hasSpecialOffers', 'true')

      // Добавляем параметры фильтрации по удобствам
      Object.entries(amenities).forEach(([key, value]) => {
        if (value) params.append(key, 'true')
      })

      // Добавляем параметр сортировки
      params.append('sortBy', sortBy)

      // Добавляем параметры пагинации
      params.append('page', page.toString())
      params.append('limit', ITEMS_PER_PAGE.toString())

      // Создаем ключ для кэша
      const cacheKey = createCacheKey(params)

      // Проверяем, есть ли результаты в кэше
      if (searchCache[cacheKey]) {
        setHotels(searchCache[cacheKey])
        setIsLoading(false)
        return
      }

      // Отправляем запрос к API
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // Таймаут 10 секунд

      try {
        const response = await fetch(`/api/hotels?${params}`, {
          signal: controller.signal,
          next: { revalidate: 3600 } // Кэширование на стороне сервера на 1 час
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          console.error('API error:', data.error)
          return
        }

        // Ограничиваем количество отелей
        const limitedHotels = (data.hotels || []).slice(0, ITEMS_PER_PAGE)

        // Вычисляем общее количество страниц
        const total = data.total || data.hotels?.length || 0
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE))

        // Сохраняем результаты в кэш
        setSearchCache(prev => ({
          ...prev,
          [cacheKey]: limitedHotels
        }))

        setHotels(limitedHotels)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.error('Request timed out')
        } else {
          console.error('Search failed:', error)
        }
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-1 md:col-span-5">
              <label className="block text-sm font-medium mb-2 text-white">{t('destination')}</label>
              <SearchLocationInput
                value={location}
                onChange={setLocation}
                placeholder={t('locationPlaceholder')}
                required
                onEnter={handleSearch}
                className="w-full"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-white">{t('checkIn')}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="date"
                  placeholder={t('checkIn')}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-white">{t('checkOut')}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="date"
                  placeholder={t('checkOut')}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-white">{t('guests')}</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="number"
                  placeholder={t('guests')}
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex items-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[42px] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white rounded-lg shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {commonT('loading')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <SearchIcon className="mr-2" size={16} />
                    {commonT('search')}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Результаты поиска */}
      {(hotels.length > 0 || isLoading) && (
        <SearchResults
          hotels={hotels}
          isLoading={isLoading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            handleSearch();
          }}
        />
      )}
    </div>
  )
}