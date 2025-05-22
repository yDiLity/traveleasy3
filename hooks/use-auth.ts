'use client'

import { useState, useEffect } from 'react'

// Тип для пользователя
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// Хук для аутентификации
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Проверяем, есть ли сохраненный пользователь при загрузке
  useEffect(() => {
    // Имитация пользователя для демонстрации
    const mockUser: User = {
      id: '1',
      name: 'Демо Пользователь',
      email: 'demo@example.com',
      avatar: '/images/avatar.jpg'
    }

    setUser(mockUser)
  }, [])

  // Функция для входа
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // В реальном приложении здесь был бы запрос к API
      // Для демонстрации используем моковые данные
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          name: 'Демо Пользователь',
          email: 'demo@example.com',
          avatar: '/images/avatar.jpg'
        }

        setUser(mockUser)
      } else {
        throw new Error('Неверный email или пароль')
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Произошла ошибка при входе')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для регистрации
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // В реальном приложении здесь был бы запрос к API
      // Для демонстрации используем моковые данные
      const mockUser: User = {
        id: '2',
        name,
        email,
        avatar: '/images/avatar.jpg'
      }

      setUser(mockUser)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Произошла ошибка при регистрации')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для выхода
  const logout = () => {
    setUser(null)
  }

  return { user, isLoading, error, login, register, logout }
}
