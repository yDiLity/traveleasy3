import { NextResponse } from 'next/server'
import { AccommodationType, MealType, Hotel } from '@/types/hotel'
import { getMockHotels } from '@/data/mock-hotels'
import { searchHotelsNearby } from '@/services/google-places-service'
import { getHotelImages } from '@/services/unsplash-api-service'
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
  const rapidApiKey = API_KEYS.RAPID_API_KEY
  const rapidApiHost = API_KEYS.RAPID_API_HOST
  const googleMapsApiKey = API_KEYS.GOOGLE_MAPS_API_KEY
  const unsplashApiKey = API_KEYS.UNSPLASH_API_KEY

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

  // Если Google Maps API не настроен или произошла ошибка, проверяем RapidAPI
  if (!rapidApiKey || !rapidApiHost) {
    console.log('API keys not configured, using mock data')
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

  try {
    // Используем RapidAPI Hotels API
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost
      }
    }

    // Сначала получаем ID локации
    const locationUrl = `https://${rapidApiHost}/locations/v3/search?q=${encodeURIComponent(location)}&locale=ru_RU`
    const locationResponse = await fetch(locationUrl, options)

    if (!locationResponse.ok) {
      throw new Error(`Location API request failed with status ${locationResponse.status}`)
    }

    const locationData = await locationResponse.json()

    // Проверяем, есть ли результаты поиска локации
    if (!locationData.sr || locationData.sr.length === 0) {
      return NextResponse.json({ hotels: [] })
    }

    // Берем первый результат поиска локации
    const destinationId = locationData.sr[0].gaiaId || locationData.sr[0].cityId

    if (!destinationId) {
      throw new Error('Failed to get destination ID')
    }

    // Форматируем даты для API
    const checkInDate = checkIn || new Date().toISOString().split('T')[0]
    const checkOutDate = checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0] // +1 день

    // Запрос на поиск отелей
    const hotelsUrl = `https://${rapidApiHost}/properties/v2/list?destinationId=${destinationId}&checkIn=${checkInDate}&checkOut=${checkOutDate}&adults=${guests}&locale=ru_RU&currency=RUB`

    const hotelsResponse = await fetch(hotelsUrl, options)

    if (!hotelsResponse.ok) {
      throw new Error(`Hotels API request failed with status ${hotelsResponse.status}`)
    }

    const hotelsData = await hotelsResponse.json()

    // Преобразуем ответ API в наш формат
    const properties = hotelsData.data?.propertySearch?.properties || []

    // Получаем изображения для отелей с помощью Unsplash API
    const hotelImagesPromises = []

    // Создаем массив промисов для получения изображений
    if (unsplashApiKey) {
      for (const property of properties) {
        const searchQuery = `${property.name} ${location} hotel`
        hotelImagesPromises.push(getHotelImages(searchQuery, 5, unsplashApiKey))
      }
    }

    // Ждем выполнения всех промисов
    const hotelImagesResults = await Promise.all(hotelImagesPromises)

    // Преобразуем ответ API в наш формат
    const hotels = properties.map((property: any, index: number) => {
      // Используем изображения из Unsplash, если они доступны
      let images = ['/hotel-placeholder.svg']

      if (property.propertyImage) {
        images = [property.propertyImage.image.url]
      }

      // Если есть изображения из Unsplash, используем их
      if (hotelImagesResults[index] && hotelImagesResults[index].length > 0) {
        images = hotelImagesResults[index]
      }

      return {
        id: property.id,
        name: property.name,
        location: location,
        address: property.address?.addressLine1 || '',
        price: property.price?.lead?.amount || 0,
        rating: property.reviews?.score || 0,
        stars: property.star || 0,
        images: images,
        description: property.description?.text || '',
        accommodationType: mapPropertyType(property.type),
        mealType: 'none', // API не предоставляет эту информацию напрямую
        amenities: mapAmenities(property.amenities),
        distanceToCenter: property.destinationInfo?.distanceFromDestination?.value || null,
        latitude: property.coordinates?.latitude || null,
        longitude: property.coordinates?.longitude || null,
        reviews: [],
        hotelChain: property.brand?.name || null,
        hasSpecialOffers: property.offerBadge ? true : false
      }
    }) || []

    // Применяем дополнительную фильтрацию
    let filteredHotels = hotels

    if (minPrice) {
      filteredHotels = filteredHotels.filter(hotel => hotel.price >= Number(minPrice))
    }

    if (maxPrice) {
      filteredHotels = filteredHotels.filter(hotel => hotel.price <= Number(maxPrice))
    }

    if (minRating) {
      filteredHotels = filteredHotels.filter(hotel => hotel.rating >= Number(minRating))
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
    console.error('API error:', error)

    // В случае ошибки используем мок-данные
    console.log('Using mock data due to API error')
    const mockHotels = getMockHotels(location)

    return NextResponse.json({
      hotels: mockHotels,
      warning: 'Using mock data due to API error'
    })
  }
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