'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionEffectProps {
  children: React.ReactNode
}

export function PageTransitionEffect({ children }: PageTransitionEffectProps) {
  const pathname = usePathname()
  const [isFirstRender, setIsFirstRender] = useState(true)
  
  useEffect(() => {
    // После первого рендера устанавливаем флаг, чтобы анимация работала при переходах
    setIsFirstRender(false)
  }, [])
  
  // Варианты анимации для страницы
  const variants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    enter: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isFirstRender ? false : "hidden"}
        animate="enter"
        exit="exit"
        variants={variants}
        className="min-h-screen"
      >
        {children}
        
        {/* Индикатор загрузки страницы */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ 
            scaleX: [0, 0.5, 1, 1],
            opacity: [1, 1, 1, 0]
          }}
          transition={{ 
            times: [0, 0.4, 0.9, 1],
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
