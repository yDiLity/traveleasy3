'use client'

import { useState, useEffect } from 'react'
import { Tour } from '@/data/mock-tours'
import { TourCard } from './tour-card'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface ToursSectionProps {
  title: string
  subtitle?: string
  location?: string
}

export function ToursSection({ title, subtitle, location = 'Москва' }: ToursSectionProps) {
  const [tours, setTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTours() {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/tours?location=${encodeURIComponent(location)}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tours: ${response.status}`)
        }
        
        const data = await response.json()
        setTours(data.tours)
      } catch (err) {
        console.error('Error fetching tours:', err)
        setError('Не удалось загрузить туры. Пожалуйста, попробуйте позже.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTours()
  }, [location])
  
  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </Card>
      </div>
    )
  }
  
  if (tours.length === 0) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}
        <Card className="p-6">
          <div className="text-center">
            <p>Нет доступных туров.</p>
          </div>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
        <Button variant="outline">Все туры</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  )
}
