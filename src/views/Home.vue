<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ArrowRight,
  Utensils,
  Languages,
  ChevronDown,
  ShieldCheck,
} from 'lucide-vue-next'

import { onMounted, ref } from 'vue'
import { subscribeToPush } from '../lib/push'



onMounted(() => {
  setTimeout(() => {
    if (
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      showNotificationPrompt.value = true
    }
  }, 1500)
})
const showNotificationPrompt = ref(false)
const notificationLoading = ref(false)

async function enableNotifications() {
  notificationLoading.value = true

  try {
    await subscribeToPush('c29cfac7-29e6-42b2-b3e5-20808682fcb7')

    showNotificationPrompt.value = false
  } catch (error) {
    console.error('Push error:', error)
  } finally {
    notificationLoading.value = false
  }
}

function closeNotificationPrompt() {
  showNotificationPrompt.value = false
}



const { locale, t } = useI18n()

const languages = [
  { code: 'ru', label: 'RU' },
  { code: 'uz', label: 'UZ' },
  { code: 'en', label: 'EN' },
]

const content = {
  ru: {
    welcome: 'Добро пожаловать',
    subtitle: 'Выберите блюда из меню и оформите заказ прямо со своего столика.',
    menu: 'Открыть меню',
    popular: 'Всё меню',
    cafeLabel: 'Кафе "Sug\'diyona"',
    notificationTitle: 'Получать уведомление?',
    notificationText: 'Мы сообщим вам, когда ваш заказ будет готов.',
    notificationEnable: 'Разрешить',
    notificationConnecting: 'Подключение...',
    notificationLater: 'Позже',
  },

  uz: {
    welcome: 'Xush kelibsiz',
    subtitle: 'Menyudan taomlarni tanlang va buyurtmangizni stolingizdan turib bering.',
    menu: 'Menyuni ochish',
    popular: 'Barcha menyu',
    cafeLabel: 'Kafe "Sug\'diyona"',
    notificationTitle: 'Bildirishnoma olish?',
    notificationText: 'Buyurtmangiz tayyor bo\'lganda sizga xabar beramiz.',
    notificationEnable: 'Ruxsat berish',
    notificationConnecting: 'Ulanmoqda...',
    notificationLater: 'Keyinroq',
  },

  en: {
    welcome: 'Welcome',
    subtitle: 'Choose your dishes and place your order right from your table.',
    menu: 'Open menu',
    popular: 'Full menu',
    cafeLabel: 'Cafe "Sug\'diyona"',
    notificationTitle: 'Receive a notification?',
    notificationText: 'We will notify you when your order is ready.',
    notificationEnable: 'Allow',
    notificationConnecting: 'Connecting...',
    notificationLater: 'Later',
  },
}

const currentContent = computed(() => {
  return content[locale.value] || content.ru
})

function changeLanguage(language) {
  locale.value = language
  localStorage.setItem('locale', language)
}
</script>

<template>
  <main class="min-h-screen bg-neutral-950 text-white">

    <header class="absolute left-0 right-0 top-0 z-50">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">

        <div class="flex items-center gap-3">

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black"
          >
            <Utensils :size="21" />
          </div>

          <span class="text-lg font-bold">
            Sug'diyona cafe
          </span>

        </div>

       <div class="flex items-center gap-2">

<router-link
  to="/admin"
  class="flex h-10 items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 text-sm font-medium text-neutral-400 backdrop-blur transition hover:border-neutral-600 hover:text-white"
>
  <ShieldCheck :size="18" />
  <span>Admin</span>
</router-link>

  <div
    class="flex h-10 items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 backdrop-blur"
  >
    <Languages
      :size="17"
      class="text-neutral-400"
    />

    <select
      :value="locale"
      @change="changeLanguage($event.target.value)"
      class="cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium outline-none"
    >
      <option
        v-for="language in languages"
        :key="language.code"
        :value="language.code"
        class="bg-neutral-900"
      >
        {{ language.label }}
      </option>
    </select>

    <ChevronDown
      :size="15"
      class="pointer-events-none -ml-5 text-neutral-500"
    />
  </div>

</div>

      </div>
    </header>


    <section
      class="relative flex min-h-screen items-center overflow-hidden px-5 py-24"
    >

      <div
        class="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-3xl"
      />

      <div
        class="relative mx-auto w-full max-w-3xl text-center"
      >

        <div
          class="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-neutral-800 bg-neutral-900 shadow-2xl"
        >
          <Utensils
            :size="42"
            stroke-width="1.5"
          />
        </div>


        <p
          class="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-neutral-500"
        >
          {{ currentContent.cafeLabel }}
        </p>


        <h1
          class="text-4xl font-bold tracking-tight sm:text-6xl"
        >
          {{ currentContent.welcome }}
        </h1>


        <p
          class="mx-auto mt-6 max-w-xl text-base leading-7 text-neutral-400 sm:text-lg"
        >
          {{ currentContent.subtitle }}
        </p>


      
        <router-link
          to="/menu"
          class="group mx-auto mt-9 flex w-full max-w-sm items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black shadow-xl transition duration-300 hover:scale-[1.02] hover:bg-neutral-200 active:scale-[0.98] sm:w-auto"
        >
          {{ currentContent.menu }}

          <ArrowRight
            :size="20"
            class="transition-transform duration-300 group-hover:translate-x-1"
          />
        </router-link>




    
        <p class="mt-5 text-xs text-neutral-600">
          {{ currentContent.popular }}
        </p>

      </div>

    </section>
<Transition
  enter-active-class="transition duration-300 ease-out"
  enter-from-class="translate-y-10 opacity-0"
  enter-to-class="translate-y-0 opacity-100"
  leave-active-class="transition duration-200 ease-in"
  leave-from-class="translate-y-0 opacity-100"
  leave-to-class="translate-y-10 opacity-0"
>
  <div
    v-if="showNotificationPrompt"
    class="fixed bottom-5 left-5 right-5 z-[100] mx-auto max-w-md"
  >
    <div
      class="rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl"
    >

      <div class="flex gap-3">

        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-black"
        >
          🔔
        </div>

        <div class="min-w-0 flex-1">

          <p class="font-semibold">
            {{ currentContent.notificationTitle }}
          </p>

          <p class="mt-1 text-sm leading-5 text-neutral-400">
            {{ currentContent.notificationText }}
          </p>

          <div class="mt-4 flex gap-2">

            <button
              type="button"
              @click="enableNotifications"
              :disabled="notificationLoading"
              class="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {{ notificationLoading ? currentContent.notificationConnecting : currentContent.notificationEnable }}
            </button>

            <button
              type="button"
              @click="closeNotificationPrompt"
              class="rounded-xl border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
            >
              {{ currentContent.notificationLater }}
            </button>

          </div>

        </div>

      </div>

    </div>
  </div>
</Transition>
  </main>
</template>