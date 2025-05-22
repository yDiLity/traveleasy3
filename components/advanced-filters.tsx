'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { 
  Wifi, 
  Car, 
  Waves, 
  Dumbbell, 
  Utensils, 
  Droplets, 
  Wind, 
  Dog, 
  Building2, 
  Bus 
} from 'lucide-react'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { AccommodationType, MealType } from '@/types/hotel'

interface AmenitiesState {
  wifi: boolean
  parking: boolean
  pool: boolean
  gym: boolean
  restaurant: boolean
  spa: boolean
  airConditioning: boolean
  petFriendly: boolean
  conferenceRoom: boolean
  transfer: boolean
}

interface AdvancedFiltersProps {
  minPrice: string
  maxPrice: string
  minRating: string
  maxDistanceToCenter: string
  accommodationType: AccommodationType | ''
  mealType: MealType | ''
  hotelChain: string
  hasSpecialOffers: boolean
  amenities: AmenitiesState
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onMinRatingChange: (value: string) => void
  onMaxDistanceToCenterChange: (value: string) => void
  onAccommodationTypeChange: (value: AccommodationType | '') => void
  onMealTypeChange: (value: MealType | '') => void
  onHotelChainChange: (value: string) => void
  onHasSpecialOffersChange: (value: boolean) => void
  onAmenityChange: (key: keyof AmenitiesState, value: boolean) => void
  onReset: () => void
}

