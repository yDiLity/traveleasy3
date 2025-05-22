import { createI18nServer } from 'next-intl/server';
import { locales, defaultLocale } from './settings';

export default createI18nServer({
  locales,
  defaultLocale,
  // Добавлять префикс локали только когда она отличается от локали по умолчанию
  localePrefix: 'as-needed'
});
