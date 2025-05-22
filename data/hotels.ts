import { City, cities } from './cities';

export interface Hotel {
  id: number;
  name: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  stars: number;
  images: string[];
  description: string;
  accommodationType: 'hotel' | 'apartment' | 'resort' | 'hostel' | 'villa' | 'guesthouse';
  mealType: 'breakfast' | 'half-board' | 'full-board' | 'all-inclusive' | 'none';
  amenities: {
    wifi: boolean;
    parking: boolean;
    pool: boolean;
    gym: boolean;
    restaurant: boolean;
    spa: boolean;
    airConditioning: boolean;
    petFriendly: boolean;
    conferenceRoom: boolean;
    transfer: boolean;
  };
  distanceToCenter: number;
  latitude: number;
  longitude: number;
  coordinates?: { lat: number; lng: number };
  reviews: any[];
  hotelChain: string | null;
  hasSpecialOffers: boolean;
  cityId?: number;
  country?: string;
}

export interface Review {
  id: number;
  userId?: number;
  userName?: string;
  author?: string;
  rating: number;
  comment: string;
  date: string;
}

// Функция для генерации отелей для каждого города
const generateHotelsForCity = (city: City, startId: number): Hotel[] => {
  const hotels: Hotel[] = [];

  // Базовые названия отелей
  const hotelNames = [
    'Grand Hotel',
    'Plaza',
    'Luxury Resort',
    'Comfort Inn',
    'City Center',
    'Royal Palace',
    'Business Hotel',
    'Seaside Resort',
    'Boutique Hotel',
    'Premium Suites'
  ];

  // Типы размещения
  const accommodationTypes: Array<Hotel['accommodationType']> = [
    'hotel', 'apartment', 'resort', 'hostel', 'villa'
  ];

  // Типы питания
  const mealTypes: Array<Hotel['mealType']> = [
    'breakfast', 'half-board', 'all-inclusive', 'none'
  ];

  // Сети отелей
  const hotelChains = [
    'Luxury Hotels', 'Comfort Hotels', 'Business Hotels', 'Premium Resorts', null
  ];

  // Генерируем 10 отелей для города
  for (let i = 0; i < 10; i++) {
    const id = startId + i;
    const stars = Math.floor(Math.random() * 3) + 3; // От 3 до 5 звезд
    const price = Math.floor((stars * 10000) + (Math.random() * 20000)); // Цена зависит от звезд
    const rating = (3.5 + (Math.random() * 1.5)).toFixed(1); // Рейтинг от 3.5 до 5.0
    const hasSpecialOffers = Math.random() > 0.7; // 30% отелей имеют спецпредложения

    // Генерируем случайные координаты вокруг центра города
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    // Базовые координаты для городов (примерные)
    let baseLat = 55.7558;
    let baseLng = 37.6173;

    switch(city.id) {
      case 1: // Москва
        baseLat = 55.7558;
        baseLng = 37.6173;
        break;
      case 2: // Санкт-Петербург
        baseLat = 59.9343;
        baseLng = 30.3351;
        break;
      case 3: // Сочи
        baseLat = 43.6028;
        baseLng = 39.7342;
        break;
      case 4: // Казань
        baseLat = 55.7887;
        baseLng = 49.1221;
        break;
      case 5: // Калининград
        baseLat = 54.7065;
        baseLng = 20.5109;
        break;
      case 6: // Владивосток
        baseLat = 43.1198;
        baseLng = 131.8869;
        break;
      case 7: // Екатеринбург
        baseLat = 56.8389;
        baseLng = 60.6057;
        break;
      case 8: // Нижний Новгород
        baseLat = 56.2965;
        baseLng = 43.9361;
        break;
    }

    // Генерируем отель
    const hotel: Hotel = {
      id,
      name: `${hotelNames[i]} ${city.name}`,
      location: city.name,
      address: `ул. Центральная, ${id}, ${city.name}`,
      price,
      rating: parseFloat(rating),
      stars,
      images: [
        `/images/hotels/hotel-moscow-1.svg`,
        `/images/hotels/hotel-moscow-2.svg`,
        `/images/hotels/hotel-moscow-3.svg`,
        `/images/hotels/hotel-moscow-4.svg`,
        `/images/hotels/hotel-moscow-5.svg`
      ],
      description: `Прекрасный ${stars}-звездочный отель в центре города ${city.name}. Отличный сервис и комфортные номера.`,
      accommodationType: accommodationTypes[Math.floor(Math.random() * accommodationTypes.length)],
      mealType: mealTypes[Math.floor(Math.random() * mealTypes.length)],
      amenities: {
        wifi: true,
        parking: Math.random() > 0.3,
        pool: stars >= 4 && Math.random() > 0.5,
        gym: stars >= 4 && Math.random() > 0.4,
        restaurant: stars >= 3 && Math.random() > 0.2,
        spa: stars >= 4 && Math.random() > 0.6,
        airConditioning: true,
        petFriendly: Math.random() > 0.7,
        conferenceRoom: stars >= 4 && Math.random() > 0.5,
        transfer: stars >= 4 && Math.random() > 0.6
      },
      distanceToCenter: parseFloat((Math.random() * 3).toFixed(1)),
      latitude: baseLat + latOffset,
      longitude: baseLng + lngOffset,
      reviews: [],
      hotelChain: hotelChains[Math.floor(Math.random() * hotelChains.length)],
      hasSpecialOffers,
      cityId: city.id
    };

    hotels.push(hotel);
  }

  return hotels;
};

