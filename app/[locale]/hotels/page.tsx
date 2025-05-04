'use client'

import { useState, useEffect } from 'react'
import { HotelCategoryFilter } from '@/components/hotel-category-filter'
import { Hotel } from '@/types/hotel'
import { motion } from 'framer-motion'

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/hotels/all?limit=1000')

        if (!response.ok) {
          throw new Error('Не удалось загрузить отели')
        }

        const data = await response.json()
        setHotels(data.hotels)
      } catch (err) {
        setError('Произошла ошибка при загрузке отелей')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Ошибка</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HotelCategoryFilter
          hotels={hotels}
          title="Все отели"
          subtitle="Выберите идеальный отель для вашего путешествия"
        />
      </motion.div>
    </div>
  )
}
