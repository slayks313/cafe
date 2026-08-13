self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let data = {}

  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = {
      title: 'Cafe Order',
      body: 'Ваш заказ готов!'
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Cafe Order',
      {
        body: data.body || 'Ваш заказ готов!',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: data.tag || 'order-ready',
        requireInteraction: true
      }
    )
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus()
        }
      }

      return clients.openWindow('/')
    })
  )
})