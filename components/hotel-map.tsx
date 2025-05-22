'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Динамический импорт компонента карты для работы с SSR
const MapComponent = dynamic(() => import('./map-component'), { ssr: false })

interface HotelMapProps {
  name: string
  address: string
  latitude?: number
  longitude?: number
}

export function HotelMap({ name, address, latitude, longitude }: HotelMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Эффект для предотвращения ошибок SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Загрузка карты...</p>
      </div>
    )
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <MapComponent
        name={name}
        address={address}
        latitude={latitude}
        longitude={longitude}
      />
    </div>
  )
}
