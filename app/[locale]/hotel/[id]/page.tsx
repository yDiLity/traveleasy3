'use client'

import { HotelDetails } from '@/components/hotel-details'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'

interface HotelPageProps {
  params: {
    id: string
  }
}

export default function HotelPage() {
  // Используем useParams для доступа к параметрам маршрута
  const params = useParams()
  const id = params.id as string

  if (!id) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8 sm:p-12">
      <HotelDetails id={id} />
    </div>
  )
}
