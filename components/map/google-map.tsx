'use client'

import { useState, useCallback, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { Hotel } from '@/types/hotel'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Стили для карты
const mapContainerStyle = {
  width: '100%',
  height: '500px',
}

// Центр карты по умолчанию (Москва)
const defaultCenter = {
  lat: 55.751244,
  lng: 37.618423,
}

interface GoogleMapsProps {
  hotels: Hotel[]
  apiKey: string
  center?: { lat: number; lng: number }
}

export function GoogleMapsComponent({ hotels, apiKey, center = defaultCenter }: GoogleMapsProps) {
  const t = useTranslations('map')
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [mapCenter, setMapCenter] = useState(center)

  // Загрузка Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  })

  // Обновляем центр карты при изменении props
  useEffect(() => {
    if (center) {
      setMapCenter(center)
    }
  }, [center])

  // Обработчик клика по маркеру
  const handleMarkerClick = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel)
  }, [])

  // Обработчик закрытия информационного окна
  const handleInfoWindowClose = useCallback(() => {
    setSelectedHotel(null)
  }, [])

  // Если API не загружен, показываем сообщение о загрузке
  if (loadError) {
    return <div className="p-4 text-center text-red-500">{t('errorLoading')}</div>
  }

  if (!isLoaded) {
    return <div className="p-4 text-center">{t('loading')}</div>
  }

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
      <CardContent className="p-0">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={12}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          {/* Маркеры отелей */}
          {hotels.map((hotel) => (
            <Marker
              key={hotel.id}
              position={{
                lat: hotel.coordinates.lat,
                lng: hotel.coordinates.lng,
              }}
              onClick={() => handleMarkerClick(hotel)}
              icon={{
                url: '/images/icons/hotel-marker.svg',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          ))}

          {/* Информационное окно при клике на маркер */}
          {selectedHotel && (
            <InfoWindow
              position={{
                lat: selectedHotel.coordinates.lat,
                lng: selectedHotel.coordinates.lng,
              }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="max-w-xs">
                <h3 className="font-semibold text-gray-900">{selectedHotel.name}</h3>
                <div className="flex items-center my-1">
                  {Array.from({ length: Math.floor(selectedHotel.stars) }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-xs text-gray-600">
                    {selectedHotel.rating.toFixed(1)}/5
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{selectedHotel.location}</p>
                <p className="text-sm font-bold text-primary mb-2">
                  {selectedHotel.price.toLocaleString('ru-RU')} ₽
                </p>
                <Link href={`/hotel/${selectedHotel.id}`} passHref>
                  <Button size="sm" className="w-full text-xs">
                    {t('viewDetails')}
                  </Button>
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </CardContent>
    </Card>
  )
}
