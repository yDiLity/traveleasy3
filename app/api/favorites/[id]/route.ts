import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { FavoriteHotel } from '@/types/hotel'

// Мок-данные для избранных отелей (в реальном приложении это была бы база данных)
// Используем тот же массив, что и в route.ts
declare global {
  var favoritesDb: FavoriteHotel[]
}

// Инициализируем глобальную переменную, если она еще не существует
if (!global.favoritesDb) {
  global.favoritesDb = []
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Получаем сессию пользователя
  const session = await getServerSession(authOptions)

  // Проверяем, авторизован ли пользователь
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const hotelId = parseInt(params.id)

  if (isNaN(hotelId)) {
    return NextResponse.json(
      { error: 'Invalid hotel ID' },
      { status: 400 }
    )
  }

  try {
    // Находим индекс избранного отеля
    const favoriteIndex = global.favoritesDb.findIndex(
      fav => fav.userId === session.user.id && fav.hotelId === hotelId
    )

    if (favoriteIndex === -1) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    // Удаляем отель из избранного
    global.favoritesDb.splice(favoriteIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
