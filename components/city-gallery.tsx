'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SafeImage } from './safe-image'

interface CityGalleryProps {
  cityName: string
  images?: string[]
  loadImagesFromApi?: boolean
}

export function CityGallery({ cityName, images = [], loadImagesFromApi = true }: CityGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryImages, setGalleryImages] = useState<string[]>(images)
  const [isLoading, setIsLoading] = useState(loadImagesFromApi)
  const t = useTranslations('cityGallery')

  // Загружаем изображения города из API
  useEffect(() => {
    if (loadImagesFromApi && cityName) {
      const fetchCityImages = async () => {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/cities/images?city=${encodeURIComponent(cityName)}&count=5`)

          if (!response.ok) {
            throw new Error(`Failed to fetch city images: ${response.status}`)
          }

          const data = await response.json()

          // Используем изображения города и достопримечательностей
          const allImages = data.all || []

          if (allImages.length > 0) {
            setGalleryImages(allImages)
          } else if (images.length > 0) {
            // Если нет изображений из API, используем переданные изображения
            setGalleryImages(images)
          } else {
            // Если нет ни изображений из API, ни переданных изображений, используем заглушку
            setGalleryImages(['/images/cities/placeholder.svg'])
          }
        } catch (error) {
          console.error('Error fetching city images:', error)
          // В случае ошибки используем переданные изображения или заглушку
          setGalleryImages(images.length > 0 ? images : ['/images/cities/placeholder.svg'])
        } finally {
          setIsLoading(false)
        }
      }

      fetchCityImages()
    } else if (images.length > 0) {
      // Если не нужно загружать изображения из API, используем переданные изображения
      setGalleryImages(images)
    } else {
      // Если нет переданных изображений, используем заглушку
      setGalleryImages(['/images/cities/placeholder.svg'])
    }
  }, [cityName, loadImagesFromApi, images])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <SafeImage
            src={galleryImages[currentImageIndex] || `/api/cities/images?city=${encodeURIComponent(cityName)}&count=1`}
            alt={`${cityName} - ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            fallbackSrc="/images/cities/placeholder.svg"
          />

          {/* Навигационные кнопки */}
          {galleryImages.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                onClick={prevImage}
                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                aria-label={t('previous')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                aria-label={t('next')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Индикаторы */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`${t('image')} ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Название города */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h2 className="text-white text-xl font-bold">{cityName}</h2>
          </div>
        </>
      )}
    </div>
  )
}
