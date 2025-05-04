'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useFavorites } from '@/context/favorites-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Hotel } from '@/types/hotel'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const { favorites, isLoading, error } = useFavorites()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const t = useTranslations('favorites')

  // Эффект для предотвращения ошибок гидратации
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Перенаправляем неавторизованных пользователей на страницу входа
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Если страница загружается на сервере или пользователь не авторизован, показываем загрузку
  if (!isClient || status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen p-8 sm:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">{t('empty')}</h2>
            <p className="text-gray-500 mb-6">
              {t('emptyDescription')}
            </p>
            <Link href="/">
              <Button>{t('findHotels')}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const hotel = favorite.hotel as Hotel
              if (!hotel) return null

              return (
                <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/hotel/${hotel.id}`}>
                    <div className="aspect-video overflow-hidden relative">
                      <Image
                        src={hotel.images[0] || '/hotel-placeholder.svg'}
                        alt={hotel.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg">{hotel.name}</h3>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: Math.floor(hotel.stars) }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{hotel.location}</p>
                      <div className="flex justify-between items-center mt-3">
                        <p className="font-bold">{hotel.price.toLocaleString('ru-RU')} ₽ / ночь</p>
                        <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-sm">
                          {hotel.rating.toFixed(1)}/5
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
