'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface MapProps {
  name: string
  address: string
  latitude?: number
  longitude?: number
}

export default function MapComponent({ name, address, latitude, longitude }: MapProps) {
  // Исправление проблемы с иконками Leaflet в Next.js
  useEffect(() => {
    // Только на клиенте
    if (typeof window !== 'undefined') {
      // Исправление иконок Leaflet
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
    }
  }, [])

  // Координаты по умолчанию (Москва)
  const defaultLatitude = 55.7558
  const defaultLongitude = 37.6173

  // Используем переданные координаты или значения по умолчанию
  const lat = latitude || defaultLatitude
  const lng = longitude || defaultLongitude

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          <div>
            <strong>{name}</strong>
            <p>{address}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
