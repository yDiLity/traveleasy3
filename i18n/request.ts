import { locales, defaultLocale } from './settings';

// Функция для загрузки сообщений для выбранной локали
export async function getMessages(locale?: string) {
  // Если локаль не определена, используем локаль по умолчанию
  const currentLocale = locale || defaultLocale;

  // Проверяем, поддерживается ли локаль
  if (!locales.includes(currentLocale as any)) {
    console.warn(`Locale '${currentLocale}' is not supported. Using default locale '${defaultLocale}'.`);
  }

  // Загружаем сообщения для выбранной локали
  let messages;
  try {
    messages = (await import(`../messages/${currentLocale}.json`)).default;
  } catch (error) {
    console.warn(`Failed to load messages for locale '${currentLocale}'. Using default locale '${defaultLocale}'.`);
    messages = (await import(`../messages/${defaultLocale}.json`)).default;
  }

  return {
    locale: currentLocale,
    messages,
    timeZone: 'Europe/Moscow',
    now: new Date(),
  };
}
