import { defineStore } from 'pinia'
import SuperJSON from 'superjson'

import { first, last } from 'lodash-es'
import type { CalendarMonth } from '~/server/services/calendar'
import type { GetCalendarResponse } from '~/server/api/calendar.get'

export const useCalendarStore = defineStore('calendarStore', {
  state: () => ({
    isLoading: true,
    isError: false,
    error: null as Error | null,
    calendar: [] as CalendarMonth[]
  }),

  getters: {
    firstDate: state => first(first(state.calendar)?.dates),
    lastDate: state => last(last(state.calendar)?.dates)
  },

  actions: {
    async fetch() {
      this.isLoading = true
      const { data, error } = await useFetch<GetCalendarResponse>('/api/calendar', {
        transform: (value) => {
          return SuperJSON.parse(value as unknown as string)
        }
      })

      if (error.value) {
        console.log('An error occurred in fetching the calendar.', error.value)
        this.isError = true
        this.error = error.value
        throw error
      }

      this.calendar = data.value?.months || []
      this.isLoading = false
      this.isError = false
      this.error = null
    }
  }
})
