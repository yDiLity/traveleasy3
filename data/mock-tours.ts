import { Hotel } from '@/types/hotel'

export interface Tour {
  id: number
  name: string
  hotel: Hotel
  price: number
  duration: number // в днях
  departureDate: string
  returnDate: string
  airline: {
    name: string
    logo: string
    rating: number
  }
  departureCity: string
  isAllInclusive: boolean
  isPrivate: boolean
  maxGuests: number
  description: string
  included: string[]
  excluded: string[]
  images: string[]
}

// Функция для получения мок-данных туров
export function getMockTours(location: string): Tour[] {
  // Получаем отели для использования в турах
  const hotels = getMockHotels(location)
  
  return [
    {
      id: 1,
      name: 'Роскошный отдых в Сочи',
      hotel: hotels.find(h => h.name.includes('Swissôtel')) || hotels[0],
      price: 800000,
      duration: 7,
      departureDate: '2025-06-15',
      returnDate: '2025-06-22',
      airline: {
        name: 'Аэрофлот',
        logo: '/images/airlines/aeroflot.svg',
        rating: 4.5
      },
      departureCity: 'Москва',
      isAllInclusive: true,
      isPrivate: true,
      maxGuests: 2,
      description: 'Эксклюзивный частный тур с проживанием в роскошном отеле Swissôtel Resort Сочи Камелия. Включает VIP-трансфер, персонального консьержа и индивидуальную экскурсионную программу.',
      included: [
        'Проживание в люкс-номере с видом на море',
        'Питание "всё включено" премиум-класса',
        'VIP-трансфер на автомобиле представительского класса',
        'Персональный консьерж 24/7',
        'Индивидуальная экскурсионная программа',
        'Спа-процедуры',
        'Авиаперелет бизнес-классом',
        'Медицинская страховка'
      ],
      excluded: [
        'Дополнительные экскурсии вне программы',
        'Личные расходы',
        'Чаевые'
      ],
      images: [
        '/images/tours/sochi-luxury-1.jpg',
        '/images/tours/sochi-luxury-2.jpg',
        '/images/tours/sochi-luxury-3.jpg'
      ]
    },
    {
      id: 2,
      name: 'VIP-отдых в Крыму',
      hotel: hotels.find(h => h.name.includes('Вилла')) || hotels[1],
      price: 650000,
      duration: 10,
      departureDate: '2025-07-10',
      returnDate: '2025-07-20',
      airline: {
        name: 'S7 Airlines',
        logo: '/images/airlines/s7.svg',
        rating: 4.3
      },
      departureCity: 'Москва',
      isAllInclusive: true,
      isPrivate: true,
      maxGuests: 4,
      description: 'Частный тур для семьи или компании друзей с проживанием в роскошной вилле с собственным бассейном и панорамным видом на море. Включает все питание, трансферы и экскурсии.',
      included: [
        'Проживание в частной вилле с бассейном',
        'Питание "всё включено" с личным шеф-поваром',
        'Трансфер на автомобиле представительского класса',
        'Индивидуальные экскурсии по Крыму',
        'Морские прогулки на яхте',
        'Авиаперелет бизнес-классом',
        'Медицинская страховка'
      ],
      excluded: [
        'Дополнительные экскурсии вне программы',
        'Личные расходы',
        'Чаевые'
      ],
      images: [
        '/images/tours/crimea-vip-1.jpg',
        '/images/tours/crimea-vip-2.jpg',
        '/images/tours/crimea-vip-3.jpg'
      ]
    },
    {
      id: 3,
      name: 'Премиум-тур в Москву',
      hotel: hotels.find(h => h.name.includes('Four Seasons')) || hotels[2],
      price: 750000,
      duration: 5,
      departureDate: '2025-05-20',
      returnDate: '2025-05-25',
      airline: {
        name: 'Победа',
        logo: '/images/airlines/pobeda.svg',
        rating: 3.8
      },
      departureCity: 'Санкт-Петербург',
      isAllInclusive: true,
      isPrivate: true,
      maxGuests: 2,
      description: 'Эксклюзивный тур в столицу России с проживанием в легендарном отеле Four Seasons Hotel Moscow. Включает VIP-экскурсии по историческим местам, посещение лучших ресторанов и театров.',
      included: [
        'Проживание в люкс-номере с видом на Кремль',
        'Питание в ресторанах премиум-класса',
        'VIP-трансфер на автомобиле представительского класса',
        'Персональный гид-историк',
        'Билеты в Большой театр (VIP-ложа)',
        'Экскурсия по Кремлю без очереди',
        'Авиаперелет бизнес-классом',
        'Медицинская страховка'
      ],
      excluded: [
        'Дополнительные экскурсии вне программы',
        'Личные расходы',
        'Чаевые'
      ],
      images: [
        '/images/tours/moscow-premium-1.jpg',
        '/images/tours/moscow-premium-2.jpg',
        '/images/tours/moscow-premium-3.jpg'
      ]
    },
    {
      id: 4,
      name: 'Роскошный отдых в Дубае',
      hotel: {
        id: 999,
        name: 'Burj Al Arab Jumeirah',
        location: 'Дубай',
        address: 'Jumeirah St, Дубай, ОАЭ',
        price: 120000,
        rating: 5.0,
        stars: 7,
        images: ['/images/hotels/burj-al-arab-1.jpg', '/images/hotels/burj-al-arab-2.jpg'],
        description: 'Легендарный семизвездочный отель, символ роскоши и богатства Дубая. Расположен на искусственном острове в 280 метрах от берега.',
        accommodationType: 'hotel',
        mealType: 'all-inclusive',
        amenities: {
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
        distanceToCenter: 15.0,
        latitude: 25.1412,
        longitude: 55.1853,
        reviews: [],
        hotelChain: 'Jumeirah',
        hasSpecialOffers: false
      },
      price: 1200000,
      duration: 7,
      departureDate: '2025-09-10',
      returnDate: '2025-09-17',
      airline: {
        name: 'Emirates',
        logo: '/images/airlines/emirates.svg',
        rating: 4.9
      },
      departureCity: 'Москва',
      isAllInclusive: true,
      isPrivate: true,
      maxGuests: 2,
      description: 'Ультра-роскошный тур в Дубай с проживанием в легендарном семизвездочном отеле Burj Al Arab Jumeirah. Включает VIP-сервис на всех этапах путешествия, персонального дворецкого и эксклюзивные развлечения.',
      included: [
        'Проживание в двухэтажном люкс-номере',
        'Питание "всё включено" в ресторанах отеля',
        'Трансфер на Rolls-Royce',
        'Персональный дворецкий 24/7',
        'Вертолетная экскурсия над Дубаем',
        'Сафари в пустыне на люксовых внедорожниках',
        'Шопинг-тур с персональным стилистом',
        'Авиаперелет первым классом',
        'VIP-страховка'
      ],
      excluded: [
        'Личные расходы',
        'Чаевые'
      ],
      images: [
        '/images/tours/dubai-luxury-1.jpg',
        '/images/tours/dubai-luxury-2.jpg',
        '/images/tours/dubai-luxury-3.jpg'
      ]
    }
  ]
}

// Импортируем функцию для получения отелей
import { getMockHotels } from './mock-hotels'
