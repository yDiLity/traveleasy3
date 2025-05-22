'use client'

import { useState, useEffect } from 'react'
import { SafeImage } from './safe-image'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
// import { useTranslations } from 'next-intl'

interface Testimonial {
  id: number
  name: string
  avatar: string
  role: string
  rating: number
  text: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Анна Смирнова',
    avatar: '/images/testimonials/avatar-1.svg',
    role: 'Путешественник',
    rating: 5,
    text: 'Благодаря Trevelease я нашла идеальный отель для нашего семейного отпуска в Сочи. Сервис очень удобный, а цены действительно выгодные. Обязательно буду пользоваться снова!'
  },
  {
    id: 2,
    name: 'Дмитрий Иванов',
    avatar: '/images/testimonials/avatar-2.svg',
    role: 'Бизнес-путешественник',
    rating: 4,
    text: 'Регулярно использую Trevelease для бизнес-поездок. Удобный поиск и фильтры позволяют быстро найти подходящий отель рядом с местом встречи. Рекомендую всем, кто ценит свое время.'
  },
  {
    id: 3,
    name: 'Екатерина Петрова',
    avatar: '/images/testimonials/avatar-3.svg',
    role: 'Блогер',
    rating: 5,
    text: 'Как тревел-блогер, я постоянно в поисках уникальных мест для проживания. Trevelease помогает мне находить интересные варианты, которых нет на других платформах. Отличный сервис!'
  }
]

// Функция для получения ключа перевода роли
function getRoleTranslationKey(role: string): string {
  switch (role) {
    case 'Путешественник':
      return 'traveler';
    case 'Бизнес-путешественник':
      return 'businessTraveler';
    case 'Блогер':
      return 'blogger';
    default:
      return role.toLowerCase();
  }
}

export function TestimonialsSection() {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Что говорят наши клиенты',
      'subtitle': 'Отзывы от путешественников, которые уже воспользовались нашим сервисом',
      'traveler': 'Путешественник',
      'businessTraveler': 'Бизнес-путешественник',
      'blogger': 'Блогер',
      'prevButton': 'Предыдущий отзыв',
      'nextButton': 'Следующий отзыв',
      'goToTestimonial': 'Перейти к отзыву'
    }
    return translations[key] || key
  }
  const [activeIndex, setActiveIndex] = useState(0)

  // Автоматическое переключение отзывов
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-10">
                    <div className="flex items-center mb-6">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                        <SafeImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          fallbackSrc="/avatar-placeholder.svg"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{t(getRoleTranslationKey(testimonial.role))}</p>
                        <div className="flex mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-600 dark:text-gray-300 text-lg italic">
                      "{testimonial.text}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label={t('prevButton')}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label={t('nextButton')}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex
                    ? 'bg-primary'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`${t('goToTestimonial')} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
