import { NextResponse } from 'next/server'
import { getCityImages, getLandmarkImages } from '@/services/pexels-api-service'
import { API_KEYS } from '@/config/api-config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Получаем параметры запроса
  const cityName = searchParams.get('city')
  const count = parseInt(searchParams.get('count') || '5')
  const includeType = searchParams.get('include') || 'all' // all, city, landmarks

  // Проверяем наличие обязательных параметров
  if (!cityName) {
    return NextResponse.json(
      { error: 'City name parameter is required' },
      { status: 400 }
    )
  }

  // Проверяем наличие API ключа
  const pexelsApiKey = API_KEYS.PEXELS_API_KEY

  if (!pexelsApiKey) {
    return NextResponse.json(
      { error: 'Pexels API key is not configured' },
      { status: 500 }
    )
  }

  try {
    let cityImages: string[] = []
    let landmarkImages: string[] = []

    // Получаем изображения города
    if (includeType === 'all' || includeType === 'city') {
      cityImages = await getCityImages(cityName, count, pexelsApiKey)
    }

    // Получаем изображения достопримечательностей
    if (includeType === 'all' || includeType === 'landmarks') {
      landmarkImages = await getLandmarkImages(cityName, count, pexelsApiKey)
    }

    // Объединяем результаты
    const result = {
      city: cityImages,
      landmarks: landmarkImages,
      all: [...cityImages, ...landmarkImages]
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching city images:', error)

    return NextResponse.json(
      { error: 'Failed to fetch city images', details: error.message },
      { status: 500 }
    )
  }
}
