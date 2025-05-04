'use client'

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'onLoad'> {
  src: string
  fallbackSrc?: string
  lowQualitySrc?: string
  className?: string
  containerClassName?: string
}

export function OptimizedImage({
  src,
  fallbackSrc = '/hotel-placeholder.svg',
  lowQualitySrc,
  alt,
  className,
  containerClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src)
  const [isError, setIsError] = useState(false)

  // Проверяем поддержку WebP
  const [supportsWebP, setSupportsWebP] = useState(false)

  useEffect(() => {
    // Проверка поддержки WebP
    const checkWebPSupport = async () => {
      const webpSupported = await testWebP()
      setSupportsWebP(webpSupported)
    }

    checkWebPSupport()
  }, [])

  // Функция для проверки поддержки WebP
  const testWebP = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false)
        return
      }

      const webP = new window.Image()
      webP.onload = () => resolve(true)
      webP.onerror = () => resolve(false)
      webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
    })
  }

  // Преобразование URL в WebP, если поддерживается
  const getOptimizedSrc = (url: string) => {
    if (!supportsWebP || !url || url.startsWith('data:') || url.startsWith('blob:')) {
      return url
    }

    // Если URL уже содержит .webp, возвращаем его как есть
    if (url.endsWith('.webp')) {
      return url
    }

    // Если URL указывает на внешний ресурс, возвращаем его как есть
    if (url.startsWith('http') && typeof window !== 'undefined' && !url.includes(window.location.hostname)) {
      return url
    }

    // Для локальных изображений добавляем параметр формата webp
    if (url.startsWith('/')) {
      // Если URL содержит параметры запроса, добавляем &format=webp
      if (url.includes('?')) {
        return `${url}&format=webp`
      }
      // Иначе добавляем ?format=webp
      return `${url}?format=webp`
    }

    return url
  }

  useEffect(() => {
    // Если есть версия с низким качеством, сначала загружаем ее
    if (lowQualitySrc) {
      setCurrentSrc(lowQualitySrc)
      setIsLoading(true)

      // Затем предзагружаем полноразмерное изображение
      if (typeof window !== 'undefined') {
        const fullImage = new window.Image()
        fullImage.src = getOptimizedSrc(src)
        fullImage.onload = () => {
          setCurrentSrc(getOptimizedSrc(src))
          setIsLoading(false)
        }
        fullImage.onerror = () => {
          setIsError(true)
          setCurrentSrc(fallbackSrc)
          setIsLoading(false)
        }
      }
    } else {
      // Если нет версии с низким качеством, загружаем сразу полноразмерное
      setCurrentSrc(getOptimizedSrc(src))
    }
  }, [src, lowQualitySrc, fallbackSrc, supportsWebP])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsError(true)
    setCurrentSrc(fallbackSrc)
  }

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <Image
        src={isError ? fallbackSrc : currentSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-500',
          isLoading ? 'opacity-60 blur-sm scale-105' : 'opacity-100 blur-0 scale-100',
          className
        )}
        onLoadingComplete={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-30 dark:bg-opacity-30">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
