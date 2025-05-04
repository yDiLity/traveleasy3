'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { FavoriteHotel } from '@/types/hotel'
import { useRouter } from 'next/navigation'

interface FavoritesContextType {
  favorites: FavoriteHotel[]
  isLoading: boolean
  error: string | null
  addFavorite: (hotelId: number) => Promise<void>
  removeFavorite: (hotelId: number) => Promise<void>
  isFavorite: (hotelId: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoriteHotel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка избранных отелей при монтировании компонента
  useEffect(() => {
    fetchFavorites()
  }, [])

  // Функция для загрузки избранных отелей
  const fetchFavorites = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/favorites')

      if (!response.ok) {
        if (response.status === 401) {
          // Пользователь не авторизован
          setFavorites([])
          return
        }
        throw new Error('Failed to fetch favorites')
      }

      const data = await response.json()
      setFavorites(data.favorites || [])
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setError('Не удалось загрузить избранные отели')
      setFavorites([])
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для добавления отеля в избранное
  const addFavorite = async (hotelId: number) => {

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hotelId }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Пользователь не авторизован
          router.push('/login')
          return
        }
        throw new Error('Failed to add favorite')
      }

      const data = await response.json()

      // Обновляем список избранных отелей
      setFavorites((prev) => [...prev, data.favorite])
    } catch (err) {
      console.error('Error adding favorite:', err)
      setError('Не удалось добавить отель в избранное')
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для удаления отеля из избранного
  const removeFavorite = async (hotelId: number) => {

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/favorites/${hotelId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Пользователь не авторизован
          router.push('/login')
          return
        }
        throw new Error('Failed to remove favorite')
      }

      // Обновляем список избранных отелей
      setFavorites((prev) => prev.filter((fav) => fav.hotelId !== hotelId))
    } catch (err) {
      console.error('Error removing favorite:', err)
      setError('Не удалось удалить отель из избранного')
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для проверки, находится ли отель в избранном
  const isFavorite = (hotelId: number) => {
    return favorites.some((fav) => fav.hotelId === hotelId)
  }

  const value = {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
