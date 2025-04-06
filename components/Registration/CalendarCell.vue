<template>
  <div
    class="flex flex-col p-2"
    :class="{ 'bg-gray-200': !isFairDate }"
  >
    <div class="font-serif">
      {{ date }}
    </div>
    <div
      v-if="isFairDate"
      class="grow-1 flex flex-col"
    >
      <div
        v-for="(area) of day.areas"
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
              v-if="isRegistered(time)"
              trailing-icon="i-lucide-x"
              class="mt-1 mb-1 flex justify-between hover:bg-red-500"
              :label="getTimeSlotLabel(time)"
              @click="cancel(area, time)"
            />

            <UButton
              v-else-if="isFull(time)"
              variant="outline"
              color="neutral"
              disabled
              class="mt-1 mb-1 flex justify-between"
              :label="getTimeSlotLabel(time)"
            />

            <UButton
              v-else
              variant="subtle"
              class="mt-1 mb-1"
              :label="getTimeSlotLabel(time)"
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

import type { Day } from '~/types/calendar'
import type { Area, TimeSlot } from '~/types/registration'

export type RegisterEvent = {
  dateID: number
  date: Date
  area: Omit<Area, 'times'> & {
    time: TimeSlot
  }
}

export type CancelRegistrationEvent = RegisterEvent & {
  id: number
}

const emit = defineEmits<{
  register: [event: RegisterEvent]
  cancel: [event: CancelRegistrationEvent]
}>()
const { day } = defineProps({
  day: {
    required: true,
    type: Object as PropType<Day>
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
    id: time.registration!,
    dateID: day.id!,
    date: day.date,
    area: {
      ...area,
      time
    }
  })
}

const isRegistered = (time: TimeSlot) => !isNil(time.registration)
const isFull = (time: TimeSlot) => time.volunteerCount >= time.maxVolunteerCount
const getTimeSlotLabel = ({ start, end }: TimeSlot) => `${formatTime(start)} - ${formatTime(end)}`

const date = computed(() => getDate(day.date))
const isFairDate = computed(() => !isNil(day.id))
</script>
