'use client'

import { motion } from 'framer-motion'
import { Search, Shield, Clock, Award, CreditCard, HeartHandshake } from 'lucide-react'
// import { useTranslations } from 'next-intl'

export function FeaturesSection() {
  // Временно используем фиксированные переводы
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'whyChooseUs.title': 'Почему выбирают нас',
      'whyChooseUs.subtitle': 'Мы предлагаем лучший сервис для поиска и бронирования отелей',
      'features.convenientSearch.title': 'Удобный поиск',
      'features.convenientSearch.description': 'Находите идеальные варианты размещения с помощью удобных фильтров',
      'features.secureBooking.title': 'Безопасное бронирование',
      'features.secureBooking.description': 'Ваши данные защищены современными технологиями шифрования',
      'features.timeSavingSearch.title': 'Экономия времени',
      'features.timeSavingSearch.description': 'Быстрый поиск и сравнение вариантов размещения',
      'features.verifiedHotels.title': 'Проверенные отели',
      'features.verifiedHotels.description': 'Все отели проходят тщательную проверку качества',
      'features.bestPrices.title': 'Лучшие цены',
      'features.bestPrices.description': 'Гарантия лучшей цены на все варианты размещения',
      'features.support247.title': 'Поддержка 24/7',
      'features.support247.description': 'Наша служба поддержки всегда готова помочь вам'
    }
    return translations[key] || key
  }

  const features = [
    {
      icon: <Search className="h-10 w-10" />,
      key: 'convenientSearch'
    },
    {
      icon: <Shield className="h-10 w-10" />,
      key: 'secureBooking'
    },
    {
      icon: <Clock className="h-10 w-10" />,
      key: 'timeSavingSearch'
    },
    {
      icon: <Award className="h-10 w-10" />,
      key: 'verifiedHotels'
    },
    {
      icon: <CreditCard className="h-10 w-10" />,
      key: 'bestPrices'
    },
    {
      icon: <HeartHandshake className="h-10 w-10" />,
      key: 'support247'
    }
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {t('whyChooseUs.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t('whyChooseUs.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{t(`features.${feature.key}.title`)}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t(`features.${feature.key}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
