'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/context/favorites-context'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  hotelId: number
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function FavoriteButton({
  hotelId,
  variant = 'outline',
  size = 'icon',
  className
}: FavoriteButtonProps) {
  const router = useRouter()
  const { isFavorite, addFavorite, removeFavorite, isLoading } = useFavorites()
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'common.removeFromFavorites': 'Удалить из избранного',
      'common.addToFavorites': 'Добавить в избранное'
    }
    return translations[key] || key
  }

  const isFav = isFavorite(hotelId)
  const isDisabled = isLoading || isProcessing

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isDisabled) return

    setIsProcessing(true)

    try {
      if (isFav) {
        await removeFavorite(hotelId)
      } else {
        await addFavorite(hotelId)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'group',
        isFav ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500',
        className
      )}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={isFav ? t('common.removeFromFavorites') : t('common.addToFavorites')}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all',
          isFav ? 'fill-current' : 'fill-none group-hover:fill-current'
        )}
      />
    </Button>
  )
}
