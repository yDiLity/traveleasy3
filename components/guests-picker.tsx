'use client'

import * as React from 'react'
import { Users, Baby, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface GuestsPickerProps {
  className?: string
  adults: number
  children: number
  infants: number
  onAdultsChange: (count: number) => void
  onChildrenChange: (count: number) => void
  onInfantsChange: (count: number) => void
}

export function GuestsPicker({
  className,
  adults,
  children,
  infants,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
}: GuestsPickerProps) {
  // Обработчики изменения количества гостей
  const handleAdultsChange = (delta: number) => {
    const newValue = Math.max(1, adults + delta) // Минимум 1 взрослый
    onAdultsChange(newValue)
  }

  const handleChildrenChange = (delta: number) => {
    const newValue = Math.max(0, children + delta) // Минимум 0 детей
    onChildrenChange(newValue)
  }

  const handleInfantsChange = (delta: number) => {
    const newValue = Math.max(0, infants + delta) // Минимум 0 младенцев
    onInfantsChange(newValue)
  }

  // Форматирование отображаемого текста
  const formatGuestsText = () => {
    const total = adults + children + infants
    let text = `${adults} ${adults === 1 ? 'взрослый' : 'взрослых'}`

    if (children > 0) {
      text += `, ${children} ${children === 1 ? 'ребенок' : (children >= 2 && children <= 4 ? 'ребенка' : 'детей')}`
    }

    if (infants > 0) {
      text += `, ${infants} ${infants === 1 ? 'младенец' : (infants >= 2 && infants <= 4 ? 'младенца' : 'младенцев')}`
    }

    return text
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal'
            )}
          >
            <Users className="mr-2 h-4 w-4" />
            {formatGuestsText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 space-y-4">
            <h4 className="font-medium text-center border-b pb-2">Выберите количество гостей</h4>

            {/* Взрослые */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Взрослые</div>
                <div className="text-sm text-gray-500">От 18 лет</div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleAdultsChange(-1)}
                  disabled={adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleAdultsChange(1)}
                  disabled={adults + children >= 10} // Максимум 10 гостей
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Дети */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Дети</div>
                <div className="text-sm text-gray-500">От 2 до 17 лет</div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleChildrenChange(-1)}
                  disabled={children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleChildrenChange(1)}
                  disabled={adults + children >= 10} // Максимум 10 гостей
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Младенцы */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Младенцы</div>
                <div className="text-sm text-gray-500">До 2 лет</div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleInfantsChange(-1)}
                  disabled={infants <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{infants}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleInfantsChange(1)}
                  disabled={infants >= 5} // Максимум 5 младенцев
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
