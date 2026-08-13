import { supabase } from './supabase'

export async function createOrder({
  tableNumber,
  customerName,
  comment,
  items,
}) {
  // Создаём заказ
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      cafe_id: 'c29cfac7-29e6-42b2-b3e5-20808682fcb7',
      table_number: Number(tableNumber),
      customer_name: customerName.trim(),
      comment: comment?.trim() || null,
    })
    .select()
    .single()

  if (orderError) {
    throw orderError
  }

const orderItems = items.map(item => ({
  order_id: order.id,
  menu_item_id: item.id,
  variant_id: item.variant_id || null,
  quantity: item.quantity,
  price: Number(item.price),
}))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    // Если товары не записались — удаляем заказ
    await supabase
      .from('orders')
      .delete()
      .eq('id', order.id)

    throw itemsError
  }

  // Привязываем текущую Push-подписку к заказу
  // Привязываем текущую Push-подписку к заказу
try {
  const registration = await navigator.serviceWorker.ready

  const subscription =
    await registration.pushManager.getSubscription()

  if (!subscription) {
    console.log('Push-подписка не найдена')
  } else {
    const subscriptionJson = subscription.toJSON()

    const { data, error } = await supabase.rpc(
      'save_push_subscription',
      {
        p_cafe_id: 'c29cfac7-29e6-42b2-b3e5-20808682fcb7',
        p_endpoint: subscription.endpoint,
        p_p256dh: subscriptionJson.keys?.p256dh,
        p_auth: subscriptionJson.keys?.auth,
        p_order_id: order.id,
      }
    )

    if (error) {
      console.error(
        'ОШИБКА СОХРАНЕНИЯ PUSH:',
        error
      )
    } else {
      console.log(
        'PUSH ПРИВЯЗАН:',
        data
      )
    }
  }
} catch (error) {
  console.error(
    'ОШИБКА PUSH:',
    error
  )
}

  return order
}