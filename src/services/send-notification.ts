import { VAPID } from '@/config'
import webPush from 'web-push'
import { getSubscriptions } from '@/lib/db'

webPush.setVapidDetails(
  VAPID.subject,
  VAPID.publicKey,
  VAPID.privateKey
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  // Add your authentication check here
  if (req.headers.authorization !== `Bearer ${process.env.API_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { title, body, url } = req.body

  try {
    const subscriptions = await getSubscriptions()
    const results = await Promise.allSettled(
      subscriptions.map((sub: webPush.PushSubscription) =>
      webPush.sendNotification(
        sub,
        JSON.stringify({ title, body, url })
      )
      )
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    res.status(200).json({ successful, total: subscriptions.length })
  } catch (error) {
    console.error('Error sending notifications:', error)
    res.status(500).json({ error: 'Failed to send notifications' })
  }
}