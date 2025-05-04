'use client'

import { useState } from 'react'
import { Hotel } from '@/types/hotel'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import { SafeImage } from './safe-image'
import { MapPin, Star, Wifi, Car, Waves, Utensils, Droplets } from 'lucide-react'
import { FavoriteButton } from './favorite-button-simple'
import { motion } from 'framer-motion'
import { Badge } from './ui/badge'

interface AnimatedHotelCardProps {
  hotel: Hotel
  index: number
}

export function AnimatedHotelCard({ hotel, index }: AnimatedHotelCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
        <div className="relative h-48 overflow-hidden">
          <SafeImage
            src={`/api/images?type=hotel&query=${encodeURIComponent(hotel.name + ' ' + hotel.location)}&count=1`}
            priority={index < 3}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-700"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            sizes="(max-width: 768px) 100vw, 33vw"
            fallbackSrc="/hotel-placeholder.svg"
          />
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton hotelId={hotel.id} />
          </div>

          {hotel.hasSpecialOffers && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white font-medium px-3 py-1">
                Спецпредложение
              </Badge>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent h-28" />

          <div className="absolute bottom-3 left-3 text-white">
            <div className="flex items-center space-x-1 mb-2">
              {Array.from({ length: Math.floor(hotel.stars) }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 bg-black/40 px-2 py-0.5 rounded-full text-xs">
                {hotel.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center text-sm bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
              <MapPin className="h-3 w-3 mr-1" />
              {hotel.location}
            </div>
          </div>
        </div>

        <CardContent className="p-3">
          <h3 className="font-bold text-lg mb-1 line-clamp-1 text-gray-900 dark:text-white">{hotel.name}</h3>

          <div className="flex items-center mb-1 text-xs text-gray-600 dark:text-gray-400">
            <MapPin className="h-3 w-3 mr-1" />
            {hotel.address}
          </div>

          <p className="text-gray-700 dark:text-gray-200 mb-2 line-clamp-2 text-sm">
            {hotel.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {hotel.amenities.wifi && (
              <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                <Wifi className="h-3 w-3 mr-1" />
                Wi-Fi
              </div>
            )}
            {hotel.amenities.parking && (
              <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                <Car className="h-3 w-3 mr-1" />
                Парковка
              </div>
            )}
            {hotel.amenities.pool && (
              <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                <Waves className="h-3 w-3 mr-1" />
                Бассейн
              </div>
            )}
            {hotel.amenities.restaurant && (
              <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                <Utensils className="h-3 w-3 mr-1" />
                Ресторан
              </div>
            )}
            {hotel.amenities.spa && (
              <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                <Droplets className="h-3 w-3 mr-1" />
                СПА
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <div className="font-bold text-lg text-primary dark:text-primary">
                {hotel.price.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">за ночь</div>
            </div>
            <Link href={`/hotel/${hotel.id}`}>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-0 text-white shadow-md text-sm py-1 h-8 px-4">
                Подробнее
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
