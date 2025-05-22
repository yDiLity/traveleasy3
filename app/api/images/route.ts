import { NextResponse } from 'next/server'
import { getHotelImages, getCityImages, getLandmarkImages } from '@/services/pexels-api-service'
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

  // Проверяем наличие API ключа Pexels
  const pexelsApiKey = API_KEYS.PEXELS_API_KEY

  if (!pexelsApiKey) {
    return NextResponse.json(
      { error: 'Pexels API key is not configured' },
      { status: 500 }
    )
  }

  try {
    let images: string[] = []

    // Получаем изображения в зависимости от типа с помощью Pexels API
    switch (type) {
      case 'hotel':
        images = await getHotelImages(query, count, pexelsApiKey)
        break
      case 'city':
        images = await getCityImages(query, count, pexelsApiKey)
        break
      case 'landmark':
        images = await getLandmarkImages(query, count, pexelsApiKey)
        break
      default:
        images = await getHotelImages(query, count, pexelsApiKey)
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
