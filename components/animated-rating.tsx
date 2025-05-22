'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnimatedRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
  animate?: boolean
}

export function AnimatedRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  className,
  animate = true
}: AnimatedRatingProps) {
  const [displayRating, setDisplayRating] = useState(0)
  
  // Размеры звезд в зависимости от параметра size
  const starSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  // Размеры текста в зависимости от параметра size
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  // Анимация заполнения рейтинга
  useEffect(() => {
    if (!animate) {
      setDisplayRating(rating)
      return
    }
    
    let start = 0
    const step = 0.1
    const delay = 1000 / (rating / step) // Время анимации - 1 секунда
    
    const timer = setInterval(() => {
      start += step
      setDisplayRating(Math.min(start, rating))
      
      if (start >= rating) {
        clearInterval(timer)
      }
    }, delay)
    
    return () => clearInterval(timer)
  }, [rating, animate])
  
  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= displayRating
          const isPartiallyFilled = !isFilled && starValue - 1 < displayRating && displayRating < starValue
          
          return (
            <div key={i} className="relative">
              {/* Пустая звезда (контур) */}
              <Star 
                className={cn(
                  starSizes[size],
                  'text-gray-300 dark:text-gray-600'
                )} 
              />
              
              {/* Заполненная звезда */}
              {isFilled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="absolute inset-0"
                >
                  <Star 
                    className={cn(
                      starSizes[size],
                      'text-yellow-400 fill-yellow-400'
                    )} 
                  />
                </motion.div>
              )}
              
              {/* Частично заполненная звезда */}
              {isPartiallyFilled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 overflow-hidden"
                  style={{ 
                    width: `${(displayRating - Math.floor(displayRating)) * 100}%` 
                  }}
                >
                  <Star 
                    className={cn(
                      starSizes[size],
                      'text-yellow-400 fill-yellow-400'
                    )} 
                  />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
      
      {showValue && (
        <span className={cn('ml-2 font-medium', textSizes[size])}>
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
