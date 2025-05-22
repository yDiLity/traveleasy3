'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Проверяем, что React.useReducer существует
  if (!React.useReducer) {
    console.error('React.useReducer is not available. This might be a version mismatch issue.');
    // Возвращаем детей без обертки, чтобы приложение не ломалось полностью
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
