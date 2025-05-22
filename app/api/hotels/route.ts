import { NextResponse } from 'next/server'
import { AccommodationType, MealType, Hotel } from '@/types/hotel'
import { getMockHotels } from '@/data/mock-hotels'
import { searchHotelsNearby } from '@/services/google-places-service'
import { API_KEYS } from '@/config/api-config'

// Функция для получения мок-данных импортируется из @/data/mock-hotels

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Основные параметры поиска
  const location = searchParams.get('location')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guests = searchParams.get('guests') || '1'

  // Параметры фильтрации
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const minRating = searchParams.get('minRating')
  const maxDistanceToCenter = searchParams.get('maxDistanceToCenter')
  const accommodationType = searchParams.get('accommodationType') as AccommodationType | null
  const mealType = searchParams.get('mealType') as MealType | null
  const hotelChain = searchParams.get('hotelChain')
  const hasSpecialOffers = searchParams.get('hasSpecialOffers')

  // Удобства
  const wifi = searchParams.get('wifi')
  const parking = searchParams.get('parking')
  const pool = searchParams.get('pool')
  const gym = searchParams.get('gym')
  const restaurant = searchParams.get('restaurant')
  const spa = searchParams.get('spa')
  const airConditioning = searchParams.get('airConditioning')
  const petFriendly = searchParams.get('petFriendly')
  const conferenceRoom = searchParams.get('conferenceRoom')
  const transfer = searchParams.get('transfer')

  // Сортировка
  const sortBy = searchParams.get('sortBy') || 'rating'

  if (!location) {
    return NextResponse.json(
      { error: 'Location is required' },
      { status: 400 }
    )
  }

  // Проверяем наличие API ключей
  const googleMapsApiKey = API_KEYS.GOOGLE_MAPS_API_KEY

  // Если есть ключ Google Maps API, используем его
  if (googleMapsApiKey) {
    try {
      console.log('Using Google Maps API')
      const hotels = await searchHotelsNearby(location, googleMapsApiKey)

      // Применяем фильтрацию
      let filteredHotels = [...hotels]

      if (minPrice) {
        filteredHotels = filteredHotels.filter(hotel => hotel.price >= Number(minPrice))
      }

      if (maxPrice) {
        filteredHotels = filteredHotels.filter(hotel => hotel.price <= Number(maxPrice))
      }

      if (minRating) {
        filteredHotels = filteredHotels.filter(hotel => hotel.rating >= Number(minRating))
      }

      if (accommodationType) {
        filteredHotels = filteredHotels.filter(hotel => hotel.accommodationType === accommodationType)
      }

      if (mealType) {
        filteredHotels = filteredHotels.filter(hotel => hotel.mealType === mealType)
      }

      if (hotelChain) {
        filteredHotels = filteredHotels.filter(hotel => hotel.hotelChain === hotelChain)
      }

      if (hasSpecialOffers === 'true') {
        filteredHotels = filteredHotels.filter(hotel => hotel.hasSpecialOffers)
      }

      // Фильтры по удобствам
      if (wifi === 'true') {
        filteredHotels = filteredHotels.filter(hotel => hotel.amenities.wifi)
      }

      if (parking === 'true') {
        filteredHotels = filteredHotels.filter(hotel => hotel.amenities.parking)
      }

      if (pool === 'true') {
        filteredHotels = filteredHotels.filter(hotel => hotel.amenities.pool)
      }

      if (gym === 'true') {
        filteredHotels = filteredHotels.filter(hotel => hotel.amenities.gym)
      }

      if (restaurant === 'true') {
        filteredHotels = filteredHotels.filter(hotel => hotel.amenities.restaurant)
      }

      if (spa === 'true') {
        filteredHotels = filteredHotels.filter(hotel => hotel.amenities.spa)
      }

      // Сортировка результатов
      if (sortBy === 'price_asc') {
        filteredHotels.sort((a, b) => a.price - b.price)
      } else if (sortBy === 'price_desc') {
        filteredHotels.sort((a, b) => b.price - a.price)
      } else {
        // По умолчанию сортируем по рейтингу
        filteredHotels.sort((a, b) => b.rating - a.rating)
      }

      return NextResponse.json({ hotels: filteredHotels })
    } catch (error) {
      console.error('Google Maps API error:', error)
      // В случае ошибки используем мок-данные или RapidAPI
    }
  }

  // Если Google Maps API не настроен или произошла ошибка, используем мок-данные
  console.log('API key not configured or error occurred, using mock data')
  const mockHotels = getMockHotels(location)

  // Применяем фильтрацию к мок-данным
  let filteredHotels = mockHotels

  if (minPrice) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price >= Number(minPrice))
  }

  if (maxPrice) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price <= Number(maxPrice))
  }

  if (minRating) {
    filteredHotels = filteredHotels.filter(hotel => hotel.rating >= Number(minRating))
  }

  if (accommodationType) {
    filteredHotels = filteredHotels.filter(hotel => hotel.accommodationType === accommodationType)
  }

  if (mealType) {
    filteredHotels = filteredHotels.filter(hotel => hotel.mealType === mealType)
  }

  // Сортировка результатов
  if (sortBy === 'price_asc') {
    filteredHotels.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price_desc') {
    filteredHotels.sort((a, b) => b.price - a.price)
  } else {
    // По умолчанию сортируем по рейтингу
    filteredHotels.sort((a, b) => b.rating - a.rating)
  }

  return NextResponse.json({ hotels: filteredHotels })
}

// Вспомогательная функция для преобразования типа размещения
function mapPropertyType(type: string): AccommodationType {
  const typeMap: Record<string, AccommodationType> = {
    'HOTEL': 'hotel',
    'APARTMENT': 'apartment',
    'HOSTEL': 'hostel',
    'RESORT': 'resort',
    'VILLA': 'villa',
    'GUESTHOUSE': 'guesthouse',
    'GUEST_HOUSE': 'guesthouse',
    'BED_AND_BREAKFAST': 'guesthouse'
  }

  return typeMap[type] || 'hotel'
}

// Вспомогательная функция для преобразования удобств
function mapAmenities(amenitiesData: any): HotelAmenities {
  const amenities = {
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
  }

  if (!amenitiesData) return amenities

  // Проходим по всем удобствам из API и сопоставляем с нашими
  amenitiesData.forEach((amenity: any) => {
    const amenityName = amenity.name?.toLowerCase() || ''

    if (amenityName.includes('wifi') || amenityName.includes('internet')) {
      amenities.wifi = true
    }

    if (amenityName.includes('parking')) {
      amenities.parking = true
    }

    if (amenityName.includes('pool') || amenityName.includes('swimming')) {
      amenities.pool = true
    }

    if (amenityName.includes('gym') || amenityName.includes('fitness')) {
      amenities.gym = true
    }

    if (amenityName.includes('restaurant') || amenityName.includes('dining')) {
      amenities.restaurant = true
    }

    if (amenityName.includes('spa') || amenityName.includes('massage')) {
      amenities.spa = true
    }

    if (amenityName.includes('air') || amenityName.includes('conditioning')) {
      amenities.airConditioning = true
    }

    if (amenityName.includes('pet') || amenityName.includes('dog') || amenityName.includes('cat')) {
      amenities.petFriendly = true
    }

    if (amenityName.includes('conference') || amenityName.includes('meeting')) {
      amenities.conferenceRoom = true
    }

    if (amenityName.includes('transfer') || amenityName.includes('shuttle')) {
      amenities.transfer = true
    }
  })

  return amenities
}