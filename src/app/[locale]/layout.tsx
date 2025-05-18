import {notFound} from 'next/navigation';
import {Locale, hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {clsx} from 'clsx';
import {routing} from '@/i18n/routing';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import {ReactNode} from 'react';

import { ClientAuthProvider } from "@/components/ClientAuthProvider";
import { PlayerProvider } from "@/context/PlayerContext";
import { ProfileProvider } from "@/context/ProfileContext";
import ResponsiveNav from "@/components/BottomNav";
import { Metadata } from "next";
import AppWrapper from "@/components/AppWrapper";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import IOSInstallHint from "@/components/IOSInstallHint";
import { ThemeProvider } from 'next-themes';
import LanguageSelectionModal from '@/components/LanguageSelectionModal';
import GoogleAnalytics from '@/components/GoogleAnalytics';
// import { OfflineProvider } from '@/components/OfflineProvider';
// import OfflineManager from '@/components/offline-manager';
import NextTopLoader from 'nextjs-toploader';
import NotificationDisplay from '@/components/NotificationDisplay';
import { NotificationProvider } from '@/context/NotificationContext';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

type Props = {
  children: ReactNode;
  params: Promise<{locale: Locale}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata(props: Omit<Props, 'children'>) {
  const {locale} = await props.params;

  const t = await getTranslations({locale, namespace: 'LocaleLayout'});

  return {
    title: t('title'),
    description:  t('description'),
    manifest: '/manifest.json',
    // themeColor: '#400AB9',
    appleWebApp: {
      capable: true,
      title: t('title'),
      statusBarStyle: 'black-translucent',
    },
    // Optional: Add more PWA-related metadata
    // viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    icons: {
      icon: '/icons/icon-192x192.png',
      apple: '/icons/icon-192x192.png',
    },
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: 'SautiBox: African Voices, Endless Stories',
//   description: 'Listen to stories in your local dialect!',
//   manifest: '/manifest.json',
//   themeColor: '#400AB9',
//   appleWebApp: {
//     capable: true,
//     title: 'SautiBox: African Voices, Endless Stories',
//     statusBarStyle: 'black-translucent',
//   },
//   // Optional: Add more PWA-related metadata
//   viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
//   icons: {
//     icon: '/icons/icon-192x192.png',
//     apple: '/icons/icon-192x192.png',
//   },
// }

export default async function RootLocaleLayout({
  children,
  params
}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SautiBox: African Voices, Endless Stories" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <GoogleAnalytics />
        {/* <OfflineManager/> */}
        <ThemeProvider>
          <NextIntlClientProvider>
            <ClientAuthProvider>
              <ProfileProvider>
                <PlayerProvider>
                  <NextTopLoader
                    color="rgb(65, 17, 197)"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={3}
                    crawl={true}
                    showSpinner={false}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px rgb(65, 17, 197),0 0 5px rgb(65, 17, 197)"
                  />
                  <div className="bg-gray-900 relative text-black flex">
                  <LanguageSelectionModal />
                    {/* Responsive Navigation */}
                    <ResponsiveNav />
                    
                    {/* Main Content Wrapper - adjusts based on screen size */}
                    <AppWrapper>
                      {/* <OfflineProvider> */}
                       <NotificationProvider>
                    {children}
                    <NotificationDisplay />
                    <ServiceWorkerRegister />
                    </NotificationProvider>
                    {/* </OfflineProvider> */}
                    </AppWrapper>

                    <PWAInstallPrompt />
                    <IOSInstallHint />
                  </div>
                </PlayerProvider>
              </ProfileProvider>
            </ClientAuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}