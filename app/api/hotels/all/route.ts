import { NextResponse } from 'next/server'
import { generateHotels } from '@/utils/hotel-generator'
import { Hotel } from '@/types/hotel'

// Генерируем 1000 отелей при первом запросе
let allHotels: Hotel[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Генерируем отели, если они еще не были сгенерированы
  if (allHotels.length === 0) {
    allHotels = generateHotels(1000)
  }
  
  // Получаем параметры фильтрации
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
  const stars = searchParams.get('stars') ? parseInt(searchParams.get('stars')!) : undefined
  const accommodationType = searchParams.get('accommodationType')
  const mealType = searchParams.get('mealType')
  const hasSpecialOffers = searchParams.get('hasSpecialOffers') === 'true'
  const country = searchParams.get('country')
  
  // Фильтруем отели
  let filteredHotels = [...allHotels]
  
  if (minPrice !== undefined) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price >= minPrice)
  }
  
  if (maxPrice !== undefined) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price <= maxPrice)
  }
  
  if (stars !== undefined) {
    filteredHotels = filteredHotels.filter(hotel => hotel.stars === stars)
  }
  
  if (accommodationType) {
    filteredHotels = filteredHotels.filter(hotel => hotel.accommodationType === accommodationType)
  }
  
  if (mealType) {
    filteredHotels = filteredHotels.filter(hotel => hotel.mealType === mealType)
  }
  
  if (hasSpecialOffers) {
    filteredHotels = filteredHotels.filter(hotel => hotel.hasSpecialOffers)
  }
  
  if (country) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.country && hotel.country.toLowerCase().includes(country.toLowerCase())
    )
  }
  
  // Сортировка
  const sort = searchParams.get('sort')
  
  if (sort === 'priceAsc') {
    filteredHotels.sort((a, b) => a.price - b.price)
  } else if (sort === 'priceDesc') {
    filteredHotels.sort((a, b) => b.price - a.price)
  } else if (sort === 'rating') {
    filteredHotels.sort((a, b) => b.rating - a.rating)
  }
  
  // Пагинация
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
  
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  
  const paginatedHotels = filteredHotels.slice(startIndex, endIndex)
  
  return NextResponse.json({
    hotels: paginatedHotels,
    total: filteredHotels.length,
    page,
    limit,
    totalPages: Math.ceil(filteredHotels.length / limit)
  })
}
