<template>
  <div class="flex flex-col items-center">
    <h1 class="text-7xl mb-5 mt-4 font-serif">
      Design in Wood
    </h1>
    <h2 class="text-3xl mb-10">
      Volunteer Sign-Up
    </h2>

    <div class="mb-10">
      {{ formatDate(calendarStore.firstDate?.date!) }} - {{ formatDate(calendarStore.lastDate?.date!) }}
    </div>

    <div class="flex flex-col">
      <UButton
        class="mb-2 justify-center bg-white"
        variant="outline"
        size="xl"
      >
        Sign Up
      </UButton>
      <UButton
        class="mb-2 justify-center bg-white"
        variant="outline"
        size="xl"
      >
        FAQ
      </UButton>
      <UButton
        class="mb-2 justify-center bg-white"
        variant="outline"
        size="xl"
      >
        My Registrations
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const calendarStore = useCalendarStore()

function formatDate(date: Date): string {
  return format(date, 'MMMM d, yyyy')
}
</script>
