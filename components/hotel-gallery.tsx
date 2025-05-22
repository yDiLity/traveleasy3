'use client'

import { useState, useEffect } from 'react'
import { SafeImage } from './safe-image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from './ui/button'

interface HotelGalleryProps {
  images: string[]
  hotelName: string
}

export function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hotelImages, setHotelImages] = useState<string[]>(images)
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем изображения отеля из API Pexels
  useEffect(() => {
    // Используем переданные изображения
    if (images.length > 0) {
      setHotelImages(images)
      setIsLoading(false)
    } else {
      // Если нет изображений, используем заглушку
      setHotelImages(['/hotel-placeholder.svg'])
      setIsLoading(false)
    }
  }, [hotelName, images])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? hotelImages.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === hotelImages.length - 1 ? 0 : prevIndex + 1))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Если идет загрузка, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Если нет изображений, показываем плейсхолдер
  if (hotelImages.length === 0) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Нет изображений
        </div>
      </div>
    )
  }

  // Если есть только одно изображение, показываем его без элементов управления
  if (hotelImages.length === 1) {
    return (
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden cursor-pointer" onClick={toggleFullscreen}>
        <SafeImage
          src={hotelImages[0]}
          alt={`${hotelName} - фото 1`}
          fill
          className="object-cover"
          fallbackSrc="/hotel-placeholder.svg"
        />

        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white"
              onClick={toggleFullscreen}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto">
              <SafeImage
                src={hotelImages[0]}
                alt={`${hotelName} - фото 1`}
                fill
                className="object-contain"
                fallbackSrc="/hotel-placeholder.svg"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Если есть несколько изображений, показываем галерею с элементами управления
  return (
    <div className="space-y-2">
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
        <SafeImage
          src={hotelImages[currentIndex]}
          alt={`${hotelName} - фото ${currentIndex + 1}`}
          fill
          className="object-cover cursor-pointer"
          onClick={toggleFullscreen}
          fallbackSrc="/hotel-placeholder.svg"
        />

        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
            {currentIndex + 1} / {hotelImages.length}
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-2 pb-2">
        {hotelImages.map((image, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${
              index === currentIndex ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <SafeImage
              src={image}
              alt={`${hotelName} - миниатюра ${index + 1}`}
              fill
              className="object-cover"
              fallbackSrc="/hotel-placeholder.svg"
            />
          </div>
        ))}
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={toggleFullscreen}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto">
            <SafeImage
              src={hotelImages[currentIndex]}
              alt={`${hotelName} - фото ${currentIndex + 1}`}
              fill
              className="object-contain"
              fallbackSrc="/hotel-placeholder.svg"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
            onClick={handleNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
              {currentIndex + 1} / {hotelImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
