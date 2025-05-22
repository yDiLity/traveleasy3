import { useState, useEffect } from 'react'
// import { useLocale } from 'next-intl'
import { useDebounce } from './use-debounce'

export interface Location {
  id: number
  name: string
  country?: string
  type: 'city' | 'country' | 'region'
}

interface UseLocationAutocompleteOptions {
  initialValue?: string
  minChars?: number
  limit?: number
  loadPopular?: boolean
}

export function useLocationAutocomplete({
  initialValue = '',
  minChars = 2,
  limit = 10,
  loadPopular = true
}: UseLocationAutocompleteOptions = {}) {
  const locale = 'ru' // Используем русский язык по умолчанию
  const [inputValue, setInputValue] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [popularLocations, setPopularLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedValue = useDebounce(inputValue, 300)

  // Загрузка популярных местоположений при инициализации
  useEffect(() => {
    if (!loadPopular) return

    const fetchPopularLocations = async () => {
      try {
        const response = await fetch(
          `/api/locations?popular=true&locale=${locale}&limit=8`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch popular locations: ${response.status}`)
        }

        const data = await response.json()
        setPopularLocations(data.locations)
      } catch (error) {
        console.error('Error fetching popular locations:', error)
        setPopularLocations([])
        setError('Failed to load popular locations')
      }
    }

    fetchPopularLocations()
  }, [locale, loadPopular])

  // Загрузка подсказок при изменении значения ввода
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.length < minChars) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/locations?query=${encodeURIComponent(debouncedValue)}&locale=${locale}&limit=${limit}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch location suggestions: ${response.status}`)
        }

        const data = await response.json()
        setSuggestions(data.locations)
      } catch (error) {
        console.error('Error fetching location suggestions:', error)
        setSuggestions([])
        setError('Failed to load suggestions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedValue, locale, minChars, limit])

  // Обработчик изменения значения ввода
  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  // Обработчик выбора подсказки
  const handleSelectSuggestion = (suggestion: Location) => {
    const newValue = suggestion.type === 'city' && suggestion.country
      ? `${suggestion.name}, ${suggestion.country}`
      : suggestion.name

    setInputValue(newValue)
    setSuggestions([])
    return newValue
  }

  return {
    inputValue,
    suggestions,
    popularLocations,
    isLoading,
    error,
    handleInputChange,
    handleSelectSuggestion,
    setInputValue
  }
}
