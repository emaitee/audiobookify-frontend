'use client';

import { ArrowUp, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';


export default function IOSInstallHint() {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isStandalone && !(navigator as any).standalone) {
      const timer = setTimeout(() => {
        const wasDismissed = localStorage.getItem('iosHintDismissed');
        if (wasDismissed !== 'true') {
          setIsVisible(true);
        }
      }, 15000); // Show after 15 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('iosHintDismissed', 'true');
  };

  if (!isVisible || dismissed) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-white p-3 rounded-full shadow-xl border border-gray-300 z-40 animate-bounce">
      {/* <div className="relative">
        <div className="absolute -top-8 -left-4 text-sm bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
          Tap <PlusIcon className="inline ml-1" /> then "Add to Home Screen"
        </div>
        <ArrowUp className="text-gray-800 text-xl" />
      </div> */}
    </div>
  );
}