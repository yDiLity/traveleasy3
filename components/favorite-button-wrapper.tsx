'use client'

import { FavoriteButton } from './favorite-button-new'
import { useSession } from 'next-auth/react'

interface FavoriteButtonWrapperProps {
  hotelId: number
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function FavoriteButtonWrapper(props: FavoriteButtonWrapperProps) {
  const { data: session, status } = useSession()

  return (
    <FavoriteButton
      {...props}
      isAuthenticated={status === 'authenticated'}
    />
  )
}
