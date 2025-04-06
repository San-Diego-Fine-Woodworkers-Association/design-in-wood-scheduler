import { defineStore } from 'pinia'
import type { RegisterEvent } from '~/components/Registration/CalendarCell.vue'

export const useRegistrationStore = defineStore('registrationStore', {
  actions: {
    async register(payload: RegisterEvent) {
      const calendarStore = useCalendarStore()

      await $fetch('/api/registration', { method: 'post', body: payload })
      await calendarStore.fetch()
    },

    async cancel(registrationID: number) {
      const calendarStore = useCalendarStore()

      await $fetch(`/api/registration/${registrationID}`, { method: 'delete' })
      await calendarStore.fetch()
    }
  }
})
