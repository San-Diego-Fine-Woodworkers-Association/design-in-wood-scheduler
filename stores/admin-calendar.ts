import { defineStore } from 'pinia'

import { first, last } from 'lodash-es'
import type { Calendar } from '~/types/calendar'
import calendarDatesAsDates from '~/utils/calendar-dates-as-dates'

export const useAdminCalendarStore = defineStore('adminCalendarStore', {
  state: () => ({
    isLoading: true,
    isError: false,
    error: null as Error | null,
    calendar: [] as Calendar
  }),

  getters: {
    firstDate: state => first(first(state.calendar)?.dates)?.date,
    lastDate: state => last(last(state.calendar)?.dates)?.date
  },

  actions: {
    async fetch() {
      const userSession = useUserSession()

      if (!userSession.user.value?.isAdmin) return this.calendar

      this.isLoading = true
      const { data, error } = await useFetch<Calendar>('/api/admin/calendar')

      if (error.value) {
        console.log('An error occurred in fetching the calendar.', error.value)
        this.isError = true
        this.error = error.value
        throw error
      }

      this.calendar = calendarDatesAsDates(data.value || [])
      this.isLoading = false
      this.isError = false
      this.error = null

      return this.calendar
    }
  }
})
