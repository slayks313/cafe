<script setup>
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ShoppingCart, Plus, X } from 'lucide-vue-next'

import { getCategories, getMenuItems } from '../lib/menu'
import { useCartStore } from '../stores/cart'

const { locale, t } = useI18n()
const cart = useCartStore()

const categories = ref([])
const items = ref([])
const selectedCategory = ref(null)
const loading = ref(true)
const error = ref(null)

const selectedItem = ref(null)
const selectedVariants = ref([])

function openVariants(item) {
  selectedItem.value = item
  selectedVariants.value = []
}

function getVariantName(variant) {
  return variant[`name_${locale.value}`] || variant.name_ru || ''
}

function closeVariants() {
  selectedItem.value = null
  selectedVariants.value = []
}

function addToCart(item) {
  if (item.menu_item_variants?.length) {
    openVariants(item)
    return
  }

  cart.addItem({
    ...item,
    variant_id: null,
    variant_name: null,
  })

  console.log('Добавлено в корзину:', item.name_ru)
}

function addVariantToCart() {
  if (!selectedItem.value || selectedVariants.value.length === 0) return

  selectedVariants.value.forEach(variant => {
    cart.addItem({
      ...selectedItem.value,
      variant_id: variant.id,
      variant_name_ru: variant.name_ru,
      variant_name_uz: variant.name_uz,
      variant_name_en: variant.name_en,
      price: Number(variant.price),
    })
  })

  console.log(
    'Добавлены варианты:',
    selectedVariants.value
  )

  closeVariants()
}

const languageField = (item, field) => {
  return item[`${field}_${locale.value}`] || item[`${field}_ru`]
}

const filteredItems = computed(() => {
  if (!selectedCategory.value) {
    return items.value
  }

  return items.value.filter(
    item => item.category_id === selectedCategory.value
  )
})



onMounted(async () => {
  try {
    categories.value = await getCategories()
    items.value = await getMenuItems()
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить меню'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="min-h-screen bg-neutral-950 text-white">
    
    <header class="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

        <h1 class="text-2xl font-bold">
          Cafe
        </h1>

        <router-link
          to="/cart"
          class="relative flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-black transition hover:scale-105"
        >
          <ShoppingCart :size="20" />

          <span>
            <span>
  {{ t('common.cart') }}
</span>
          </span>

          <span
            v-if="cart.totalQuantity > 0"
            class="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
          >
            {{ cart.totalQuantity }}
          </span>
        </router-link>

      </div>
    </header>

    <div class="mx-auto max-w-6xl px-5 py-8">

      <div v-if="loading" class="py-20 text-center">
        {{ t('menu.loading') }}...
      </div>

      <div v-else-if="error" class="py-20 text-center text-red-400">
        {{ error }}
      </div>

      <template v-else>


        <div class="mb-8 flex gap-3 overflow-x-auto pb-2">

          <button
            @click="selectedCategory = null"
            class="shrink-0 rounded-xl px-5 py-3 transition"
            :class="
              selectedCategory === null
                ? 'bg-white text-black'
                : 'bg-neutral-800 text-white hover:bg-neutral-700'
            "
          >
            {{ t('common.all') }}
          </button>

          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="shrink-0 rounded-xl px-5 py-3 transition"
            :class="
              selectedCategory === category.id
                ? 'bg-white text-black'
                : 'bg-neutral-800 text-white hover:bg-neutral-700'
            "
          >
            {{ languageField(category, 'name') }}
          </button>

        </div>


        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

         <article
  v-for="item in filteredItems"
  :key="item.id"
  class="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"
>

           <div class="h-64 w-full overflow-hidden bg-neutral-800">
  <img
    v-if="item.image_url"
    :src="item.image_url"
    :alt="languageField(item, 'name')"
    class="h-full w-full object-cover"
  />

  <div
    v-else
    class="flex h-full items-center justify-center text-neutral-500"
  >
    {{ t('menu.photo') }}
  </div>
</div>

           <div class="flex flex-1 flex-col p-5">

             <h2
  class="break-words text-xl font-semibold"
  style="overflow-wrap: anywhere;"
>
  {{ languageField(item, 'name') }}
</h2>

         <p
  class="mt-2 line-clamp-2 min-h-10 break-words text-sm text-neutral-400"
  style="overflow-wrap: anywhere;"
>
  {{ languageField(item, 'description') }}
</p>

             <div v-if="item.menu_item_variants?.length" class="mt-3 border-t border-neutral-800 pt-3">
  <p class="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
    {{ t('menu.variants') }}
  </p>

  <div class="space-y-1.5">
    <div
      v-for="variant in item.menu_item_variants"
      :key="variant.id"
      class="flex items-center justify-between gap-3 text-sm"
    >
      <span class="text-neutral-300">
        {{ getVariantName(variant) }}
      </span>

      <span class="font-medium text-white">
        {{ Number(variant.price).toLocaleString() }}
        {{ t('common.currency') }}
      </span>
    </div>
  </div>
</div>

             <div class="mt-auto flex items-center justify-between gap-3 pt-5">

                <span class="text-lg font-bold">
  <template v-if="item.menu_item_variants?.length">
    от {{ Math.min(...item.menu_item_variants.map(v => Number(v.price))).toLocaleString() }}
  </template>

  <template v-else>
    {{ Number(item.price).toLocaleString() }}
  </template>

  {{ t('common.currency') }}
</span>

                <button
                  @click="addToCart(item)"
                  class="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-black transition hover:scale-105 active:scale-95"
                >
                  <Plus :size="18" />
                  {{ t('common.add') }}
                </button>

              </div>

            </div>

          </article>

        </div>

      </template>

    </div>
    <div
  v-if="selectedItem"
  class="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center"
  @click.self="closeVariants"
>
  <div
    class="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
  >
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-xl font-bold">
        {{ languageField(selectedItem, 'name') }}
      </h2>

      <button
        @click="closeVariants"
        class="rounded-xl p-2 hover:bg-neutral-800"
      >
        <X :size="20" />
      </button>
    </div>

    <p class="mb-3 text-neutral-400">
      {{ t('menu.chooseVariant') }}
    </p>

    <div class="space-y-2">
      <button
        v-for="variant in selectedItem.menu_item_variants"
        :key="variant.id"
        @click="
  selectedVariants.includes(variant)
    ? selectedVariants.splice(selectedVariants.indexOf(variant), 1)
    : selectedVariants.push(variant)
"
        class="flex w-full items-center justify-between rounded-xl border p-4 text-left transition"
        :class="
  selectedVariants.some(v => v.id === variant.id)
    ? 'border-white bg-white text-black'
    : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700'
"
      >
        <span>
          {{ getVariantName(variant) }}
        </span>

        <span class="font-bold">
          {{ Number(variant.price).toLocaleString() }}
          {{ t('common.currency') }}
        </span>
      </button>
    </div>

    <button
      @click="addVariantToCart"
     :disabled="selectedVariants.length === 0"
      class="mt-5 w-full rounded-xl bg-white py-4 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
    >
      {{ t('menu.addToCart') }}
    </button>
  </div>
</div>

  </main>
</template>