'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'registerTitle': 'Регистрация',
      'registerSubtitle': 'Создайте аккаунт для доступа ко всем функциям',
      'name': 'Имя',
      'email': 'Email',
      'password': 'Пароль',
      'confirmPassword': 'Подтвердите пароль',
      'registerButton': 'Зарегистрироваться',
      'haveAccount': 'Уже есть аккаунт?',
      'loginButton': 'Войти',
      'passwordMismatch': 'Пароли не совпадают',
      'emailExists': 'Пользователь с таким email уже существует',
      'registrationSuccess': 'Регистрация успешна! Теперь вы можете войти в систему.'
    }
    return translations[key] || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setError(t('passwordMismatch'))
      setIsLoading(false)
      return
    }

    try {
      // Отправляем запрос к API для регистрации
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Обработка ошибки
        if (data.error === 'User with this email already exists') {
          setError(t('emailExists'))
        } else {
          setError(data.error || 'Произошла ошибка. Попробуйте позже.')
        }
        setIsLoading(false)
        return
      }

      // Успешная регистрация
      alert(t('registrationSuccess'))

      // Перенаправление на страницу входа
      router.push('/login')
    } catch (error) {
      setError('Произошла ошибка. Попробуйте позже.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t('registerTitle')}</CardTitle>
          <CardDescription className="text-center">
            {t('registerSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Петров"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Загрузка...' : t('registerButton')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {t('haveAccount')}{' '}
            <Link href="/login" className="text-primary hover:underline">
              {t('loginButton')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
