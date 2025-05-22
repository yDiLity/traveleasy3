'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function SkipToContent() {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const handleClick = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href="#main-content"
      className={cn(
        'fixed top-0 left-0 p-3 m-3 bg-primary text-white z-50 transition-transform duration-200 rounded-md shadow-lg',
        isFocused ? 'transform-none' : '-translate-y-full'
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      Перейти к основному содержанию
    </a>
  )
}
