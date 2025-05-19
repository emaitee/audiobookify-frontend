// lib/pushService.ts
import { type PushSubscription } from 'web-push';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function subscribeToPushNotifications(userId: string): Promise<PushSubscription> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported');
  }

  const registration = await navigator.serviceWorker.ready;
  const rawSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.VAPID_PUBLIC_KEY,
  });

  const subscription: PushSubscription = {
    ...rawSubscription,
    keys: {
      p256dh: rawSubscription.toJSON().keys?.p256dh || '',
      auth: rawSubscription.toJSON().keys?.auth || '',
    },
  };

  // Send subscription to backend
  const response = await fetch(`${API_BASE_URL}/api/subscriptions/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save subscription');
  }

  return subscription;
}

export async function unsubscribeFromPushNotifications(endpoint: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint }),
  });

  if (!response.ok) {
    throw new Error('Failed to unsubscribe');
  }

  // Unsubscribe from browser push
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
  }
}

export async function registerFcmToken(token: string, userId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions/register-fcm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to register FCM token');
  }
}