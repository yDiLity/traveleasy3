'use client'

import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window && 'PerformanceObserver' in window) {
      // Отслеживание метрик Core Web Vitals
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Логируем метрики в консоль для отладки
            console.log(`[Performance] ${entry.name}:`, entry)
            
            // Отправляем метрики в аналитику (можно подключить Google Analytics или другие сервисы)
            if (entry.name === 'LCP') {
              console.log(`[Core Web Vitals] Largest Contentful Paint: ${entry.startTime}ms`)
            }
            if (entry.name === 'FID') {
              console.log(`[Core Web Vitals] First Input Delay: ${entry.processingStart - entry.startTime}ms`)
            }
            if (entry.name === 'CLS') {
              console.log(`[Core Web Vitals] Cumulative Layout Shift: ${entry.value}`)
            }
          })
        })
        
        // Наблюдаем за различными типами метрик
        observer.observe({ type: 'largest-contentful-paint', buffered: true })
        observer.observe({ type: 'first-input', buffered: true })
        observer.observe({ type: 'layout-shift', buffered: true })
        
        return () => {
          observer.disconnect()
        }
      } catch (e) {
        console.error('PerformanceObserver error:', e)
      }
    }
  }, [])

  // Этот компонент не рендерит никакой UI
  return null
}
