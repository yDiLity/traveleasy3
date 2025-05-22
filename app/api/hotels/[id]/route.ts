import { NextResponse } from 'next/server'
import { Hotel } from '@/types/hotel'
import { generateRandomHotel } from '@/utils/hotel-generator'
import { getHotelImages } from '@/services/unsplash-api-service'
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

    // Изображения будут загружены из API Unsplash в компоненте HotelGallery
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
  const rapidApiKey = API_KEYS.RAPID_API_KEY
  const rapidApiHost = API_KEYS.RAPID_API_HOST
  const unsplashApiKey = API_KEYS.UNSPLASH_API_KEY

  // Если API ключи не настроены, используем мок-данные
  if (!rapidApiKey || !rapidApiHost) {
    console.log('API keys not configured, using mock data')
    const hotel = getMockHotelById(id)

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ hotel })
  }

  try {
    // Используем RapidAPI Hotels API для получения детальной информации об отеле
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost
      }
    }

    // Запрос на получение детальной информации об отеле
    const hotelUrl = `https://${rapidApiHost}/properties/v2/detail?propertyId=${id}`
    const hotelResponse = await fetch(hotelUrl, options)

    if (!hotelResponse.ok) {
      throw new Error(`Hotel API request failed with status ${hotelResponse.status}`)
    }

    const hotelData = await hotelResponse.json()
    const propertyData = hotelData.data?.propertyInfo

    if (!propertyData) {
      throw new Error('Failed to get hotel data')
    }

    // Получаем изображения отеля с помощью Unsplash API
    let hotelImages = propertyData.propertyGallery?.images?.map((img: any) => img.image.url) || ['/hotel-placeholder.svg']

    // Если есть ключ Unsplash API, получаем дополнительные изображения
    if (unsplashApiKey) {
      try {
        const searchQuery = `${propertyData.name} ${propertyData.address?.locality || ''} hotel`
        const unsplashImages = await getHotelImages(searchQuery, 5, unsplashApiKey)

        if (unsplashImages && unsplashImages.length > 0) {
          // Объединяем изображения из API и Unsplash
          hotelImages = [...hotelImages, ...unsplashImages]
        }
      } catch (error) {
        console.error('Error fetching images from Unsplash:', error)
      }
    }

    // Преобразуем ответ API в наш формат
    const hotel: Hotel = {
      id: parseInt(id),
      name: propertyData.name || '',
      location: propertyData.address?.locality || '',
      address: [
        propertyData.address?.addressLine1,
        propertyData.address?.locality,
        propertyData.address?.countryName
      ].filter(Boolean).join(', '),
      price: propertyData.featuredPrice?.currentPrice?.plain || 0,
      rating: propertyData.reviewInfo?.summary?.overallScoreWithDescriptionA11y?.value || 0,
      stars: propertyData.starRating || 0,
      images: hotelImages,
      description: propertyData.description?.text || '',
      accommodationType: 'hotel', // Упрощенно, можно доработать
      mealType: 'none', // API не предоставляет эту информацию напрямую
      amenities: {
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
      },
      distanceToCenter: propertyData.destinationInfo?.distanceFromDestination?.value || null,
      reviews: propertyData.reviewInfo?.reviews?.map((review: any) => ({
        id: review.id || Math.floor(Math.random() * 1000),
        author: review.reviewAuthor?.name || 'Гость',
        rating: review.reviewScoreWithDescription?.value || 0,
        comment: review.text || '',
        date: review.submissionTime?.date || new Date().toISOString().split('T')[0]
      })) || [],
      hotelChain: propertyData.brandInfo?.name || null,
      hasSpecialOffers: propertyData.offerBadge ? true : false
    }

    // Обрабатываем удобства, если они есть
    if (propertyData.amenities && Array.isArray(propertyData.amenities.amenities)) {
      propertyData.amenities.amenities.forEach((amenity: any) => {
        const amenityName = amenity.name?.toLowerCase() || ''

        if (amenityName.includes('wifi') || amenityName.includes('internet')) {
          hotel.amenities.wifi = true
        }

        if (amenityName.includes('parking')) {
          hotel.amenities.parking = true
        }

        if (amenityName.includes('pool') || amenityName.includes('swimming')) {
          hotel.amenities.pool = true
        }

        if (amenityName.includes('gym') || amenityName.includes('fitness')) {
          hotel.amenities.gym = true
        }

        if (amenityName.includes('restaurant') || amenityName.includes('dining')) {
          hotel.amenities.restaurant = true
        }

        if (amenityName.includes('spa') || amenityName.includes('massage')) {
          hotel.amenities.spa = true
        }

        if (amenityName.includes('air') || amenityName.includes('conditioning')) {
          hotel.amenities.airConditioning = true
        }

        if (amenityName.includes('pet') || amenityName.includes('dog') || amenityName.includes('cat')) {
          hotel.amenities.petFriendly = true
        }

        if (amenityName.includes('conference') || amenityName.includes('meeting')) {
          hotel.amenities.conferenceRoom = true
        }

        if (amenityName.includes('transfer') || amenityName.includes('shuttle')) {
          hotel.amenities.transfer = true
        }
      })
    }

    return NextResponse.json({ hotel })
  } catch (error) {
    console.error('API error:', error)

    // В случае ошибки используем мок-данные
    console.log('Using mock data due to API error')
    const hotel = getMockHotelById(id)

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      hotel,
      warning: 'Using mock data due to API error'
    })
  }
}
