import { defineStore } from 'pinia'

import { first, last, map, toNumber } from 'lodash-es'
import type { Calendar } from '~/types/calendar'

const convertCalendarDateStringsToDates = (calendar: Calendar): Calendar => map(calendar, ({ month, dates }) => ({
  month,
  dates: map(dates, ({ date, ...d }) => {
    const [year, month, day] = (date as unknown as string).split('-')
    return { ...d, date: new Date(toNumber(year), toNumber(month) - 1, toNumber(day)) }
  })
}))

export const useCalendarStore = defineStore('calendarStore', {
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
      this.isLoading = true
      const { data, error } = await useFetch<Calendar>('/api/calendar')

      if (error.value) {
        console.log('An error occurred in fetching the calendar.', error.value)
        this.isError = true
        this.error = error.value
        throw error
      }

      this.calendar = convertCalendarDateStringsToDates(data.value || [])
      this.isLoading = false
      this.isError = false
      this.error = null
    }
  }
})
