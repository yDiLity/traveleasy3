'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { StayType } from '@/types/hotel'
import { Star, Upload, X } from 'lucide-react'
import { useToast } from './ui/use-toast'
import { useAuth } from '@/components/auth-provider'
import { v4 as uuidv4 } from 'uuid'

interface AddReviewFormProps {
  hotelId: string
  hotelName: string
  onReviewAdded: () => void
}

export function AddReviewForm({ hotelId, hotelName, onReviewAdded }: AddReviewFormProps) {
  const t = useTranslations('reviews')
  const { toast } = useToast()
  const { user } = useAuth()

  // Состояния формы
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [stayType, setStayType] = useState<StayType>('leisure')
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Состояния для оценок по категориям
  const [categoryRatings, setCategoryRatings] = useState({
    location: 0,
    cleanliness: 0,
    service: 0,
    value: 0,
    comfort: 0
  })

  // Обработчик изменения оценки по категории
  const handleCategoryRatingChange = (category: keyof typeof categoryRatings, value: number) => {
    setCategoryRatings(prev => ({
      ...prev,
      [category]: value
    }))
  }

  // Обработчик загрузки фотографий
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // В реальном приложении здесь был бы код для загрузки файлов на сервер
    // Для демонстрации просто создаем URL-ы для локальных файлов
    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file))
    setPhotos(prev => [...prev, ...newPhotos])
  }

  // Обработчик удаления фотографии
  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в систему, чтобы оставить отзыв',
        variant: 'destructive'
      })
      return
    }

    if (rating === 0) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, укажите общую оценку',
        variant: 'destructive'
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, укажите заголовок отзыва',
        variant: 'destructive'
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, напишите комментарий',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      // В реальном приложении здесь был бы запрос к API для сохранения отзыва
      // Для демонстрации просто имитируем задержку
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Создаем объект отзыва
      const newReview = {
        id: uuidv4(),
        hotelId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        rating,
        title,
        comment,
        date: new Date().toISOString(),
        likes: 0,
        categories: categoryRatings,
        stayType,
        photos,
        verified: true
      }

      // В реальном приложении здесь был бы код для сохранения отзыва в базе данных
      console.log('Новый отзыв:', newReview)

      // Сбрасываем форму
      setRating(0)
      setTitle('')
      setComment('')
      setStayType('leisure')
      setPhotos([])
      setCategoryRatings({
        location: 0,
        cleanliness: 0,
        service: 0,
        value: 0,
        comfort: 0
      })

      // Уведомляем пользователя
      toast({
        title: 'Отзыв отправлен',
        description: 'Спасибо за ваш отзыв об отеле ' + hotelName,
      })

      // Уведомляем родительский компонент
      onReviewAdded()
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error)
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить отзыв. Пожалуйста, попробуйте позже.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Если пользователь не авторизован, показываем сообщение
  if (!user) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">{t('writeReview')}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Необходимо войти в систему, чтобы оставить отзыв
        </p>
        <Button>Войти</Button>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">{t('writeReview')}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Общая оценка */}
        <div>
          <Label htmlFor="rating" className="block mb-2">{t('yourRating')}</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(value)}
              >
                <Star
                  className={`h-8 w-8 ${
                    (hoverRating || rating) >= value
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-lg font-semibold">{rating}/5</span>
            )}
          </div>
        </div>

        {/* Оценки по категориям */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categoryRatings).map(([category, value]) => (
            <div key={category}>
              <Label htmlFor={`category-${category}`} className="block mb-2">
                {t(`category.${category}`)}
              </Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(starValue => (
                  <button
                    key={starValue}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => handleCategoryRatingChange(
                      category as keyof typeof categoryRatings,
                      starValue
                    )}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        value >= starValue
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Тип поездки */}
        <div>
          <Label htmlFor="stayType" className="block mb-2">Тип поездки</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(['business', 'leisure', 'family', 'couple', 'solo'] as StayType[]).map(type => (
              <Button
                key={type}
                type="button"
                variant={stayType === type ? 'default' : 'outline'}
                onClick={() => setStayType(type)}
                className="justify-start"
              >
                {t(`stayType.${type}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Заголовок отзыва */}
        <div>
          <Label htmlFor="title" className="block mb-2">{t('reviewTitle')}</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Кратко опишите ваше впечатление"
            maxLength={100}
            required
          />
        </div>

        {/* Комментарий */}
        <div>
          <Label htmlFor="comment" className="block mb-2">{t('reviewComment')}</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Расскажите подробнее о вашем опыте проживания"
            rows={5}
            required
          />
        </div>

        {/* Загрузка фотографий */}
        <div>
          <Label htmlFor="photos" className="block mb-2">{t('addPhotos')}</Label>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="photo-upload"
              className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:border-primary"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </Label>

            {/* Предпросмотр фотографий */}
            {photos.map((photo, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={photo}
                  alt={`Фото ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка отправки */}
        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : t('submitReview')}
        </Button>
      </form>
    </Card>
  )
}
