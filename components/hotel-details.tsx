'use client'

import { useState, useEffect } from 'react'
import { Hotel, HotelReview } from '@/types/hotel'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import Link from 'next/link'
import { HotelMap } from './hotel-map'
import { FavoriteButton } from './favorite-button-simple'
import { useTranslations } from 'next-intl'
import { HotelGallery } from './hotel-gallery'
import { useRecentlyViewed } from '@/context/recently-viewed-context'
import { HotelReviews } from './hotel-reviews'
import { AddReviewForm } from './add-review-form'
import { LazyLoad } from './lazy-load'

interface HotelDetailsProps {
  id: string
}

export function HotelDetails({ id }: HotelDetailsProps) {
  // Используем next-intl для переводов
  const t = useTranslations()
  const hotelT = useTranslations('hotel')
  const commonT = useTranslations('common')
  const searchT = useTranslations('search')

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<HotelReview[]>([])
  const { addToRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    async function fetchHotelDetails() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/hotels/${id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch hotel details: ${response.status}`)
        }

        const data = await response.json()
        setHotel(data.hotel)

        // Загружаем отзывы для отеля
        if (data.hotel && data.hotel.reviews) {
          setReviews(data.hotel.reviews)
        }

        // Добавляем отель в недавно просмотренные
        if (data.hotel) {
          addToRecentlyViewed(data.hotel)
        }
      } catch (err) {
        console.error('Error fetching hotel details:', err)
        setError('Не удалось загрузить информацию об отеле. Пожалуйста, попробуйте позже.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotelDetails()
  }, [id, addToRecentlyViewed])

  // Функция для отображения типа питания на русском
  const getMealTypeText = (mealType: string) => {
    const mealTypeMap: Record<string, string> = {
      'none': 'Без питания',
      'breakfast': 'Завтрак',
      'half-board': 'Полупансион',
      'full-board': 'Полный пансион',
      'all-inclusive': 'Всё включено'
    }

    return mealTypeMap[mealType] || 'Не указано'
  }

  // Функция для отображения типа размещения на русском
  const getAccommodationTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      'hotel': 'Отель',
      'apartment': 'Апартаменты',
      'hostel': 'Хостел',
      'villa': 'Вилла',
      'resort': 'Курортный отель'
    }

    return typeMap[type] || 'Не указано'
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-4">Ошибка</h2>
          <p>{error}</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Вернуться к поиску</Button>
          </Link>
        </div>
      </Card>
    )
  }

  if (!hotel) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Отель не найден</h2>
          <p>Информация об отеле недоступна или отель не существует.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Вернуться к поиску</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:underline mb-2 inline-block">
            ← {commonT('back')}
          </Link>
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <div className="flex items-center mt-2">
            {Array.from({ length: Math.floor(hotel.stars) }).map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
            <span className="ml-2 text-gray-500">{hotel.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white px-4 py-2 rounded-lg text-xl font-bold">
            {hotel.price.toLocaleString('ru-RU')} ₽ / ночь
          </div>
          <FavoriteButton hotelId={hotel.id} size="lg" />
        </div>
      </div>

      {/* Галерея изображений */}
      <HotelGallery images={hotel.images} hotelName={hotel.name} />

      {/* Основная информация и вкладки */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="description">{hotelT('description')}</TabsTrigger>
          <TabsTrigger value="amenities">{hotelT('amenities')}</TabsTrigger>
          <TabsTrigger value="reviews">{hotelT('reviews')}</TabsTrigger>
          <TabsTrigger value="location">{hotelT('location')}</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-2">{hotelT('description')}</h3>
                  <ul className="space-y-2">
                    <li><span className="text-gray-500">Тип размещения:</span> {getAccommodationTypeText(hotel.accommodationType)}</li>
                    <li><span className="text-gray-500">Тип питания:</span> {getMealTypeText(hotel.mealType)}</li>
                    {hotel.hotelChain && <li><span className="text-gray-500">Сеть отелей:</span> {hotel.hotelChain}</li>}
                    {hotel.distanceToCenter && <li><span className="text-gray-500">Расстояние до центра:</span> {hotel.distanceToCenter} км</li>}
                    {hotel.hasSpecialOffers && <li className="text-primary font-semibold">Специальное предложение!</li>}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{searchT('rating')}</h3>
                  <div className="flex items-center">
                    <div className="bg-primary text-white font-bold rounded-lg px-3 py-1 text-xl">
                      {hotel.rating.toFixed(1)}
                    </div>
                    <div className="ml-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < Math.round(hotel.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {hotel.reviews?.length || 0} отзывов
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold mb-2">{hotelT('description')}</h3>
              <p className="text-gray-700">{hotel.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">{hotelT('amenities')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.wifi && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Wi-Fi</span>
                  </div>
                )}
                {hotel.amenities.parking && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Парковка</span>
                  </div>
                )}
                {hotel.amenities.pool && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Бассейн</span>
                  </div>
                )}
                {hotel.amenities.gym && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Фитнес-центр</span>
                  </div>
                )}
                {hotel.amenities.restaurant && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Ресторан</span>
                  </div>
                )}
                {hotel.amenities.spa && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>СПА-центр</span>
                  </div>
                )}
                {hotel.amenities.airConditioning && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Кондиционер</span>
                  </div>
                )}
                {hotel.amenities.petFriendly && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Размещение с животными</span>
                  </div>
                )}
                {hotel.amenities.conferenceRoom && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Конференц-зал</span>
                  </div>
                )}
                {hotel.amenities.transfer && (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Трансфер</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-8">
            <LazyLoad threshold={0.1} showLoadingIndicator={true}>
              <HotelReviews
                reviews={reviews}
                hotelName={hotel.name}
                averageRating={hotel.rating}
              />
            </LazyLoad>

            <LazyLoad threshold={0.1} showLoadingIndicator={true} delay={300}>
              <AddReviewForm
                hotelId={hotel.id}
                hotelName={hotel.name}
                onReviewAdded={() => {
                  // В реальном приложении здесь был бы код для обновления списка отзывов
                  // Для демонстрации просто добавляем отзыв в начало списка
                  setReviews(prevReviews => {
                    // Создаем фиктивный отзыв для демонстрации
                    const newReview: HotelReview = {
                      id: `demo-${Date.now()}`,
                      hotelId: hotel.id,
                      userId: 'current-user',
                      userName: 'Вы',
                      rating: 5,
                      title: 'Отличный отель!',
                      comment: 'Спасибо за отзыв! В реальном приложении здесь был бы ваш отзыв.',
                      date: new Date().toISOString(),
                      likes: 0,
                      categories: {
                        location: 5,
                        cleanliness: 5,
                        service: 5,
                        value: 5,
                        comfort: 5
                      },
                      verified: true
                    }
                    return [newReview, ...prevReviews]
                  })
                }}
              />
            </LazyLoad>
          </div>
        </TabsContent>

        <TabsContent value="location">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">{hotelT('location')}</h3>
              <p className="mb-4">
                <span className="font-medium">{hotelT('address')}:</span> {hotel.address}
              </p>
              {hotel.distanceToCenter && (
                <p className="mb-4">
                  <span className="font-medium">{hotelT('distanceToCenter')}:</span> {hotel.distanceToCenter} км
                </p>
              )}

              {/* Карта с расположением отеля */}
              <HotelMap
                name={hotel.name}
                address={hotel.address}
                latitude={hotel.latitude}
                longitude={hotel.longitude}
              />

              <p className="text-sm text-gray-500 mt-2">
                Примечание: Если координаты отеля не указаны, на карте отображается примерное расположение.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Кнопка бронирования */}
      <div className="flex justify-center mt-6">
        <Button size="lg" className="px-8">
          {hotelT('book')}
        </Button>
      </div>
    </div>
  )
}
