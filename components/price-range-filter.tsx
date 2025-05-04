'use client'

import { useState, useEffect } from 'react'
import { Slider } from './ui/slider'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface PriceRangeFilterProps {
  minPrice: number
  maxPrice: number
  onPriceChange: (min: number, max: number) => void
  className?: string
}

export function PriceRangeFilter({ minPrice, maxPrice, onPriceChange, className }: PriceRangeFilterProps) {
  const [range, setRange] = useState<[number, number]>([minPrice, maxPrice])
  const [minInput, setMinInput] = useState<string>(minPrice.toString())
  const [maxInput, setMaxInput] = useState<string>(maxPrice.toString())
  
  // Обновляем состояние при изменении пропсов
  useEffect(() => {
    setRange([minPrice, maxPrice])
    setMinInput(minPrice.toString())
    setMaxInput(maxPrice.toString())
  }, [minPrice, maxPrice])
  
  // Обработчик изменения слайдера
  const handleSliderChange = (value: number[]) => {
    const [min, max] = value as [number, number]
    setRange([min, max])
    setMinInput(min.toString())
    setMaxInput(max.toString())
  }
  
  // Обработчик изменения минимальной цены в инпуте
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMinInput(value)
    
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= range[1]) {
      setRange([numValue, range[1]])
    }
  }
  
  // Обработчик изменения максимальной цены в инпуте
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMaxInput(value)
    
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= range[0]) {
      setRange([range[0], numValue])
    }
  }
  
  // Применение фильтра
  const applyFilter = () => {
    onPriceChange(range[0], range[1])
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="price-range" className="text-sm font-medium">
          Диапазон цен (₽)
        </Label>
        <Slider
          id="price-range"
          defaultValue={range}
          value={range}
          min={0}
          max={150000}
          step={1000}
          onValueChange={handleSliderChange}
          className="mt-2"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <div>
          <Label htmlFor="min-price" className="text-xs">
            От
          </Label>
          <Input
            id="min-price"
            type="number"
            value={minInput}
            onChange={handleMinInputChange}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="max-price" className="text-xs">
            До
          </Label>
          <Input
            id="max-price"
            type="number"
            value={maxInput}
            onChange={handleMaxInputChange}
            className="h-8"
          />
        </div>
        <Button onClick={applyFilter} className="mt-4 h-8">
          Применить
        </Button>
      </div>
    </div>
  )
}
