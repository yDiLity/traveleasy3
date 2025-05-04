import type { Metadata } from "next";
import Link from "next/link";
import { AuthProvider } from "@/components/auth-provider";
import { AuthButtons } from "@/components/auth-buttons";
import { FavoritesProvider } from "@/context/favorites-context";
// import { RecentlyViewedProvider } from "@/context/recently-viewed-context";
import { LanguageSwitcher } from "@/components/language-switcher";
// import { NextIntlClientProvider, useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/settings";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { MainNavigation } from "@/components/main-navigation";
// import { MobileNavigation } from "@/components/mobile-navigation";
import { Footer } from "@/components/footer";
import { LoadingIndicator } from "@/components/loading-indicator";
import { PageTransition } from "@/components/page-transition";
import { PerformanceMonitor } from "@/components/performance-monitor";
import { SkipToContent } from "@/components/skip-to-content";
import "../leaflet.css";

// Метаданные будут динамически генерироваться в зависимости от локали
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  // Загружаем сообщения для выбранной локали
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    return {
      title: "Trevelease",
      description: "Hotel search service",
    };
  }

  return {
    title: locale === 'ru'
      ? "Trevelease - Поиск отелей"
      : "Trevelease - Hotel Search",
    description: locale === 'ru'
      ? "Сервис подбора отелей для туристов. Сравнивайте цены, читайте отзывы и бронируйте лучшие отели."
      : "Hotel selection service for tourists. Compare prices, read reviews and book the best hotels.",
  };
};

// Генерируем статические параметры для всех поддерживаемых локалей
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Проверяем, поддерживается ли локаль
  if (!locales.includes(locale)) {
    notFound();
  }

  // Загружаем сообщения для выбранной локали
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <div className="min-h-screen bg-transparent">
          <AuthProvider>
            <ThemeProvider>
                <FavoritesProvider>
                    <PerformanceMonitor />
                    <LoadingIndicator />
                    {/* <SkipToContent /> */}
                  <header className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                          <Link href={`/${locale}`} className="text-xl font-bold text-primary dark:text-primary">
                            Trevelease
                          </Link>
                        </div>
                        <MainNavigation
                          locale={locale}
                          translations={{
                            home: messages?.common?.home || "Главная",
                            hotels: messages?.common?.hotels || "Отели"
                          }}
                        />
                        <div className="hidden md:flex items-center space-x-4">
                          <ThemeToggle />
                          <LanguageSwitcher />
                          <AuthButtons />
                        </div>
                        <div className="md:hidden">
                          <button className="text-gray-700 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="3" y1="12" x2="21" y2="12"></line>
                              <line x1="3" y1="6" x2="21" y2="6"></line>
                              <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </header>

                  <main id="main-content" tabIndex={-1} className="min-h-screen bg-transparent outline-none">
                    {children}
                  </main>

                  <Footer />
                </FavoritesProvider>
            </ThemeProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
