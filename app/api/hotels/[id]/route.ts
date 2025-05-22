import { NextResponse } from 'next/server'
import { Hotel } from '@/types/hotel'
import { generateRandomHotel } from '@/utils/hotel-generator'
import { getHotelImages } from '@/services/pexels-api-service'
import { API_KEYS } from '@/config/api-config'

// Функция для получения мок-данных об отеле по ID
function getMockHotelById(id: string): Hotel | null {
  // Генерируем отель с указанным ID
  try {
    const hotelId = parseInt(id)
    if (isNaN(hotelId)) {
      return null
    }

    // Генерируем отель с указанным ID
    const hotel = generateRandomHotel(hotelId)

    // Изображения будут загружены из API Pexels
    hotel.images = ['/hotel-placeholder.svg']

    // Добавляем более подробное описание
    hotel.description = `${hotel.description} Отель предлагает комфортное размещение и высокий уровень сервиса. К услугам гостей ${hotel.amenities.restaurant ? 'ресторан, ' : ''}${hotel.amenities.pool ? 'бассейн, ' : ''}${hotel.amenities.spa ? 'спа-центр, ' : ''}${hotel.amenities.gym ? 'фитнес-центр, ' : ''}${hotel.amenities.wifi ? 'бесплатный Wi-Fi' : ''}. ${hotel.hasSpecialOffers ? 'В настоящее время действуют специальные предложения и скидки.' : ''}`

    // Добавляем больше отзывов, если их мало
    if (hotel.reviews.length < 3) {
      const additionalReviews = [
        {
          id: hotelId * 100 + 10,
          author: 'Анна М.',
          rating: 4,
          comment: 'Очень понравилось расположение и обслуживание. Рекомендую!',
          date: '2025-03-15'
        },
        {
          id: hotelId * 100 + 11,
          author: 'Сергей К.',
          rating: 5,
          comment: 'Отличный отель, все на высшем уровне!',
          date: '2025-02-20'
        }
      ]
      hotel.reviews = [...hotel.reviews, ...additionalReviews]
    }

    return hotel
  } catch (error) {
    console.error('Error generating hotel:', error)
    return null
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  if (!id) {
    return NextResponse.json(
      { error: 'Hotel ID is required' },
      { status: 400 }
    )
  }

  // Проверяем наличие API ключей
  const pexelsApiKey = API_KEYS.PEXELS_API_KEY

  // Получаем мок-данные об отеле
  console.log('Getting hotel data')
  const hotel = getMockHotelById(id)

  if (!hotel) {
    return NextResponse.json(
      { error: 'Hotel not found' },
      { status: 404 }
    )
  }

  // Добавляем мок-изображения отеля
  hotel.images = [
    'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    'https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg'
  ]
  console.log('Using mock images from Pexels')

  return NextResponse.json({ hotel })
}
