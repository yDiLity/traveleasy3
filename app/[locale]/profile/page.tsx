'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'profileTitle': 'Профиль',
      'profileSubtitle': 'Управление вашим профилем и настройками',
      'personalInfo': 'Личная информация',
      'security': 'Безопасность',
      'preferences': 'Предпочтения',
      'name': 'Имя',
      'email': 'Email',
      'saveChanges': 'Сохранить изменения',
      'changesSaved': 'Изменения сохранены',
      'currentPassword': 'Текущий пароль',
      'newPassword': 'Новый пароль',
      'confirmPassword': 'Подтвердите пароль',
      'changePassword': 'Изменить пароль',
      'passwordChanged': 'Пароль успешно изменен',
      'language': 'Язык',
      'currency': 'Валюта',
      'notifications': 'Уведомления',
      'emailNotifications': 'Получать уведомления по email',
      'savePreferences': 'Сохранить предпочтения',
      'preferencesSaved': 'Предпочтения сохранены'
    }
    return translations[key] || key
  }

  // Перенаправление на страницу входа, если пользователь не авторизован
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
    }
  }, [session, status, router])

  // Обработчик сохранения личной информации
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage(null)

    try {
      // В реальном приложении здесь был бы запрос к API для обновления профиля
      // Для демонстрации мы просто имитируем успешное обновление
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage(t('changesSaved'))
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  // Обработчик изменения пароля
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage(null)

    try {
      // В реальном приложении здесь был бы запрос к API для изменения пароля
      // Для демонстрации мы просто имитируем успешное изменение
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage(t('passwordChanged'))
      setIsLoading(false)
      
      // Сбрасываем поля формы
      e.currentTarget.reset()
    } catch (error) {
      setIsLoading(false)
    }
  }

  // Обработчик сохранения предпочтений
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage(null)

    try {
      // В реальном приложении здесь был бы запрос к API для сохранения предпочтений
      // Для демонстрации мы просто имитируем успешное сохранение
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage(t('preferencesSaved'))
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  // Показываем загрузку, пока проверяем сессию
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // Если пользователь не авторизован, не показываем содержимое страницы
  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                  <AvatarFallback>{getInitials(session.user.name || '')}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{session.user.name}</h2>
                <p className="text-gray-500">{session.user.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>{t('profileTitle')}</CardTitle>
              <CardDescription>{t('profileSubtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-4">
                  <TabsTrigger value="personal">{t('personalInfo')}</TabsTrigger>
                  <TabsTrigger value="security">{t('security')}</TabsTrigger>
                  <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
                </TabsList>
                
                {successMessage && (
                  <div className="bg-green-50 text-green-600 px-4 py-2 rounded-md text-sm mb-4">
                    {successMessage}
                  </div>
                )}
                
                <TabsContent value="personal">
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('name')}</Label>
                      <Input
                        id="name"
                        type="text"
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Загрузка...' : t('saveChanges')}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="security">
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('newPassword')}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Загрузка...' : t('changePassword')}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="preferences">
                  <form onSubmit={handleSavePreferences} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">{t('language')}</Label>
                      <select
                        id="language"
                        className="w-full p-2 border rounded-md"
                        defaultValue="ru"
                      >
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">{t('currency')}</Label>
                      <select
                        id="currency"
                        className="w-full p-2 border rounded-md"
                        defaultValue="RUB"
                      >
                        <option value="RUB">Российский рубль (₽)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        defaultChecked
                        className="h-4 w-4"
                      />
                      <Label htmlFor="emailNotifications">{t('emailNotifications')}</Label>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Загрузка...' : t('savePreferences')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Вспомогательная функция для получения инициалов из имени
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
