import { HotelDetails } from '@/components/hotel-details'
import { notFound } from 'next/navigation'

interface HotelPageProps {
  params: {
    id: string
  }
}

export default function HotelPage({ params }: HotelPageProps) {
  const { id } = params

  if (!id) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8 sm:p-12">
      <HotelDetails id={id} />
    </div>
  )
}
