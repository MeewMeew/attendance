import { db, messaging } from '../shared/firebase'
import { logger } from '../utils/logger'

type SubscribeOptions = {
  token: string
  classId: string
  faculatyId: string
  batchId: string
}
type UnsubscribeOptions = {
  token: string
}
type SendNotificationOptions = {
  title: string
  body: string
  icon: string
  topic: string
}

export async function subscribe(options: SubscribeOptions) {
  try {
    const snapshot = await db
      .collection('subscriptions')
      .where('token', '==', options.token)
      .get()
    if (!snapshot.empty) return
    await db.collection('subscriptions')
      .add({
        token: options.token,
        classId: options.classId,
        faculatyId: options.faculatyId,
        batchId: options.batchId
      })
    await messaging.subscribeToTopic(options.token, `${options.classId}-${options.faculatyId}-${options.batchId}`)
    return true
  } catch (error) {
    logger.error('An error occurred while subscribing:', error)
    return false
  }
}

export async function unsubscribe(options: UnsubscribeOptions) {
  try {
    const snapshot = await db
      .collection('subscriptions')
      .where('token', '==', options.token)
      .get()
    if (snapshot.empty) return
    const doc = snapshot.docs[0].data()
    await messaging.unsubscribeFromTopic(options.token, `${doc.classId}-${doc.faculatyId}-${doc.batchId}`)
    await snapshot.forEach(doc => doc.ref.delete())
    return true
  } catch (error) {
    logger.error('An error occurred while unsubscribing:', error)
    return false
  }
}

export async function sendNotification(options: SendNotificationOptions) {
  try {
    const topic = options.topic.split('-')
    const snapshot = await db
      .collection('subscriptions')
      .where('classId', '==', topic[0])
      .where('faculatyId', '==', topic[1])
      .where('batchId', '==', topic[2])
      .get()
    if (snapshot.empty) return
    const tokens = snapshot.docs.map(doc => doc.data().token)
    await messaging.sendToTopic(options.topic, {
      notification: {
        title: options.title,
        body: options.body,
        icon: options.icon
      }
    }, { registrationTokens: tokens })
    return true
  } catch (error) {
    logger.error('An error occurred while sending the notification:', error)
    return false
  }
}