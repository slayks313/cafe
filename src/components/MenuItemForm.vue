<script setup>
import { ref, watch } from 'vue'
import { X, Upload, Plus, Trash2 } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const languageField = (item, field) => {
  return item[`${field}_${locale.value}`] || item[`${field}_ru`]
}

function setVariantName(variant, value) {
  ;['ru', 'uz', 'en'].forEach(language => {
    variant[`name_${language}`] = value
  })
}

function getVariantName(variant) {
  return variant[`name_${locale.value}`] || variant.name_ru || ''
}

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'saved'])

const loading = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)

const variants = ref([])

function addVariant() {
  variants.value.push({
    name_ru: '',
    name_uz: '',
    name_en: '',
    price: '',
    sort_order: variants.value.length,
  })
}

function removeVariant(index) {
  variants.value.splice(index, 1)

  variants.value.forEach((variant, index) => {
    variant.sort_order = index
  })
}

const localCategories = ref([...props.categories])

const showCategoryForm = ref(false)

const newCategory = ref({
  name_ru: '',
  name_uz: '',
  name_en: '',
})

watch(
  () => props.categories,
  (categories) => {
    localCategories.value = [...categories]
  }
)

function openCategoryForm() {
  newCategory.value = {
    name_ru: '',
    name_uz: '',
    name_en: '',
  }

  showCategoryForm.value = true
}

function closeCategoryForm() {
  showCategoryForm.value = false
}

async function createCategory() {
  if (
    !newCategory.value.name_ru.trim() ||
    !newCategory.value.name_uz.trim() ||
    !newCategory.value.name_en.trim()
  ) {
    alert('Заполните все три названия')
    return
  }

  const { data, error } = await supabase
    .from('menu_categories')
    .insert({
      cafe_id: 'c29cfac7-29e6-42b2-b3e5-20808682fcb7',
      name_ru: newCategory.value.name_ru.trim(),
      name_uz: newCategory.value.name_uz.trim(),
      name_en: newCategory.value.name_en.trim(),
      sort_order: localCategories.value.length + 1,
    })
    .select()
    .single()

  if (error) {
    console.error(error)
    alert('Не удалось создать категорию')
    return
  }

  localCategories.value.push(data)

  form.value.category_id = data.id

  showCategoryForm.value = false
}

const form = ref({
  name_ru: '',
  name_uz: '',
  name_en: '',

  description_ru: '',
  description_uz: '',
  description_en: '',

  price: '',
  category_id: '',
  is_available: true,
})

watch(
  () => props.item,
  async (item) => {
    variants.value = []

    if (!item) {
      form.value = {
        name_ru: '',
        name_uz: '',
        name_en: '',

        description_ru: '',
        description_uz: '',
        description_en: '',

        price: '',
        category_id: '',
        is_available: true,
      }

      imagePreview.value = null
      return
    }

    form.value = {
      name_ru: item.name_ru || '',
      name_uz: item.name_uz || '',
      name_en: item.name_en || '',

      description_ru: item.description_ru || '',
      description_uz: item.description_uz || '',
      description_en: item.description_en || '',

      price: item.price || '',
      category_id: item.category_id || '',
      is_available: item.is_available ?? true,
    }

    imagePreview.value = item.image_url || null

    const { data, error } = await supabase
      .from('menu_item_variants')
      .select(`
        id,
        name_ru,
        name_uz,
        name_en,
        price,
        sort_order
      `)
      .eq('menu_item_id', item.id)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Ошибка загрузки вариантов:', error)
      return
    }

    variants.value = data || []
  },
  { immediate: true }
)

