'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Hotel, AccommodationType, MealType } from '@/types/hotel'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
// import { useTranslations } from 'next-intl'
import { SearchLocationInput } from './search-location-input'
import { SearchResults } from './search-results'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, Filter, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DateRangePicker } from './date-range-picker'
import { GuestsPicker } from './guests-picker'
import { AdvancedFilters } from './advanced-filters'
import { useDebounce } from '@/hooks/use-debounce'
import { LazyLoad } from './lazy-load'

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

  // Даты заезда и выезда
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined)

  // Строковые представления дат для API
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  // Обновляем строковые представления дат при изменении объектов Date
  useEffect(() => {
    if (checkInDate) {
      setCheckIn(checkInDate.toISOString().split('T')[0])
    }
    if (checkOutDate) {
      setCheckOut(checkOutDate.toISOString().split('T')[0])
    }
  }, [checkInDate, checkOutDate])

  // Количество гостей
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  // Общее количество гостей для API
  const guests = String(adults + children)

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

  // Состояние для отслеживания ошибок
  const [searchError, setSearchError] = useState<string | null>(null)

  // Дебаунсинг параметров поиска для предотвращения частых запросов
  const debouncedLocation = useDebounce(location, 500)
  const debouncedMinPrice = useDebounce(minPrice, 500)
  const debouncedMaxPrice = useDebounce(maxPrice, 500)
  const debouncedMinRating = useDebounce(minRating, 500)

  // Мемоизированные параметры поиска для предотвращения ненужных ререндеров
  const searchParams = useMemo(() => {
    return {
      location: debouncedLocation,
      checkIn,
      checkOut,
      adults,
      children,
      infants,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      minRating: debouncedMinRating,
      maxDistanceToCenter,
      accommodationType,
      mealType,
      hotelChain,
      hasSpecialOffers,
      amenities,
      sortBy,
      page
    }
  }, [
    debouncedLocation, checkIn, checkOut, adults, children, infants,
    debouncedMinPrice, debouncedMaxPrice, debouncedMinRating, maxDistanceToCenter,
    accommodationType, mealType, hotelChain, hasSpecialOffers, amenities, sortBy, page
  ])

  // Функция поиска отелей с дебаунсингом и кэшированием
  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Проверка обязательных полей
    if (!searchParams.location) {
      setSearchError('Пожалуйста, укажите место назначения')
      return
    }

    setSearchError(null)
    setIsLoading(true)
    setHasSearched(true) // Устанавливаем флаг, что поиск был выполнен

    try {
      // Создаем базовые параметры поиска
      const params = new URLSearchParams({
        location: searchParams.location,
        checkIn,
        checkOut,
        adults: String(adults),
        children: String(children),
        infants: String(infants),
        guests
      })

      // Добавляем параметры фильтрации по цене и рейтингу
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice)
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice)
      if (searchParams.minRating) params.append('minRating', searchParams.minRating)
      if (searchParams.maxDistanceToCenter) params.append('maxDistanceToCenter', searchParams.maxDistanceToCenter)

      // Добавляем параметры фильтрации по типу размещения и питания
      if (searchParams.accommodationType) params.append('accommodationType', searchParams.accommodationType)
      if (searchParams.mealType) params.append('mealType', searchParams.mealType)
      if (searchParams.hotelChain) params.append('hotelChain', searchParams.hotelChain)
      if (searchParams.hasSpecialOffers) params.append('hasSpecialOffers', 'true')

      // Добавляем параметры фильтрации по удобствам
      Object.entries(searchParams.amenities).forEach(([key, value]) => {
        if (value) params.append(key, 'true')
      })

      // Добавляем параметр сортировки
      params.append('sortBy', searchParams.sortBy)

      // Добавляем параметры пагинации
      params.append('page', searchParams.page.toString())
      params.append('limit', ITEMS_PER_PAGE.toString())

      // Создаем ключ для кэша
      const cacheKey = createCacheKey(params)

      // Проверяем, есть ли результаты в кэше
      if (searchCache[cacheKey]) {
        setHotels(searchCache[cacheKey])
        setIsLoading(false)
        return
      }

      // Отправляем запрос к API с поддержкой отмены
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
          setSearchError(data.error)
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
          setSearchError('Запрос занял слишком много времени. Пожалуйста, попробуйте снова.')
          console.error('Request timed out')
        } else {
          setSearchError('Произошла ошибка при поиске. Пожалуйста, попробуйте снова.')
          console.error('Search failed:', error)
        }
      }
    } catch (error) {
      setSearchError('Произошла ошибка при поиске. Пожалуйста, попробуйте снова.')
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams, checkIn, checkOut, guests, createCacheKey, searchCache])

  // Автоматический поиск при изменении параметров поиска
  useEffect(() => {
    if (hasSearched && debouncedLocation) {
      handleSearch();
    }
  }, [debouncedLocation, debouncedMinPrice, debouncedMaxPrice, debouncedMinRating, hasSearched, handleSearch]);

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

            <div className="col-span-1 md:col-span-4">
              <label className="block text-sm font-medium mb-2 text-white">Даты поездки</label>
              <DateRangePicker
                checkIn={checkInDate}
                checkOut={checkOutDate}
                onCheckInChange={setCheckInDate}
                onCheckOutChange={setCheckOutDate}
              />
            </div>

            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-white">{t('guests')}</label>
              <GuestsPicker
                adults={adults}
                children={children}
                infants={infants}
                onAdultsChange={setAdults}
                onChildrenChange={setChildren}
                onInfantsChange={setInfants}
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex items-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="h-[42px]"
              >
                <Filter className="mr-2" size={16} />
                <span className="hidden sm:inline">Фильтры</span>
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[42px]"
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

        {/* Расширенные фильтры */}
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <AdvancedFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
              minRating={minRating}
              maxDistanceToCenter={maxDistanceToCenter}
              accommodationType={accommodationType}
              mealType={mealType}
              hotelChain={hotelChain}
              hasSpecialOffers={hasSpecialOffers}
              amenities={amenities}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onMinRatingChange={setMinRating}
              onMaxDistanceToCenterChange={setMaxDistanceToCenter}
              onAccommodationTypeChange={setAccommodationType}
              onMealTypeChange={setMealType}
              onHotelChainChange={setHotelChain}
              onHasSpecialOffersChange={setHasSpecialOffers}
              onAmenityChange={handleAmenityChange}
              onReset={() => {
                setMinPrice('')
                setMaxPrice('')
                setMinRating('')
                setMaxDistanceToCenter('')
                setAccommodationType('')
                setMealType('')
                setHotelChain('')
                setHasSpecialOffers(false)
                setAmenities({
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
              }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Отображение ошибок */}
      <AnimatePresence>
        {searchError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{searchError}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSearchError(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Результаты поиска */}
      {hasSearched && (
        <LazyLoad threshold={0.1} showLoadingIndicator={true}>
          {hotels.length > 0 || isLoading ? (
            <SearchResults
              hotels={hotels}
              isLoading={isLoading}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                handleSearch();
              }}
            />
          ) : !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">Отели не найдены</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Попробуйте изменить параметры поиска или выбрать другое направление.
                </p>
                <Button
                  onClick={() => {
                    setShowAdvancedFilters(true);
                  }}
                  className="mt-2"
                >
                  Изменить фильтры
                </Button>
              </div>
            </motion.div>
          )}
        </LazyLoad>
      )}
    </div>
  )
}