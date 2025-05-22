import { NextResponse } from 'next/server'

// Мок-данные для местоположений (в реальном приложении это был бы запрос к базе данных или внешнему API)
const locations = [
  // Города России
  { id: 1, name: 'Москва', country: 'Россия', type: 'city' },
  { id: 2, name: 'Санкт-Петербург', country: 'Россия', type: 'city' },
  { id: 3, name: 'Казань', country: 'Россия', type: 'city' },
  { id: 4, name: 'Сочи', country: 'Россия', type: 'city' },
  { id: 5, name: 'Екатеринбург', country: 'Россия', type: 'city' },
  { id: 6, name: 'Новосибирск', country: 'Россия', type: 'city' },
  { id: 7, name: 'Калининград', country: 'Россия', type: 'city' },
  { id: 8, name: 'Владивосток', country: 'Россия', type: 'city' },
  { id: 9, name: 'Мурманск', country: 'Россия', type: 'city' },
  { id: 10, name: 'Ростов-на-Дону', country: 'Россия', type: 'city' },
  { id: 21, name: 'Ярославль', country: 'Россия', type: 'city' },
  { id: 22, name: 'Волгоград', country: 'Россия', type: 'city' },
  { id: 23, name: 'Нижний Новгород', country: 'Россия', type: 'city' },
  { id: 24, name: 'Самара', country: 'Россия', type: 'city' },
  { id: 25, name: 'Челябинск', country: 'Россия', type: 'city' },
  { id: 26, name: 'Краснодар', country: 'Россия', type: 'city' },
  { id: 27, name: 'Воронеж', country: 'Россия', type: 'city' },
  { id: 28, name: 'Пермь', country: 'Россия', type: 'city' },
  { id: 29, name: 'Уфа', country: 'Россия', type: 'city' },
  { id: 30, name: 'Тюмень', country: 'Россия', type: 'city' },

  // Популярные международные города
  { id: 11, name: 'Нью-Йорк', country: 'США', type: 'city' },
  { id: 12, name: 'Лондон', country: 'Великобритания', type: 'city' },
  { id: 13, name: 'Париж', country: 'Франция', type: 'city' },
  { id: 14, name: 'Рим', country: 'Италия', type: 'city' },
  { id: 15, name: 'Барселона', country: 'Испания', type: 'city' },
  { id: 16, name: 'Берлин', country: 'Германия', type: 'city' },
  { id: 17, name: 'Токио', country: 'Япония', type: 'city' },
  { id: 18, name: 'Дубай', country: 'ОАЭ', type: 'city' },
  { id: 19, name: 'Сидней', country: 'Австралия', type: 'city' },
  { id: 20, name: 'Монреаль', country: 'Канада', type: 'city' },
  { id: 31, name: 'Вена', country: 'Австрия', type: 'city' },
  { id: 32, name: 'Амстердам', country: 'Нидерланды', type: 'city' },
  { id: 33, name: 'Прага', country: 'Чехия', type: 'city' },
  { id: 34, name: 'Стамбул', country: 'Турция', type: 'city' },
  { id: 35, name: 'Бангкок', country: 'Таиланд', type: 'city' },
  { id: 36, name: 'Сингапур', country: 'Сингапур', type: 'city' },
  { id: 37, name: 'Гонконг', country: 'Китай', type: 'city' },
  { id: 38, name: 'Лиссабон', country: 'Португалия', type: 'city' },
  { id: 39, name: 'Афины', country: 'Греция', type: 'city' },
  { id: 40, name: 'Мадрид', country: 'Испания', type: 'city' },

  // Страны
  { id: 101, name: 'Россия', type: 'country' },
  { id: 102, name: 'США', type: 'country' },
  { id: 103, name: 'Великобритания', type: 'country' },
  { id: 104, name: 'Франция', type: 'country' },
  { id: 105, name: 'Италия', type: 'country' },
  { id: 106, name: 'Испания', type: 'country' },
  { id: 107, name: 'Германия', type: 'country' },
  { id: 108, name: 'Япония', type: 'country' },
  { id: 109, name: 'ОАЭ', type: 'country' },
  { id: 110, name: 'Австралия', type: 'country' },
  { id: 111, name: 'Канада', type: 'country' },
  { id: 112, name: 'Турция', type: 'country' },
  { id: 113, name: 'Египет', type: 'country' },
  { id: 114, name: 'Таиланд', type: 'country' },
  { id: 115, name: 'Греция', type: 'country' },
  { id: 116, name: 'Португалия', type: 'country' },
  { id: 117, name: 'Нидерланды', type: 'country' },
  { id: 118, name: 'Швейцария', type: 'country' },
  { id: 119, name: 'Австрия', type: 'country' },
  { id: 120, name: 'Мексика', type: 'country' },

  // Курортные регионы
  { id: 201, name: 'Крым', country: 'Россия', type: 'region' },
  { id: 202, name: 'Краснодарский край', country: 'Россия', type: 'region' },
  { id: 203, name: 'Мальдивы', type: 'region' },
  { id: 204, name: 'Бали', country: 'Индонезия', type: 'region' },
  { id: 205, name: 'Канарские острова', country: 'Испания', type: 'region' },
  { id: 206, name: 'Майорка', country: 'Испания', type: 'region' },
  { id: 207, name: 'Сицилия', country: 'Италия', type: 'region' },
  { id: 208, name: 'Монако', type: 'region' },
  { id: 209, name: 'Гавайи', country: 'США', type: 'region' },
  { id: 210, name: 'Мальта', type: 'region' },
]

