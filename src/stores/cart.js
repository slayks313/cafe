import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

 function addItem(product) {
  const existing = items.value.find(
    item =>
      item.id === product.id &&
      item.variant_id === product.variant_id
  )

  if (existing) {
    existing.quantity += 1
  } else {
    items.value.push({
      ...product,
      quantity: 1,
    })
  }
}

function increase(productId, variantId = null) {
  const item = items.value.find(
    item =>
      item.id === productId &&
      item.variant_id === variantId
  )

  if (item) {
    item.quantity += 1
  }
}

 function decrease(productId, variantId = null) {
  const item = items.value.find(
    item =>
      item.id === productId &&
      item.variant_id === variantId
  )

  if (!item) return

  if (item.quantity > 1) {
    item.quantity -= 1
  } else {
    removeItem(productId, variantId)
  }
}

 function removeItem(productId, variantId = null) {
  items.value = items.value.filter(
    item =>
      !(
        item.id === productId &&
        item.variant_id === variantId
      )
  )
}

  function clearCart() {
    items.value = []
  }

  const totalQuantity = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.quantity,
      0
    )
  })

  const totalPrice = computed(() => {
    return items.value.reduce(
      (total, item) =>
        total + Number(item.price) * item.quantity,
      0
    )
  })

  return {
    items,
    addItem,
    increase,
    decrease,
    removeItem,
    clearCart,
    totalQuantity,
    totalPrice,
  }
})