function handleImage(event) {
  const file = event.target.files[0]

  if (!file) return

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

async function uploadImage() {
  if (!imageFile.value) {
    return props.item?.image_url || null
  }

  const file = imageFile.value

  const extension = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${extension}`

  const filePath = fileName

  const { error } = await supabase.storage
    .from('menu-images')
    .upload(filePath, file)

  if (error) {
    throw error
  }

  const { data } = supabase.storage
    .from('menu-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

async function save() {
  if (
    !form.value.name_ru ||
    !form.value.name_uz ||
    !form.value.name_en ||
    !form.value.price ||
    !form.value.category_id
  ) {
    alert('Заполните обязательные поля')
    return
  }

  loading.value = true

  try {
    const imageUrl = await uploadImage()

    const data = {
      name_ru: form.value.name_ru,
      name_uz: form.value.name_uz,
      name_en: form.value.name_en,

      description_ru: form.value.description_ru,
      description_uz: form.value.description_uz,
      description_en: form.value.description_en,

      price: Number(form.value.price),
      category_id: form.value.category_id,
      cafe_id: 'c29cfac7-29e6-42b2-b3e5-20808682fcb7',

      is_available: form.value.is_available,
    }

    if (imageUrl) {
      data.image_url = imageUrl
    }

let menuItemId

if (props.item) {
  const { error } = await supabase
    .from('menu_items')
    .update(data)
    .eq('id', props.item.id)

  if (error) throw error

  menuItemId = props.item.id
} else {
  const { data: newItem, error } = await supabase
    .from('menu_items')
    .insert(data)
    .select()
    .single()

  if (error) throw error

  menuItemId = newItem.id
}

// Удаляем старые варианты
const { error: deleteVariantsError } = await supabase
  .from('menu_item_variants')
  .delete()
  .eq('menu_item_id', menuItemId)

if (deleteVariantsError) {
  throw deleteVariantsError
}

// Добавляем новые варианты
const validVariants = variants.value
  .filter(variant => variant.name_ru.trim() && variant.price)
  .map((variant, index) => ({
    menu_item_id: menuItemId,
    name_ru: variant.name_ru.trim(),
    name_uz: variant.name_uz?.trim() || variant.name_ru.trim(),
    name_en: variant.name_en?.trim() || variant.name_ru.trim(),
    price: Number(variant.price),
    sort_order: index,
  }))

if (validVariants.length > 0) {
  const { error: variantsError } = await supabase
    .from('menu_item_variants')
    .insert(validVariants)

  if (variantsError) {
    throw variantsError
  }
}

    emit('saved')
    emit('close')
  } catch (error) {
    console.error(error)
    alert('Не удалось сохранить блюдо')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">

    <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-neutral-800 bg-neutral-950">

      <div class="flex items-center justify-between border-b border-neutral-800 p-6">

        <h2 class="text-2xl font-bold">
          {{ item ? t('menu.form.editTitle') : t('menu.form.addTitle') }}
        </h2>

        <button
          @click="$emit('close')"
          class="rounded-xl p-2 hover:bg-neutral-800"
        >
          <X :size="22" />
        </button>

      </div>

      <form
        @submit.prevent="save"
        class="space-y-6 p-6"
      >

        <div>

          <label class="mb-3 block font-medium">
            {{ t('menu.form.choosePhoto') }}
          </label>

          <label
            class="flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-neutral-700 bg-neutral-900"
          >

            <img
              v-if="imagePreview"
              :src="imagePreview"
              class="h-full w-full object-cover"
            />

            <div
              v-else
              class="text-center text-neutral-500"
            >
              <Upload
                :size="32"
                class="mx-auto mb-2"
              />

              {{ t('menu.form.choosePhoto') }}
            </div>

            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImage"
            />

          </label>

        </div>

        <div class="grid gap-4 md:grid-cols-3">

          <div>
            <label>{{ t('menu.form.nameRu') }}</label>
            <input
              v-model="form.name_ru"
              class="input"
              :placeholder="t('menu.form.nameRu')"
            />
          </div>

          <div>
            <label>{{ t('menu.form.nameUz') }}</label>
            <input
              v-model="form.name_uz"
              class="input"
              :placeholder="t('menu.form.nameUz')"
            />
          </div>

          <div>
            <label>{{ t('menu.form.nameEn') }}</label>
            <input
              v-model="form.name_en"
              class="input"
              :placeholder="t('menu.form.nameEn')"
            />
          </div>

        </div>

        <div class="grid gap-4 md:grid-cols-3">

          <div>
            <label>{{ t('menu.form.descriptionRu') }}</label>
            <textarea
              v-model="form.description_ru"
              class="input"
            />
          </div>

          <div>
            <label>{{ t('menu.form.descriptionUz') }}</label>
            <textarea
              v-model="form.description_uz"
              class="input"
            />
          </div>

          <div>
            <label>{{ t('menu.form.descriptionEn') }}</label>
            <textarea
              v-model="form.description_en"
              class="input"
            />
          </div>

        </div>

        <div class="grid gap-4 md:grid-cols-2">

          <div>
            <label>{{ t('menu.form.price') }}</label>

            <input
              v-model="form.price"
              type="number"
              min="0"
              class="input"
              placeholder="45000"
            />
          </div>

          <div>
            <div class="md:col-span-2">
  <div class="mb-3 flex items-center justify-between">
    <label class="font-medium">
      {{ t('menu.form.variantSectionTitle') }}
    </label>

    <button
      type="button"
      @click="addVariant"
      class="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 hover:bg-neutral-700"
    >
      <Plus :size="18" />
      {{ t('menu.form.addVariant') }}
    </button>
  </div>

  <div
    v-if="variants.length === 0"
    class="rounded-xl border border-dashed border-neutral-700 p-4 text-sm text-neutral-500"
  >
    {{ t('menu.form.emptyVariants') }}
  </div>

  <div
    v-for="(variant, index) in variants"
    :key="variant.id || index"
    class="mb-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
  >
    <div class="grid gap-3 md:grid-cols-[1fr_auto]">

      <input
        :value="getVariantName(variant)"
        @input="setVariantName(variant, $event.target.value)"
        class="input"
        :placeholder="t('menu.form.variantName')"
      />

      <button
        type="button"
        @click="removeVariant(index)"
        class="shrink-0 rounded-xl bg-red-500/10 px-4 text-red-400 hover:bg-red-500/20"
      >
        <Trash2 :size="20" />
      </button>

    </div>

    <div class="mt-3 flex gap-3">

      <input
        v-model="variant.price"
        type="number"
        min="0"
        class="input"
        :placeholder="t('menu.form.variantPrice')"
      />

    </div>
  </div>
</div>
  <label>{{ t('menu.form.category') }}</label>

  <div class="mt-2 flex gap-2">

    <select
      v-model="form.category_id"
      class="input mt-0"
    >
      <option value="" disabled>
        {{ t('menu.form.chooseCategory') }}
      </option>

      <option
        v-for="category in localCategories"
        :key="category.id"
        :value="category.id"
      >
        {{ languageField(category, 'name') }}
      </option>
    </select>

    <button
      type="button"
      @click="openCategoryForm"
      class="flex shrink-0 items-center gap-2 rounded-xl bg-neutral-800 px-4 hover:bg-neutral-700"
    >
      <Plus :size="18" />
      {{ t('menu.form.newCategory') }}
    </button>

  </div>
</div>

        </div>

        <label class="flex cursor-pointer items-center gap-3">

          <input
            v-model="form.is_available"
            type="checkbox"
            class="h-5 w-5"
          />

          <span>
           {{ t('menu.form.available') }}
          </span>

        </label>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 border-t border-neutral-800 pt-6">

          <button
            type="button"
            @click="$emit('close')"
            class="rounded-xl bg-neutral-800 px-5 py-3"
          >
            {{ t('common.cancel') }}
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="rounded-xl bg-white px-6 py-3 font-semibold text-black disabled:opacity-50"
          >
            {{ loading ? t('common.loading') : t('common.save') }}
          </button>

        </div>

      </form>
<div
  v-if="showCategoryForm"
  class="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-5"
>
  <div class="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-6">

    <div class="mb-6 flex items-center justify-between">
      <h3 class="text-2xl font-bold">
        {{ t('menu.form.newCategory') }}
      </h3>

      <button
        type="button"
        @click="closeCategoryForm"
        class="rounded-lg p-2 hover:bg-neutral-800"
      >
        <X :size="20" />
      </button>
    </div>

    <div class="space-y-4">

      <div>
        <label>{{ t('menu.form.nameRu') }}</label>

        <input
          v-model="newCategory.name_ru"
          class="input"
          :placeholder="t('menu.form.newCategory')"
        />
      </div>

      <div>
        <label>{{ t('menu.form.nameUz') }}</label>

        <input
          v-model="newCategory.name_uz"
          class="input"
          :placeholder="t('menu.form.newCategory')"
        />
      </div>

      <div>
        <label>{{ t('menu.form.nameEn') }}</label>

        <input
          v-model="newCategory.name_en"
          class="input"
          :placeholder="t('menu.form.newCategory')"
        />
      </div>

    </div>

    <div class="mt-6 flex justify-end gap-3">

      <button
        type="button"
        @click="closeCategoryForm"
        class="rounded-xl bg-neutral-800 px-5 py-3"
      >
        {{ t('common.cancel') }}
      </button>

      <button
        type="button"
        @click="createCategory"
        class="rounded-xl bg-white px-5 py-3 font-semibold text-black"
      >
        {{ t('menu.form.create') }}
      </button>

    </div>

  </div>
</div>
    </div>

  </div>
</template>

<style scoped>
.input {
  margin-top: 0.5rem;
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgb(38 38 38);
  background: rgb(23 23 23);
  padding: 0.75rem 1rem;
  outline: none;
}

.input:focus {
  border-color: white;
}

label {
  font-size: 0.875rem;
  color: rgb(212 212 212);
}
</style>