// Английские переводы для местоположений
const locationsEn = [
  // Города России
  { id: 1, name: 'Moscow', country: 'Russia', type: 'city' },
  { id: 2, name: 'Saint Petersburg', country: 'Russia', type: 'city' },
  { id: 3, name: 'Kazan', country: 'Russia', type: 'city' },
  { id: 4, name: 'Sochi', country: 'Russia', type: 'city' },
  { id: 5, name: 'Yekaterinburg', country: 'Russia', type: 'city' },
  { id: 6, name: 'Novosibirsk', country: 'Russia', type: 'city' },
  { id: 7, name: 'Kaliningrad', country: 'Russia', type: 'city' },
  { id: 8, name: 'Vladivostok', country: 'Russia', type: 'city' },
  { id: 9, name: 'Murmansk', country: 'Russia', type: 'city' },
  { id: 10, name: 'Rostov-on-Don', country: 'Russia', type: 'city' },
  { id: 21, name: 'Yaroslavl', country: 'Russia', type: 'city' },
  { id: 22, name: 'Volgograd', country: 'Russia', type: 'city' },
  { id: 23, name: 'Nizhny Novgorod', country: 'Russia', type: 'city' },
  { id: 24, name: 'Samara', country: 'Russia', type: 'city' },
  { id: 25, name: 'Chelyabinsk', country: 'Russia', type: 'city' },
  { id: 26, name: 'Krasnodar', country: 'Russia', type: 'city' },
  { id: 27, name: 'Voronezh', country: 'Russia', type: 'city' },
  { id: 28, name: 'Perm', country: 'Russia', type: 'city' },
  { id: 29, name: 'Ufa', country: 'Russia', type: 'city' },
  { id: 30, name: 'Tyumen', country: 'Russia', type: 'city' },

  // Популярные международные города
  { id: 11, name: 'New York', country: 'USA', type: 'city' },
  { id: 12, name: 'London', country: 'United Kingdom', type: 'city' },
  { id: 13, name: 'Paris', country: 'France', type: 'city' },
  { id: 14, name: 'Rome', country: 'Italy', type: 'city' },
  { id: 15, name: 'Barcelona', country: 'Spain', type: 'city' },
  { id: 16, name: 'Berlin', country: 'Germany', type: 'city' },
  { id: 17, name: 'Tokyo', country: 'Japan', type: 'city' },
  { id: 18, name: 'Dubai', country: 'UAE', type: 'city' },
  { id: 19, name: 'Sydney', country: 'Australia', type: 'city' },
  { id: 20, name: 'Montreal', country: 'Canada', type: 'city' },
  { id: 31, name: 'Vienna', country: 'Austria', type: 'city' },
  { id: 32, name: 'Amsterdam', country: 'Netherlands', type: 'city' },
  { id: 33, name: 'Prague', country: 'Czech Republic', type: 'city' },
  { id: 34, name: 'Istanbul', country: 'Turkey', type: 'city' },
  { id: 35, name: 'Bangkok', country: 'Thailand', type: 'city' },
  { id: 36, name: 'Singapore', country: 'Singapore', type: 'city' },
  { id: 37, name: 'Hong Kong', country: 'China', type: 'city' },
  { id: 38, name: 'Lisbon', country: 'Portugal', type: 'city' },
  { id: 39, name: 'Athens', country: 'Greece', type: 'city' },
  { id: 40, name: 'Madrid', country: 'Spain', type: 'city' },

  // Страны
  { id: 101, name: 'Russia', type: 'country' },
  { id: 102, name: 'USA', type: 'country' },
  { id: 103, name: 'United Kingdom', type: 'country' },
  { id: 104, name: 'France', type: 'country' },
  { id: 105, name: 'Italy', type: 'country' },
  { id: 106, name: 'Spain', type: 'country' },
  { id: 107, name: 'Germany', type: 'country' },
  { id: 108, name: 'Japan', type: 'country' },
  { id: 109, name: 'UAE', type: 'country' },
  { id: 110, name: 'Australia', type: 'country' },
  { id: 111, name: 'Canada', type: 'country' },
  { id: 112, name: 'Turkey', type: 'country' },
  { id: 113, name: 'Egypt', type: 'country' },
  { id: 114, name: 'Thailand', type: 'country' },
  { id: 115, name: 'Greece', type: 'country' },
  { id: 116, name: 'Portugal', type: 'country' },
  { id: 117, name: 'Netherlands', type: 'country' },
  { id: 118, name: 'Switzerland', type: 'country' },
  { id: 119, name: 'Austria', type: 'country' },
  { id: 120, name: 'Mexico', type: 'country' },

  // Курортные регионы
  { id: 201, name: 'Crimea', country: 'Russia', type: 'region' },
  { id: 202, name: 'Krasnodar Krai', country: 'Russia', type: 'region' },
  { id: 203, name: 'Maldives', type: 'region' },
  { id: 204, name: 'Bali', country: 'Indonesia', type: 'region' },
  { id: 205, name: 'Canary Islands', country: 'Spain', type: 'region' },
  { id: 206, name: 'Mallorca', country: 'Spain', type: 'region' },
  { id: 207, name: 'Sicily', country: 'Italy', type: 'region' },
  { id: 208, name: 'Monaco', type: 'region' },
  { id: 209, name: 'Hawaii', country: 'USA', type: 'region' },
  { id: 210, name: 'Malta', type: 'region' },
]

