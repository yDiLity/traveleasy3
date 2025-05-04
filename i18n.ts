import { notFound } from 'next/navigation';

// Определяем поддерживаемые локали
export const locales = ['ru', 'en'];
export const defaultLocale = 'ru';

// Функция для загрузки сообщений для выбранной локали
export async function getMessages(locale: string) {
  // Проверяем, поддерживается ли локаль
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Загружаем сообщения для выбранной локали
  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    return {};
  }
}
