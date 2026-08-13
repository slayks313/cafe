<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { login } from '../../lib/auth'

const router = useRouter()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  const { error: loginError } = await login(
    email.value,
    password.value
  )

  loading.value = false

  if (loginError) {
    error.value = loginError.message
    return
  }

  router.push('/admin')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <form
      @submit.prevent="handleLogin"
      class="w-full max-w-sm space-y-4"
    >
      <h1 class="text-3xl font-bold">
        {{ t('admin.login.title') }}
      </h1>

      <input
        v-model="email"
        type="email"
        :placeholder="t('admin.login.email')"
        class="w-full rounded-lg border p-3"
      />

      <input
        v-model="password"
        type="password"
        :placeholder="t('admin.login.password')"
        class="w-full rounded-lg border p-3"
      />

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-lg bg-black px-4 py-3 text-white"
      >
        {{ loading ? t('admin.login.loading') : t('admin.login.button') }}
      </button>

      <p v-if="error" class="text-red-500">
        {{ error }}
      </p>
    </form>
  </div>
</template>