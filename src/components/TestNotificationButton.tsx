// components/TestNotificationButton.tsx
'use client';

export default function TestNotificationButton() {
  const sendTestNotification = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/send-to-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user-id-123',
          title: 'Test Notification',
          body: 'This is a test notification from your PWA',
          data: {
            url: '/notifications',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      alert('Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert(`Failed to send test notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <button 
      onClick={sendTestNotification}
      className="px-4 py-2 bg-green-500 text-white rounded"
    >
      Send Test Notification
    </button>
  );
}