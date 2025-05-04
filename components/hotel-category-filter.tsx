'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { AnimatedHotelCard } from './animated-hotel-card'
import { Hotel } from '@/types/hotel'
import { PriceRangeFilter } from './price-range-filter'
import { motion } from 'framer-motion'

interface HotelCategoryFilterProps {
  hotels: Hotel[]
  title: string
  subtitle?: string
}

type CategoryTab = 'all' | 'premium' | 'business' | 'standard' | 'budget'

export function HotelCategoryFilter({ hotels, title, subtitle }: HotelCategoryFilterProps) {
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(hotels)
  const [activeTab, setActiveTab] = useState<CategoryTab>('all')
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(150000)
  
  // Функция для фильтрации отелей по категории
  const filterByCategory = (category: CategoryTab) => {
    setActiveTab(category)
    
    if (category === 'all') {
      setFilteredHotels(hotels.filter(hotel => 
        hotel.price >= minPrice && hotel.price <= maxPrice
      ))
      return
    }
    
    let filteredByStars: Hotel[] = []
    
    switch (category) {
      case 'premium':
        filteredByStars = hotels.filter(hotel => hotel.stars === 5)
        break
      case 'business':
        filteredByStars = hotels.filter(hotel => hotel.stars === 4)
        break
      case 'standard':
        filteredByStars = hotels.filter(hotel => hotel.stars === 3)
        break
      case 'budget':
        filteredByStars = hotels.filter(hotel => hotel.stars <= 2)
        break
    }
    
    setFilteredHotels(filteredByStars.filter(hotel => 
      hotel.price >= minPrice && hotel.price <= maxPrice
    ))
  }
  
  // Функция для фильтрации отелей по цене
  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min)
    setMaxPrice(max)
    
    if (activeTab === 'all') {
      setFilteredHotels(hotels.filter(hotel => 
        hotel.price >= min && hotel.price <= max
      ))
      return
    }
    
    let filteredByStars: Hotel[] = []
    
    switch (activeTab) {
      case 'premium':
        filteredByStars = hotels.filter(hotel => hotel.stars === 5)
        break
      case 'business':
        filteredByStars = hotels.filter(hotel => hotel.stars === 4)
        break
      case 'standard':
        filteredByStars = hotels.filter(hotel => hotel.stars === 3)
        break
      case 'budget':
        filteredByStars = hotels.filter(hotel => hotel.stars <= 2)
        break
    }
    
    setFilteredHotels(filteredByStars.filter(hotel => 
      hotel.price >= min && hotel.price <= max
    ))
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-2"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Категория отеля</h3>
            <div className="space-y-2">
              <button
                onClick={() => filterByCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Все категории
              </button>
              <button
                onClick={() => filterByCategory('premium')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'premium' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Премиум (5★)
              </button>
              <button
                onClick={() => filterByCategory('business')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'business' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Бизнес (4★)
              </button>
              <button
                onClick={() => filterByCategory('standard')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'standard' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Стандарт (3★)
              </button>
              <button
                onClick={() => filterByCategory('budget')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'budget' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Бюджет (1-2★)
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Цена</h3>
            <PriceRangeFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
            />
          </div>
        </div>
        
        <div className="w-full md:w-3/4">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Найдено отелей: {filteredHotels.length}
            </p>
          </div>
          
          {filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.slice(0, 9).map((hotel, index) => (
                <AnimatedHotelCard key={hotel.id} hotel={hotel} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                Отели не найдены. Попробуйте изменить параметры фильтрации.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
