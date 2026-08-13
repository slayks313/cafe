<script setup>
import { onMounted, ref } from 'vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { supabase } from '../../lib/supabase'
import MenuItemForm from '../../components/MenuItemForm.vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const languageField = (item, field) => {
  return item[`${field}_${locale.value}`] || item[`${field}_ru`]
}

const showForm = ref(false)
const editingItem = ref(null)

function openCreate() {
  editingItem.value = null
  showForm.value = true
}

function openEdit(item) {
  editingItem.value = item
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingItem.value = null
}

const items = ref([])
const categories = ref([])
const loading = ref(true)

const showCategoryForm = ref(false)
const editingCategory = ref(null)

const categoryForm = ref({
  name_ru: '',
  name_uz: '',
  name_en: '',
})

async function loadData() {
  loading.value = true

  const [itemsResult, categoriesResult] = await Promise.all([
    supabase
     .from('menu_items')
.select(`
  *,
  menu_item_variants (
    id,
    name_ru,
    name_uz,
    name_en,
    price,
    sort_order
  )
`)
.order('sort_order', { ascending: true }),

    supabase
      .from('menu_categories')
      .select('*')
      .order('sort_order', { ascending: true }),
  ])

  if (itemsResult.error) {
    console.error(itemsResult.error)
  }

  if (categoriesResult.error) {
    console.error(categoriesResult.error)
  }

  items.value = itemsResult.data || []
  categories.value = categoriesResult.data || []

  loading.value = false
}

function openCategoryCreate() {
  editingCategory.value = null

  categoryForm.value = {
    name_ru: '',
    name_uz: '',
    name_en: '',
  }

  showCategoryForm.value = true
}

function openCategoryEdit(category) {
  editingCategory.value = category

  categoryForm.value = {
    name_ru: category.name_ru,
    name_uz: category.name_uz,
    name_en: category.name_en,
  }

  showCategoryForm.value = true
}

function closeCategoryForm() {
  showCategoryForm.value = false
  editingCategory.value = null
}

async function saveCategory() {
  if (
    !categoryForm.value.name_ru ||
    !categoryForm.value.name_uz ||
    !categoryForm.value.name_en
  ) {
    alert(t('menu.fillAllNames'))
    return
  }

  const data = {
    name_ru: categoryForm.value.name_ru,
    name_uz: categoryForm.value.name_uz,
    name_en: categoryForm.value.name_en,
  }

  if (editingCategory.value) {
    const { error } = await supabase
      .from('menu_categories')
      .update(data)
      .eq('id', editingCategory.value.id)

    if (error) {
      console.error(error)
      alert(t('menu.categoryUpdateFailed'))
      return
    }
  } else {
    const { error } = await supabase
      .from('menu_categories')
      .insert({
        ...data,
        cafe_id: 'c29cfac7-29e6-42b2-b3e5-20808682fcb7',
        sort_order: categories.value.length + 1,
      })

    if (error) {
      console.error(error)
      alert(t('menu.categoryCreateFailed'))
      return
    }
  }

  closeCategoryForm()
  await loadData()
}

async function deleteCategory(id) {
  const confirmed = confirm(
    t('menu.deleteCategoryConfirm')
  )

  if (!confirmed) return

  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    alert(t('menu.categoryDeleteFailed'))
    return
  }

  await loadData()
}

function categoryName(categoryId) {
  const category = categories.value.find(
    category => category.id === categoryId
  )

  if (!category) return t('menu.noCategory') || 'No category'

  return category[`name_${locale.value}`] || category.name_ru || 'Without category'
}

async function deleteItem(id) {
  const confirmed = confirm(
    t('menu.deleteItemConfirm')
  )

  if (!confirmed) return

  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    alert(t('menu.itemDeleteFailed'))
    return
  }

  items.value = items.value.filter(
    item => item.id !== id
  )
}

onMounted(loadData)
</script>

<template>
  <main class="min-h-screen bg-neutral-950 p-6 text-white">

    <div class="mx-auto max-w-6xl">

      <div class="mb-8 flex items-center justify-between">

        <div>
          <h1 class="text-4xl font-bold">
            {{ t('menu.title') }}
          </h1>

          <p class="mt-2 text-neutral-400">
            {{ t('menu.manage') }}
          </p>
        </div>

        <button
        @click="openCreate"
          class="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black"
        >
          <Plus :size="20" />
            {{ editingItem ? t('menu.form.editTitle') : t('menu.form.addTitle') }}
        </button>

      </div>

      <div
        v-if="loading"
        class="py-20 text-center text-neutral-400"
      >
        {{ t('common.loading') }}
      </div>

      

      <div
        v-else-if="items.length === 0"
        class="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center"
      >
        {{ t('menu.empty') }}
      </div>
      
      

      <div
        v-else
        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
      
      

        <article
  v-for="item in items"
  :key="item.id"
  class="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"
>

         <div class="h-64 w-full shrink-0 overflow-hidden bg-neutral-800">

            <img
              v-if="item.image_url"
              :src="item.image_url"
              :alt="item.name_ru"
              class="h-full w-full object-cover"
            />

            <div
              v-else
              class="flex h-full items-center justify-center text-neutral-500"
            >
              {{ t('menu.noPhoto') }}
            </div>

          </div>

          <div class="flex flex-1 flex-col p-5">

            <p class="mb-2 text-sm text-neutral-500">
              {{ categoryName(item.category_id) }}
            </p>

<h2
  class="line-clamp-1 break-words text-xl font-bold"
  style="overflow-wrap: anywhere;"
>
 {{ languageField(item, 'name') }}
</h2>

<p
  class="mt-2 line-clamp-2 min-h-[3.5rem] overflow-hidden break-words text-neutral-400"
  style="overflow-wrap: anywhere;"
>
  {{ languageField(item, 'description') }}
</p>

          <div class="mt-4">
  <template v-if="item.menu_item_variants?.length">
    <p class="mb-2 text-sm text-neutral-500">
      {{ t('menu.variants') }}
    </p>

    <div class="space-y-1">
      <div
        v-for="variant in item.menu_item_variants"
        :key="variant.id"
        class="flex justify-between text-sm"
      >
        <span class="text-neutral-300">
          {{ variant[`name_${locale}`] || variant.name_ru }}
        </span>

        <span class="font-bold">
          {{ Number(variant.price).toLocaleString() }}
          {{ t('common.currency') }}
        </span>
      </div>
    </div>
  </template>

  <p v-else class="text-lg font-bold">
    {{ Number(item.price).toLocaleString() }}
    {{ t('common.currency') }}
  </p>
</div>

            <div class="mt-auto flex gap-2 pt-5">

              <button
              @click="openEdit(item)"
                class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-800 py-3 hover:bg-neutral-700"
              >
                <Pencil :size="18" />
                {{ t('common.edit') }}
              </button>

              <button
                @click="deleteItem(item.id)"
                class="flex items-center justify-center rounded-xl bg-red-500/10 px-4 py-3 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 :size="18" />
              </button>

            </div>

          </div>

        </article>

      </div>

    </div>
<MenuItemForm
  v-if="showForm"
  :item="editingItem"
  :categories="categories"
  @close="closeForm"
  @saved="loadData"
/>
  </main>
</template>