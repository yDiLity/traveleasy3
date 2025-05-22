'use client'

import { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MapPin, Globe, Map, Search, Loader2 } from 'lucide-react'
import { useLocationAutocomplete, Location } from '@/hooks/use-location-autocomplete'

interface SearchLocationInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  onEnter?: () => void
}

export function SearchLocationInput({
  value,
  onChange,
  placeholder = 'Куда вы хотите поехать?',
  className,
  required = false,
  onEnter
}: SearchLocationInputProps) {
  const {
    inputValue,
    suggestions,
    popularLocations,
    isLoading,
    handleInputChange,
    handleSelectSuggestion,
    setInputValue
  } = useLocationAutocomplete({ initialValue: value })

  const [isFocused, setIsFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showPopular, setShowPopular] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Обработчик изменения значения ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.value)
    onChange(e.target.value)
    setActiveIndex(-1)
    setShowPopular(e.target.value.length === 0)
  }

  // Обработчик выбора подсказки
  const handleSelect = (suggestion: Location) => {
    const newValue = handleSelectSuggestion(suggestion)
    onChange(newValue)
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

  // Обработчик клика вне компонента
  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsFocused(false)
    }
  }

  // Добавляем обработчик клика вне компонента
  useEffect(() => {
    // Проверяем, что код выполняется в браузере
    if (typeof window !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [])

  // Обработчик нажатия клавиш для навигации по списку подсказок
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const currentSuggestions = suggestions.length > 0 ? suggestions :
                              (showPopular ? popularLocations : [])

    if (!currentSuggestions.length) {
      if (e.key === 'Enter' && onEnter) {
        onEnter()
      }
      return
    }

    // Стрелка вниз - переход к следующей подсказке
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => (prev < currentSuggestions.length - 1 ? prev + 1 : 0))
    }
    // Стрелка вверх - переход к предыдущей подсказке
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => (prev > 0 ? prev - 1 : currentSuggestions.length - 1))
    }
    // Enter - выбор активной подсказки
    else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(currentSuggestions[activeIndex])
    }
    // Enter - вызов onEnter, если нет активной подсказки
    else if (e.key === 'Enter' && activeIndex === -1 && onEnter) {
      onEnter()
    }
    // Escape - закрытие списка подсказок
    else if (e.key === 'Escape') {
      setIsFocused(false)
    }
  }

  // Получение иконки для типа местоположения
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'city':
        return <MapPin className="h-4 w-4 text-white/80" />
      case 'country':
        return <Globe className="h-4 w-4 text-white/80" />
      case 'region':
        return <Map className="h-4 w-4 text-white/80" />
      default:
        return <MapPin className="h-4 w-4 text-white/80" />
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

  // Получение текста типа местоположения
  const getLocationType = (type: string) => {
    switch (type) {
      case 'city':
        return 'Город'
      case 'country':
        return 'Страна'
      case 'region':
        return 'Регион'
      default:
        return ''
    }
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
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true)
            setShowPopular(inputValue.length === 0)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300 ${className}`}
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
        <div className="absolute z-10 mt-1 w-full bg-black/80 backdrop-blur-md rounded-md shadow-lg max-h-60 overflow-auto border border-white/20">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                className={`px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center text-white ${activeIndex === index ? 'bg-white/20' : ''}`}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="mr-2">
                  {getLocationIcon(suggestion.type)}
                </div>
                <div>
                  <div className="font-medium">{highlightMatch(suggestion.name)}</div>
                  {suggestion.country && suggestion.type !== 'country' && (
                    <div className="text-xs text-gray-300">{suggestion.country}</div>
                  )}
                </div>
                <div className="ml-auto text-xs text-gray-300">
                  {getLocationType(suggestion.type)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isFocused && showPopular && popularLocations.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-black/80 backdrop-blur-md rounded-md shadow-lg max-h-60 overflow-auto border border-white/20">
          <div className="p-3 border-b border-white/10">
            <h3 className="text-sm font-medium text-white">Популярные направления</h3>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {popularLocations.map((location, index) => (
              <Button
                key={location.id}
                variant="outline"
                className={`justify-start h-auto py-2 bg-white/10 border-white/20 text-white hover:bg-white/20 ${activeIndex === index ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleSelect(location)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="mr-2">
                  {getLocationIcon(location.type)}
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-medium truncate">{location.name}</div>
                  {location.country && location.type !== 'country' && (
                    <div className="text-xs text-gray-300 truncate">{location.country}</div>
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
