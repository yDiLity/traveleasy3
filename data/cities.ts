export interface City {
  id: number;
  name: string;
  country: string;
  description: string;
  image: string;
  slug: string;
  popularDestination: boolean;
}

export const cities: City[] = [
  {
    id: 1,
    name: 'Москва',
    country: 'Россия',
    description: 'Столица России, крупнейший по численности населения город страны и один из крупнейших городов мира.',
    image: 'https://images.pexels.com/photos/236294/pexels-photo-236294.jpeg',
    slug: 'moscow',
    popularDestination: true
  },
  {
    id: 2,
    name: 'Санкт-Петербург',
    country: 'Россия',
    description: 'Культурная столица России, город с богатой историей и архитектурой.',
    image: 'https://images.pexels.com/photos/5146463/pexels-photo-5146463.jpeg',
    slug: 'saint-petersburg',
    popularDestination: true
  },
  {
    id: 3,
    name: 'Сочи',
    country: 'Россия',
    description: 'Курортный город на Черном море, популярное место для отдыха и спорта.',
    image: '/images/cities/sochi.jpg',
    slug: 'sochi',
    popularDestination: true
  },
  {
    id: 4,
    name: 'Казань',
    country: 'Россия',
    description: 'Столица Республики Татарстан, город с богатым культурным наследием.',
    image: 'https://images.pexels.com/photos/1486577/pexels-photo-1486577.jpeg',
    slug: 'kazan',
    popularDestination: true
  },
  {
    id: 5,
    name: 'Калининград',
    country: 'Россия',
    description: 'Самый западный город России, расположенный на побережье Балтийского моря.',
    image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    slug: 'kaliningrad',
    popularDestination: true
  },
  {
    id: 6,
    name: 'Владивосток',
    country: 'Россия',
    description: 'Крупный портовый город на Дальнем Востоке России, конечная точка Транссибирской магистрали.',
    image: 'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg',
    slug: 'vladivostok',
    popularDestination: false
  },
  {
    id: 7,
    name: 'Екатеринбург',
    country: 'Россия',
    description: 'Четвертый по численности населения город России, важный промышленный и культурный центр.',
    image: 'https://images.pexels.com/photos/2901216/pexels-photo-2901216.jpeg',
    slug: 'ekaterinburg',
    popularDestination: false
  },
  {
    id: 8,
    name: 'Нижний Новгород',
    country: 'Россия',
    description: 'Город с богатой историей, расположенный на слиянии рек Оки и Волги.',
    image: 'https://images.pexels.com/photos/2901217/pexels-photo-2901217.jpeg',
    slug: 'nizhny-novgorod',
    popularDestination: false
  }
];

export const getPopularCities = (): City[] => {
  return cities.filter(city => city.popularDestination);
};

export const getCityBySlug = (slug: string): City | undefined => {
  return cities.find(city => city.slug === slug);
};

export const getAllCities = (): City[] => {
  return cities;
};
