'use client'

import { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  // Отслеживаем изменения URL для показа индикатора загрузки
  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => {
      setTimeout(() => setIsLoading(false), 300) // Небольшая задержка для плавности
    }

    // Добавляем обработчики событий для Next.js Router
    window.addEventListener('beforeunload', handleStart)
    window.addEventListener('load', handleComplete)

    // Создаем MutationObserver для отслеживания изменений в DOM
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Если добавлены новые узлы, считаем, что страница загружена
          handleComplete()
        }
      }
    })

    // Начинаем наблюдение за изменениями в body
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('beforeunload', handleStart)
      window.removeEventListener('load', handleComplete)
      observer.disconnect()
    }
  }, [])

  // Отслеживаем изменения URL
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
          <div className="h-full w-1/3 bg-white/30 animate-[loading_1.5s_ease-in-out_infinite]" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Добавляем анимацию загрузки в глобальные стили
const addLoadingAnimation = () => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
      }
    `
    document.head.appendChild(style)
  }
}

// Вызываем функцию для добавления анимации
if (typeof window !== 'undefined') {
  addLoadingAnimation()
}
