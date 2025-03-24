<template>
  <div class="flex flex-col">
    <div class="font-serif">
      {{ date }}
    </div>
    <div
      v-if="isFairDate"
      class="grow-1 flex flex-col"
    >
      <div
        v-for="(area) of areas"
        :key="area.typeID"
        class="mt-4 flex flex-col"
      >
        <div class="font-bold mb-2">
          {{ area.typeName }}
        </div>
        <div class="flex flex-col">
          <template
            v-for="time of area.times"
            :key="time.id"
          >
            <UButton
              v-if="time.isRegistered"
              trailing-icon="i-lucide-x"
              class="mt-1 mb-1 flex justify-between hover:bg-red-500"
              :label="time.label"
              @click="cancel(area, time)"
            />

            <UButton
              v-else-if="time.isFull"
              variant="outline"
              color="neutral"
              disabled
              class="mt-1 mb-1 flex justify-between"
              :label="time.label"
            />

            <UButton
              v-else
              variant="subtle"
              class="mt-1 mb-1"
              :label="time.label"
              @click="register(area, time)"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDate } from 'date-fns'
import { isNil, map, toNumber } from 'lodash-es'

import type { Registration } from './calendar'
import type { CalendarDate, TimeSlot, Area } from '~/server/services/calendar'

const emit = defineEmits<{
  register: [registration: Registration]
  cancel: [registration: Registration]
}>()
const { day } = defineProps({
  day: {
    required: true,
    type: Object as PropType<CalendarDate>
  }
})

function formatTime(time: string): string {
  const [hours] = map(time.split(':'), toNumber)
  const ampm = hours >= 12 ? 'pm' : 'am'
  const hour = hours % 12 || 12
  return `${hour}${ampm}`
};

function register({ times, ...area }: Area, time: TimeSlot) {
  emit('register', {
    dateID: day.id!,
    date: day.date,
    area: {
      ...area,
      time
    }
  })
};

function cancel({ times, ...area }: Area, time: TimeSlot) {
  emit('cancel', {
    dateID: day.id!,
    date: day.date,
    area: {
      ...area,
      time
    }
  })
}

function decorateTimeSlot(slot: TimeSlot) {
  return {
    ...slot,
    isRegistered: !isNil(slot.registrationID),
    isFull: slot.volunteerCount >= slot.maxVolunteerCount,
    label: `${formatTime(slot.start)} - ${formatTime(slot.end)}`
  }
}

const date = computed(() => getDate(day.date))
const isFairDate = computed(() => !isNil(day.id))
const areas = computed(() => map(day.areas, ({ times, ...area }) => ({
  ...area,
  times: map(times, decorateTimeSlot)
})))
</script>
