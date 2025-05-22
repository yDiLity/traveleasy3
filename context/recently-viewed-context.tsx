'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Hotel } from '@/types/hotel'

interface RecentlyViewedContextType {
  recentlyViewed: Hotel[]
  addToRecentlyViewed: (hotel: Hotel) => void
  clearRecentlyViewed: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider')
  }
  return context
}

interface RecentlyViewedProviderProps {
  children: ReactNode
}

export function RecentlyViewedProvider({ children }: RecentlyViewedProviderProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<Hotel[]>([])

  // Загружаем недавно просмотренные отели из localStorage при монтировании компонента
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedHotels = localStorage.getItem('recentlyViewedHotels')
      if (storedHotels) {
        try {
          const parsedHotels = JSON.parse(storedHotels)
          setRecentlyViewed(parsedHotels)
        } catch (error) {
          console.error('Error parsing recently viewed hotels:', error)
          localStorage.removeItem('recentlyViewedHotels')
        }
      }
    }
  }, [])

  // Сохраняем недавно просмотренные отели в localStorage при изменении
  useEffect(() => {
    if (typeof window !== 'undefined' && recentlyViewed.length > 0) {
      localStorage.setItem('recentlyViewedHotels', JSON.stringify(recentlyViewed))
    }
  }, [recentlyViewed])

  // Функция для добавления отеля в недавно просмотренные
  const addToRecentlyViewed = (hotel: Hotel) => {
    setRecentlyViewed(prev => {
      // Проверяем, есть ли уже такой отель в списке
      const exists = prev.some(item => item.id === hotel.id)
      
      if (exists) {
        // Если отель уже есть, перемещаем его в начало списка
        return [
          hotel,
          ...prev.filter(item => item.id !== hotel.id)
        ]
      } else {
        // Если отеля нет, добавляем его в начало списка и ограничиваем список до 10 элементов
        return [
          hotel,
          ...prev
        ].slice(0, 10)
      }
    })
  }

  // Функция для очистки списка недавно просмотренных отелей
  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentlyViewedHotels')
    }
  }

  const value = {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed
  }

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}
