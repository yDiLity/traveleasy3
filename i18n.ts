import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './i18n/settings';

// Функция для загрузки сообщений для выбранной локали
export default getRequestConfig(async ({ locale }) => {
  // Проверяем, поддерживается ли локаль
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Загружаем сообщения для выбранной локали
  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {
      messages,
      // Настройки форматирования для дат, чисел и т.д.
      formats: {
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          },
          long: {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }
        },
        number: {
          currency: {
            style: 'currency',
            currency: 'RUB'
          },
          percent: {
            style: 'percent'
          }
        }
      },
      // Добавляем настройки для next-intl
      locales,
      defaultLocale,
      localePrefix: 'as-needed'
    };
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    return {
      messages: {},
      formats: {},
      locales,
      defaultLocale,
      localePrefix: 'as-needed'
    };
  }
});
