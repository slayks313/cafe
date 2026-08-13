<script setup>
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const languageField = (item, field) => {
  return item[`${field}_${locale.value}`] || item[`${field}_ru`]
}

const cart = useCartStore()
</script>

<template>
  <main class="min-h-screen bg-neutral-950 p-5 text-white">

    <div class="mx-auto max-w-3xl">

      <div class="mb-8 flex items-center justify-between">

        <router-link
          to="/menu"
          class="flex items-center gap-2 text-neutral-400 hover:text-white"
        >
          <ArrowLeft :size="20" />
          {{ t('common.back') }}
        </router-link>

        <ShoppingCart :size="24" />

      </div>

      <h1 class="mb-8 text-4xl font-bold">
        <span>
  {{ t('common.cart') }}
</span>
      </h1>

      <div
        v-if="cart.items.length === 0"
        class="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center"
      >
        <ShoppingCart
          :size="48"
          class="mx-auto mb-4 text-neutral-600"
        />

        <p class="text-xl">
          {{ t('cart.empty') }}
        </p>

        <router-link
          to="/menu"
          class="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-medium text-black"
        >
          {{ t('menu.total') }}
        </router-link>
      </div>

      <div v-else>

        <div class="space-y-3">

          <div
            v-for="item in cart.items"
            :key="`${item.id}-${item.variant_id || 'default'}`"
            class="flex items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
          >

            <div>
              <h2 class="font-semibold">
              {{ languageField(item, 'name') }}
              </h2>

              <p
  v-if="item.variant_id"
  class="mt-1 text-sm text-neutral-400"
>
  {{ item[`variant_name_${locale}`] || item.variant_name_ru }}
</p>

              <p class="mt-1 text-sm text-neutral-400">
               {{ Number(item.price).toLocaleString() }} {{ t('common.currency') }}
              </p>
            </div>

            <div class="flex items-center gap-3">

              <button
                @click="cart.decrease(item.id, item.variant_id)"
                class="h-9 w-9 rounded-lg bg-neutral-800 hover:bg-neutral-700"
              >
                −
              </button>

              <span class="w-6 text-center">
                {{ item.quantity }}
              </span>

              <button
                @click="cart.increase(item.id, item.variant_id)"
                class="h-9 w-9 rounded-lg bg-neutral-800 hover:bg-neutral-700"
              >
                +
              </button>

              <button
               @click="cart.removeItem(item.id, item.variant_id)"
                class="ml-2 text-red-400 hover:text-red-300"
              >
                <Trash2 :size="19" />
              </button>

            </div>

          </div>

        </div>

        <div class="mt-8 border-t border-neutral-800 pt-6">

          <div class="flex items-center justify-between">
            <span class="text-xl">
              {{ t('cart.total') }}
            </span>

            <span class="text-2xl font-bold">
              {{ cart.totalPrice.toLocaleString() }} {{ t('common.currency') }}
            </span>
          </div>

        <router-link
  to="/checkout"
  class="mt-6 block w-full rounded-xl bg-white py-4 text-center font-semibold text-black"
>
 {{ t('cart.checkout') }}
</router-link>

        </div>

      </div>

    </div>

  </main>
</template>