import { defineStore } from 'pinia'
import type { RegisterEvent } from '~/components/Registration/CalendarCell.vue'

export const useRegistrationStore = defineStore('registrationStore', {
  actions: {
    async register(payload: RegisterEvent) {
      const calendarStore = useCalendarStore()

      await $fetch('/api/registration', { method: 'post', body: payload })
      await calendarStore.fetch()
    },

    async registerForUser(payload: RegisterEvent, user: number) {
      const adminCalendarStore = useAdminCalendarStore()

      await $fetch('/api/admin/registration', { method: 'post', body: { registration: payload, user } })
      await adminCalendarStore.fetch()
    },

    async cancel(registrationID: number) {
      const calendarStore = useCalendarStore()

      await $fetch(`/api/registration/${registrationID}`, { method: 'delete' })
      await calendarStore.fetch()
    },

    async cancelForUser(registrationID: number) {
      const adminCalendarStore = useAdminCalendarStore()

      await $fetch(`/api/admin/registration/${registrationID}`, { method: 'delete' })
      await adminCalendarStore.fetch()
    }
  }
})
