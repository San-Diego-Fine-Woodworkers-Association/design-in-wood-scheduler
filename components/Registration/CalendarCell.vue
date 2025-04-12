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
            <template v-if="time.registrations">
              <div class="font-bold">
                {{ getTimeSlotLabel(time) }}
              </div>

              <template
                v-for="(e, idx) of Array(time.maxVolunteerCount)"
                :key="idx"
              >
                <UButton
                  v-if="get(time.registrations, [idx])"
                  trailing-icon="i-lucide-x"
                  class="mt-1 mb-1 flex justify-between hover:bg-red-500"
                  :label="getAdminTimeSlotLabel(time.registrations[idx])"
                  @click="cancel(area, time, time.registrations[idx])"
                />

                <UButton
                  v-else
                  variant="subtle"
                  class="mt-1 mb-1"
                  label="Open"
                  @click="register(area, time, true)"
                />
              </template>
            </template>

            <template v-else>
              <UButton
                v-if="isRegistered(time)"
                trailing-icon="i-lucide-x"
                class="mt-1 mb-1 flex justify-between hover:bg-red-500"
                :label="getTimeSlotLabel(time)"
                @click="cancel(area, time, time.registration!)"
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
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { get } from '@nuxt/ui/runtime/utils/index.js'
import { getDate } from 'date-fns'
import { isNil, map, toNumber } from 'lodash-es'

import type { Day } from '~/types/calendar'
import type { Area, Registration, RegistrationID, TimeSlot } from '~/types/registration'

export type RegisterEvent = {
  dateID: number
  date: Date
  area: Omit<Area, 'times'> & {
    time: TimeSlot
  }
  search?: boolean
}

export type CancelRegistrationEvent = RegisterEvent & {
  registration: Registration | RegistrationID
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

function register({ times, ...area }: Area, time: TimeSlot, search: boolean = false) {
  emit('register', {
    dateID: day.id!,
    date: day.date,
    area: {
      ...area,
      time
    },
    search
  })
};

function cancel({ times, ...area }: Area, time: TimeSlot, registration: Registration | RegistrationID) {
  emit('cancel', {
    registration,
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
const getAdminTimeSlotLabel = ({ user }: Registration) => user.name

const date = computed(() => getDate(day.date))
const isFairDate = computed(() => !isNil(day.id))
</script>
