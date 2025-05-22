'use client'

import Image from 'next/image'

export function SaintPetersburgImage() {
  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden">
      {/* Используем локальное изображение Санкт-Петербурга */}
      <div className="absolute inset-0">
        <Image
          src="/images/cities/2024-03-08 (1).jpg"
          alt="Санкт-Петербург - Исаакиевский собор и канал Грибоедова"
          fill
          className="object-cover"
        />
      </div>

      {/* Затемнение для текста */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Название города */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-white text-2xl font-bold">Санкт-Петербург</h3>
        <p className="text-white/80">Исаакиевский собор, канал Грибоедова и другие достопримечательности</p>
      </div>
    </div>
  )
}
