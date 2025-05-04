import { NextResponse } from 'next/server'
import { getHotelImages as getUnsplashHotelImages, getCityImages as getUnsplashCityImages, getLandmarkImages as getUnsplashLandmarkImages } from '@/services/unsplash-api-service'
import { getHotelImages as getPexelsHotelImages, getCityImages as getPexelsCityImages, getLandmarkImages as getPexelsLandmarkImages } from '@/services/pexels-api-service'
import { API_KEYS } from '@/config/api-config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Получаем параметры запроса
  const type = searchParams.get('type') || 'hotel' // тип изображения: hotel, city, landmark
  const query = searchParams.get('query') // поисковый запрос или название города
  const count = parseInt(searchParams.get('count') || '5') // количество изображений

  // Проверяем наличие обязательных параметров
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }

  // Проверяем наличие API ключей
  const unsplashApiKey = API_KEYS.UNSPLASH_API_KEY
  const pexelsApiKey = API_KEYS.PEXELS_API_KEY

  if (!unsplashApiKey && !pexelsApiKey) {
    return NextResponse.json(
      { error: 'No image API keys are configured' },
      { status: 500 }
    )
  }

  try {
    let images: string[] = []

    // Получаем изображения в зависимости от типа
    // Сначала пробуем Pexels API, если он настроен
    if (pexelsApiKey) {
      switch (type) {
        case 'hotel':
          images = await getPexelsHotelImages(query, count, pexelsApiKey)
          break
        case 'city':
          images = await getPexelsCityImages(query, count, pexelsApiKey)
          break
        case 'landmark':
          images = await getPexelsLandmarkImages(query, count, pexelsApiKey)
          break
        default:
          images = await getPexelsHotelImages(query, count, pexelsApiKey)
      }
    }

    // Если Pexels не вернул результатов или не настроен, пробуем Unsplash
    if (images.length === 0 && unsplashApiKey) {
      switch (type) {
        case 'hotel':
          images = await getUnsplashHotelImages(query, count, unsplashApiKey)
          break
        case 'city':
          images = await getUnsplashCityImages(query, count, unsplashApiKey)
          break
        case 'landmark':
          images = await getUnsplashLandmarkImages(query, count, unsplashApiKey)
          break
        default:
          images = await getUnsplashHotelImages(query, count, unsplashApiKey)
      }
    }

    // Если изображения не найдены, возвращаем пустой массив
    if (images.length === 0) {
      return NextResponse.json({ images: [] })
    }

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching images:', error)

    return NextResponse.json(
      { error: 'Failed to fetch images', details: error.message },
      { status: 500 }
    )
  }
}
