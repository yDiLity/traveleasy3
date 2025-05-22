'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useState, useEffect } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

// Различные типы анимаций для разных страниц
const animations = {
  default: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [animationType, setAnimationType] = useState('default')

  // Выбираем тип анимации в зависимости от пути
  useEffect(() => {
    if (pathname?.includes('/hotel/')) {
      setAnimationType('slide')
    } else if (pathname?.includes('/favorites')) {
      setAnimationType('scale')
    } else if (pathname?.includes('/login')) {
      setAnimationType('fade')
    } else {
      setAnimationType('default')
    }
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={animations[animationType as keyof typeof animations].initial}
        animate={animations[animationType as keyof typeof animations].animate}
        exit={animations[animationType as keyof typeof animations].exit}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
