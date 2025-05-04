import Link from 'next/link'

interface MainNavigationProps {
  locale: string;
  translations: {
    home: string;
    hotels: string;
  };
}

export function MainNavigation({ locale, translations }: MainNavigationProps) {
  // Формируем пути с учетом локали
  const homeLink = locale ? `/${locale}` : '/'
  const hotelsLink = locale ? `/${locale}/hotels` : '/hotels'

  return (
    <nav className="hidden md:flex space-x-8">
      <Link
        href={homeLink}
        className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
      >
        {translations.home}
      </Link>
      <Link
        href={hotelsLink}
        className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
      >
        {translations.hotels}
      </Link>
    </nav>
  )
}
