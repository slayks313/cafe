<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import {
  Clock,
  ChefHat,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-vue-next'

import { supabase } from '../../lib/supabase'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const languageField = (item, field) => {
  return item[`${field}_${locale.value}`] || item[`${field}_ru`]
}

const orders = ref([])
const loading = ref(true)
let channel = null

async function loadOrders() {
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
   order_items (
  id,
  quantity,
  price,
  variant_id,

  menu_item:menu_items (
    name_ru,
    name_uz,
    name_en
  ),

  variant:menu_item_variants (
    name_ru,
    name_uz,
    name_en
  )
)
  `)
  .in('status', ['new', 'preparing'])
  .order('created_at', { ascending: false })

  if (error) {
    console.error('Ошибка загрузки заказов:', error)
    return
  }

  orders.value = data || []
  loading.value = false
}

async function updateStatus(orderId, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    console.error('Ошибка изменения статуса:', error)
    return
  }

  // Если заказ завершён — отправляем Push
  if (status === 'ready') {
    const { data, error: pushError } =
      await supabase.functions.invoke(
        'send-order-ready',
        {
          body: {
            orderId,
          },
        }
      )

    if (pushError) {
      console.error(
        'Ошибка отправки Push:',
        pushError
      )
    } else {
      console.log(
        'Push отправлен:',
        data
      )
    }
  }
}

function statusText(status) {
  const statuses = {
    new: t('admin.orders.status.new'),
    accepted: t('admin.orders.status.accepted'),
    preparing: t('admin.orders.status.preparing'),
    ready: t('admin.orders.status.ready'),
    completed: t('admin.orders.status.completed'),
    cancelled: t('admin.orders.status.cancelled'),
  }

  return statuses[status] || status
}

function formatTableLabel(value) {
  const tableValue = Number(value)

  if (!Number.isFinite(tableValue) || tableValue <= 0) {
    return '№0'
  }

  const floor = Math.floor(tableValue / 100)
  const tableNumber = tableValue % 100

  if (floor > 0 && tableNumber > 0) {
    return `${floor} этаж №${tableNumber}`
  }

  return `№${tableValue}`
}

onMounted(async () => {
  await loadOrders()

  channel = supabase
    .channel('admin-orders')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      async () => {
        await loadOrders()
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (channel) {
    supabase.removeChannel(channel)
  }
})
</script>

<template>
  <main class="min-h-screen bg-neutral-950 p-6 text-white">

    <div class="mx-auto max-w-6xl">

      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold">
            {{ t('admin.orders.title') }}
          </h1>

         
        </div>

        <button
          @click="loadOrders"
          class="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-3 hover:bg-neutral-700"
        >
          <RefreshCw :size="18" />
          {{ t('admin.orders.refresh') }}
        </button>
      </div>

      <div
        v-if="loading"
        class="py-20 text-center text-neutral-400"
      >
        {{ t('admin.orders.loading') }}
      </div>

      <div
        v-else-if="orders.length === 0"
        class="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center"
      >
        <p class="text-xl">
          {{ t('admin.orders.empty') }}
        </p>
      </div>

      <div v-else class="space-y-5">

        <article
          v-for="order in orders"
          :key="order.id"
          class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
        >

          <div class="flex flex-wrap items-start justify-between gap-4">

            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-2xl font-bold">
                  {{ t('admin.orders.order') }} №{{ order.order_number }}
                </h2>

                <span class="rounded-full bg-neutral-800 px-3 py-1 text-sm">
                  {{ statusText(order.status) }}
                </span>
              </div>

              <div class="mt-3 space-y-1 text-neutral-400">
                <p>
                  {{ t('admin.orders.table') }} {{ formatTableLabel(order.table_number) }}
                </p>

                <p>
                  {{ t('admin.orders.customer') }}: {{ order.customer_name }}
                </p>

                <p v-if="order.comment">
                  {{ t('admin.orders.comment') }}: {{ order.comment }}
                </p>
              </div>
            </div>

            <div class="text-sm text-neutral-500">
              {{ new Date(order.created_at).toLocaleString() }}
            </div>

          </div>

          <div class="mt-6 border-t border-neutral-800 pt-5">

            <h3 class="mb-3 font-semibold">
              {{ t('admin.orders.items') }}
            </h3>

            <div class="space-y-2">

              <div
                v-for="item in order.order_items"
                :key="item.id"
                class="flex justify-between rounded-xl bg-neutral-800/60 px-4 py-3"
              >
              <span>
  {{ item.menu_item?.[`name_${locale.value}`] || item.menu_item?.name_ru || t('admin.orders.defaultDish') }}

  <span
    v-if="item.variant"
    class="ml-2 text-neutral-400"
  >
    — {{ item.variant[`name_${locale.value}`] || item.variant.name_ru }}
  </span>

  × {{ item.quantity }}
</span>

                <span>
                  {{ (Number(item.price) * item.quantity).toLocaleString() }}
                  {{ t('common.currency') }}
                </span>
              </div>

            </div>

          </div>

         <div class="mt-6 flex gap-3">

  <button
    v-if="order.status === 'new'"
    @click="updateStatus(order.id, 'preparing')"
    class="rounded-xl bg-white px-5 py-3 font-semibold text-black"
  >
    {{ t('admin.orders.accept') }}
  </button>

  <button
    v-if="order.status === 'preparing'"
    @click="updateStatus(order.id, 'ready')"
    class="rounded-xl bg-white px-5 py-3 font-semibold text-black"
  >
    {{ t('admin.orders.finish') }}
  </button>

</div>

        </article>

      </div>

    </div>

  </main>
</template>