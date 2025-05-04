import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n/settings';

// Функция для получения локали из куки
export function getLocale(request: NextRequest) {
  // Проверяем локаль в URL
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) return pathnameLocale;

  // Используем локаль по умолчанию
  return defaultLocale;
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Пропускаем API и статические файлы
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Получаем локаль
  const locale = getLocale(request);
  const pathnameHasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  // Если локаль уже есть в URL, пропускаем
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Если локаль по умолчанию, не добавляем префикс
  if (locale === defaultLocale) {
    return NextResponse.next();
  }

  // Добавляем локаль в URL
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Применяем middleware ко всем маршрутам
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
