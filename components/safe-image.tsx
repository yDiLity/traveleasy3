import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  showLoadingIndicator?: boolean;
  lowQualityPreview?: boolean;
  priority?: boolean;
  sizes?: string;
}

/**
 * Улучшенный компонент для безопасной загрузки изображений с обработкой ошибок,
 * прогрессивной загрузкой и оптимизацией производительности
 */
export function SafeImage({
  src,
  alt,
  fallbackSrc = '/hotel-placeholder.svg',
  showLoadingIndicator = false,
  lowQualityPreview = false,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);

  // Обновляем источник изображения при изменении src
  useEffect(() => {
    setImgSrc(typeof src === 'string' ? src : '');
    setHasError(false);
    setIsLoading(true);

    // Если включен режим предварительного просмотра с низким качеством и src - строка
    if (lowQualityPreview && typeof src === 'string' && !src.startsWith('data:')) {
      // Создаем базовый URL для размытого изображения
      setBlurDataUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+');
    }
  }, [src, lowQualityPreview]);

  const handleError = () => {
    if (!hasError) {
      console.log(`Image error loading: ${src}`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Если источник изображения - API URL, обрабатываем его
  useEffect(() => {
    const fetchImageFromApi = async () => {
      if (typeof src === 'string' && src.startsWith('/api/')) {
        try {
          const response = await fetch(src);
          if (!response.ok) throw new Error('Failed to fetch image from API');

          const data = await response.json();
          if (data.images && data.images.length > 0) {
            setImgSrc(data.images[0]);
          } else {
            handleError();
          }
        } catch (error) {
          console.error('Error fetching image from API:', error);
          handleError();
        }
      }
    };

    if (typeof src === 'string' && src.startsWith('/api/')) {
      fetchImageFromApi();
    } else if (typeof src === 'string' && src.startsWith('/images/')) {
      // Для локальных изображений просто устанавливаем источник
      setImgSrc(src);
      setIsLoading(false);
    }
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {imgSrc && imgSrc.endsWith('.svg') ? (
        // Для SVG используем обычный тег img
        <img
          src={imgSrc}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          className={cn(
            className,
            'transition-opacity duration-300 w-full h-full object-cover',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
        />
      ) : imgSrc && (
        // Для других изображений используем компонент Image из Next.js
        <Image
          {...props}
          src={imgSrc}
          alt={alt}
          onError={handleError}
          onLoadingComplete={handleLoad}
          className={cn(
            className,
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          placeholder={blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={blurDataUrl}
          priority={priority}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}

      {(isLoading && showLoadingIndicator) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
