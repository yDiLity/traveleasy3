'use client'

import { useState } from 'react'
import { Hotel } from '@/types/hotel'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import { SafeImage } from './safe-image'
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Waves,
  Utensils,
  Droplets,
  Wind,
  Dog,
  Building2,
  Bus,
  Coffee,
  UtensilsCrossed,
  Sandwich,
  ChefHat,
  Hotel as HotelIcon,
  Home,
  Building,
  Bed,
  Dumbbell
} from 'lucide-react'
import { FavoriteButton } from './favorite-button-simple'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from './ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { AnimatedRating } from './animated-rating'

interface AnimatedHotelCardProps {
  hotel: Hotel
  index: number
}

export function AnimatedHotelCard({ hotel, index }: AnimatedHotelCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Функция для получения иконки типа размещения
  const getAccommodationTypeIcon = () => {
    switch (hotel.accommodationType) {
      case 'hotel':
        return <HotelIcon className="h-4 w-4" />
      case 'apartment':
        return <Home className="h-4 w-4" />
      case 'hostel':
        return <Bed className="h-4 w-4" />
      case 'villa':
        return <Building className="h-4 w-4" />
      case 'resort':
        return <Building className="h-4 w-4" />
      case 'guesthouse':
        return <Building2 className="h-4 w-4" />
      default:
        return <HotelIcon className="h-4 w-4" />
    }
  }

  // Функция для получения иконки типа питания
  const getMealTypeIcon = () => {
    switch (hotel.mealType) {
      case 'breakfast':
        return <Coffee className="h-4 w-4" />
      case 'half-board':
        return <UtensilsCrossed className="h-4 w-4" />
      case 'full-board':
        return <Utensils className="h-4 w-4" />
      case 'all-inclusive':
        return <ChefHat className="h-4 w-4" />
      case 'none':
        return <Sandwich className="h-4 w-4" />
      default:
        return <Utensils className="h-4 w-4" />
    }
  }

  // Функция для получения текста типа питания
  const getMealTypeText = () => {
    switch (hotel.mealType) {
      case 'breakfast':
        return 'Завтрак'
      case 'half-board':
        return 'Полупансион'
      case 'full-board':
        return 'Полный пансион'
      case 'all-inclusive':
        return 'Всё включено'
      case 'none':
        return 'Без питания'
      default:
        return 'Не указано'
    }
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: Math.min(index * 0.05, 0.5),
          type: "spring",
          stiffness: 100
        }}
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.2 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setShowDetails(!showDetails)}
      >
        <Card className="overflow-hidden h-full bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
          <div className="relative h-48 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05 + 0.2, 0.7) }}
              style={{ width: '100%', height: '100%', position: 'relative' }}
            >
              <SafeImage
                src={hotel.images && hotel.images.length > 0
                  ? hotel.images[0]
                  : `/api/images?type=hotel&query=${encodeURIComponent(hotel.name + ' ' + hotel.location)}&count=1`}
                priority={index < 3}
                alt={hotel.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                fallbackSrc="/hotel-placeholder.svg"
                showLoadingIndicator={true}
              />
              <motion.div
                className="absolute inset-0 bg-transparent"
                animate={{
                  scale: isHovered ? 1.05 : 1
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundImage: `url(${hotel.images && hotel.images.length > 0 ? hotel.images[0] : '/hotel-placeholder.svg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </motion.div>
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.05 + 0.3, 0.8),
                  type: "spring",
                  stiffness: 100
                }}
                className="flex items-center space-x-1 mb-2"
              >
                <div className="bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                  <AnimatedRating rating={hotel.stars} size="sm" showValue={false} />
                </div>
                <span className="bg-black/40 px-2 py-0.5 rounded-full text-xs backdrop-blur-sm">
                  {hotel.rating.toFixed(1)}
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.05 + 0.4, 0.9),
                  type: "spring",
                  stiffness: 100
                }}
                className="flex items-center text-sm bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm"
              >
                <MapPin className="h-3 w-3 mr-1" />
                {hotel.location}
              </motion.div>
            </div>

            {/* Тип размещения и питания */}
            <div className="absolute top-2 right-12 z-10 flex space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm">
                    {getAccommodationTypeIcon()}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{hotel.accommodationType.charAt(0).toUpperCase() + hotel.accommodationType.slice(1)}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm">
                    {getMealTypeIcon()}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{getMealTypeText()}</p>
                </TooltipContent>
              </Tooltip>
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

          {/* Основные удобства */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {hotel.amenities.wifi && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                    <Wifi className="h-3 w-3 mr-1" />
                    Wi-Fi
                  </div>
                </TooltipTrigger>
                <TooltipContent>Бесплатный Wi-Fi</TooltipContent>
              </Tooltip>
            )}
            {hotel.amenities.parking && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                    <Car className="h-3 w-3 mr-1" />
                    Парковка
                  </div>
                </TooltipTrigger>
                <TooltipContent>Парковка на территории</TooltipContent>
              </Tooltip>
            )}
            {hotel.amenities.pool && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                    <Waves className="h-3 w-3 mr-1" />
                    Бассейн
                  </div>
                </TooltipTrigger>
                <TooltipContent>Бассейн на территории</TooltipContent>
              </Tooltip>
            )}
            {hotel.amenities.restaurant && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                    <Utensils className="h-3 w-3 mr-1" />
                    Ресторан
                  </div>
                </TooltipTrigger>
                <TooltipContent>Ресторан на территории</TooltipContent>
              </Tooltip>
            )}
            {hotel.amenities.spa && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-0.5 rounded-full border border-primary/20 shadow-sm">
                    <Droplets className="h-3 w-3 mr-1" />
                    СПА
                  </div>
                </TooltipTrigger>
                <TooltipContent>СПА-центр</TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Дополнительная информация (раскрывающаяся) */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 70,
                  damping: 20
                }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mb-3">
                  <h4 className="text-sm font-medium mb-2">Дополнительные удобства:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {hotel.amenities.airConditioning && (
                      <div className="flex items-center">
                        <Wind className="h-3 w-3 mr-1 text-primary" />
                        <span>Кондиционер</span>
                      </div>
                    )}
                    {hotel.amenities.petFriendly && (
                      <div className="flex items-center">
                        <Dog className="h-3 w-3 mr-1 text-primary" />
                        <span>Можно с питомцами</span>
                      </div>
                    )}
                    {hotel.amenities.conferenceRoom && (
                      <div className="flex items-center">
                        <Building2 className="h-3 w-3 mr-1 text-primary" />
                        <span>Конференц-зал</span>
                      </div>
                    )}
                    {hotel.amenities.transfer && (
                      <div className="flex items-center">
                        <Bus className="h-3 w-3 mr-1 text-primary" />
                        <span>Трансфер</span>
                      </div>
                    )}
                    {hotel.amenities.gym && (
                      <div className="flex items-center">
                        <Dumbbell className="h-3 w-3 mr-1 text-primary" />
                        <span>Фитнес-центр</span>
                      </div>
                    )}
                  </div>
                </div>

                {hotel.distanceToCenter && (
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="h-3 w-3 mr-1 text-primary" />
                    <span>{hotel.distanceToCenter} км до центра</span>
                  </div>
                )}

                {hotel.hotelChain && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-medium">Сеть отелей:</span> {hotel.hotelChain}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <div className="font-bold text-lg text-primary dark:text-primary">
                {hotel.price.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">за ночь</div>
            </div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(!showDetails);
                  }}
                  className="h-8 px-2"
                >
                  {showDetails ? 'Скрыть' : 'Детали'}
                </Button>
              </motion.div>
              <Link href={`/hotel/${hotel.id}`} onClick={(e) => e.stopPropagation()}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-0 text-white shadow-md text-sm py-1 h-8 px-4">
                    Подробнее
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    </TooltipProvider>
  )
}
