import { supabase } from './supabase'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  if (!base64String) {
    throw new Error('VITE_VAPID_PUBLIC_KEY не найден в .env')
  }

  const padding = '='.repeat(
    (4 - (base64String.length % 4)) % 4
  )

  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)

  return Uint8Array.from(
    [...rawData].map(char => char.charCodeAt(0))
  )
}

export async function subscribeToPush(cafeId) {
  console.log('1. Запуск Push')

  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker не поддерживается')
  }

  if (!('PushManager' in window)) {
    throw new Error('Push не поддерживается')
  }

  const permission = await Notification.requestPermission()

  console.log('2. Разрешение:', permission)

  if (permission !== 'granted') {
    throw new Error(`Уведомления не разрешены: ${permission}`)
  }

  const registration = await navigator.serviceWorker.ready

  console.log('3. Service Worker готов')

  let subscription =
    await registration.pushManager.getSubscription()

  if (!subscription) {
    console.log('4. Создаём Push-подписку')

    subscription =
      await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
  }

  const json = subscription.toJSON()

  console.log('5. Push подписка получена')

const { data, error } = await supabase.rpc(
  'save_push_subscription',
  {
    p_cafe_id: cafeId,
    p_endpoint: json.endpoint,
    p_p256dh: json.keys.p256dh,
    p_auth: json.keys.auth,
  }
)

  if (error) {
    console.error('SUPABASE PUSH ERROR:', error)
    throw error
  }

  console.log('6. Подписка сохранена:', data)

  localStorage.setItem(
  'push_endpoint',
  json.endpoint
)

  return subscription
}