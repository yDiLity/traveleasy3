import { Hotel, AccommodationType, MealType } from '@/types/hotel'

// Массивы данных для генерации отелей
const hotelNames = {
  premium: [
    'Grand Hotel', 'Royal Palace', 'Luxury Resort', 'Imperial Hotel', 'Elite Suites',
    'Prestige Hotel', 'Diamond Resort', 'Platinum Palace', 'Majestic Hotel', 'Ritz Plaza',
    'Waldorf Astoria', 'Four Seasons', 'St. Regis', 'Mandarin Oriental', 'Peninsula Hotel',
    'Burj Al Arab', 'Belmond Hotel', 'Aman Resort', 'Raffles Hotel', 'Park Hyatt'
  ],
  business: [
    'Business Center Hotel', 'Executive Suites', 'Corporate Inn', 'Commerce Hotel', 'Trade Center Hotel',
    'Metropolitan Hotel', 'City Center Hotel', 'Urban Hotel', 'Central Plaza', 'Downtown Suites',
    'Hilton', 'Marriott', 'Sheraton', 'Westin', 'InterContinental',
    'Radisson Blu', 'Hyatt Regency', 'Crowne Plaza', 'Renaissance Hotel', 'Sofitel'
  ],
  standard: [
    'Comfort Inn', 'Holiday Hotel', 'Seaside Resort', 'Mountain View Hotel', 'Park Hotel',
    'Garden Hotel', 'Sunset Hotel', 'Riverside Inn', 'Ocean View Resort', 'Valley Hotel',
    'Best Western', 'Holiday Inn', 'Ramada', 'Courtyard', 'DoubleTree',
    'Novotel', 'Mercure', 'Ibis', 'Hampton Inn', 'Fairfield Inn'
  ],
  budget: [
    'Budget Inn', 'Economy Hotel', 'Traveler\'s Lodge', 'Backpacker\'s Hostel', 'Value Stay',
    'Simple Stay', 'Basic Hotel', 'Affordable Inn', 'Thrifty Lodge', 'Smart Hotel',
    'Motel 6', 'Super 8', 'Days Inn', 'Econo Lodge', 'Travelodge',
    'Red Roof Inn', 'Ibis Budget', 'Premier Inn', 'Formule 1', 'EasyHotel'
  ]
}

const hotelChains = [
  'Marriott International', 'Hilton Worldwide', 'InterContinental Hotels Group', 'Wyndham Hotels & Resorts',
  'Accor', 'Choice Hotels', 'Best Western', 'Radisson Hotel Group', 'Hyatt Hotels Corporation',
  'Shangri-La Hotels and Resorts', 'Taj Hotels', 'Four Seasons Hotels and Resorts', 'Mandarin Oriental Hotel Group',
  'NH Hotel Group', 'Melia Hotels International', 'Riu Hotels & Resorts', 'Barceló Hotel Group',
  'Kempinski Hotels', 'Jumeirah Group', 'Millennium & Copthorne Hotels'
]

const russianCities = [
  'Москва', 'Санкт-Петербург', 'Сочи', 'Казань', 'Екатеринбург', 'Нижний Новгород', 'Калининград',
  'Владивосток', 'Ярославль', 'Иркутск', 'Новосибирск', 'Краснодар', 'Ростов-на-Дону', 'Самара',
  'Волгоград', 'Суздаль', 'Великий Новгород', 'Псков', 'Выборг', 'Севастополь', 'Ялта', 'Алушта',
  'Феодосия', 'Судак', 'Евпатория', 'Анапа', 'Геленджик', 'Туапсе', 'Адлер', 'Красная Поляна'
]

