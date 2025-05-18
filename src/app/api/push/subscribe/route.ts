import { VAPID } from '@/config';
import webPush from 'web-push';
import { NextResponse } from 'next/server';

webPush.setVapidDetails(
  VAPID.subject,
  VAPID.publicKey,
  VAPID.privateKey
);

export async function POST(request: Request) {
  const subscription = await request.json();

  try {
    // In a real app, you would save this to your database
    // await saveSubscription(subscription);
    
    // Send a test notification
    await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Welcome!',
        body: 'Thanks for enabling push notifications',
        url: '/'
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}