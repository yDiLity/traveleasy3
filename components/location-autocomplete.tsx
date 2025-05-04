'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Input } from './ui/input'
import { useTranslations, useLocale } from 'next-intl'
import { useDebounce } from '@/hooks/use-debounce'
import { MapPin, Globe, Map, Search, Loader2 } from 'lucide-react'
import { Button } from './ui/button'

interface Location {
  id: number
  name: string
  country?: string
  type: 'city' | 'country' | 'region'
}

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  required = false
}: LocationAutocompleteProps) {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'locationPlaceholder': 'Куда вы хотите поехать?',
      'locationTypes.city': 'Город',
      'locationTypes.country': 'Страна',
      'locationTypes.region': 'Регион'
    }
    return translations[key] || key
  }
  const locale = useLocale()
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [popularLocations, setPopularLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showPopular, setShowPopular] = useState(false)
  const debouncedValue = useDebounce(inputValue, 300)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Загрузка популярных местоположений при инициализации
  useEffect(() => {
    const fetchPopularLocations = async () => {
      try {
        const response = await fetch(
          `/api/locations?popular=true&locale=${locale}&limit=8`
        )
        const data = await response.json()
        setPopularLocations(data.locations)
      } catch (error) {
        console.error('Error fetching popular locations:', error)
        setPopularLocations([])
      }
    }

    fetchPopularLocations()
  }, [locale])

  // Загрузка подсказок при изменении значения ввода
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.length < 2) {
        setSuggestions([])
        setShowPopular(debouncedValue.length === 0 && isFocused)
        return
      }

      setIsLoading(true)
      setShowPopular(false)

      try {
        const response = await fetch(
          `/api/locations?query=${encodeURIComponent(debouncedValue)}&locale=${locale}&limit=10`
        )
        const data = await response.json()
        setSuggestions(data.locations)
      } catch (error) {
        console.error('Error fetching location suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedValue, locale, isFocused])

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Обработчик изменения значения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onChange(e.target.value)
    setActiveIndex(-1) // Сбрасываем активный индекс при изменении ввода

    // Показываем популярные места, если поле пустое
    setShowPopular(e.target.value.length === 0)
  }

  // Обработчик выбора подсказки
  const handleSelectSuggestion = (suggestion: Location) => {
    const newValue = suggestion.type === 'city' && suggestion.country
      ? `${suggestion.name}, ${suggestion.country}`
      : suggestion.name

    setInputValue(newValue)
    onChange(newValue)
    setSuggestions([])
    setShowPopular(false)
    setIsFocused(false)

    // Фокусируемся на следующем поле ввода (если есть)
    const form = inputRef.current?.form
    if (form) {
      const inputs = Array.from(form.querySelectorAll('input'))
      const currentIndex = inputs.indexOf(inputRef.current as HTMLInputElement)
      if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus()
      }
    }
  }

  // Получение иконки для типа местоположения
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'city':
        return <MapPin className="h-4 w-4 text-gray-500" />
      case 'country':
        return <Globe className="h-4 w-4 text-gray-500" />
      case 'region':
        return <Map className="h-4 w-4 text-gray-500" />
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />
    }
  }

  // Получение текста типа местоположения
  const getLocationType = (type: string) => {
    switch (type) {
      case 'city':
        return t('locationTypes.city')
      case 'country':
        return t('locationTypes.country')
      case 'region':
        return t('locationTypes.region')
      default:
        return ''
    }
  }

  // Обработчик нажатия клавиш для навигации по списку подсказок
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return

    // Стрелка вниз - переход к следующей подсказке
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
    }
    // Стрелка вверх - переход к предыдущей подсказке
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
    }
    // Enter - выбор активной подсказки
    else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[activeIndex])
    }
    // Escape - закрытие списка подсказок
    else if (e.key === 'Escape') {
      setIsFocused(false)
    }
  }

  // Функция для выделения совпадающего текста в подсказке
  const highlightMatch = (text: string) => {
    if (!inputValue || !text) return text

    const index = text.toLowerCase().indexOf(inputValue.toLowerCase())
    if (index === -1) return text

    const before = text.substring(0, index)
    const match = text.substring(index, index + inputValue.length)
    const after = text.substring(index + inputValue.length)

    return (
      <>
        {before}
        <span className="font-bold text-primary">{match}</span>
        {after}
      </>
    )
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true)
            setShowPopular(inputValue.length === 0)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('locationPlaceholder')}
          className={`pl-10 ${className}`}
          required={required}
          autoComplete="off"
          ref={inputRef}
        />

        {isLoading && isFocused && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center ${activeIndex === index ? 'bg-gray-100' : ''}`}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="mr-2">
                  {getLocationIcon(suggestion.type)}
                </div>
                <div>
                  <div className="font-medium">{highlightMatch(suggestion.name)}</div>
                  {suggestion.country && suggestion.type !== 'country' && (
                    <div className="text-xs text-gray-500">{suggestion.country}</div>
                  )}
                </div>
                <div className="ml-auto text-xs text-gray-400">
                  {suggestion.type === 'city' ? t('locationTypes.city') :
                   suggestion.type === 'country' ? t('locationTypes.country') :
                   t('locationTypes.region')}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isFocused && showPopular && popularLocations.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-3 border-b">
            <h3 className="text-sm font-medium text-gray-500">Популярные направления</h3>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {popularLocations.map((location) => (
              <Button
                key={location.id}
                variant="outline"
                className="justify-start h-auto py-2"
                onClick={() => handleSelectSuggestion(location)}
              >
                <div className="mr-2">
                  {getLocationIcon(location.type)}
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-medium truncate">{location.name}</div>
                  {location.country && location.type !== 'country' && (
                    <div className="text-xs text-gray-500 truncate">{location.country}</div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
