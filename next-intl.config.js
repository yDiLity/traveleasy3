module.exports = {
  // Локали, которые поддерживает приложение
  locales: ['ru', 'en'],
  
  // Локаль по умолчанию
  defaultLocale: 'ru',
  
  // Настройки для локализованных маршрутов
  localePrefix: 'as-needed',
  
  // Настройки для форматирования дат, чисел и т.д.
  formats: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      },
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    },
    number: {
      currency: {
        style: 'currency',
        currency: 'RUB'
      },
      percent: {
        style: 'percent'
      }
    }
  }
};
