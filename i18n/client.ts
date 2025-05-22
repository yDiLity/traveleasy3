'use client';

import { createI18nClient } from 'next-intl/client';
import { locales, defaultLocale } from './settings';

export default createI18nClient({
  locales,
  defaultLocale,
  // Добавлять префикс локали только когда она отличается от локали по умолчанию
  localePrefix: 'as-needed'
});
