'use client'

import { ReactNode, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface LazyLoadProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  showLoadingIndicator?: boolean
  fadeIn?: boolean
  delay?: number
}

/**
 * Компонент для ленивой загрузки содержимого при прокрутке
 * Использует Intersection Observer API для определения видимости
 */
export function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '100px',
  showLoadingIndicator = false,
  fadeIn = true,
  delay = 0
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Элемент стал видимым
          setIsVisible(true)
          // Отключаем наблюдение после первого появления
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(ref)

    return () => {
      observer.disconnect()
    }
  }, [ref, threshold, rootMargin])

  // Добавляем задержку для загрузки, если указана
  useEffect(() => {
    if (isVisible && delay > 0) {
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, delay)

      return () => clearTimeout(timer)
    } else if (isVisible) {
      setIsLoaded(true)
    }
  }, [isVisible, delay])

  // Анимация появления
  const fadeInAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <div ref={setRef} className="relative">
      {isLoaded ? (
        fadeIn ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInAnimation}
          >
            {children}
          </motion.div>
        ) : (
          children
        )
      ) : isVisible && showLoadingIndicator ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : null}
    </div>
  )
}
