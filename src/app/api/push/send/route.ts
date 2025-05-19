// import { VAPID } from '@/config';
// import webPush from 'web-push';
// import { NextResponse } from 'next/server';

// webPush.setVapidDetails(
//   VAPID.subject,
//   VAPID.publicKey,
//   VAPID.privateKey
// );

// export async function POST(request: Request) {
//   // Verify authorization
//   const authHeader = request.headers.get('authorization');
//   if (authHeader !== `Bearer ${process.env.API_SECRET}`) {
//     return NextResponse.json(
//       { error: 'Unauthorized' },
//       { status: 401 }
//     );
//   }

//   const { title, body, url } = await request.json();

//   try {
//     // In a real app, you would fetch subscriptions from your database
//     // const subscriptions = await getSubscriptions();
//     interface Subscription {
//       endpoint: string;
//       keys: {
//         p256dh: string;
//         auth: string;
//       };
//     }

//     const subscriptions: Subscription[] = []; // Replace with actual subscriptions
    
//     const results = await Promise.allSettled(
//       subscriptions.map(sub =>
//         webPush.sendNotification(
//           sub,
//           JSON.stringify({ title, body, url })
//         )
//       )
//     );

//     const successful = results.filter(r => r.status === 'fulfilled').length;
//     return NextResponse.json({ 
//       successful, 
//       total: subscriptions.length 
//     });
//   } catch (error) {
//     console.error('Error sending notifications:', error);
//     return NextResponse.json(
//       { error: 'Failed to send notifications' },
//       { status: 500 }
//     );
//   }
// }