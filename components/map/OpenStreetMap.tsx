'use client'

import { useState, useEffect } from 'react'
import { Hotel } from '@/types/hotel'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Star } from 'lucide-react'
// import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

// Динамический импорт компонентов Leaflet, чтобы они загружались только на клиенте
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

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

interface OpenStreetMapProps {
  hotels: Hotel[]
  center?: { lat: number; lng: number }
}

export function OpenStreetMapComponent({ hotels, center = defaultCenter }: OpenStreetMapProps) {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'mapDescription': 'Карта показывает расположение отелей. Нажмите на маркер, чтобы увидеть подробную информацию.',
      'viewDetails': 'Подробнее'
    }
    return translations[key] || key
  }
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [mapCenter, setMapCenter] = useState(center)
  const [hotelIcon, setHotelIcon] = useState<any>(null)

  // Инициализация иконок Leaflet
  useEffect(() => {
    // Только на стороне клиента
    if (typeof window !== 'undefined') {
      // Динамический импорт Leaflet
      import('leaflet').then((L) => {
        // Импортируем стили Leaflet
        import('leaflet/dist/leaflet.css');

        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/images/icons/marker-icon-2x.png',
          iconUrl: '/images/icons/marker-icon.png',
          shadowUrl: '/images/icons/marker-shadow.png',
        });

        // Создаем пользовательскую иконку для отелей
        setHotelIcon(new L.Icon({
          iconUrl: '/images/icons/hotel-marker.svg',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        }));
      });
    }
  }, [])

  // Обновляем центр карты при изменении props
  useEffect(() => {
    if (center) {
      setMapCenter(center)
    }
  }, [center])

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
      <CardContent className="p-0">
        <div className="mb-2 text-sm text-gray-600 dark:text-gray-300 p-4">
          {t('mapDescription')}
        </div>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={12}
          style={mapContainerStyle}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Маркеры отелей */}
          {hotels.map((hotel) => (
            <Marker
              key={hotel.id}
              position={[
                hotel.coordinates?.lat || hotel.latitude || defaultCenter.lat,
                hotel.coordinates?.lng || hotel.longitude || defaultCenter.lng
              ]}
              icon={hotelIcon || undefined}
            >
              <Popup>
                <div className="max-w-xs p-2">
                  <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                  <div className="flex items-center my-1">
                    {Array.from({ length: Math.floor(hotel.stars) }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-1 text-xs text-gray-600">
                      {hotel.rating.toFixed(1)}/5
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{hotel.location}</p>
                  <p className="text-sm font-bold text-primary mb-2">
                    {hotel.price.toLocaleString('ru-RU')} ₽
                  </p>
                  <Link href={`/hotel/${hotel.id}`} passHref>
                    <Button size="sm" className="w-full text-xs">
                      {t('viewDetails')}
                    </Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  )
}
