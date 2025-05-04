'use client'

import { useState, useEffect } from 'react'
import { Hotel } from '@/types/hotel'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ViewToggle, ViewMode } from './view-toggle'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedHotelCard } from './animated-hotel-card'
import { FavoriteButton } from './favorite-button-simple'
import { OpenStreetMapComponent } from './map/OpenStreetMap'
import Image from 'next/image'
import Link from 'next/link'
import { VirtualizedList } from './virtualized-list'
import { Pagination } from './pagination'
import {
  ArrowUpDown,
  ArrowDownUp,
  Star,
  DollarSign,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Map as MapIcon,
  Wifi,
  Car,
  Waves,
  Utensils,
  Droplets
} from 'lucide-react'
// import { useTranslations } from 'next-intl'

interface SearchResultsProps {
  hotels: Hotel[]
  isLoading: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function SearchResults({
  hotels,
  isLoading,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: SearchResultsProps) {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'noResults': 'Нет результатов',
      'tryDifferentSearch': 'Попробуйте изменить параметры поиска',
      'resetFilters': 'Сбросить фильтры',
      'searchingHotels': 'Поиск отелей...',
      'searchResults': 'Результаты поиска',
      'found': 'Найдено',
      'hotels': 'отелей',
      'filters': 'Фильтры',
      'sortOptions.rating': 'По рейтингу',
      'sortOptions.priceAsc': 'Цена (по возрастанию)',
      'sortOptions.priceDesc': 'Цена (по убыванию)',
      'showMap': 'Показать карту',
      'map': 'Карта',
      'mapDescription': 'Карта отелей',
      'advancedFilters': 'Расширенные фильтры',
      'priceRange': 'Диапазон цен',
      'min': 'Мин',
      'max': 'Макс',
      'minRating': 'Минимальный рейтинг',
      'any': 'Любой',
      'stars': 'Звезды',
      'amenities': 'Удобства',
      'amenities.parking': 'Парковка',
      'amenities.pool': 'Бассейн',
      'amenities.restaurant': 'Ресторан',
      'amenities.spa': 'СПА',
      'specialOffer': 'Спецпредложение',
      'perNight': 'за ночь'
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

  // Состояние для отображения
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [windowHeight, setWindowHeight] = useState(600)
  const [useVirtualization, setUseVirtualization] = useState(false)

  // Определяем, нужно ли использовать виртуализацию на основе количества отелей
  useEffect(() => {
    // Используем виртуализацию только если отелей больше 20
    setUseVirtualization(hotels.length > 20)

    // Устанавливаем высоту окна для виртуализации
    setWindowHeight(typeof window !== 'undefined' ? window.innerHeight * 0.7 : 600)

    const handleResize = () => {
      setWindowHeight(window.innerHeight * 0.7)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [hotels.length])

  // Состояние для фильтрации
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [minRating, setMinRating] = useState(0)
  const [selectedStars, setSelectedStars] = useState<number[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // Функция для сортировки отелей
  const sortedHotels = [...hotels].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price
    if (sortBy === 'price_desc') return b.price - a.price
    return b.rating - a.rating // По умолчанию сортируем по рейтингу
  })

  // Функция для фильтрации отелей
  const filteredHotels = sortedHotels.filter(hotel => {
    // Фильтрация по цене
    if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) return false

    // Фильтрация по рейтингу
    if (hotel.rating < minRating) return false

    // Фильтрация по звездам
    if (selectedStars.length > 0 && !selectedStars.includes(Math.floor(hotel.stars))) return false

    // Фильтрация по удобствам
    if (selectedAmenities.includes('wifi') && !hotel.amenities.wifi) return false
    if (selectedAmenities.includes('parking') && !hotel.amenities.parking) return false
    if (selectedAmenities.includes('pool') && !hotel.amenities.pool) return false
    if (selectedAmenities.includes('restaurant') && !hotel.amenities.restaurant) return false
    if (selectedAmenities.includes('spa') && !hotel.amenities.spa) return false

    return true
  })

  // Функция для переключения звезд в фильтре
  const toggleStar = (star: number) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter(s => s !== star))
    } else {
      setSelectedStars([...selectedStars, star])
    }
  }

  // Функция для переключения удобств в фильтре
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
    } else {
      setSelectedAmenities([...selectedAmenities, amenity])
    }
  }

  // Функция для сброса всех фильтров
  const resetFilters = () => {
    setPriceRange([0, 1000000])
    setMinRating(0)
    setSelectedStars([])
    setSelectedAmenities([])
  }

  // Если нет результатов поиска
  if (hotels.length === 0 && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8"
      >
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">{t('noResults')}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('tryDifferentSearch')}
          </p>
          <div className="flex justify-center">
            <Button onClick={resetFilters}>
              {t('resetFilters')}
            </Button>
          </div>
        </Card>
      </motion.div>
    )
  }

  // Если идет загрузка
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8"
      >
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{t('searchingHotels')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 flex-grow"
    >
      <Card className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-semibold">{t('searchResults')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('found')} {filteredHotels.length} {t('hotels')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center w-full sm:w-auto justify-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('filters')}
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('rating')}
                className="flex items-center flex-1 sm:flex-none justify-center"
              >
                <Star className="h-4 w-4 mr-2" />
                {t('sortOptions.rating')}
              </Button>

              <Button
                variant={sortBy === 'price_asc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('price_asc')}
                className="flex items-center flex-1 sm:flex-none justify-center"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('sortOptions.priceAsc')}</span>
                <span className="sm:hidden">↑ ₽</span>
              </Button>

              <Button
                variant={sortBy === 'price_desc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('price_desc')}
                className="flex items-center flex-1 sm:flex-none justify-center"
              >
                <ArrowDownUp className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('sortOptions.priceDesc')}</span>
                <span className="sm:hidden">↓ ₽</span>
              </Button>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <ViewToggle
                currentView={viewMode}
                onChange={setViewMode}
                className="flex-1 sm:flex-none justify-center"
              />

              <Button
                variant={showMap ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center flex-1 sm:flex-none justify-center"
              >
                <MapIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('showMap')}</span>
                <span className="sm:hidden">{t('map')}</span>
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                {t('mapDescription')}
              </div>
              <OpenStreetMapComponent
                hotels={filteredHotels}
              />
            </motion.div>
          )}

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <Card className="p-4 bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">{t('advancedFilters')}</h4>
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
                    <X className="h-3 w-3 mr-1" />
                    {t('resetFilters')}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Фильтр по цене */}
                  <div className="col-span-1">
                    <h5 className="text-sm font-medium mb-2">{t('priceRange')}</h5>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder={t('min')}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min={priceRange[0]}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder={t('max')}
                      />
                    </div>
                  </div>

                  {/* Фильтр по рейтингу */}
                  <div className="col-span-1">
                    <h5 className="text-sm font-medium mb-2">{t('minRating')}</h5>
                    <div className="flex flex-wrap items-center gap-1">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <Button
                          key={rating}
                          variant={minRating === rating ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMinRating(rating)}
                          className="flex-1"
                        >
                          {rating > 0 ? `${rating}+` : t('any')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Фильтр по звездам */}
                  <div className="col-span-1">
                    <h5 className="text-sm font-medium mb-2">{t('stars')}</h5>
                    <div className="flex flex-wrap items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant={selectedStars.includes(star) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleStar(star)}
                          className="flex-1"
                        >
                          {star} ★
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Фильтр по удобствам */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2">{t('amenities')}</h5>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedAmenities.includes('wifi') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAmenity('wifi')}
                    >
                      Wi-Fi
                    </Button>
                    <Button
                      variant={selectedAmenities.includes('parking') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAmenity('parking')}
                    >
                      {t('amenities.parking')}
                    </Button>
                    <Button
                      variant={selectedAmenities.includes('pool') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAmenity('pool')}
                    >
                      {t('amenities.pool')}
                    </Button>
                    <Button
                      variant={selectedAmenities.includes('restaurant') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAmenity('restaurant')}
                    >
                      {t('amenities.restaurant')}
                    </Button>
                    <Button
                      variant={selectedAmenities.includes('spa') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAmenity('spa')}
                    >
                      {t('amenities.spa')}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {viewMode === 'grid' ? (
          useVirtualization ? (
            <VirtualizedList
              items={filteredHotels}
              itemHeight={350} // Примерная высота карточки отеля
              windowHeight={windowHeight}
              overscan={5}
              renderItem={(hotel, index) => (
                <div className="p-2">
                  <AnimatedHotelCard key={hotel.id} hotel={hotel} index={index} />
                </div>
              )}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredHotels.map((hotel, index) => (
                <AnimatedHotelCard key={hotel.id} hotel={hotel} index={index} />
              ))}
            </div>
          )
        ) : (
          useVirtualization ? (
            <VirtualizedList
              items={filteredHotels}
              itemHeight={200} // Примерная высота карточки отеля в режиме списка
              windowHeight={windowHeight}
              overscan={3}
              renderItem={(hotel, index) => (
                <div className="py-2">
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
                  >
                <Card className="overflow-hidden bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/3 h-48 sm:h-48 md:h-auto">
                      <Image
                        src={hotel.images[0] || '/hotel-placeholder.svg'}
                        alt={hotel.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index < 3}
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <FavoriteButton hotelId={hotel.id} />
                      </div>
                      {hotel.hasSpecialOffers && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                          {t('specialOffer')}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-16" />
                      <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                        <div className="flex items-center space-x-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {Array.from({ length: Math.floor(hotel.stars) }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-white text-xs ml-1">{hotel.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                        <div>
                          <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{hotel.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {hotel.address}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="font-bold text-xl text-primary dark:text-primary">
                            {hotel.price.toLocaleString('ru-RU')} ₽
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">{t('perNight')}</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-200 mb-3 line-clamp-2 sm:line-clamp-3">{hotel.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {hotel.amenities.wifi && (
                          <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                            <Wifi className="h-3 w-3 mr-1" />
                            Wi-Fi
                          </div>
                        )}
                        {hotel.amenities.parking && (
                          <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                            <Car className="h-3 w-3 mr-1" />
                            {t('amenities.parking')}
                          </div>
                        )}
                        {hotel.amenities.pool && (
                          <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                            <Waves className="h-3 w-3 mr-1" />
                            {t('amenities.pool')}
                          </div>
                        )}
                        {hotel.amenities.restaurant && (
                          <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                            <Utensils className="h-3 w-3 mr-1" />
                            {t('amenities.restaurant')}
                          </div>
                        )}
                        {hotel.amenities.spa && (
                          <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                            <Droplets className="h-3 w-3 mr-1" />
                            {t('amenities.spa')}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                        <Link href={`/hotel/${hotel.id}`}>
                          <Button
                            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-0 text-white shadow-md"
                          >
                            {t('viewDetails')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
                  </motion.div>
                </div>
              )}
            />
          ) : (
            <div className="space-y-4">
              {filteredHotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
                >
                  <Card className="overflow-hidden bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/3 h-48 sm:h-48 md:h-auto">
                        <Image
                          src={hotel.images[0] || '/hotel-placeholder.svg'}
                          alt={hotel.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={index < 3}
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <FavoriteButton hotelId={hotel.id} />
                        </div>
                        {hotel.hasSpecialOffers && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                            {t('specialOffer')}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-16" />
                        <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                          <div className="flex items-center space-x-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {Array.from({ length: Math.floor(hotel.stars) }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-white text-xs ml-1">{hotel.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                          <div>
                            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{hotel.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {hotel.address}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="font-bold text-xl text-primary dark:text-primary">
                              {hotel.price.toLocaleString('ru-RU')} ₽
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{t('perNight')}</div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-200 mb-3 line-clamp-2 sm:line-clamp-3">{hotel.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {hotel.amenities.wifi && (
                            <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                              <Wifi className="h-3 w-3 mr-1" />
                              Wi-Fi
                            </div>
                          )}
                          {hotel.amenities.parking && (
                            <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                              <Car className="h-3 w-3 mr-1" />
                              {t('amenities.parking')}
                            </div>
                          )}
                          {hotel.amenities.pool && (
                            <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                              <Waves className="h-3 w-3 mr-1" />
                              {t('amenities.pool')}
                            </div>
                          )}
                          {hotel.amenities.restaurant && (
                            <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                              <Utensils className="h-3 w-3 mr-1" />
                              {t('amenities.restaurant')}
                            </div>
                          )}
                          {hotel.amenities.spa && (
                            <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                              <Droplets className="h-3 w-3 mr-1" />
                              {t('amenities.spa')}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                          <Link href={`/hotel/${hotel.id}`}>
                            <Button
                              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-0 text-white shadow-md"
                            >
                              {t('viewDetails')}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )
        )}

        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">{t('noMatchingResults')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('tryChangingFilters')}
            </p>
            <Button onClick={resetFilters}>
              {t('resetFilters')}
            </Button>
          </div>
        )}

        {/* Пагинация */}
        {filteredHotels.length > 0 && totalPages > 1 && onPageChange && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              className="mt-6"
            />
          </div>
        )}
      </Card>
    </motion.div>
  )
}
