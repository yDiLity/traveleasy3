'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ children, delay = 0, duration = 0.5, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  duration?: number
  className?: string
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.5,
  className = '' 
}: SlideInProps) {
  const variants = {
    hidden: {
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay
      }
    },
    exit: {
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
      opacity: 0,
      transition: {
        duration: duration / 2
      }
    }
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredListProps {
  children: React.ReactNode[]
  delay?: number
  staggerDelay?: number
  className?: string
}

export function StaggeredList({ 
  children, 
  delay = 0, 
  staggerDelay = 0.1,
  className = '' 
}: StaggeredListProps) {
  return (
    <div className={className}>
      <AnimatePresence>
        {React.Children.map(children, (child, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: delay + i * staggerDelay, duration: 0.5 }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
