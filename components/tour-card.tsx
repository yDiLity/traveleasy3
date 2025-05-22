'use client'

import { Tour } from '@/data/mock-tours'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { SafeImage } from './safe-image'
import { Calendar, Users, Clock, Plane } from 'lucide-react'
import Link from 'next/link'

interface TourCardProps {
  tour: Tour
}

export function TourCard({ tour }: TourCardProps) {
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <SafeImage
          src={tour.images[0] || '/hotel-placeholder.svg'}
          alt={tour.name}
          fill
          className="object-cover"
          fallbackSrc="/hotel-placeholder.svg"
        />
        {tour.isPrivate && (
          <Badge className="absolute top-2 left-2 bg-black text-white">
            Частный тур
          </Badge>
        )}
        {tour.isAllInclusive && (
          <Badge className="absolute top-2 right-2 bg-primary">
            Всё включено
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{tour.name}</h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center text-sm text-gray-500 mr-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(tour.departureDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{tour.duration} дней</span>
          </div>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center text-sm text-gray-500 mr-4">
            <Users className="h-4 w-4 mr-1" />
            <span>до {tour.maxGuests} гостей</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Plane className="h-4 w-4 mr-1" />
            <span>{tour.airline.name}</span>
          </div>
        </div>

        <div className="flex items-center mb-3">
          <div className="h-5 w-5 relative mr-2">
            <SafeImage
              src={tour.airline.logo || '/placeholder.svg'}
              alt={tour.airline.name}
              fill
              className="object-contain"
              fallbackSrc="/placeholder.svg"
            />
          </div>
          <div className="text-sm">
            Рейтинг авиакомпании: {tour.airline.rating.toFixed(1)}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {tour.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="font-bold text-lg">
            {tour.price.toLocaleString('ru-RU')} ₽
          </div>
          <Link href={`/tour/${tour.id}`}>
            <Button variant="outline" size="sm">
              Подробнее
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