// Генерируем отели для всех городов
const generateAllHotels = (): Hotel[] => {
  let allHotels: Hotel[] = [];
  let currentId = 1;

  cities.forEach(city => {
    const cityHotels = generateHotelsForCity(city, currentId);
    allHotels = [...allHotels, ...cityHotels];
    currentId += 10;
  });

  // Добавляем несколько премиум отелей и отелей со специальными предложениями
  // для гарантии их наличия на главной странице
  const premiumHotels = [
    {
      id: 1001,
      name: 'Plaza Москва',
      location: 'Москва',
      address: 'ул. Центральная, 1, Москва',
      price: 57947,
      rating: 4.9,
      stars: 5,
      images: [
        '/images/hotels/hotel-moscow-1.svg',
        '/images/hotels/hotel-moscow-2.svg',
        '/images/hotels/hotel-moscow-3.svg',
        '/images/hotels/hotel-moscow-4.svg',
        '/images/hotels/hotel-moscow-5.svg'
      ],
      description: 'Прекрасный 5-звездочный отель в центре города Москва. Отличный сервис и комфортные номера.',
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
        petFriendly: true,
        conferenceRoom: true,
        transfer: true
      },
      distanceToCenter: 0.5,
      latitude: 55.7558,
      longitude: 37.6173,
      reviews: [],
      hotelChain: 'Luxury Hotels',
      hasSpecialOffers: false,
      cityId: 1
    },
    {
      id: 1002,
      name: 'Royal Palace Москва',
      location: 'Москва',
      address: 'ул. Тверская, 5, Москва',
      price: 66297,
      rating: 4.8,
      stars: 5,
      images: [
        '/images/hotels/hotel-moscow-2.svg',
        '/images/hotels/hotel-moscow-3.svg',
        '/images/hotels/hotel-moscow-4.svg',
        '/images/hotels/hotel-moscow-5.svg',
        '/images/hotels/hotel-moscow-1.svg'
      ],
      description: 'Прекрасный 5-звездочный отель в центре города Москва. Отличный сервис и комфортные номера.',
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
        petFriendly: true,
        conferenceRoom: true,
        transfer: true
      },
      distanceToCenter: 0.3,
      latitude: 55.7558,
      longitude: 37.6173,
      reviews: [],
      hotelChain: 'Luxury Hotels',
      hasSpecialOffers: true,
      cityId: 1
    },
    {
      id: 1003,
      name: 'Luxury Resort Санкт-Петербург',
      location: 'Санкт-Петербург',
      address: 'ул. Невская, 10, Санкт-Петербург',
      price: 61390,
      rating: 4.7,
      stars: 5,
      images: [
        '/images/hotels/hotel-moscow-3.svg',
        '/images/hotels/hotel-moscow-4.svg',
        '/images/hotels/hotel-moscow-5.svg',
        '/images/hotels/hotel-moscow-1.svg',
        '/images/hotels/hotel-moscow-2.svg'
      ],
      description: 'Прекрасный 5-звездочный отель в центре города Санкт-Петербург. Отличный сервис и комфортные номера.',
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
        petFriendly: true,
        conferenceRoom: true,
        transfer: true
      },
      distanceToCenter: 0.7,
      latitude: 59.9343,
      longitude: 30.3351,
      reviews: [],
      hotelChain: 'Luxury Hotels',
      hasSpecialOffers: true,
      cityId: 2
    }
  ];

  // Добавляем премиум отели в общий список
  allHotels = [...allHotels, ...premiumHotels];

  return allHotels;
};

// Генерируем отели при импорте модуля
export const hotels = generateAllHotels();

// Функции для работы с отелями
export const getHotelsByCity = (cityId: number): Hotel[] => {
  return hotels.filter(hotel => hotel.cityId === cityId);
};

export const getHotelById = (id: number): Hotel | undefined => {
  return hotels.find(hotel => hotel.id === id);
};

export const getHotelsByStars = (stars: number): Hotel[] => {
  return hotels.filter(hotel => hotel.stars === stars);
};

export const getHotelsWithSpecialOffers = (): Hotel[] => {
  return hotels.filter(hotel => hotel.hasSpecialOffers);
};

export const getHotelsByType = (type: Hotel['accommodationType']): Hotel[] => {
  return hotels.filter(hotel => hotel.accommodationType === type);
};

export const getTopRatedHotels = (limit: number = 10): Hotel[] => {
  return [...hotels].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

export const getLuxuryHotels = (): Hotel[] => {
  return hotels.filter(hotel => hotel.stars === 5);
};

export const getResortHotels = (): Hotel[] => {
  return hotels.filter(hotel => hotel.accommodationType === 'resort');
};

export const getAllHotels = (): Hotel[] => {
  return hotels;
};
