'use client'

// import { useTranslations } from 'next-intl'

export function Footer() {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'aboutCompany': 'О компании',
      'aboutUs': 'О нас',
      'careers': 'Карьера',
      'news': 'Новости',
      'partnership': 'Партнерство',
      'help': 'Помощь',
      'faq': 'FAQ',
      'support': 'Поддержка',
      'contactUs': 'Связаться с нами',
      'useful': 'Полезное',
      'blog': 'Блог',
      'tips': 'Советы',
      'popularDestinations': 'Популярные направления',
      'subscription': 'Подписка',
      'subscriptionText': 'Получайте эксклюзивные предложения и новости о путешествиях',
      'emailPlaceholder': 'Ваш email',
      'subscribe': 'Подписаться',
      'copyright': '© 2023 TravelEasy. Все права защищены.'
    }
    return translations[key] || key
  }

  return (
    <footer id="main-footer" className="bg-gray-100 dark:bg-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('aboutCompany')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('aboutUs')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('careers')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('news')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('partnership')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('help')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('faq')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('support')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('contactUs')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('useful')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('blog')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('tips')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">{t('popularDestinations')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('subscription')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('subscriptionText')}</p>
            <div className="flex">
              <input type="email" placeholder={t('emailPlaceholder')} className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90">
                {t('subscribe')}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">{t('copyright')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
