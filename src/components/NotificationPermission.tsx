// components/NotificationPermission.tsx
'use client';

import { useEffect } from 'react';

export default function NotificationPermission() {
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  return null;
}