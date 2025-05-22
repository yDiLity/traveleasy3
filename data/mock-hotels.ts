import { Hotel } from '@/types/hotel'
import { generateHotels } from '@/utils/hotel-generator'

// Функция для получения мок-данных отелей
export function getMockHotels(location: string): Hotel[] {
  // Генерируем 50 отелей с помощью нашего генератора
  return generateHotels(50, location);

  // Старые мок-данные оставлены для справки
  /*
  return [
    // Премиум отели (5 звезд)
    {
      id: 1,
      name: 'Four Seasons Hotel Moscow',
      location: location,
      address: 'ул. Охотный ряд, 2, ' + location,
      price: 72000,
      rating: 4.9,
      stars: 5,
      images: ['/images/hotels/four-seasons-moscow.jpg', '/images/hotels/four-seasons-moscow-2.jpg', '/images/hotels/four-seasons-moscow-3.jpg'],
      description: 'Роскошный отель в самом центре Москвы, всего в 5 минутах ходьбы от Красной площади. Прекрасный вид на исторический центр города.',
      accommodationType: 'hotel',
      mealType: 'breakfast',
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
      distanceToCenter: 0.5,
      latitude: 55.7558,
      longitude: 37.6173,
      reviews: [
        {
          id: 101,
          author: 'Иван П.',
          rating: 5,
          comment: 'Отличный отель, прекрасное обслуживание!',
          date: '2025-03-15'
        },
        {
          id: 102,
          author: 'Мария С.',
          rating: 4,
          comment: 'Хороший отель, но завтрак мог бы быть лучше.',
          date: '2025-02-20'
        }
      ],
      hotelChain: 'Four Seasons',
      hasSpecialOffers: true
    },
    {
      id: 2,
      name: 'Swissôtel Resort Сочи Камелия',
      location: location,
      address: 'Курортный проспект, 89, ' + location,
      price: 45000,
      rating: 4.8,
      stars: 5,
      images: ['/images/hotels/swissotel-sochi.jpg', '/images/hotels/swissotel-sochi-2.jpg', '/images/hotels/swissotel-sochi-3.jpg'],
      description: 'Прекрасный курортный отель на берегу моря с собственным пляжем, спа-центром и несколькими ресторанами.',
      accommodationType: 'resort',
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
      distanceToCenter: 3.2,
      latitude: 43.5992,
      longitude: 39.7257,
      reviews: [
        {
          id: 201,
          author: 'Алексей К.',
          rating: 5,
          comment: 'Потрясающий вид на море, отличный сервис!',
          date: '2025-04-01'
        }
      ],
      hotelChain: 'Swissôtel',
      hasSpecialOffers: false
    },
    {
      id: 3,
      name: 'Lotte Hotel Moscow',
      location: location,
      address: 'Новинский бульвар, 8с2, ' + location,
      price: 65000,
      rating: 4.9,
      stars: 5,
      images: ['/images/hotels/lotte-hotel-moscow.jpg', '/images/hotels/lotte-hotel-moscow-2.jpg'],
      description: 'Роскошный отель в центре Москвы с панорамным видом на город, спа-центром и несколькими ресторанами высокой кухни.',
      accommodationType: 'hotel',
      mealType: 'breakfast',
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
      distanceToCenter: 1.8,
      latitude: 55.7558,
      longitude: 37.5819,
      reviews: [
        {
          id: 301,
          author: 'Елена В.',
          rating: 5,
          comment: 'Безупречный сервис и комфорт на высшем уровне!',
          date: '2025-03-10'
        }
      ],
      hotelChain: 'Lotte Hotels & Resorts',
      hasSpecialOffers: true
    },

    // Отели бизнес-класса (4 звезды)
    {
      id: 4,
      name: 'Novotel Moscow Centre',
      location: location,
      address: 'ул. Новослободская, 23, ' + location,
      price: 18500,
      rating: 4.5,
      stars: 4,
      images: ['/images/hotels/novotel-moscow.jpg', '/images/hotels/novotel-moscow-2.jpg'],
      description: 'Современный бизнес-отель в центре города с удобным расположением рядом с метро и основными достопримечательностями.',
      accommodationType: 'hotel',
      mealType: 'breakfast',
      amenities: {
        wifi: true,
        parking: true,
        pool: false,
        gym: true,
        restaurant: true,
        spa: false,
        airConditioning: true,
        petFriendly: false,
        conferenceRoom: true,
        transfer: false
      },
      distanceToCenter: 2.5,
      latitude: 55.7833,
      longitude: 37.5946,
      reviews: [
        {
          id: 401,
          author: 'Дмитрий Н.',
          rating: 4,
          comment: 'Отличное расположение, чистые номера, хороший завтрак.',
          date: '2025-02-15'
        }
      ],
      hotelChain: 'Accor',
      hasSpecialOffers: true
    },
    {
      id: 5,
      name: 'Radisson Blu Resort & Congress Centre',
      location: location,
      address: 'Голубая ул., 1А, Адлер, ' + location,
      price: 22000,
      rating: 4.6,
      stars: 4,
      images: ['/images/hotels/radisson-sochi.jpg', '/images/hotels/radisson-sochi-2.jpg'],
      description: 'Современный курортный отель с конгресс-центром, расположенный на берегу Черного моря в Олимпийском парке.',
      accommodationType: 'resort',
      mealType: 'half-board',
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
      distanceToCenter: 5.0,
      latitude: 43.4103,
      longitude: 39.9553,
      reviews: [
        {
          id: 501,
          author: 'Ольга М.',
          rating: 5,
          comment: 'Прекрасный отель с отличным пляжем и разнообразным питанием.',
          date: '2025-05-10'
        }
      ],
      hotelChain: 'Radisson',
      hasSpecialOffers: false
    },
    {
      id: 6,
      name: 'Holiday Inn Moscow Sokolniki',
      location: location,
      address: 'ул. Русаковская, 24, ' + location,
      price: 15000,
      rating: 4.4,
      stars: 4,
      images: ['/images/hotels/holiday-inn-moscow.jpg', '/images/hotels/holiday-inn-moscow-2.jpg'],
      description: 'Комфортабельный отель рядом с парком Сокольники и выставочным центром, удобно расположен рядом с метро.',
      accommodationType: 'hotel',
      mealType: 'breakfast',
      amenities: {
        wifi: true,
        parking: true,
        pool: false,
        gym: true,
        restaurant: true,
        spa: false,
        airConditioning: true,
        petFriendly: false,
        conferenceRoom: true,
        transfer: false
      },
      distanceToCenter: 4.0,
      latitude: 55.7892,
      longitude: 37.6778,
      reviews: [
        {
          id: 601,
          author: 'Сергей К.',
          rating: 4,
          comment: 'Хороший отель для бизнес-поездок, удобное расположение.',
          date: '2025-01-20'
        }
      ],
      hotelChain: 'IHG',
      hasSpecialOffers: true
    },

    // Отели среднего класса (3 звезды)
    {
      id: 7,
      name: 'Ibis Moscow Centre Bakhrushina',
      location: location,
      address: 'ул. Бахрушина, 11, ' + location,
      price: 8500,
      rating: 4.2,
      stars: 3,
      images: ['/images/hotels/ibis-moscow.jpg', '/images/hotels/ibis-moscow-2.jpg'],
      description: 'Современный отель в историческом центре Москвы, в нескольких минутах ходьбы от Павелецкого вокзала и метро.',
      accommodationType: 'hotel',
      mealType: 'breakfast',
      amenities: {
        wifi: true,
        parking: false,
        pool: false,
        gym: false,
        restaurant: true,
        spa: false,
        airConditioning: true,
        petFriendly: true,
        conferenceRoom: false,
        transfer: false
      },
      distanceToCenter: 2.0,
      latitude: 55.7342,
      longitude: 37.6351,
      reviews: [
        {
          id: 701,
          author: 'Анна Л.',
          rating: 4,
          comment: 'Чистый, уютный отель с хорошим расположением.',
          date: '2025-03-05'
        }
      ],
      hotelChain: 'Accor',
      hasSpecialOffers: false
    },
    {
      id: 8,
      name: 'Park Inn by Radisson Sochi City Centre',
      location: location,
      address: 'ул. Горького, 56, ' + location,
      price: 12000,
      rating: 4.3,
      stars: 3,
      images: ['/images/hotels/park-inn-sochi.jpg', '/images/hotels/park-inn-sochi-2.jpg'],
      description: 'Современный отель в центре Сочи, в нескольких минутах ходьбы от пляжа и основных достопримечательностей.',
      accommodationType: 'hotel',
      mealType: 'breakfast',
      amenities: {
        wifi: true,
        parking: true,
        pool: false,
        gym: true,
        restaurant: true,
        spa: false,
        airConditioning: true,
        petFriendly: false,
        conferenceRoom: true,
        transfer: false
      },
      distanceToCenter: 0.8,
      latitude: 43.5855,
      longitude: 39.7231,
      reviews: [
        {
          id: 801,
          author: 'Максим П.',
          rating: 4,
          comment: 'Отличное расположение, приветливый персонал.',
          date: '2025-04-15'
        }
      ],
      hotelChain: 'Radisson',
      hasSpecialOffers: true
    },
    {
      id: 9,
      name: 'City Apartments',
      location: location,
      address: 'Невский проспект, 55, ' + location,
      price: 7500,
      rating: 4.2,
      stars: 3,
      images: ['/images/hotels/park-inn-sochi.jpg', '/images/hotels/park-inn-sochi-2.jpg'],
      description: 'Современные апартаменты в центре города с полностью оборудованной кухней и всеми удобствами для комфортного проживания.',
      accommodationType: 'apartment',
      mealType: 'none',
      amenities: {
        wifi: true,
        parking: false,
        pool: false,
        gym: false,
        restaurant: false,
        spa: false,
        airConditioning: true,
        petFriendly: true,
        conferenceRoom: false,
        transfer: false
      },
      distanceToCenter: 1.0,
      latitude: 59.9343,
      longitude: 30.3351,
      reviews: [
        {
          id: 901,
          author: 'Татьяна С.',
          rating: 4,
          comment: 'Отличные апартаменты в самом центре, есть все необходимое.',
          date: '2025-02-28'
        }
      ],
      hotelChain: null,
      hasSpecialOffers: true
    },

    // Бюджетные варианты (2 звезды)
    {
      id: 10,
      name: 'Хостел Friends',
      location: location,
      address: 'ул. Тверская, 30, ' + location,
      price: 2500,
      rating: 4.0,
      stars: 2,
      images: ['/images/hotels/hostel-friends.jpg'],
      description: 'Уютный хостел в центре города с общей кухней и гостиной. Идеальный вариант для бюджетных путешественников.',
      accommodationType: 'hostel',
      mealType: 'none',
      amenities: {
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
      },
      distanceToCenter: 1.5,
      latitude: 55.7702,
      longitude: 37.5978,
      reviews: [
        {
          id: 1001,
          author: 'Игорь М.',
          rating: 4,
          comment: 'Чисто, уютно, отличное расположение для такой цены.',
          date: '2025-03-20'
        }
      ],
      hotelChain: null,
      hasSpecialOffers: false
    },
    {
      id: 11,
      name: 'Гостевой дом "У моря"',
      location: location,
      address: 'ул. Морская, 15, ' + location,
      price: 4500,
      rating: 4.1,
      stars: 2,
      images: ['/images/hotels/guesthouse-sea.jpg', '/images/hotels/guesthouse-sea-2.jpg'],
      description: 'Уютный гостевой дом в 5 минутах ходьбы от пляжа. Домашняя атмосфера и приветливый персонал.',
      accommodationType: 'guesthouse',
      mealType: 'breakfast',
      amenities: {
        wifi: true,
        parking: true,
        pool: false,
        gym: false,
        restaurant: false,
        spa: false,
        airConditioning: true,
        petFriendly: true,
        conferenceRoom: false,
        transfer: false
      },
      distanceToCenter: 3.0,
      latitude: 43.5722,
      longitude: 39.7361,
      reviews: [
        {
          id: 1101,
          author: 'Наталья К.',
          rating: 4,
          comment: 'Очень уютно, как дома. Хозяева очень гостеприимные.',
          date: '2025-05-05'
        }
      ],
      hotelChain: null,
      hasSpecialOffers: true
    },

    // Люкс-виллы и апартаменты
    {
      id: 12,
      name: 'Вилла "Панорама"',
      location: location,
      address: 'ул. Горная, 25, ' + location,
      price: 120000,
      rating: 4.9,
      stars: 5,
      images: ['/images/hotels/villa-panorama.jpg', '/images/hotels/villa-panorama-2.jpg'],
      description: 'Роскошная вилла с панорамным видом на море, частным бассейном и всеми удобствами для незабываемого отдыха.',
      accommodationType: 'villa',
      mealType: 'none',
      amenities: {
        wifi: true,
        parking: true,
        pool: true,
        gym: true,
        restaurant: false,
        spa: true,
        airConditioning: true,
        petFriendly: true,
        conferenceRoom: false,
        transfer: true
      },
      distanceToCenter: 5.0,
      latitude: 43.5603,
      longitude: 39.7649,
      reviews: [
        {
          id: 1201,
          author: 'Александр Д.',
          rating: 5,
          comment: 'Потрясающая вилла с невероятным видом! Отдых был незабываемым.',
          date: '2025-04-25'
        }
      ],
      hotelChain: null,
      hasSpecialOffers: false
    },
    {
      id: 13,
      name: 'Премиум Апартаменты в Москва-Сити',
      location: location,
      address: 'Пресненская набережная, 12, ' + location,
      price: 35000,
      rating: 4.7,
      stars: 5,
      images: ['/images/hotels/premium-apartments.jpg', '/images/hotels/premium-apartments-2.jpg'],
      description: 'Роскошные апартаменты в небоскребе Москва-Сити с панорамным видом на город и всеми удобствами премиум-класса.',
      accommodationType: 'apartment',
      mealType: 'none',
      amenities: {
        wifi: true,
        parking: true,
        pool: true,
        gym: true,
        restaurant: false,
        spa: false,
        airConditioning: true,
        petFriendly: false,
        conferenceRoom: false,
        transfer: true
      },
      distanceToCenter: 4.0,
      latitude: 55.7473,
      longitude: 37.5377,
      reviews: [
        {
          id: 1301,
          author: 'Виктория Л.',
          rating: 5,
          comment: 'Потрясающий вид из окна, современный дизайн, все продумано до мелочей.',
          date: '2025-03-30'
        }
      ],
      hotelChain: null,
      hasSpecialOffers: true
    },

    // Спа-отели и курорты
    {
      id: 14,
      name: 'Mriya Resort & Spa',
      location: location,
      address: 'пгт. Парковое, ' + location,
      price: 55000,
      rating: 4.8,
      stars: 5,
      images: ['/images/hotels/mriya-resort.jpg', '/images/hotels/mriya-resort-2.jpg'],
      description: 'Роскошный спа-курорт на берегу Черного моря с огромной территорией, несколькими бассейнами и спа-центром мирового уровня.',
      accommodationType: 'resort',
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
      latitude: 44.4153,
      longitude: 34.0872,
      reviews: [
        {
          id: 1401,
          author: 'Екатерина В.',
          rating: 5,
          comment: 'Лучший курорт в Крыму! Потрясающий сервис и инфраструктура.',
          date: '2025-06-10'
        }
      ],
      hotelChain: 'Mriya Resort',
      hasSpecialOffers: false
    },
    {
      id: 15,
      name: 'Altay Resort',
      location: location,
      address: 'с. Урлу-Аспак, ' + location,
      price: 42000,
      rating: 4.7,
      stars: 5,
      images: ['/images/hotels/altay-resort.jpg', '/images/hotels/altay-resort-2.jpg'],
      description: 'Эко-курорт премиум-класса в горах Алтая с уникальными спа-процедурами на основе местных трав и минералов.',
      accommodationType: 'resort',
      mealType: 'full-board',
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
      distanceToCenter: 25.0,
      latitude: 51.6542,
      longitude: 85.6675,
      reviews: [
        {
          id: 1501,
          author: 'Михаил С.',
          rating: 5,
          comment: 'Уникальное место для отдыха и восстановления сил. Потрясающая природа и сервис.',
          date: '2025-05-15'
        }
      ],
      hotelChain: null,
      hasSpecialOffers: true
    }
  ]
  */
}
