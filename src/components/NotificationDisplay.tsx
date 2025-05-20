// // components/NotificationDisplay.tsx
// 'use client';

// import { useNotification } from '@/context/NotificationContext';

// export default function NotificationDisplay() {
//   const { notification, clearNotification } = useNotification();

//   if (!notification) return null;

//   return (
//     <div className="fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg max-w-xs z-50">
//       <h3 className="font-bold">{notification.title}</h3>
//       <p className="text-sm">{notification.body}</p>
//       <button 
//         onClick={clearNotification}
//         className="mt-2 text-xs text-blue-500"
//       >
//         Dismiss
//       </button>
//     </div>
//   );
// }