'use client'

import { useState, useMemo } from 'react'
import { HotelReview, StayType } from '@/types/hotel'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { SafeImage } from './safe-image'
import { LazyLoad } from './lazy-load'
import { useTranslations } from 'next-intl'
import {
  Star,
  ThumbsUp,
  Calendar,
  Briefcase,
  Users,
  User,
  Heart,
  MapPin,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react'

interface HotelReviewsProps {
  reviews: HotelReview[]
  hotelName: string
  averageRating: number
}

export function HotelReviews({ reviews, hotelName, averageRating }: HotelReviewsProps) {
  // Используем next-intl для переводов
  const t = useTranslations('reviews')
  
  // Состояние для фильтрации и сортировки
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [filterStayType, setFilterStayType] = useState<StayType | null>(null)
  const [showAllReviews, setShowAllReviews] = useState(false)
  
  // Количество отзывов для отображения в свернутом состоянии
  const INITIAL_REVIEWS_COUNT = 3
  
  // Мемоизированные отфильтрованные и отсортированные отзывы
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews]
    
    // Фильтрация по рейтингу
    if (filterRating !== null) {
      result = result.filter(review => Math.floor(review.rating) === filterRating)
    }
    
    // Фильтрация по типу поездки
    if (filterStayType !== null) {
      result = result.filter(review => review.stayType === filterStayType)
    }
    
    // Сортировка
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else {
      result.sort((a, b) => b.rating - a.rating)
    }
    
    return result
  }, [reviews, sortBy, filterRating, filterStayType])
  
  // Отзывы для отображения (все или только первые несколько)
  const displayedReviews = showAllReviews 
    ? filteredAndSortedReviews 
    : filteredAndSortedReviews.slice(0, INITIAL_REVIEWS_COUNT)
  
  // Статистика по рейтингам
  const ratingStats = useMemo(() => {
    const stats = [0, 0, 0, 0, 0] // Для рейтингов от 1 до 5
    
    reviews.forEach(review => {
      const ratingIndex = Math.floor(review.rating) - 1
      if (ratingIndex >= 0 && ratingIndex < 5) {
        stats[ratingIndex]++
      }
    })
    
    return stats.map((count, index) => ({
      rating: index + 1,
      count,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0
    }))
  }, [reviews])
  
  // Статистика по категориям
  const categoryStats = useMemo(() => {
    if (reviews.length === 0) return {}
    
    const categories = {
      location: 0,
      cleanliness: 0,
      service: 0,
      value: 0,
      comfort: 0
    }
    
    reviews.forEach(review => {
      if (review.categories) {
        categories.location += review.categories.location
        categories.cleanliness += review.categories.cleanliness
        categories.service += review.categories.service
        categories.value += review.categories.value
        categories.comfort += review.categories.comfort
      }
    })
    
    // Вычисляем средние значения
    Object.keys(categories).forEach(key => {
      categories[key as keyof typeof categories] /= reviews.length
    })
    
    return categories
  }, [reviews])
  
  // Функция для отображения иконки типа поездки
  const getStayTypeIcon = (stayType: StayType) => {
    switch (stayType) {
      case 'business': return <Briefcase className="h-4 w-4" />
      case 'family': return <Users className="h-4 w-4" />
      case 'couple': return <Heart className="h-4 w-4" />
      case 'solo': return <User className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }
  
  // Функция для отображения названия типа поездки
  const getStayTypeName = (stayType: StayType) => {
    return t(`stayType.${stayType}`)
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <MessageSquare className="mr-2 h-6 w-6 text-primary" />
        {t('title')} ({reviews.length})
      </h2>
      
      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Рейтинги */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">{t('ratingDistribution')}</h3>
          <div className="space-y-2">
            {ratingStats.slice().reverse().map(stat => (
              <div key={stat.rating} className="flex items-center gap-2">
                <div className="w-16 text-sm">{stat.rating} {t('stars')}</div>
                <div className="flex-grow h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400" 
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm text-right">{stat.count}</div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Категории */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">{t('categoryRatings')}</h3>
          <div className="space-y-2">
            {Object.entries(categoryStats).map(([category, rating]) => (
              <div key={category} className="flex items-center gap-2">
                <div className="w-24 text-sm">{t(`category.${category}`)}</div>
                <div className="flex-grow h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(rating / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm text-right">{rating.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Фильтры и сортировка */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('date')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {t('sortByDate')}
          </Button>
          <Button
            variant={sortBy === 'rating' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('rating')}
          >
            <Star className="h-4 w-4 mr-2" />
            {t('sortByRating')}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[null, 5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating === null ? 'all' : rating}
              variant={filterRating === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRating(rating)}
            >
              {rating === null ? t('allRatings') : `${rating} ${t('stars')}`}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Список отзывов */}
      <div className="space-y-4">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review, index) => (
            <LazyLoad key={review.id} threshold={0.1} delay={index * 100}>
              <ReviewCard review={review} />
            </LazyLoad>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">{t('noReviews')}</p>
          </Card>
        )}
      </div>
      
      {/* Кнопка "Показать больше" */}
      {filteredAndSortedReviews.length > INITIAL_REVIEWS_COUNT && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="mt-4"
          >
            {showAllReviews ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                {t('showLess')}
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                {t('showMore', { count: filteredAndSortedReviews.length - INITIAL_REVIEWS_COUNT })}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

// Компонент карточки отзыва
function ReviewCard({ review }: { review: HotelReview }) {
  const t = useTranslations('reviews')
  const [showFullComment, setShowFullComment] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  
  // Определяем, нужно ли обрезать комментарий
  const isLongComment = review.comment.length > 300
  const displayedComment = isLongComment && !showFullComment 
    ? `${review.comment.substring(0, 300)}...` 
    : review.comment
  
  // Форматирование даты
  const formattedDate = new Date(review.date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <Card className="p-4 overflow-hidden">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={review.userAvatar} alt={review.userName} />
          <AvatarFallback>{review.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div>
              <h4 className="font-semibold">{review.userName}</h4>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                {formattedDate}
                
                {review.stayType && (
                  <span className="ml-3 flex items-center">
                    {getStayTypeIcon(review.stayType)}
                    <span className="ml-1">{t(`stayType.${review.stayType}`)}</span>
                  </span>
                )}
                
                {review.verified && (
                  <span className="ml-3 flex items-center text-green-600 dark:text-green-400">
                    <Check className="h-3 w-3 mr-1" />
                    {t('verified')}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center bg-primary/10 px-2 py-1 rounded-md">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-semibold">{review.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <h5 className="font-medium mt-2">{review.title}</h5>
          
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {displayedComment}
          </p>
          
          {isLongComment && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullComment(!showFullComment)}
              className="mt-1 h-auto p-0 text-primary"
            >
              {showFullComment ? t('showLess') : t('readMore')}
            </Button>
          )}
          
          {/* Фотографии */}
          {review.photos && review.photos.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">{t('photos')} ({review.photos.length})</span>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {(showAllPhotos ? review.photos : review.photos.slice(0, 3)).map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                    <SafeImage
                      src={photo}
                      alt={`${t('photo')} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 25vw"
                    />
                  </div>
                ))}
                
                {!showAllPhotos && review.photos.length > 3 && (
                  <div 
                    className="relative aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  >
                    <div className="text-center">
                      <span className="text-lg font-bold">+{review.photos.length - 3}</span>
                      <p className="text-xs">{t('more')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Лайки */}
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {review.likes > 0 ? review.likes : t('helpful')}
            </Button>
          </div>
          
          {/* Ответ от отеля */}
          {review.response && (
            <div className="mt-4 pl-4 border-l-2 border-primary/30">
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{review.response.responderName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{review.response.responderName}</span>
                    <span className="ml-2 text-sm text-gray-500">{review.response.responderRole}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-1">
                    {new Date(review.response.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.response.comment}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// Вспомогательная функция для отображения иконки типа поездки
function getStayTypeIcon(stayType: StayType) {
  switch (stayType) {
    case 'business': return <Briefcase className="h-3 w-3" />
    case 'family': return <Users className="h-3 w-3" />
    case 'couple': return <Heart className="h-3 w-3" />
    case 'solo': return <User className="h-3 w-3" />
    default: return <Users className="h-3 w-3" />
  }
}
