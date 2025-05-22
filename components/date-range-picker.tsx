'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateRangePickerProps {
  className?: string
  checkIn: Date | undefined
  checkOut: Date | undefined
  onCheckInChange: (date: Date | undefined) => void
  onCheckOutChange: (date: Date | undefined) => void
}

export function DateRangePicker({
  className,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: checkIn,
    to: checkOut,
  })

  // Обновляем внутреннее состояние при изменении пропсов
  React.useEffect(() => {
    setDate({
      from: checkIn,
      to: checkOut,
    })
  }, [checkIn, checkOut])

  // Обработчик изменения диапазона дат
  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    if (range?.from) {
      onCheckInChange(range.from)
    }
    if (range?.to) {
      onCheckOutChange(range.to)
    }
  }

  // Форматирование отображаемой даты
  const formatDisplayDate = () => {
    if (date?.from) {
      if (date.to) {
        return `${format(date.from, 'dd.MM.yyyy', { locale: ru })} - ${format(date.to, 'dd.MM.yyyy', { locale: ru })}`
      }
      return format(date.from, 'dd.MM.yyyy', { locale: ru })
    }
    return 'Выберите даты'
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white placeholder-gray-300',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplayDate()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ru}
            disabled={{ before: new Date() }}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
