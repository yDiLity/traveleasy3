'use client'

import { useState, useEffect } from 'react'
import { Hotel } from '@/types/hotel'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { FavoriteButton } from './favorite-button-simple'
import { ViewToggle, ViewMode } from './view-toggle'

interface HotelCarouselProps {
  title: string
  subtitle?: string
  filter?: (hotel: Hotel) => boolean
}

export function HotelCarousel({ title, subtitle, filter }: HotelCarouselProps) {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Количество отелей, отображаемых одновременно в зависимости от режима просмотра
  const itemsPerPage = viewMode === 'grid' ? 3 : 2

  // Функция для генерации заглушечных данных
  const generateMockHotels = () => {
    // Создаем массив из 10 отелей
    const mockHotels: Hotel[] = [
      {
        id: 1,
        name: 'Grand Hotel Москва',
        location: 'Москва',
        address: 'ул. Тверская, 15, Москва',
        price: 45000,
        rating: 4.8,
        stars: 5,
        images: ['/hotel-placeholder.svg'],
        description: 'Роскошный отель в центре Москвы с панорамным видом на город.',
        accommodationType: 'hotel',
        mealType: 'breakfast',
        amenities: {
          wifi: true,
          parking: true,
          pool: true,
          gym: true,
          restaurant: true,
          spa: true,
          airConditioning: true,
          petFriendly: false,
          conferenceRoom: true,
          transfer: true
        },
        distanceToCenter: 0.5,
        latitude: 55.7558,
        longitude: 37.6173,
        reviews: [],
        hotelChain: 'Luxury Hotels',
        hasSpecialOffers: true
      },
      {
        id: 2,
        name: 'Business Plaza Москва',
        location: 'Москва',
        address: 'ул. Новый Арбат, 32, Москва',
        price: 25000,
        rating: 4.5,
        stars: 4,
        images: ['/hotel-placeholder.svg'],
        description: 'Современный бизнес-отель с конференц-залами и рестораном.',
        accommodationType: 'hotel',
        mealType: 'breakfast',
        amenities: {
          wifi: true,
          parking: true,
          pool: false,
          gym: true,
          restaurant: true,
          spa: false,
          airConditioning: true,
          petFriendly: false,
          conferenceRoom: true,
          transfer: false
        },
        distanceToCenter: 1.2,
        latitude: 55.7516,
        longitude: 37.5965,
        reviews: [],
        hotelChain: 'Business Hotels',
        hasSpecialOffers: false
      },
      {
        id: 3,
        name: 'Comfort Inn Москва',
        location: 'Москва',
        address: 'ул. Пятницкая, 25, Москва',
        price: 12000,
        rating: 4.2,
        stars: 3,
        images: ['/hotel-placeholder.svg'],
        description: 'Уютный отель в историческом центре города.',
        accommodationType: 'hotel',
        mealType: 'breakfast',
        amenities: {
          wifi: true,
          parking: false,
          pool: false,
          gym: false,
          restaurant: true,
          spa: false,
          airConditioning: true,
          petFriendly: false,
          conferenceRoom: false,
          transfer: false
        },
        distanceToCenter: 1.8,
        latitude: 55.7419,
        longitude: 37.6288,
        reviews: [],
        hotelChain: 'Comfort Hotels',
        hasSpecialOffers: true
      },
      {
        id: 4,
        name: 'Luxury Resort Сочи',
        location: 'Сочи',
        address: 'ул. Морская, 10, Сочи',
        price: 65000,
        rating: 4.9,
        stars: 5,
        images: ['/hotel-placeholder.svg'],
        description: 'Роскошный курортный отель на берегу моря с собственным пляжем.',
        accommodationType: 'resort',
        mealType: 'all-inclusive',
        amenities: {
          wifi: true,
          parking: true,
          pool: true,
          gym: true,
          restaurant: true,
          spa: true,
          airConditioning: true,
          petFriendly: false,
          conferenceRoom: true,
          transfer: true
        },
        distanceToCenter: 3.0,
        latitude: 43.5992,
        longitude: 39.7257,
        reviews: [],
        hotelChain: 'Luxury Resorts',
        hasSpecialOffers: true
      },
      {
        id: 5,
        name: 'City Apartments Москва',
        location: 'Москва',
        address: 'ул. Садовая, 5, Москва',
        price: 18000,
        rating: 4.3,
        stars: 4,
        images: ['/hotel-placeholder.svg'],
        description: 'Современные апартаменты в центре города с кухней и всеми удобствами.',
        accommodationType: 'apartment',
        mealType: 'none',
        amenities: {
          wifi: true,
          parking: true,
          pool: false,
          gym: true,
          restaurant: false,
          spa: false,
          airConditioning: true,
          petFriendly: true,
          conferenceRoom: false,
          transfer: false
        },
        distanceToCenter: 1.5,
        latitude: 55.7622,
        longitude: 37.6270,
        reviews: [],
        hotelChain: null,
        hasSpecialOffers: false
      }
    ];

    // Если есть фильтр, применяем его
    if (filter) {
      return mockHotels.filter(filter);
    }

    return mockHotels;
  };

  useEffect(() => {
    // Используем заглушечные данные для ускорения загрузки
    setIsLoading(true)

    // Генерируем мок-данные
    const mockHotels = generateMockHotels();

    // Применяем фильтр, если он указан
    let filteredHotels = mockHotels;
    if (filter) {
      filteredHotels = filteredHotels.filter(filter);
    }

    setHotels(filteredHotels);
    setIsLoading(false);

    // Запрос к API делаем только если нужны реальные данные
    // В данном случае мы используем только мок-данные для ускорения загрузки
  }, [filter])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1
      return newIndex < 0 ? Math.max(0, hotels.length - itemsPerPage) : newIndex
    })
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1
      return newIndex > Math.max(0, hotels.length - itemsPerPage) ? 0 : newIndex
    })
  }

  const visibleHotels = hotels.slice(currentIndex, currentIndex + itemsPerPage)

  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </Card>
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}
        <Card className="p-6">
          <div className="text-center">
            <p>Нет доступных отелей.</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex gap-2 items-center">
          <ViewToggle
            currentView={viewMode}
            onChange={setViewMode}
            className="mr-2"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={hotels.length <= itemsPerPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={hotels.length <= itemsPerPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        // Отображение сеткой
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative h-36">
                <Image
                  src={hotel.images[0] || '/hotel-placeholder.svg'}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <FavoriteButton hotelId={hotel.id} />
                </div>
                {hotel.hasSpecialOffers && (
                  <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                    Спецпредложение
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex items-center mb-1">
                  {Array.from({ length: Math.floor(hotel.stars) }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">★</span>
                  ))}
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">{hotel.location}</span>
                </div>
                <h3 className="font-semibold text-base mb-1 line-clamp-1 text-gray-900 dark:text-white">{hotel.name}</h3>
                <p className="text-xs text-gray-700 dark:text-gray-200 mb-2 line-clamp-1">{hotel.description}</p>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-base text-primary dark:text-primary">
                    {hotel.price.toLocaleString('ru-RU')} ₽
                    <span className="text-xs text-gray-600 dark:text-gray-300"> / ночь</span>
                  </div>
                  <Link href={`/hotel/${hotel.id}`}>
                    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-0 text-white shadow-md text-xs py-1 h-7">
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Отображение списком
        <div className="space-y-4">
          {visibleHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/3 h-36 md:h-auto">
                  <Image
                    src={hotel.images[0] || '/hotel-placeholder.svg'}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <FavoriteButton hotelId={hotel.id} />
                  </div>
                  {hotel.hasSpecialOffers && (
                    <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                      Спецпредложение
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-white">{hotel.name}</h3>
                      <div className="flex items-center mb-1">
                        {Array.from({ length: Math.floor(hotel.stars) }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">★</span>
                        ))}
                        <div className="flex items-center ml-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                          <MapPin className="h-2.5 w-2.5 mr-0.5" />
                          {hotel.location}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-base text-primary dark:text-primary">
                      {hotel.price.toLocaleString('ru-RU')} ₽
                      <span className="text-xs text-gray-600 dark:text-gray-300"> / ночь</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-200 mb-2 line-clamp-1">{hotel.description}</p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {hotel.amenities.wifi && <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-1.5 py-0.5 rounded-full border border-primary/20 text-[10px]">Wi-Fi</span>}
                    {hotel.amenities.parking && <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-1.5 py-0.5 rounded-full border border-primary/20 text-[10px]">Парковка</span>}
                    {hotel.amenities.pool && <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-1.5 py-0.5 rounded-full border border-primary/20 text-[10px]">Бассейн</span>}
                    {hotel.amenities.restaurant && <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-1.5 py-0.5 rounded-full border border-primary/20 text-[10px]">Ресторан</span>}
                    {hotel.amenities.spa && <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-1.5 py-0.5 rounded-full border border-primary/20 text-[10px]">СПА</span>}
                  </div>

                  <div className="flex justify-end">
                    <Link href={`/hotel/${hotel.id}`}>
                      <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-0 text-white shadow-md text-xs py-1 h-7">
                        Подробнее
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
