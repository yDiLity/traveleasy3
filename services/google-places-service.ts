import { Hotel } from '@/types/hotel'

// Интерфейс для результатов поиска мест
interface PlaceResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: () => number
      lng: () => number
    }
  }
  rating?: number
  photos?: {
    getUrl: (options: { maxWidth: number; maxHeight: number }) => string
  }[]
  price_level?: number
  types?: string[]
  user_ratings_total?: number
}

// Функция для поиска отелей по местоположению
export async function searchHotelsNearby(
  location: string,
  apiKey: string,
  radius: number = 5000
): Promise<Hotel[]> {
  try {
    // Сначала получаем координаты по адресу
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${apiKey}`
    
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    
    if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
      throw new Error('Не удалось найти координаты для указанного местоположения')
    }
    
    const { lat, lng } = geocodeData.results[0].geometry.location
    
    // Затем ищем отели рядом с этими координатами
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=lodging&key=${apiKey}`
    
    const placesResponse = await fetch(placesUrl)
    const placesData = await placesResponse.json()
    
    if (placesData.status !== 'OK') {
      throw new Error(`Ошибка при поиске отелей: ${placesData.status}`)
    }
    
    // Преобразуем результаты в формат нашего приложения
    const hotels: Hotel[] = await Promise.all(
      placesData.results.map(async (place: any) => {
        // Получаем детальную информацию о месте
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,rating,photos,price_level,types,user_ratings_total,reviews&key=${apiKey}`
        
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()
        
        if (detailsData.status !== 'OK') {
          console.error(`Ошибка при получении деталей для ${place.name}: ${detailsData.status}`)
        }
        
        const details = detailsData.result || place
        
        // Генерируем цену на основе price_level или случайным образом
        const priceLevel = details.price_level || Math.floor(Math.random() * 4) + 1
        const basePrice = 2000 + priceLevel * 1500
        const price = basePrice + Math.floor(Math.random() * 1000)
        
        // Определяем звездность на основе типов или рейтинга
        let stars = 3 // По умолчанию 3 звезды
        if (details.types) {
          if (details.types.includes('lodging') && details.types.includes('spa')) {
            stars = 5
          } else if (details.types.includes('lodging') && details.rating && details.rating > 4.5) {
            stars = 5
          } else if (details.types.includes('lodging') && details.rating && details.rating > 4) {
            stars = 4
          } else if (details.types.includes('lodging') && details.rating && details.rating > 3) {
            stars = 3
          } else {
            stars = 2
          }
        }
        
        // Получаем URL фотографий, если они есть
        const photos = details.photos
          ? details.photos.map((photo: any) => {
              return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`
            })
          : ['/hotel-placeholder.svg']
        
        // Создаем объект отеля
        return {
          id: details.place_id,
          name: details.name,
          location: details.formatted_address || details.vicinity,
          description: 'Отличный отель с удобным расположением и всеми необходимыми удобствами.',
          price,
          currency: 'RUB',
          stars,
          rating: details.rating || 4.0,
          reviewsCount: details.user_ratings_total || 0,
          images: photos,
          coordinates: {
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          },
          amenities: {
            wifi: Math.random() > 0.1, // 90% вероятность наличия Wi-Fi
            parking: Math.random() > 0.3,
            pool: Math.random() > 0.7,
            restaurant: Math.random() > 0.4,
            spa: Math.random() > 0.8,
            gym: Math.random() > 0.6,
            airConditioning: Math.random() > 0.2,
            petFriendly: Math.random() > 0.7,
            conferenceRoom: Math.random() > 0.8,
            transfer: Math.random() > 0.6,
          },
          accommodationType: ['hotel', 'apartment', 'hostel', 'resort'][Math.floor(Math.random() * 4)] as any,
          mealType: ['none', 'breakfast', 'halfBoard', 'fullBoard', 'allInclusive'][Math.floor(Math.random() * 5)] as any,
          hotelChain: Math.random() > 0.7 ? ['Hilton', 'Marriott', 'Hyatt', 'Radisson', 'Accor'][Math.floor(Math.random() * 5)] : '',
          hasSpecialOffers: Math.random() > 0.7,
        }
      })
    )
    
    return hotels
  } catch (error) {
    console.error('Ошибка при поиске отелей:', error)
    throw error
  }
}

// Функция для получения деталей отеля по ID
export async function getHotelDetails(placeId: string, apiKey: string): Promise<Hotel | null> {
  try {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,photos,price_level,types,user_ratings_total,reviews&key=${apiKey}`
    
    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()
    
    if (detailsData.status !== 'OK' || !detailsData.result) {
      throw new Error(`Ошибка при получении деталей отеля: ${detailsData.status}`)
    }
    
    const details = detailsData.result
    
    // Генерируем цену на основе price_level или случайным образом
    const priceLevel = details.price_level || Math.floor(Math.random() * 4) + 1
    const basePrice = 2000 + priceLevel * 1500
    const price = basePrice + Math.floor(Math.random() * 1000)
    
    // Определяем звездность на основе типов или рейтинга
    let stars = 3 // По умолчанию 3 звезды
    if (details.types) {
      if (details.types.includes('lodging') && details.types.includes('spa')) {
        stars = 5
      } else if (details.types.includes('lodging') && details.rating && details.rating > 4.5) {
        stars = 5
      } else if (details.types.includes('lodging') && details.rating && details.rating > 4) {
        stars = 4
      } else if (details.types.includes('lodging') && details.rating && details.rating > 3) {
        stars = 3
      } else {
        stars = 2
      }
    }
    
    // Получаем URL фотографий, если они есть
    const photos = details.photos
      ? details.photos.map((photo: any) => {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`
        })
      : ['/hotel-placeholder.svg']
    
    // Создаем объект отеля
    return {
      id: details.place_id,
      name: details.name,
      location: details.formatted_address || details.vicinity,
      description: 'Отличный отель с удобным расположением и всеми необходимыми удобствами.',
      price,
      currency: 'RUB',
      stars,
      rating: details.rating || 4.0,
      reviewsCount: details.user_ratings_total || 0,
      images: photos,
      coordinates: {
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
      },
      amenities: {
        wifi: Math.random() > 0.1, // 90% вероятность наличия Wi-Fi
        parking: Math.random() > 0.3,
        pool: Math.random() > 0.7,
        restaurant: Math.random() > 0.4,
        spa: Math.random() > 0.8,
        gym: Math.random() > 0.6,
        airConditioning: Math.random() > 0.2,
        petFriendly: Math.random() > 0.7,
        conferenceRoom: Math.random() > 0.8,
        transfer: Math.random() > 0.6,
      },
      accommodationType: ['hotel', 'apartment', 'hostel', 'resort'][Math.floor(Math.random() * 4)] as any,
      mealType: ['none', 'breakfast', 'halfBoard', 'fullBoard', 'allInclusive'][Math.floor(Math.random() * 5)] as any,
      hotelChain: Math.random() > 0.7 ? ['Hilton', 'Marriott', 'Hyatt', 'Radisson', 'Accor'][Math.floor(Math.random() * 5)] : '',
      hasSpecialOffers: Math.random() > 0.7,
    }
  } catch (error) {
    console.error('Ошибка при получении деталей отеля:', error)
    return null
  }
}
