import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/settings';

// Создаем middleware с помощью next-intl
export default createMiddleware({
  // Список поддерживаемых локалей
  locales: locales,

  // Локаль по умолчанию
  defaultLocale: defaultLocale,

  // Добавлять префикс локали только когда она отличается от локали по умолчанию
  localePrefix: 'as-needed',

  // Функция для определения локали из запроса
  localeDetection: true
});

// Конфигурация для Next.js middleware
export const config = {
  // Применяем middleware ко всем маршрутам, кроме API, статических файлов и т.д.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)']
};
