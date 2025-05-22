'use client'

import Image from 'next/image'

export function MoscowImage() {
  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-blue-500 flex items-center justify-center">
        <div className="text-white text-center p-4">
          <h3 className="text-2xl font-bold mb-2">Москва</h3>
          <p>Красная площадь, Кремль и другие достопримечательности</p>
        </div>
      </div>
    </div>
  )
}
