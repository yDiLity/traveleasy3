/**
 * Конфигурация API ключей для различных сервисов
 */
export const API_KEYS = {
  // Ключ для RapidAPI (если используется)
  RAPID_API_KEY: process.env.RAPID_API_KEY || '',
  RAPID_API_HOST: process.env.RAPID_API_HOST || '',

  // Ключ для Google Maps API
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',

  // Ключ для Unsplash API
  UNSPLASH_API_KEY: process.env.UNSPLASH_API_KEY || '',

  // Ключ для Pexels API
  PEXELS_API_KEY: process.env.PEXELS_API_KEY || '',

  // Другие API ключи могут быть добавлены здесь
}

/**
 * Проверка наличия необходимых API ключей
 */
export function validateApiKeys(): boolean {
  let isValid = true;

  // Проверяем наличие ключа для RapidAPI
  if (!API_KEYS.RAPID_API_KEY) {
    console.warn('RAPID_API_KEY is not set. Hotel search functionality may not work properly.');
    isValid = false;
  }

  // Проверяем наличие ключа для Google Maps API
  if (!API_KEYS.GOOGLE_MAPS_API_KEY) {
    console.warn('GOOGLE_MAPS_API_KEY is not set. Map functionality may not work properly.');
    isValid = false;
  }

  // Проверяем наличие ключа для Unsplash API
  if (!API_KEYS.UNSPLASH_API_KEY) {
    console.warn('UNSPLASH_API_KEY is not set. Image search functionality may not work properly.');
    isValid = false;
  }

  // Проверяем наличие ключа для Pexels API
  if (!API_KEYS.PEXELS_API_KEY) {
    console.warn('PEXELS_API_KEY is not set. Alternative image search functionality may not work properly.');
    isValid = false;
  }

  return isValid;
}