// Популярные местоположения для быстрого доступа
const popularLocationsRu = [
  { id: 1, name: 'Москва', country: 'Россия', type: 'city' },
  { id: 2, name: 'Санкт-Петербург', country: 'Россия', type: 'city' },
  { id: 4, name: 'Сочи', country: 'Россия', type: 'city' },
  { id: 3, name: 'Казань', country: 'Россия', type: 'city' },
  { id: 7, name: 'Калининград', country: 'Россия', type: 'city' },
  { id: 201, name: 'Крым', country: 'Россия', type: 'region' },
  { id: 101, name: 'Россия', type: 'country' },
  { id: 106, name: 'Испания', type: 'country' },
]

const popularLocationsEn = [
  { id: 1, name: 'Moscow', country: 'Russia', type: 'city' },
  { id: 2, name: 'Saint Petersburg', country: 'Russia', type: 'city' },
  { id: 4, name: 'Sochi', country: 'Russia', type: 'city' },
  { id: 3, name: 'Kazan', country: 'Russia', type: 'city' },
  { id: 7, name: 'Kaliningrad', country: 'Russia', type: 'city' },
  { id: 201, name: 'Crimea', country: 'Russia', type: 'region' },
  { id: 101, name: 'Russia', type: 'country' },
  { id: 106, name: 'Spain', type: 'country' },
]

export async function GET(request: Request) {
  // Получаем параметры запроса
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')?.toLowerCase() || ''
  const locale = searchParams.get('locale') || 'ru'
  const limit = parseInt(searchParams.get('limit') || '10')
  const popular = searchParams.get('popular') === 'true'

  // Выбираем набор данных в зависимости от локали
  const dataSet = locale === 'en' ? locationsEn : locations
  const popularSet = locale === 'en' ? popularLocationsEn : popularLocationsRu

  // Если запрошены популярные местоположения
  if (popular) {
    // Добавляем небольшую задержку для имитации сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 100))
    return NextResponse.json({ locations: popularSet.slice(0, limit) })
  }

  // Если запрос пустой, возвращаем пустой массив
  if (!query) {
    return NextResponse.json({ locations: [] })
  }

  // Фильтруем местоположения по запросу
  const filteredLocations = dataSet
    .filter(location =>
      location.name.toLowerCase().includes(query) ||
      (location.country && location.country.toLowerCase().includes(query))
    )
    .slice(0, limit)

  // Добавляем задержку для имитации сетевого запроса (только для демонстрации)
  await new Promise(resolve => setTimeout(resolve, 200))

  return NextResponse.json({ locations: filteredLocations })
}
