
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClientAuthProvider } from "@/components/ClientAuthProvider";
import { PlayerProvider } from "@/context/PlayerContext";
import { ProfileProvider } from "@/context/ProfileContext";
import ResponsiveNav from "@/components/BottomNav";
import { Metadata } from "next";
import AppWrapper from "@/components/AppWrapper";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import IOSInstallHint from "@/components/IOSInstallHint";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'SautiBox: African Voices, Endless Stories',
  description: 'Listen to stories in your local dialect!',
  manifest: '/manifest.json',
  themeColor: '#400AB9',
  appleWebApp: {
    capable: true,
    title: 'SautiBox: African Voices, Endless Stories',
    statusBarStyle: 'black-translucent',
  },
  // Optional: Add more PWA-related metadata
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Your App Name" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <ClientAuthProvider>
          <ProfileProvider>
            <PlayerProvider>
              <div className="bg-white min-h-screen relative text-black flex">
                {/* Responsive Navigation */}
                <ResponsiveNav />
                
                {/* Main Content Wrapper - adjusts based on screen size */}
                <AppWrapper>
                {children}
                </AppWrapper>
                <PWAInstallPrompt />
                <IOSInstallHint />
              </div>
            </PlayerProvider>
          </ProfileProvider>
        </ClientAuthProvider>
      </body>
    </html>
  );
}