const worldCities = [
  { city: 'Париж', country: 'Франция' },
  { city: 'Лондон', country: 'Великобритания' },
  { city: 'Рим', country: 'Италия' },
  { city: 'Барселона', country: 'Испания' },
  { city: 'Амстердам', country: 'Нидерланды' },
  { city: 'Берлин', country: 'Германия' },
  { city: 'Вена', country: 'Австрия' },
  { city: 'Прага', country: 'Чехия' },
  { city: 'Афины', country: 'Греция' },
  { city: 'Стамбул', country: 'Турция' },
  { city: 'Дубай', country: 'ОАЭ' },
  { city: 'Нью-Йорк', country: 'США' },
  { city: 'Лос-Анджелес', country: 'США' },
  { city: 'Майами', country: 'США' },
  { city: 'Токио', country: 'Япония' },
  { city: 'Сингапур', country: 'Сингапур' },
  { city: 'Бангкок', country: 'Таиланд' },
  { city: 'Пхукет', country: 'Таиланд' },
  { city: 'Бали', country: 'Индонезия' },
  { city: 'Мальдивы', country: 'Мальдивы' },
  { city: 'Каир', country: 'Египет' },
  { city: 'Шарм-эль-Шейх', country: 'Египет' },
  { city: 'Хургада', country: 'Египет' },
  { city: 'Канкун', country: 'Мексика' },
  { city: 'Рио-де-Жанейро', country: 'Бразилия' },
  { city: 'Буэнос-Айрес', country: 'Аргентина' },
  { city: 'Сидней', country: 'Австралия' },
  { city: 'Мельбурн', country: 'Австралия' },
  { city: 'Кейптаун', country: 'ЮАР' },
  { city: 'Маракеш', country: 'Марокко' }
]

const accommodationTypes: AccommodationType[] = ['hotel', 'apartment', 'hostel', 'villa', 'resort', 'guesthouse']
const mealTypes: MealType[] = ['none', 'breakfast', 'half-board', 'full-board', 'all-inclusive']

const amenitiesSets = [
  // Премиум отели (5 звезд)
  {
    wifi: true,
    parking: true,
    pool: true,
    gym: true,
    restaurant: true,
    spa: true,
    airConditioning: true,
    petFriendly: true,
    conferenceRoom: true,
    transfer: true
  },
  // Бизнес отели (4 звезды)
  {
    wifi: true,
    parking: true,
    pool: true,
    gym: true,
    restaurant: true,
    spa: true,
    airConditioning: true,
    petFriendly: false,
    conferenceRoom: true,
    transfer: true
  },
  // Стандартные отели (3 звезды)
  {
    wifi: true,
    parking: true,
    pool: false,
    gym: false,
    restaurant: true,
    spa: false,
    airConditioning: true,
    petFriendly: false,
    conferenceRoom: false,
    transfer: false
  },
  // Бюджетные отели (2 звезды)
  {
    wifi: true,
    parking: false,
    pool: false,
    gym: false,
    restaurant: false,
    spa: false,
    airConditioning: false,
    petFriendly: false,
    conferenceRoom: false,
    transfer: false
  }
]

const hotelDescriptions = {
  premium: [
    'Роскошный отель в самом сердце города, предлагающий непревзойденный уровень комфорта и сервиса. Изысканные номера, спа-центр мирового класса и рестораны высокой кухни.',
    'Элегантный пятизвездочный отель с панорамными видами и эксклюзивным сервисом. Идеальный выбор для требовательных путешественников, ценящих роскошь и комфорт.',
    'Престижный отель, сочетающий классическую роскошь и современные технологии. Просторные номера, персональный сервис и изысканная атмосфера.',
    'Великолепный отель премиум-класса с безупречным сервисом и вниманием к каждой детали. Роскошные номера, спа-центр и рестораны с отмеченной звездами Мишлен кухней.',
    'Эксклюзивный отель, предлагающий непревзойденный уровень роскоши и комфорта. Идеальное место для незабываемого отдыха с высочайшим уровнем сервиса.'
  ],
  business: [
    'Современный бизнес-отель с удобным расположением в деловом центре города. Функциональные номера, конференц-залы и высокоскоростной интернет.',
    'Комфортабельный отель для деловых путешественников с отличной инфраструктурой для работы и отдыха. Удобное расположение и профессиональный сервис.',
    'Элегантный отель, идеально подходящий для бизнес-поездок. Современные конференц-залы, бизнес-центр и удобные рабочие зоны в номерах.',
    'Стильный городской отель с отличными условиями для работы и отдыха. Расположен в непосредственной близости от основных бизнес-центров и достопримечательностей.',
    'Комфортабельный отель с продуманной инфраструктурой для бизнес-путешественников. Удобное расположение, современные технологии и профессиональный сервис.'
  ],
  standard: [
    'Уютный отель с комфортабельными номерами и дружелюбным персоналом. Отличное соотношение цены и качества для приятного отдыха.',
    'Комфортный отель в хорошем районе города. Чистые и уютные номера, приветливый персонал и все необходимые удобства для приятного пребывания.',
    'Приятный отель с домашней атмосферой и внимательным обслуживанием. Идеальный выбор для семейного отдыха или путешествия с друзьями.',
    'Удобно расположенный отель с комфортабельными номерами и хорошим сервисом. Отличный выбор для туристов, желающих исследовать город.',
    'Гостеприимный отель с уютными номерами и всеми необходимыми удобствами. Прекрасное соотношение цены и качества для комфортного отдыха.'
  ],
  budget: [
    'Экономичный отель с чистыми и функциональными номерами. Идеальный выбор для путешественников с ограниченным бюджетом.',
    'Доступный отель с базовыми удобствами и хорошим расположением. Отличный вариант для тех, кто ищет недорогое жилье без излишеств.',
    'Бюджетный отель с простыми, но комфортными номерами. Все необходимое для непродолжительного пребывания по доступной цене.',
    'Экономичный вариант размещения с чистыми номерами и дружелюбным персоналом. Идеально подходит для путешественников, которые большую часть времени проводят вне отеля.',
    'Недорогой отель с базовыми удобствами и удобным расположением. Хороший выбор для экономных путешественников.'
  ]
}

