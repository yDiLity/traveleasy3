/**
 * Сервис для работы с Unsplash API для получения изображений
 */

// Типы для результатов Unsplash API
interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
}

/**
 * Получение изображений отелей по поисковому запросу
 * @param query Поисковый запрос (например, "hotel moscow" или "resort beach")
 * @param count Количество изображений для получения
 * @param apiKey API ключ Unsplash
 * @returns Массив URL изображений
 */
export async function getHotelImages(
  query: string,
  count: number = 5,
  apiKey: string
): Promise<string[]> {
  try {
    if (!apiKey) {
      throw new Error('API key is required for Unsplash API');
    }

    // Формируем URL для запроса к Unsplash API
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query + ' hotel'
    )}&per_page=${count}&orientation=landscape`;

    // Выполняем запрос к API
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Проверяем наличие результатов
    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Извлекаем URL изображений
    const imageUrls = data.results.map((image: UnsplashImage) => image.urls.regular);
    return imageUrls;
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return [];
  }
}

/**
 * Получение изображений городов по названию города
 * @param cityName Название города
 * @param count Количество изображений для получения
 * @param apiKey API ключ Unsplash
 * @returns Массив URL изображений
 */
export async function getCityImages(
  cityName: string,
  count: number = 5,
  apiKey: string
): Promise<string[]> {
  try {
    if (!apiKey) {
      throw new Error('API key is required for Unsplash API');
    }

    // Формируем URL для запроса к Unsplash API
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      cityName + ' city skyline'
    )}&per_page=${count}&orientation=landscape`;

    // Выполняем запрос к API
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Проверяем наличие результатов
    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Извлекаем URL изображений
    const imageUrls = data.results.map((image: UnsplashImage) => image.urls.regular);
    return imageUrls;
  } catch (error) {
    console.error('Error fetching city images from Unsplash:', error);
    return [];
  }
}

/**
 * Получение изображений достопримечательностей по названию города
 * @param cityName Название города
 * @param count Количество изображений для получения
 * @param apiKey API ключ Unsplash
 * @returns Массив URL изображений
 */
export async function getLandmarkImages(
  cityName: string,
  count: number = 5,
  apiKey: string
): Promise<string[]> {
  try {
    if (!apiKey) {
      throw new Error('API key is required for Unsplash API');
    }

    // Формируем URL для запроса к Unsplash API
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      cityName + ' landmarks'
    )}&per_page=${count}&orientation=landscape`;

    // Выполняем запрос к API
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Проверяем наличие результатов
    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Извлекаем URL изображений
    const imageUrls = data.results.map((image: UnsplashImage) => image.urls.regular);
    return imageUrls;
  } catch (error) {
    console.error('Error fetching landmark images from Unsplash:', error);
    return [];
  }
}
