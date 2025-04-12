<template>
  <div>
    <div v-if="isLoading && !calendar">
      Loading...
    </div>

    <div
      v-for="{ month, dates } in props.calendar"
      v-else
      :key="month"
      :class="[$style.month]"
    >
      <div :class="[$style['month-header'], 'sticky', 'z-10', 'top-0', 'bg-(--color-early-dawn-50)']">
        <h1 :class="[$style['month-heading'], 'font-serif', 'ml-2']">
          {{ month }}
        </h1>
        <div :class="$style['month-heading-days']">
          <div
            v-for="day of daysOfWeek"
            :key="day"
            :class="[$style['month-heading-day'], 'font-serif']"
          >
            {{ day }}
          </div>
        </div>
      </div>

      <div :class="[$style['month-dates']]">
        <div
          v-for="i in getCellOffset(dates)"
          :key="i"
          :class="[$style['calendar-cell'], $style['calendar-cell--filler']]"
        />

        <div
          v-for="calendarDate in dates"
          :key="calendarDate.date.getTime()"
          :class="[$style['calendar-cell'], $style.day, 'bg-white']"
        >
          <RegistrationCalendarCell
            :day="calendarDate"
            class="h-full"
            :admin="admin"
            @register="onRegister"
            @cancel="onCancel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { eachDayOfInterval, endOfWeek, format, getDay, startOfWeek } from 'date-fns'
import { first, map } from 'lodash-es'

import type { PropType } from 'vue'
import type { RegisterEvent, CancelRegistrationEvent } from './CalendarCell.vue'
import type { Calendar, Day } from '~/types/calendar'

const emit = defineEmits<{
  register: [registration: RegisterEvent]
  cancel: [registration: CancelRegistrationEvent]
}>()
const props = defineProps({
  calendar: {
    required: true,
    type: Object as PropType<Calendar>
  },
  isLoading: {
    required: true,
    type: Boolean
  },
  admin: {
    type: Boolean,
    default: false
  }
})

const daysOfWeek = map(eachDayOfInterval({ start: startOfWeek(new Date()), end: endOfWeek(new Date()) }), date => format(date, 'EEE'))

function getCellOffset(dates: Day[]): number {
  return getDay(first(dates)!.date)
}

function onRegister(registration: RegisterEvent) {
  emit('register', registration)
}

function onCancel(registration: CancelRegistrationEvent) {
  emit('cancel', registration)
}
</script>

<style lang="scss" module>
.month {
  margin-bottom: 32px;

  @mixin calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    align-items: stretch;
  }

  &-heading {
    font-size: 40px;
    font-weight: bold;
    margin-top: 0;
  }

  &-heading-days {
    @include calendar-grid();
  }

  &-heading-day {
    padding: 8px;
    border: 1px solid black;
    background-color: black;
    color: white;
  }

  &-dates {
    @include calendar-grid();
    border-top: 1px solid black;
    border-left: 1px solid black;
  }
}

.calendar-cell {
  border-bottom: 1px solid black;
  border-right: 1px solid black;

  &--filler {
    background-color: lightgray;
  }
}

.day {
  min-height: 100px;
}
</style>
