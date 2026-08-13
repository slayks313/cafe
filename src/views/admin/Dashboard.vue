<script setup>
import {
  ShoppingBag,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main class="min-h-screen bg-neutral-950 text-white">

    <header class="border-b border-neutral-800">
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"
      >
        <div class="flex items-center gap-3">

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black"
          >
            <ShieldCheck :size="21" />
          </div>

          <div>
            <p class="font-bold">
              {{ t('admin.panel') }}
            </p>

          
          </div>

        </div>
      </div>
    </header>


    <section class="px-5 py-10">

      <div class="mx-auto max-w-6xl">

        <div class="mb-10">
          <p class="mb-2 text-sm font-medium uppercase tracking-widest text-neutral-500">
            {{ t('admin.controlPanel') }}
          </p>

          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
            {{ t('admin.management') }}
          </h1>

          <p class="mt-3 max-w-xl text-neutral-400">
            {{ t('admin.manageText') }}
          </p>
        </div>


        <div class="grid gap-5 sm:grid-cols-2">

          <router-link
            to="/admin/orders"
            class="group rounded-3xl border border-neutral-800 bg-neutral-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:bg-neutral-800"
          >

            <div class="flex items-start justify-between">

              <div
                class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black"
              >
                <ShoppingBag :size="26" />
              </div>

              <ArrowRight
                :size="22"
                class="text-neutral-600 transition group-hover:translate-x-1 group-hover:text-white"
              />

            </div>

            <h2 class="mt-8 text-2xl font-bold">
              {{ t('admin.orders.title') }}
            </h2>

            <p class="mt-2 text-neutral-400">
              {{ t('admin.orders.description') }}
            </p>

            <div class="mt-6 text-sm font-medium text-neutral-500">
              {{ t('admin.orders.open') }}
            </div>

          </router-link>


          <router-link
            to="/admin/menu"
            class="group rounded-3xl border border-neutral-800 bg-neutral-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:bg-neutral-800"
          >

            <div class="flex items-start justify-between">

              <div
                class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black"
              >
                <UtensilsCrossed :size="26" />
              </div>

              <ArrowRight
                :size="22"
                class="text-neutral-600 transition group-hover:translate-x-1 group-hover:text-white"
              />

            </div>

            <h2 class="mt-8 text-2xl font-bold">
              {{ t('admin.menu.title') }}
            </h2>

            <p class="mt-2 text-neutral-400">
              {{ t('admin.menu.description') }}
            </p>

            <div class="mt-6 text-sm font-medium text-neutral-500">
              {{ t('admin.menu.open') }}
            </div>

          </router-link>

        </div>

      </div>

    </section>

  </main>
</template>