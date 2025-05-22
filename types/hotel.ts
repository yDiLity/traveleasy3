// Типы для представления данных об отелях

// Тип питания
export type MealType = 'none' | 'breakfast' | 'half-board' | 'full-board' | 'all-inclusive';

// Тип размещения
export type AccommodationType = 'hotel' | 'apartment' | 'hostel' | 'villa' | 'resort' | 'guesthouse';

// Удобства отеля
export interface HotelAmenities {
  wifi?: boolean;
  parking?: boolean;
  pool?: boolean;
  gym?: boolean;
  restaurant?: boolean;
  spa?: boolean;
  airConditioning?: boolean;
  petFriendly?: boolean;
  conferenceRoom?: boolean;
  transfer?: boolean;
}

// Отзыв об отеле
export interface HotelReview {
  id: string;
  hotelId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  categories: {
    location: number;
    cleanliness: number;
    service: number;
    value: number;
    comfort: number;
  };
  stayDate?: string;
  stayType?: StayType;
  response?: ReviewResponse;
  photos?: string[];
  verified: boolean;
}

// Ответ на отзыв
export interface ReviewResponse {
  id: string;
  reviewId: string;
  responderName: string;
  responderRole: string;
  comment: string;
  date: string;
}

// Тип поездки
export type StayType = 'business' | 'leisure' | 'family' | 'couple' | 'solo' | 'other';

// Тип избранного отеля
export interface FavoriteHotel {
  id: string;                    // Уникальный идентификатор записи в избранном
  userId: string;                // ID пользователя
  hotelId: number;               // ID отеля
  addedAt: string;               // Дата добавления в избранное
  hotel?: Hotel;                 // Данные отеля (опционально)
}

// Основной тип отеля
export interface Hotel {
  id: number;                    // Уникальный идентификатор отеля
  name: string;                  // Название отеля
  location: string;              // Местоположение
  address: string;               // Полный адрес
  price: number;                 // Цена за ночь
  rating: number;                // Рейтинг (от 1 до 5)
  stars: number;                 // Звездность отеля (от 1 до 5)
  images: string[];              // URL изображений
  description?: string;          // Описание отеля
  accommodationType: AccommodationType; // Тип размещения
  mealType: MealType;            // Тип питания
  amenities: HotelAmenities;     // Удобства
  distanceToCenter?: number;     // Расстояние до центра (в км)
  reviews?: HotelReview[];       // Отзывы
  hotelChain?: string;           // Принадлежность к сети отелей
  hasSpecialOffers?: boolean;    // Наличие специальных предложений
  latitude?: number;             // Широта для отображения на карте
  longitude?: number;            // Долгота для отображения на карте
  coordinates?: {
    lat: number;                  // Широта для использования в Google Maps
    lng: number;                  // Долгота для использования в Google Maps
  };
}