// // context/NotificationContext.tsx
// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { requestFcmToken } from '@/lib/firebase';
// import { registerFcmToken, subscribeToPushNotifications, unsubscribeFromPushNotifications } from '@/app/utils/pushNotifications';

// type Notification = {
//   title: string;
//   body: string;
//   data?: any;
//   createdAt?: Date;
// };

// type NotificationContextType = {
//   notification: Notification | null;
//   permission: NotificationPermission;
//   isSubscribed: boolean;
//   subscribe: (userId: string) => Promise<void>;
//   unsubscribe: () => Promise<void>;
//   clearNotification: () => void;
// };

// const NotificationContext = createContext<NotificationContextType>({
//   notification: null,
//   permission: 'default',
//   isSubscribed: false,
//   subscribe: async () => {},
//   unsubscribe: async () => {},
//   clearNotification: () => {},
// });

// export function NotificationProvider({ children }: { children: React.ReactNode }) {
//   const [notification, setNotification] = useState<Notification | null>(null);
//   const [permission, setPermission] = useState<NotificationPermission>('default');
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   useEffect(() => {
//     // Check current permission status
//     if ('Notification' in window) {
//       setPermission(Notification.permission);
      
//       // Check existing subscription
//       checkSubscription();
//     }

//     // Listen for push events
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.addEventListener('message', (event) => {
//         if (event.data.type === 'NOTIFICATION') {
//           setNotification(event.data.notification);
//         }
//       });
//     }
//   }, []);

//   const checkSubscription = async () => {
//     const registration = await navigator.serviceWorker.ready;
//     const subscription = await registration.pushManager.getSubscription();
//     setIsSubscribed(!!subscription);
//   };

//   const subscribe = async (userId: string) => {
//     if (!('Notification' in window)) {
//       throw new Error('Notifications not supported');
//     }

//     // Request permission
//     const permissionResult = await Notification.requestPermission();
//     setPermission(permissionResult);

//     if (permissionResult !== 'granted') {
//       throw new Error('Permission not granted');
//     }

//     // Subscribe to push
//     await subscribeToPushNotifications(userId);
//     setIsSubscribed(true);

//     // Initialize FCM if needed
//     if (typeof window !== 'undefined' && 'firebase' in window) {
//       const token = await requestFcmToken();
//       if (token) {
//         await registerFcmToken(token, userId);
//       }
//     }
//   };

//   const unsubscribe = async () => {
//     const registration = await navigator.serviceWorker.ready;
//     const subscription = await registration.pushManager.getSubscription();
    
//     if (subscription) {
//       await unsubscribeFromPushNotifications(subscription.endpoint);
//       setIsSubscribed(false);
//     }
//   };

//   const clearNotification = () => setNotification(null);

//   return (
//     <NotificationContext.Provider
//       value={{
//         notification,
//         permission,
//         isSubscribed,
//         subscribe,
//         unsubscribe,
//         clearNotification,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// }

// export const useNotification = () => useContext(NotificationContext);