const hotelImages = {
  premium: [
    ['/images/hotels/premium/premium-1.svg'],
    ['/images/hotels/premium/premium-1.svg'],
    ['/images/hotels/premium/premium-1.svg']
  ],
  business: [
    ['/images/hotels/business/business-1.svg'],
    ['/images/hotels/business/business-1.svg'],
    ['/images/hotels/business/business-1.svg']
  ],
  standard: [
    ['/images/hotels/standard/standard-1.svg'],
    ['/images/hotels/standard/standard-1.svg'],
    ['/images/hotels/standard/standard-1.svg']
  ],
  budget: [
    ['/images/hotels/budget/budget-1.svg'],
    ['/images/hotels/budget/budget-1.svg'],
    ['/images/hotels/budget/budget-1.svg']
  ]
}

// Функция для получения случайного элемента из массива
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Функция для получения случайного числа в диапазоне
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Функция для генерации случайного отеля
export function generateRandomHotel(id: number, location?: string): Hotel {
  // Определяем категорию отеля
  const categories = ['premium', 'business', 'standard', 'budget']
  const categoryWeights = [0.1, 0.3, 0.4, 0.2] // Вероятности для каждой категории

  const randomValue = Math.random()
  let cumulativeWeight = 0
  let category = 'standard'

  for (let i = 0; i < categories.length; i++) {
    cumulativeWeight += categoryWeights[i]
    if (randomValue < cumulativeWeight) {
      category = categories[i]
      break
    }
  }

  // Определяем количество звезд в зависимости от категории
  let stars = 3
  switch (category) {
    case 'premium':
      stars = 5
      break
    case 'business':
      stars = 4
      break
    case 'standard':
      stars = 3
      break
    case 'budget':
      stars = getRandomNumber(1, 2)
      break
  }

  // Определяем местоположение
  let hotelLocation = location
  let country: string | undefined

  if (!hotelLocation) {
    const isRussian = Math.random() < 0.7 // 70% российских отелей

    if (isRussian) {
      hotelLocation = getRandomItem(russianCities)
    } else {
      const worldCity = getRandomItem(worldCities)
      hotelLocation = worldCity.city
      country = worldCity.country
    }
  }

  // Определяем тип размещения
  let accommodationType: AccommodationType

  switch (category) {
    case 'premium':
      accommodationType = getRandomItem(['hotel', 'resort', 'villa'])
      break
    case 'business':
      accommodationType = getRandomItem(['hotel', 'apartment'])
      break
    case 'standard':
      accommodationType = getRandomItem(['hotel', 'apartment', 'guesthouse'])
      break
    case 'budget':
      accommodationType = getRandomItem(['hotel', 'hostel', 'guesthouse'])
      break
    default:
      accommodationType = 'hotel'
  }

  // Определяем тип питания
  let mealType: MealType

  switch (category) {
    case 'premium':
      mealType = getRandomItem(['breakfast', 'half-board', 'full-board', 'all-inclusive'])
      break
    case 'business':
      mealType = getRandomItem(['breakfast', 'half-board'])
      break
    case 'standard':
      mealType = getRandomItem(['none', 'breakfast'])
      break
    case 'budget':
      mealType = getRandomItem(['none', 'breakfast'])
      break
    default:
      mealType = 'none'
  }

  // Определяем цену в зависимости от категории
  let price: number

  switch (category) {
    case 'premium':
      price = getRandomNumber(35000, 120000)
      break
    case 'business':
      price = getRandomNumber(15000, 35000)
      break
    case 'standard':
      price = getRandomNumber(5000, 15000)
      break
    case 'budget':
      price = getRandomNumber(1500, 5000)
      break
    default:
      price = getRandomNumber(5000, 15000)
  }

  // Определяем название отеля
  const hotelName = getRandomItem(hotelNames[category as keyof typeof hotelNames]) + ' ' + hotelLocation

  // Определяем удобства в зависимости от категории
  const amenitiesIndex = category === 'premium' ? 0 :
                         category === 'business' ? 1 :
                         category === 'standard' ? 2 : 3

  const amenities = amenitiesSets[amenitiesIndex]

  // Определяем описание отеля
  const description = getRandomItem(hotelDescriptions[category as keyof typeof hotelDescriptions])

  // Определяем изображения отеля
  const images = getRandomItem(hotelImages[category as keyof typeof hotelImages])

  // Определяем, имеет ли отель специальные предложения
  const hasSpecialOffers = Math.random() < 0.2 // 20% отелей имеют специальные предложения

  // Определяем принадлежность к сети отелей
  const hotelChain = Math.random() < 0.6 ? getRandomItem(hotelChains) : null // 60% отелей принадлежат к сети

  // Генерируем отзывы
  const reviewsCount = getRandomNumber(0, 5)
  const reviews = []

  const reviewAuthors = ['Александр К.', 'Екатерина С.', 'Дмитрий П.', 'Ольга М.', 'Иван Т.', 'Мария В.', 'Сергей Л.', 'Анна Р.']
  const reviewComments = [
    'Отличный отель, прекрасное обслуживание!',
    'Хороший отель, но завтрак мог бы быть лучше.',
    'Прекрасное расположение, все достопримечательности рядом.',
    'Чистые и уютные номера, приветливый персонал.',
    'Отличное соотношение цены и качества.',
    'Потрясающий вид из окна, очень комфортные кровати.',
    'Немного шумно, но в целом хороший отель.',
    'Превосходный сервис, обязательно вернемся снова!'
  ]

  for (let i = 0; i < reviewsCount; i++) {
    reviews.push({
      id: id * 100 + i,
      author: getRandomItem(reviewAuthors),
      rating: getRandomNumber(3, 5),
      comment: getRandomItem(reviewComments),
      date: `2025-${getRandomNumber(1, 12).toString().padStart(2, '0')}-${getRandomNumber(1, 28).toString().padStart(2, '0')}`
    })
  }

  // Генерируем координаты
  const lat = 55.7558 + (Math.random() - 0.5) * 0.1
  const lng = 37.6173 + (Math.random() - 0.5) * 0.1

  // Создаем и возвращаем объект отеля
  return {
    id,
    name: hotelName,
    location: hotelLocation,
    address: `ул. ${getRandomItem(['Центральная', 'Морская', 'Парковая', 'Лесная', 'Горная', 'Речная', 'Озерная', 'Солнечная'])}, ${getRandomNumber(1, 100)}, ${hotelLocation}`,
    price,
    rating: parseFloat((3 + Math.random() * 2).toFixed(1)), // Рейтинг от 3 до 5
    stars,
    images,
    description,
    accommodationType,
    mealType,
    amenities,
    distanceToCenter: parseFloat((Math.random() * 10).toFixed(1)),
    latitude: lat,
    longitude: lng,
    coordinates: {
      lat,
      lng
    },
    reviews,
    hotelChain,
    hasSpecialOffers,
    country
  }
}

// Функция для генерации массива отелей
export function generateHotels(count: number, location?: string): Hotel[] {
  const hotels: Hotel[] = []

  for (let i = 1; i <= count; i++) {
    hotels.push(generateRandomHotel(i, location))
  }

  return hotels
}