export function AdvancedFilters({
  minPrice,
  maxPrice,
  minRating,
  maxDistanceToCenter,
  accommodationType,
  mealType,
  hotelChain,
  hasSpecialOffers,
  amenities,
  onMinPriceChange,
  onMaxPriceChange,
  onMinRatingChange,
  onMaxDistanceToCenterChange,
  onAccommodationTypeChange,
  onMealTypeChange,
  onHotelChainChange,
  onHasSpecialOffersChange,
  onAmenityChange,
  onReset
}: AdvancedFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice ? parseInt(minPrice) : 0,
    maxPrice ? parseInt(maxPrice) : 50000
  ])

  // Обработчик изменения диапазона цен
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
    onMinPriceChange(values[0].toString())
    onMaxPriceChange(values[1].toString())
  }

  // Список сетей отелей
  const hotelChains = [
    { id: 'marriott', name: 'Marriott' },
    { id: 'hilton', name: 'Hilton' },
    { id: 'hyatt', name: 'Hyatt' },
    { id: 'accor', name: 'Accor' },
    { id: 'ihg', name: 'IHG' },
    { id: 'radisson', name: 'Radisson' },
    { id: 'wyndham', name: 'Wyndham' },
    { id: 'fourseasons', name: 'Four Seasons' }
  ]

  return (
    <div className="space-y-6 p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Расширенные фильтры</h3>
        <Button variant="ghost" onClick={onReset} className="text-white hover:text-primary">
          Сбросить все
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {/* Фильтр по цене */}
        <AccordionItem value="price" className="border-white/10">
          <AccordionTrigger className="text-white hover:text-primary">Цена</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="pt-4">
                <Slider
                  value={[priceRange[0], priceRange[1]]}
                  min={0}
                  max={50000}
                  step={1000}
                  onValueChange={handlePriceRangeChange}
                  className="my-6"
                />
              </div>
              <div className="flex justify-between text-sm text-white">
                <span>от {priceRange[0].toLocaleString()} ₽</span>
                <span>до {priceRange[1].toLocaleString()} ₽</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Фильтр по рейтингу */}
        <AccordionItem value="rating" className="border-white/10">
          <AccordionTrigger className="text-white hover:text-primary">Рейтинг</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={parseInt(minRating) === rating ? 'default' : 'outline'}
                    onClick={() => onMinRatingChange(rating.toString())}
                    className="flex items-center justify-center"
                  >
                    {rating}+
                  </Button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Фильтр по типу размещения */}
        <AccordionItem value="accommodationType" className="border-white/10">
          <AccordionTrigger className="text-white hover:text-primary">Тип размещения</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <Select
                value={accommodationType}
                onValueChange={(value) => onAccommodationTypeChange(value as AccommodationType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип размещения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Любой</SelectItem>
                  <SelectItem value="hotel">Отель</SelectItem>
                  <SelectItem value="apartment">Апартаменты</SelectItem>
                  <SelectItem value="hostel">Хостел</SelectItem>
                  <SelectItem value="villa">Вилла</SelectItem>
                  <SelectItem value="resort">Курорт</SelectItem>
                  <SelectItem value="guesthouse">Гостевой дом</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Фильтр по типу питания */}
        <AccordionItem value="mealType" className="border-white/10">
          <AccordionTrigger className="text-white hover:text-primary">Тип питания</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <Select
                value={mealType}
                onValueChange={(value) => onMealTypeChange(value as MealType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип питания" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Любой</SelectItem>
                  <SelectItem value="none">Без питания</SelectItem>
                  <SelectItem value="breakfast">Завтрак</SelectItem>
                  <SelectItem value="half-board">Полупансион</SelectItem>
                  <SelectItem value="full-board">Полный пансион</SelectItem>
                  <SelectItem value="all-inclusive">Всё включено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Фильтр по удобствам */}
        <AccordionItem value="amenities" className="border-white/10">
          <AccordionTrigger className="text-white hover:text-primary">Удобства</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="wifi" 
                  checked={amenities.wifi}
                  onCheckedChange={(checked) => onAmenityChange('wifi', checked === true)}
                />
                <Label htmlFor="wifi" className="flex items-center text-white">
                  <Wifi className="h-4 w-4 mr-2" />
                  Wi-Fi
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="parking" 
                  checked={amenities.parking}
                  onCheckedChange={(checked) => onAmenityChange('parking', checked === true)}
                />
                <Label htmlFor="parking" className="flex items-center text-white">
                  <Car className="h-4 w-4 mr-2" />
                  Парковка
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pool" 
                  checked={amenities.pool}
                  onCheckedChange={(checked) => onAmenityChange('pool', checked === true)}
                />
                <Label htmlFor="pool" className="flex items-center text-white">
                  <Waves className="h-4 w-4 mr-2" />
                  Бассейн
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gym" 
                  checked={amenities.gym}
                  onCheckedChange={(checked) => onAmenityChange('gym', checked === true)}
                />
                <Label htmlFor="gym" className="flex items-center text-white">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  Фитнес-центр
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="restaurant" 
                  checked={amenities.restaurant}
                  onCheckedChange={(checked) => onAmenityChange('restaurant', checked === true)}
                />
                <Label htmlFor="restaurant" className="flex items-center text-white">
                  <Utensils className="h-4 w-4 mr-2" />
                  Ресторан
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="spa" 
                  checked={amenities.spa}
                  onCheckedChange={(checked) => onAmenityChange('spa', checked === true)}
                />
                <Label htmlFor="spa" className="flex items-center text-white">
                  <Droplets className="h-4 w-4 mr-2" />
                  СПА
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="airConditioning" 
                  checked={amenities.airConditioning}
                  onCheckedChange={(checked) => onAmenityChange('airConditioning', checked === true)}
                />
                <Label htmlFor="airConditioning" className="flex items-center text-white">
                  <Wind className="h-4 w-4 mr-2" />
                  Кондиционер
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="petFriendly" 
                  checked={amenities.petFriendly}
                  onCheckedChange={(checked) => onAmenityChange('petFriendly', checked === true)}
                />
                <Label htmlFor="petFriendly" className="flex items-center text-white">
                  <Dog className="h-4 w-4 mr-2" />
                  Можно с питомцами
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="conferenceRoom" 
                  checked={amenities.conferenceRoom}
                  onCheckedChange={(checked) => onAmenityChange('conferenceRoom', checked === true)}
                />
                <Label htmlFor="conferenceRoom" className="flex items-center text-white">
                  <Building2 className="h-4 w-4 mr-2" />
                  Конференц-зал
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="transfer" 
                  checked={amenities.transfer}
                  onCheckedChange={(checked) => onAmenityChange('transfer', checked === true)}
                />
                <Label htmlFor="transfer" className="flex items-center text-white">
                  <Bus className="h-4 w-4 mr-2" />
                  Трансфер
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
