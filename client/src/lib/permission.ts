import { useWebNotification } from '@vueuse/core'
import { getToken, onMessage } from 'firebase/messaging'
import { toast } from 'vue-sonner'

import { messaging } from '@/shared/firebase'

import Axios from './axios'

interface RequestPermissionOptions {
  facultyId: string
  batchId: string
  classId: string
}

export async function requestPermission(options: RequestPermissionOptions) {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: import.meta.env['VITE_VAPID_KEY'] })
      await Axios.post('/api/subscribe', { token, ...options })
      toast.success('Permission granted')
    }
  } catch (error) {
    console.error('An error occurred while requesting permission:', error)
    toast.error('An error occurred while requesting permission')
  }
}

export function onMessageReceived() {
  onMessage(messaging, (payload) => {
    if (payload.notification) {
      const { title, body, icon } = payload.notification!
      const { isSupported, show, onError } = useWebNotification({
        title: title,
        dir: 'auto',
        lang: 'en',
        icon: icon,
        body: body,
        tag: payload.messageId
      })
      if (isSupported.value) {
        show()
      }
      onError((error) => {
        console.error('An error occurred while showing the notification:', error)
      })
    }
  })
}