'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'forgotPasswordTitle': 'Восстановление пароля',
      'forgotPasswordSubtitle': 'Введите ваш email для получения инструкций по восстановлению пароля',
      'email': 'Email',
      'sendInstructions': 'Отправить инструкции',
      'backToLogin': 'Вернуться к входу',
      'checkEmail': 'Проверьте ваш email',
      'resetLinkSent': 'Мы отправили ссылку для восстановления пароля на указанный email. Пожалуйста, проверьте вашу почту и следуйте инструкциям.'
    }
    return translations[key] || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // В реальном приложении здесь был бы запрос к API для отправки ссылки восстановления
      // Для демонстрации мы просто имитируем успешную отправку
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSubmitted ? t('checkEmail') : t('forgotPasswordTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {isSubmitted ? t('resetLinkSent') : t('forgotPasswordSubtitle')}
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Загрузка...' : t('sendInstructions')}
              </Button>
            </form>
          </CardContent>
        ) : (
          <CardContent>
            <div className="flex justify-center my-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
