<script setup>
import { ref } from 'vue'
import { ArrowLeft, User, Armchair, MessageSquare } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { createOrder } from '../lib/orders'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const languageField = (item, field) => {
  return item[`${field}_${locale.value}`] || item[`${field}_ru`]
}

const router = useRouter()
const cart = useCartStore()

const customerName = ref('')
const tableNumber = ref('')
const comment = ref('')
const loading = ref(false)
const error = ref('')

const tableOptions = [
  { floor: 1, label: '1 этаж', numbers: Array.from({ length: 12 }, (_, i) => i + 1) },
  { floor: 2, label: '2 этаж', numbers: Array.from({ length: 12 }, (_, i) => i + 1) },
  { floor: 0, label: 'Улица', numbers: Array.from({ length: 16 }, (_, i) => i + 1) },
]

function normalizeTableValue(value) {
  if (!value) return ''

  const [floor, number] = String(value).split('-')
  if (!floor || !number) return Number(value)

  return Number(floor) * 100 + Number(number)
}

async function submitOrder() {
  error.value = ''

if (!customerName.value.trim()) {
  error.value = t('order.validationName')
  return
}

if (!tableNumber.value) {
  error.value = t('order.validationTable')
  return
}

if (cart.items.length === 0) {
  error.value = t('order.validationCart')
  return
}

  loading.value = true

  try {
    const order = await createOrder({
      tableNumber: normalizeTableValue(tableNumber.value),
      customerName: customerName.value,
      comment: comment.value,
      items: cart.items,
    })

    console.log('Заказ создан:', order)

    cart.clearCart()

    router.push(`/order/${order.id}`)
  } catch (err) {
  console.error(err)
  error.value = t('order.submitError')

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-neutral-950 p-5 text-white">

    <div class="mx-auto max-w-xl">

      <router-link
        to="/cart"
        class="mb-8 flex items-center gap-2 text-neutral-400 hover:text-white"
      >
        <ArrowLeft :size="20" />
        {{ t('common.back') }}
      </router-link>

      <h1 class="text-4xl font-bold">
       {{ t('order.title') }}
      </h1>

      <p class="mt-2 text-neutral-400">
       {{ t('order.subtitle') }}
      </p>

      <form
        @submit.prevent="submitOrder"
        class="mt-8 space-y-6"
      >

        <div>
          <label class="mb-2 flex items-center gap-2 text-sm">
            <User :size="18" />
           {{ t('order.name') }}
          </label>

          <input
            v-model="customerName"
            type="text"
            class="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 outline-none focus:border-white"
          />
        </div>

        <div>
          <label class="mb-2 flex items-center gap-2 text-sm">
            <Armchair :size="18" />
           {{ t('order.table') }}
          </label>

          <select
            v-model="tableNumber"
            class="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 outline-none"
          >
            <option value="" disabled>
            {{ t('order.tablePlaceholder') }}
            </option>

            <optgroup
              v-for="floor in tableOptions"
              :key="floor.floor"
              :label="floor.label"
            >
              <option
                v-for="number in floor.numbers"
                :key="`${floor.floor}-${number}`"
                :value="`${floor.floor}-${number}`"
              >
                {{ t('order.table') }} №{{ number }}
              </option>
            </optgroup>
          </select>
        </div>

        <div>
          <label class="mb-2 flex items-center gap-2 text-sm">
            <MessageSquare :size="18" />
            {{ t('order.comment') }}
          </label>

          <textarea
            v-model="comment"
            rows="4"
            :placeholder="t('order.commentPlaceholder')"
            class="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 outline-none focus:border-white"
          />
        </div>

        <p
          v-if="error"
          class="rounded-xl bg-red-500/10 p-4 text-red-400"
        >
          {{ error }}
        </p>


        <div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">

          <div class="flex justify-between">
            <span class="text-neutral-400">
             {{ t('order.items') }}
            </span>

            <span>
              {{ cart.totalQuantity }}
            </span>
          </div>

          <div class="mt-3 flex justify-between text-xl font-bold">
            <span>
             {{ t('order.total') }}
            </span>

            <span>
              {{ Number(cart.totalPrice).toLocaleString() }} {{ t('common.currency') }}
            </span>
          </div>

        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl bg-white py-4 font-semibold text-black transition hover:scale-[1.01] disabled:opacity-50"
        >
          {{ loading ? t('common.loading') : t('order.submit') }}
        </button>

      </form>

    </div>

  </main>
</template>