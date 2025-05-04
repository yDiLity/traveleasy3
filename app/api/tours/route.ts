import { NextResponse } from 'next/server'
import { getMockTours } from '@/data/mock-tours'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location') || 'Москва'
  
  // Получаем туры для указанного местоположения
  const tours = getMockTours(location)
  
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return NextResponse.json({ tours })
}
