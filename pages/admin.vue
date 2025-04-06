<template>
  <div>
    <h1 class="text-2xl font-bold">
      Admin Panel
    </h1>
    <div>
      <UNavigationMenu
        :items="menu"
        class="justify-self-center"
      />
      <div>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const menu = ref([
  [
    {
      label: 'Registrations',
      to: '/admin/registrations',
      icon: 'i-lucide-calendar-check-2'
    },
    {
      label: 'Fairs Dates',
      to: '/admin/fair-dates',
      icon: 'i-lucide-calendar-range'
    },
    {
      label: 'Time Slots',
      to: '/admin/time-slots',
      icon: 'i-lucide-square-chart-gantt'
    }
  ]
])
</script>
