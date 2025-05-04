import { useState, useEffect } from 'react'

/**
 * Хук для дебаунса значения
 * @param value Значение, которое нужно дебаунсить
 * @param delay Задержка в миллисекундах
 * @returns Дебаунсированное значение
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Устанавливаем таймер для обновления дебаунсированного значения
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Очищаем таймер при изменении значения или размонтировании компонента
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
