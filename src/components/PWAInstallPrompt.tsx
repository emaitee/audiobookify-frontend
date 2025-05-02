'use client';

import { Apple, AppleIcon, ChromeIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';


export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user is on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone || (navigator as any).standalone) {
      return;
    }

    // Standard PWA installation prompt for Chrome/Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if previously dismissed
    const dismissedStatus = localStorage.getItem('pwaPromptDismissed');
    if (dismissedStatus !== 'true') {
      // For iOS, show after a delay (since there's no automatic prompt)
      if (/iphone|ipad|ipod/.test(userAgent)) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 10000); // Show after 10 seconds
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted install');
      }
      setDeferredPrompt(null);
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  if (!isVisible || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border border-gray-300 max-w-xs z-50">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X />
      </button>
      
      {isIOS ? (
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2 flex items-center justify-center">
            <AppleIcon className="mr-2" /> Install this App
          </h3>
          <p className="mb-3">For the best experience, add this app to your home screen:</p>
          <ol className="list-decimal text-left pl-5 mb-3 space-y-2">
            <li>Tap the <strong>Share</strong> button <span className="text-lg">⎋</span></li>
            <li>Select <strong>"Add to Home Screen"</strong></li>
            <li>Tap <strong>"Add"</strong> in the top right</li>
          </ol>
          <div className="bg-gray-100 p-2 rounded text-sm">
            Safari → Share → Add to Home Screen
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2 flex items-center justify-center">
            <ChromeIcon className="mr-2" /> Install App
          </h3>
          <p className="mb-3">Get the full experience by installing this app</p>
          <button
            onClick={handleInstallClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            Install Now
          </button>
        </div>
      )}
    </div>
  );
}