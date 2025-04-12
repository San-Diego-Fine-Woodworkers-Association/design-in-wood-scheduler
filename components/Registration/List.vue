<template>
  <div class="border-solid border-black border-1 rounded-sm bg-white p-4">
    <h1 v-if="isEmpty(registeredDates)">
      No registrations found. To make a registrations, select a timeslot on the calendar <ULink to="/sign-up"> here </ULink>.
    </h1>

    <div
      v-for="date in registeredDates"
      :key="date.date.getTime()"
      class="mb-4"
    >
      <h2 class="text-xl font-bold">
        {{ formatDate(date.date) }}
      </h2>
      <div class="border-solid border-black border-1 rounded-sm p-4">
        <div
          v-for="area in date.areas"
          :key="area.typeID"
        >
          <h3>{{ area.typeName }}</h3>
          <div class="flex flex-row gap-2">
            <UButton
              v-for="time in area.times"
              :key="time.id"
              trailing-icon="i-lucide-x"
              class="mt-1 mb-1 flex justify-between hover:bg-red-500 w-[150px]"
              :label="getTimeSlotLabel(time)"
              @click="cancel(date.id!, date.date, area, time, time.registration!)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { filter, isEmpty, isNil, map, toNumber } from 'lodash-es'
import type { CancelRegistrationEvent } from './CalendarCell.vue'
import type { Day } from '~/types/calendar'
import type { Area, RegistrationID, TimeSlot } from '~/types/registration'

const props = defineProps<{
  dates: Day[]
}>()

const emit = defineEmits<{
  cancel: [event: CancelRegistrationEvent]
}>()

function cancel(dayID: number, date: Date, { times, ...area }: Area, time: TimeSlot, registration: RegistrationID) {
  emit('cancel', {
    registration,
    dateID: dayID,
    date: date,
    area: {
      ...area,
      time
    }
  })
}

function formatTime(time: string): string {
  const [hours] = map(time.split(':'), toNumber)
  const ampm = hours >= 12 ? 'pm' : 'am'
  const hour = hours % 12 || 12
  return `${hour}${ampm}`
};
const getTimeSlotLabel = ({ start, end }: TimeSlot) => `${formatTime(start)} - ${formatTime(end)}`

function formatDate(date: Date): string {
  return format(date, 'MMMM d')
}

const registeredDates = computed(() => {
  const dates: Day[] = []

  for (const date of props.dates) {
    if (!date.areas) continue

    const registeredAreas: Area[] = []
    for (const area of date.areas) {
      const filteredArea = {
        ...area,
        times: filter(area.times, ({ registration }) => !isNil(registration))
      }

      if (isEmpty(filteredArea.times)) continue
      registeredAreas.push(filteredArea)
    }

    if (isEmpty(registeredAreas)) continue
    dates.push({
      ...date,
      areas: registeredAreas
    })
  }

  return dates
})
</script>
