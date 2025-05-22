/**
 * Сервис для работы с Pexels API для получения изображений
 */

// Типы для результатов Pexels API
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page: string;
}

/**
 * Получение изображений отелей по поисковому запросу
 * @param query Поисковый запрос (например, "hotel moscow" или "resort beach")
 * @param count Количество изображений для получения
 * @param apiKey API ключ Pexels
 * @returns Массив URL изображений
 */
export async function getHotelImages(
  query: string,
  count: number = 5,
  apiKey: string
): Promise<string[]> {
  try {
    if (!apiKey) {
      throw new Error('API key is required for Pexels API');
    }

    // Формируем URL для запроса к Pexels API
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query + ' hotel'
    )}&per_page=${count}&orientation=landscape`;

    // Выполняем запрос к API с правильным форматом заголовка
    console.log('Using Pexels API key:', apiKey.substring(0, 10) + '...');
    const response = await fetch(url, {
      headers: {
        Authorization: `${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API request failed with status ${response.status}`);
    }

    const data: PexelsResponse = await response.json();

    // Проверяем наличие результатов
    if (!data.photos || data.photos.length === 0) {
      return [];
    }

    // Извлекаем URL изображений
    const imageUrls = data.photos.map((photo) => photo.src.large);
    return imageUrls;
  } catch (error) {
    console.error('Error fetching images from Pexels:', error);
    return [];
  }
}

/**
 * Получение изображений городов по названию города
 * @param cityName Название города
 * @param count Количество изображений для получения
 * @param apiKey API ключ Pexels
 * @returns Массив URL изображений
 */
export async function getCityImages(
  cityName: string,
  count: number = 5,
  apiKey: string
): Promise<string[]> {
  try {
    if (!apiKey) {
      throw new Error('API key is required for Pexels API');
    }

    // Формируем URL для запроса к Pexels API
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      cityName + ' city skyline'
    )}&per_page=${count}&orientation=landscape`;

    // Выполняем запрос к API с правильным форматом заголовка
    console.log('Using Pexels API key:', apiKey.substring(0, 10) + '...');
    const response = await fetch(url, {
      headers: {
        Authorization: `${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API request failed with status ${response.status}`);
    }

    const data: PexelsResponse = await response.json();

    // Проверяем наличие результатов
    if (!data.photos || data.photos.length === 0) {
      return [];
    }

    // Извлекаем URL изображений
    const imageUrls = data.photos.map((photo) => photo.src.large);
    return imageUrls;
  } catch (error) {
    console.error('Error fetching city images from Pexels:', error);
    return [];
  }
}

/**
 * Получение изображений достопримечательностей по названию города
 * @param cityName Название города
 * @param count Количество изображений для получения
 * @param apiKey API ключ Pexels
 * @returns Массив URL изображений
 */
export async function getLandmarkImages(
  cityName: string,
  count: number = 5,
  apiKey: string
): Promise<string[]> {
  try {
    if (!apiKey) {
      throw new Error('API key is required for Pexels API');
    }

    // Формируем URL для запроса к Pexels API
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      cityName + ' landmarks'
    )}&per_page=${count}&orientation=landscape`;

    // Выполняем запрос к API с правильным форматом заголовка
    console.log('Using Pexels API key:', apiKey.substring(0, 10) + '...');
    const response = await fetch(url, {
      headers: {
        Authorization: `${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API request failed with status ${response.status}`);
    }

    const data: PexelsResponse = await response.json();

    // Проверяем наличие результатов
    if (!data.photos || data.photos.length === 0) {
      return [];
    }

    // Извлекаем URL изображений
    const imageUrls = data.photos.map((photo) => photo.src.large);
    return imageUrls;
  } catch (error) {
    console.error('Error fetching landmark images from Pexels:', error);
    return [];
  }
}
