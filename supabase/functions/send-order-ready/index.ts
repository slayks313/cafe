import webpush from 'npm:web-push'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!

webpush.setVapidDetails(
  'mailto:admin@example.com',
  vapidPublicKey,
  vapidPrivateKey
)

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return Response.json(
        { error: 'orderId is required' },
        {
          status: 400,
          headers: corsHeaders,
        }
      )
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/push_subscriptions?order_id=eq.${orderId}&select=*`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    )

    if (!response.ok) {
      const text = await response.text()

      console.error('Supabase error:', text)

      return Response.json(
        { error: text },
        {
          status: 500,
          headers: corsHeaders,
        }
      )
    }

    const subscriptions = await response.json()

    console.log(`Найдено подписок: ${subscriptions.length}`)

    const payload = JSON.stringify({
      title: 'Заказ готов! 🔔',
      body: 'Ваш заказ готов. Можете забрать его.',
      orderId,
    })

    const results = []

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          payload
        )

        results.push({
          success: true,
        })
      } catch (error) {
        console.error('Ошибка отправки Push:', error)

        results.push({
          success: false,
          error: String(error),
        })
      }
    }

    return Response.json(
      {
        success: true,
        sent: results,
      },
      {
        headers: corsHeaders,
      }
    )
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    )
  }
})