<template>
  <div class="grid grid-cols-3 gap-5 items-center mx-5">
    <div class="flex items-center">
      <h1 class="text-2xl font-serif">
        Design in Wood
      </h1>

      <div
        class="pl-5"
      >
        {{ formatDate(calendarStore.firstDate!) }} - {{ formatDate(calendarStore.lastDate!) }}
      </div>
    </div>

    <UNavigationMenu
      :items="menu"
      class="justify-self-center"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const calendarStore = useCalendarStore()

const menu = ref([
  [
    {
      label: 'Sign Up',
      to: '/calendar',
      icon: 'i-lucide-calendar-search'
    },
    {
      label: 'My Registrations',
      to: '/my-registrations',
      icon: 'i-lucide-calendar-check'
    }
  ]
])

const formatDate = (date: Date) => {
  return format(date, 'MM/dd')
}
</script>
