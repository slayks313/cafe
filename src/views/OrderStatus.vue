<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { CheckCircle, Clock, ChefHat } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const order = ref(null)
const loading = ref(true)
const error = ref(null)

let channel = null

async function loadOrder() {
  const { data, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (fetchError) {
    console.error(fetchError)
    error.value = t('order.loadError')
    loading.value = false
    return
  }

  order.value = data
  loading.value = false
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

const statusInfo = computed(() => {
  if (!order.value) return null

  switch (order.value.status) {
    case 'new':
      return {
        title: t('order.status.accepted'),
        text: t('order.status.waitingText'),
        type: 'waiting',
      }

    case 'preparing':
      return {
        title: t('order.status.preparingTitle'),
        text: t('order.status.preparingText'),
        type: 'preparing',
      }

    case 'ready':
      return {
        title: t('order.status.readyTitle'),
        type: 'ready',
      }

    default:
      return {
        title: t('order.status.accepted'),
        text: t('order.status.waitingText'),
        type: 'waiting',
      }
  }
})

onMounted(async () => {
  await loadOrder()

  channel = supabase
    .channel(`order-${route.params.id}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${route.params.id}`,
      },
      (payload) => {
        order.value = payload.new
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
  <main class="min-h-screen bg-neutral-950 px-5 py-10 text-white">

    <div class="mx-auto max-w-xl">

      <div
        v-if="loading"
        class="py-20 text-center text-neutral-400"
      >
        {{ t('order.loading') }}
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl bg-red-500/10 p-6 text-center text-red-400"
      >
        {{ error }}
      </div>

      <div v-else-if="order">

        <div class="text-center">

          <div
            class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-black"
          >
            <CheckCircle :size="42" />
          </div>

          <h1 class="text-4xl font-bold">
            {{ t('order.orderNumber') }} №{{ order.order_number }}
          </h1>

          <p class="mt-3 text-neutral-400">
            {{ t('order.tableTitle') }} {{ formatTableLabel(order.table_number) }}
          </p>

        </div>

        <div
          class="mt-10 rounded-3xl border border-neutral-800 bg-neutral-900 p-8 text-center"
        >

          <template v-if="statusInfo.type === 'waiting'">

            <Clock
              :size="52"
              class="mx-auto mb-5"
            />

            <h2 class="text-2xl font-bold">
              {{ statusInfo.title }}
            </h2>

            <p class="mt-2 text-neutral-400">
              {{ statusInfo.text }}
            </p>

          </template>

          <template v-else-if="statusInfo.type === 'preparing'">

            <ChefHat
              :size="52"
              class="mx-auto mb-5"
            />

            <h2 class="text-2xl font-bold">
              {{ statusInfo.title }}
            </h2>

            <p class="mt-2 text-neutral-400">
              {{ statusInfo.text }}
            </p>

          </template>

          <template v-else-if="statusInfo.type === 'ready'">

            <CheckCircle
              :size="52"
              class="mx-auto mb-5"
            />

            <h2 class="text-3xl font-bold">
              {{ statusInfo.title }}
            </h2>

            <p class="mt-2 text-neutral-400">
              {{ statusInfo.text }}
            </p>

          </template>

        </div>

        <div
          class="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
        >

          <div class="flex justify-between">
            <span class="text-neutral-400">
              {{ t('order.name') }}
            </span>

            <span>
              {{ order.customer_name }}
            </span>
          </div>

          <div class="mt-4 flex justify-between">
            <span class="text-neutral-400">
              {{ t('order.table') }}
            </span>

            <span>
              {{ formatTableLabel(order.table_number) }}
            </span>
          </div>

          <div
            v-if="order.comment"
            class="mt-4 border-t border-neutral-800 pt-4"
          >
            <span class="text-neutral-400">
              {{ t('order.comment') }}
            </span>

            <p class="mt-2">
              {{ order.comment }}
            </p>
          </div>

        </div>

      </div>

    </div>

  </main>
</template>