'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'resetPasswordTitle': 'Сброс пароля',
      'resetPasswordSubtitle': 'Введите новый пароль для вашей учетной записи',
      'newPassword': 'Новый пароль',
      'confirmPassword': 'Подтвердите пароль',
      'resetPassword': 'Сбросить пароль',
      'backToLogin': 'Вернуться к входу',
      'passwordMismatch': 'Пароли не совпадают',
      'invalidToken': 'Недействительный или истекший токен',
      'passwordReset': 'Пароль успешно сброшен',
      'passwordResetSuccess': 'Ваш пароль был успешно сброшен. Теперь вы можете войти в систему с новым паролем.'
    }
    return translations[key] || key
  }

  // Проверка наличия токена
  if (!token && !isSubmitted) {
    setError(t('invalidToken'))
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
      // В реальном приложении здесь был бы запрос к API для сброса пароля
      // Для демонстрации мы просто имитируем успешный сброс
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
      setIsLoading(false)
      
      // Через 3 секунды перенаправляем на страницу входа
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      setError('Произошла ошибка. Попробуйте позже.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSubmitted ? t('passwordReset') : t('resetPasswordTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {isSubmitted ? t('passwordResetSuccess') : t('resetPasswordSubtitle')}
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">{t('newPassword')}</Label>
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
              <Button type="submit" className="w-full" disabled={isLoading || !token}>
                {isLoading ? 'Загрузка...' : t('resetPassword')}
              </Button>
            </form>
          </CardContent>
        ) : (
          <CardContent>
            <div className="flex justify-center my-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-primary hover:underline">
            {t('backToLogin')}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
