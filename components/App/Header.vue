<template>
  <div class="grid grid-cols-3 gap-5 items-center mx-5">
    <div class="flex items-center">
      <h1 class="text-2xl font-serif">
        Design in Wood
      </h1>

      <div
        class="pl-5"
      >
        {{ formatDate(calendarStore.firstDate?.date!) }} - {{ formatDate(calendarStore.lastDate?.date!) }}
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
      label: 'Calendar',
      to: '/calendar',
      icon: 'i-lucide-calendar-search'
    }
  ]
])

const formatDate = (date: Date) => {
  return format(date, 'MM/dd')
}
</script>
