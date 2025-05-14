'use client'
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };
    
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    
    // Set initial state
    handleStatusChange();
    
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return isOffline;
}
