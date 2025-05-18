// components/NotificationPrompt.tsx
'use client';

import { useNotification } from '@/context/NotificationContext';
import { useEffect } from 'react';

export default function NotificationPrompt() {
  const { permission, subscribe, isSubscribed, unsubscribe } = useNotification();

  const handleSubscribe = async () => {
    try {
      // Replace with actual user ID
      await subscribe('user-id-123');
      alert('Push notifications enabled!');
    } catch (error) {
      console.error('Error enabling notifications:', error);
      alert(`Failed to enable notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe();
      alert('Push notifications disabled!');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      alert(`Failed to disable notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (permission === 'granted') {
    return (
      <div>
        {isSubscribed ? (
          <button 
            onClick={handleUnsubscribe}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Disable Push Notifications
          </button>
        ) : (
          <button 
            onClick={handleSubscribe}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Enable Push Notifications
          </button>
        )}
      </div>
    );
  }

  return null;
}