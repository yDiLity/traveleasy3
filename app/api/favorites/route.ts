import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { v4 as uuidv4 } from 'uuid'
import { FavoriteHotel } from '@/types/hotel'

// Мок-данные для избранных отелей (в реальном приложении это была бы база данных)
let favoritesDb: FavoriteHotel[] = []

export async function GET(request: Request) {
  // Получаем сессию пользователя
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting session:', error);
    // В режиме разработки продолжаем без сессии
  }

  // В режиме разработки используем временный ID пользователя
  const userId = session?.user?.id || 'dev-user-id';

  // Получаем избранные отели пользователя
  const userFavorites = favoritesDb.filter(fav => fav.userId === userId)

  // Для каждого избранного отеля получаем данные отеля
  const favoritesWithHotels = await Promise.all(
    userFavorites.map(async (favorite) => {
      try {
        // Получаем данные отеля из API
        const response = await fetch(`${request.headers.get('origin')}/api/hotels/${favorite.hotelId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch hotel with ID ${favorite.hotelId}`)
        }

        const data = await response.json()

        // Добавляем данные отеля к избранному
        return {
          ...favorite,
          hotel: data.hotel
        }
      } catch (error) {
        console.error(`Error fetching hotel ${favorite.hotelId}:`, error)
        return favorite
      }
    })
  )

  return NextResponse.json({ favorites: favoritesWithHotels })
}

export async function POST(request: Request) {
  // Получаем сессию пользователя
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting session:', error);
    // В режиме разработки продолжаем без сессии
  }

  // В режиме разработки используем временный ID пользователя
  const userId = session?.user?.id || 'dev-user-id';

  try {
    // Получаем данные из запроса
    const { hotelId } = await request.json()

    // Проверяем, есть ли уже такой отель в избранном
    const existingFavorite = favoritesDb.find(
      fav => fav.userId === userId && fav.hotelId === hotelId
    )

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Hotel already in favorites' },
        { status: 400 }
      )
    }

    // Создаем новую запись в избранном
    const newFavorite: FavoriteHotel = {
      id: uuidv4(),
      userId: userId,
      hotelId,
      addedAt: new Date().toISOString()
    }

    // Добавляем в "базу данных"
    favoritesDb.push(newFavorite)

    // Получаем данные отеля
    const response = await fetch(`${request.headers.get('origin')}/api/hotels/${hotelId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch hotel with ID ${hotelId}`)
    }

    const data = await response.json()

    // Возвращаем созданную запись с данными отеля
    return NextResponse.json({
      favorite: {
        ...newFavorite,
        hotel: data.hotel
      }
    })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}
