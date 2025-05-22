'use client'

import { HotelDetails } from '@/components/hotel-details'
import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'

interface HotelPageProps {
  params: {
    id: string
  }
}

export default function HotelPage({ params }: HotelPageProps) {
  // Используем React.use() для доступа к параметрам маршрута
  const unwrappedParams = React.use(params)
  const { id } = unwrappedParams
  const t = useTranslations()

  if (!id) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8 sm:p-12">
      <HotelDetails id={id} />
    </div>
  )
}
